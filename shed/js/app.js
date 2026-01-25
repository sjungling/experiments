// Main Application Logic
let currentStep = 0;
let currentView = '2d';
let zoomLevel = 1;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadStep(0);
    initThreeJS();
    
    // Sidebar click handlers
    document.querySelectorAll('.step-item').forEach(item => {
        item.addEventListener('click', () => {
            loadStep(parseInt(item.dataset.step));
        });
    });
});

// Convert <strong>PART-ID</strong> to clickable links
function linkifyPartIds(html) {
    // Match part IDs in strong tags - pattern covers all ID formats
    return html.replace(/<strong>([A-Z]+-[A-Z0-9]+-\d+)<\/strong>/g,
        '<a href="#" class="part-link" data-part-id="$1">$1</a>');
}

function loadStep(stepIndex) {
    currentStep = stepIndex;
    const step = steps[stepIndex];

    // Update sidebar
    document.querySelectorAll('.step-item').forEach((item, i) => {
        item.classList.remove('active');
        if (i < stepIndex) item.classList.add('completed');
        if (i === stepIndex) item.classList.add('active');
    });

    // Update progress
    const progress = ((stepIndex + 1) / steps.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = stepIndex + 1;
    document.getElementById('mobile-step-num').textContent = `Step ${stepIndex + 1}/${steps.length}`;

    // Update diagram
    document.getElementById('diagram-title').textContent = step.title;
    document.getElementById('svg-container').innerHTML = svgDiagrams[stepIndex];

    // Update 3D if active
    if (currentView === '3d') {
        update3DView(stepIndex);
    }

    // Update instructions panel
    const panel = document.getElementById('instructions-panel');
    
    // Build pieces reference if available
    let piecesHTML = '';
    if (step.pieces && step.pieces.length > 0) {
        piecesHTML = `
            <div class="instruction-card pieces-card">
                <h3>
                    <span class="icon" style="background: #ffc233">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                    </span>
                    Pieces for This Step
                </h3>
                <div class="pieces-grid">
                    ${step.pieces.map(p => `<button class="piece-tag" data-part-id="${p}">${p}</button>`).join('')}
                </div>
            </div>
        `;
    }
    
    panel.innerHTML = `
        <div class="instruction-card">
            <h3>
                <span class="icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                </span>
                Materials Needed
            </h3>
            <ul class="materials-list">
                ${step.materials.map(m => `
                    <li>
                        <span>${m.name}</span>
                        <span class="material-qty">${m.qty}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="instruction-card">
            <h3>
                <span class="icon" style="background: #51cf66">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                </span>
                Instructions
            </h3>
            <ol class="steps-list">
                ${step.instructions.map(inst => `<li>${linkifyPartIds(inst)}</li>`).join('')}
            </ol>
            <div class="tip-box">
                <strong>💡 Pro Tip:</strong> ${step.tip}
            </div>
        </div>
        ${piecesHTML}
    `;

    // Update nav buttons
    document.getElementById('prev-btn').disabled = stepIndex === 0;
    document.getElementById('mobile-prev-btn').disabled = stepIndex === 0;
    
    const nextBtn = document.getElementById('next-btn');
    if (stepIndex === steps.length - 1) {
        nextBtn.innerHTML = 'Finish ✓';
    } else {
        nextBtn.innerHTML = `Next Step <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        loadStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 0) {
        loadStep(currentStep - 1);
    }
}

function setView(view) {
    currentView = view;

    document.getElementById('btn-2d').classList.toggle('active', view === '2d');
    document.getElementById('btn-3d').classList.toggle('active', view === '3d');
    document.getElementById('btn-parts').classList.toggle('active', view === 'parts');

    document.getElementById('svg-container').style.display = view === '2d' ? 'block' : 'none';
    document.getElementById('webgl-container').style.display = view === '3d' ? 'block' : 'none';
    document.getElementById('controls-overlay').classList.toggle('visible', view === '3d');

    // Toggle diagram container and parts grid
    document.querySelector('.diagram-container').style.display = view === 'parts' ? 'none' : 'block';

    if (view === 'parts') {
        PartsGrid.show();
    } else {
        PartsGrid.hide();
    }

    if (view === '3d') {
        update3DView(currentStep);
        animate();
    }
}

function zoomIn() {
    if (currentView === '2d') {
        zoomLevel = Math.min(zoomLevel * 1.2, 3);
        const svg = document.querySelector('#svg-container svg');
        if (svg) svg.style.transform = `scale(${zoomLevel})`;
    } else {
        zoom3DIn();
    }
}

function zoomOut() {
    if (currentView === '2d') {
        zoomLevel = Math.max(zoomLevel / 1.2, 0.5);
        const svg = document.querySelector('#svg-container svg');
        if (svg) svg.style.transform = `scale(${zoomLevel})`;
    } else {
        zoom3DOut();
    }
}

function resetView() {
    if (currentView === '2d') {
        zoomLevel = 1;
        const svg = document.querySelector('#svg-container svg');
        if (svg) svg.style.transform = 'scale(1)';
    } else {
        reset3DView();
    }
}

// Handle part link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('.part-link');
    if (link) {
        e.preventDefault();
        const partId = link.dataset.partId;
        PartsModal.open(partId);
    }
});

// Handle piece tag clicks
document.addEventListener('click', (e) => {
    const tag = e.target.closest('.piece-tag');
    if (tag) {
        e.preventDefault();
        const partId = tag.dataset.partId;
        PartsModal.open(partId);
    }
});
