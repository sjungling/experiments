// Three.js 3D Scene Module
let scene, camera, renderer;
let isDragging = false;
let previousPosition = { x: 0, y: 0 };
let theta = 0.5;
let phi = 1.0;
let radius = 22;

// Cached materials (created once to allow material comparisons)
let mats = null;

function initThreeJS() {
    const container = document.getElementById('webgl-container');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    updateCameraPosition();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Grid
    scene.add(new THREE.GridHelper(20, 20, 0x444444, 0x333333));

    // Mouse controls
    renderer.domElement.addEventListener('mousedown', e => { isDragging = true; previousPosition = { x: e.clientX, y: e.clientY }; });
    renderer.domElement.addEventListener('mousemove', e => {
        if (isDragging) {
            theta -= (e.clientX - previousPosition.x) * 0.005;
            phi -= (e.clientY - previousPosition.y) * 0.005;
            phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
            updateCameraPosition();
            previousPosition = { x: e.clientX, y: e.clientY };
        }
    });
    renderer.domElement.addEventListener('mouseup', () => isDragging = false);
    renderer.domElement.addEventListener('mouseleave', () => isDragging = false);
    renderer.domElement.addEventListener('wheel', e => {
        e.preventDefault();
        radius = Math.max(10, Math.min(50, radius * (1 + e.deltaY * 0.001)));
        updateCameraPosition();
    }, { passive: false });

    // Touch controls
    let touchDist = 0, initRad = radius;
    renderer.domElement.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            isDragging = false;
            touchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            initRad = radius;
        }
        e.preventDefault();
    }, { passive: false });
    renderer.domElement.addEventListener('touchmove', e => {
        if (e.touches.length === 1 && isDragging) {
            theta -= (e.touches[0].clientX - previousPosition.x) * 0.005;
            phi -= (e.touches[0].clientY - previousPosition.y) * 0.005;
            phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
            updateCameraPosition();
            previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            radius = Math.max(10, Math.min(50, initRad * touchDist / d));
            updateCameraPosition();
        }
        e.preventDefault();
    }, { passive: false });
    renderer.domElement.addEventListener('touchend', () => isDragging = false);

    // Resize
    window.addEventListener('resize', () => {
        if (container.clientWidth && container.clientHeight) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

function updateCameraPosition() {
    camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(0, 4, 0);
}

function update3DView(stepIndex) {
    // Clear meshes
    const toRemove = [];
    scene.traverse(c => { if (c.isMesh) toRemove.push(c); });
    toRemove.forEach(o => scene.remove(o));

    // Initialize materials once (allows material comparisons for shingle swap)
    if (!mats) {
        mats = {
            conc: new THREE.MeshLambertMaterial({ color: 0x808080 }),
            pt: new THREE.MeshLambertMaterial({ color: 0x5a7d4a }),
            wood: new THREE.MeshLambertMaterial({ color: 0xc49464 }),
            osb: new THREE.MeshLambertMaterial({ color: 0xc4a35a }),
            siding: new THREE.MeshLambertMaterial({ color: 0xa0522d }),
            roof: new THREE.MeshLambertMaterial({ color: 0x4a4a4a }),
            door: new THREE.MeshLambertMaterial({ color: 0x8b4513 }),
            header: new THREE.MeshLambertMaterial({ color: 0x51cf66 })
        };
    }

    const W = 8, L = 10, H = 6, P = 1.33;

    // Foundation (step 0+)
    if (stepIndex >= 0) {
        const bg = new THREE.BoxGeometry(1, 0.5, 1);
        [[-4,0.25,-3.5],[0,0.25,-3.5],[4,0.25,-3.5],[-4,0.25,0],[4,0.25,0],[-4,0.25,3.5],[0,0.25,3.5],[4,0.25,3.5]].forEach(p => {
            const b = new THREE.Mesh(bg, mats.conc);
            b.position.set(...p);
            b.castShadow = true;
            scene.add(b);
        });
    }

    // Floor frame (step 1+)
    if (stepIndex >= 1) {
        const rl = new THREE.BoxGeometry(L, 0.45, 0.15);
        const rs = new THREE.BoxGeometry(0.15, 0.45, W - 0.3);
        [-W/2+0.075, W/2-0.075].forEach(z => { const m = new THREE.Mesh(rl, mats.pt); m.position.set(0, 0.75, z); scene.add(m); });
        [-L/2+0.075, L/2-0.075].forEach(x => { const m = new THREE.Mesh(rs, mats.pt); m.position.set(x, 0.75, 0); scene.add(m); });
        const jg = new THREE.BoxGeometry(0.1, 0.45, W - 0.3);
        for (let x = -L/2+1.5; x < L/2-1; x += 1.375) { const j = new THREE.Mesh(jg, mats.pt); j.position.set(x, 0.75, 0); scene.add(j); }
    }

    // Floor deck (step 2+)
    if (stepIndex >= 2) {
        const d = new THREE.Mesh(new THREE.BoxGeometry(L-0.1, 0.1, W-0.1), mats.osb);
        d.position.set(0, 1.05, 0);
        d.receiveShadow = true;
        scene.add(d);
    }

    // Back wall (step 3+)
    if (stepIndex >= 3) {
        const sg = new THREE.BoxGeometry(0.1, H-0.3, 0.1);
        const pg = new THREE.BoxGeometry(L, 0.1, 0.1);
        const z = W/2 - 0.1;
        const bp1 = new THREE.Mesh(pg, mats.wood);
        bp1.position.set(0, 1.15, z);
        scene.add(bp1);
        const bp2 = new THREE.Mesh(pg, mats.wood);
        bp2.position.set(0, 1.15+H-0.15, z);
        scene.add(bp2);
        for (let x = -L/2+0.5; x <= L/2-0.5; x += 1.375) {
            const s = new THREE.Mesh(sg, mats.wood);
            s.position.set(x, 1.15+(H-0.3)/2+0.1, z);
            scene.add(s);
        }
    }

    // Left wall (step 4+)
    if (stepIndex >= 4) {
        const sg = new THREE.BoxGeometry(0.1, H-0.3, 0.1);
        const pg = new THREE.BoxGeometry(0.1, 0.1, W);
        const x = -L/2+0.1;
        const lp1 = new THREE.Mesh(pg, mats.wood);
        lp1.position.set(x, 1.15, 0);
        scene.add(lp1);
        const lp2 = new THREE.Mesh(pg, mats.wood);
        lp2.position.set(x, 1.15+H-0.15, 0);
        scene.add(lp2);
        for (let z = -W/2+0.8; z <= W/2-0.8; z += 1.375) {
            const s = new THREE.Mesh(sg, mats.wood);
            s.position.set(x, 1.15+(H-0.3)/2+0.1, z);
            scene.add(s);
        }
    }

    // Right wall (step 5+)
    if (stepIndex >= 5) {
        const sg = new THREE.BoxGeometry(0.1, H-0.3, 0.1);
        const pg = new THREE.BoxGeometry(0.1, 0.1, W);
        const x = L/2-0.1;
        const rp1 = new THREE.Mesh(pg, mats.wood);
        rp1.position.set(x, 1.15, 0);
        scene.add(rp1);
        const rp2 = new THREE.Mesh(pg, mats.wood);
        rp2.position.set(x, 1.15+H-0.15, 0);
        scene.add(rp2);
        for (let z = -W/2+0.8; z <= W/2-0.8; z += 1.375) {
            const s = new THREE.Mesh(sg, mats.wood);
            s.position.set(x, 1.15+(H-0.3)/2+0.1, z);
            scene.add(s);
        }
    }

    // Front wall (step 6+)
    if (stepIndex >= 6) {
        const sg = new THREE.BoxGeometry(0.1, H-0.3, 0.1);
        const pg = new THREE.BoxGeometry(L, 0.1, 0.1);
        const z = -W/2 + 0.1;
        const fp1 = new THREE.Mesh(pg, mats.wood);
        fp1.position.set(0, 1.15, z);
        scene.add(fp1);
        const fp2 = new THREE.Mesh(pg, mats.wood);
        fp2.position.set(0, 1.15+H-0.15, z);
        scene.add(fp2);
        for (let x = -L/2+0.5; x <= L/2-0.5; x += 1.375) {
            if (x > -1.5 && x < 1.5) continue;
            const s = new THREE.Mesh(sg, mats.wood);
            s.position.set(x, 1.15+(H-0.3)/2+0.1, z);
            scene.add(s);
        }
        const hg = new THREE.BoxGeometry(3.2, 0.4, 0.1);
        const h = new THREE.Mesh(hg, mats.header);
        h.position.set(0, 1.15+H-1.2, z);
        scene.add(h);
    }

    // Roof (step 7+)
    if (stepIndex >= 7) {
        const rg = new THREE.BoxGeometry(L+0.5, 0.15, 0.1);
        const r = new THREE.Mesh(rg, mats.wood);
        r.position.set(0, 1.15+H+P, 0);
        scene.add(r);
        const rl = Math.sqrt((W/2)**2 + P**2);
        const ra = Math.atan2(P, W/2);
        const rfg = new THREE.BoxGeometry(0.1, rl+0.5, 0.1);
        for (let x = -L/2+0.5; x <= L/2-0.5; x += 1.375) {
            const l = new THREE.Mesh(rfg, mats.wood);
            l.position.set(x, 1.15+H+P/2, -W/4);
            l.rotation.x = -ra;
            scene.add(l);
            const rt = new THREE.Mesh(rfg, mats.wood);
            rt.position.set(x, 1.15+H+P/2, W/4);
            rt.rotation.x = ra;
            scene.add(rt);
        }
    }

    // Siding (step 8+)
    if (stepIndex >= 8) {
        const sfg = new THREE.BoxGeometry(L, H, 0.05);
        const sf = new THREE.Mesh(sfg, mats.siding);
        sf.position.set(0, 1.15+H/2, -W/2);
        sf.castShadow = true;
        sf.receiveShadow = true;
        scene.add(sf);
        const sb = new THREE.Mesh(sfg, mats.siding);
        sb.position.set(0, 1.15+H/2, W/2);
        sb.castShadow = true;
        sb.receiveShadow = true;
        scene.add(sb);
        const ssg = new THREE.BoxGeometry(0.05, H, W);
        [-L/2, L/2].forEach(x => {
            const sw = new THREE.Mesh(ssg, mats.siding);
            sw.position.set(x, 1.15+H/2, 0);
            sw.castShadow = true;
            sw.receiveShadow = true;
            scene.add(sw);
        });
        const ra = Math.atan2(P, W/2);
        const rog = new THREE.BoxGeometry(L+1, Math.sqrt((W/2+0.5)**2+P**2), 0.08);
        const rol = new THREE.Mesh(rog, mats.osb);
        rol.position.set(0, 1.15+H+P/2+0.1, -W/4-0.1);
        rol.rotation.x = -ra;
        rol.castShadow = true;
        scene.add(rol);
        const ror = new THREE.Mesh(rog, mats.osb);
        ror.position.set(0, 1.15+H+P/2+0.1, W/4+0.1);
        ror.rotation.x = ra;
        ror.castShadow = true;
        scene.add(ror);
    }

    // Door (step 9+)
    if (stepIndex >= 9) {
        const dg = new THREE.BoxGeometry(2.8, 6.5, 0.15);
        const d = new THREE.Mesh(dg, mats.door);
        d.position.set(0, 1.15+3.25, -W/2-0.1);
        scene.add(d);
    }

    // Shingles (step 10+)
    if (stepIndex >= 10) {
        scene.traverse(c => {
            if (c.material === mats.osb && c.position.y > 5) c.material = mats.roof;
        });
    }
}

function animate() {
    if (typeof currentView !== 'undefined' && currentView === '3d') {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

function reset3DView() {
    theta = 0.5; phi = 1.0; radius = 22;
    updateCameraPosition();
}

function zoom3DIn() {
    radius = Math.max(10, radius * 0.85);
    updateCameraPosition();
}

function zoom3DOut() {
    radius = Math.min(50, radius * 1.15);
    updateCameraPosition();
}
