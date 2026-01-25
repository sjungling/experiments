// SVG Diagrams for each step
const svgDiagrams = [
    // Step 1: Foundation
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="gravel" patternUnits="userSpaceOnUse" width="10" height="10">
                <circle cx="2" cy="2" r="1" fill="#666"/>
                <circle cx="7" cy="5" r="1.5" fill="#888"/>
                <circle cx="4" cy="8" r="1" fill="#777"/>
            </pattern>
            <linearGradient id="conc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#909090"/>
                <stop offset="100%" stop-color="#606060"/>
            </linearGradient>
        </defs>
        <rect x="50" y="60" width="400" height="280" fill="url(#gravel)" stroke="#444" stroke-width="2" rx="4"/>
        <line x1="50" y1="45" x2="450" y2="45" stroke="#ff6b35" stroke-dasharray="5,5"/>
        <text x="250" y="38" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="14">10'-0"</text>
        <line x1="30" y1="60" x2="30" y2="340" stroke="#ff6b35" stroke-dasharray="5,5"/>
        <text x="18" y="200" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="14" transform="rotate(-90,18,200)">8'-0"</text>
        ${[[70,80],[230,80],[390,80],[70,180],[390,180],[70,280],[390,280],[70,320],[230,320],[390,320]].map(([x,y],i)=>`
            <rect x="${x}" y="${y}" width="40" height="40" fill="url(#conc)" stroke="#404040" stroke-width="2" rx="2"/>
            <rect x="${x+10}" y="${y+10}" width="20" height="20" fill="#505050"/>
            <text x="${x+20}" y="${y+58}" text-anchor="middle" fill="#ffc233" font-family="monospace" font-size="10">${i+1}</text>
        `).join('')}
        <rect x="300" y="90" width="130" height="60" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <rect x="310" y="105" width="16" height="16" fill="url(#conc)" stroke="#404040"/>
        <text x="335" y="117" fill="white" font-size="11">Deck Block ×12</text>
        <text x="310" y="140" fill="#a0a0a0" font-size="10">~4-5' spacing</text>
    </svg>`,

    // Step 2: Floor Frame
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="pt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#6b8e5a"/>
                <stop offset="50%" stop-color="#5a7d4a"/>
                <stop offset="100%" stop-color="#4a6d3a"/>
            </linearGradient>
        </defs>
        <rect x="60" y="60" width="380" height="14" fill="url(#pt)" stroke="#3d5a2e" stroke-width="2"/>
        <rect x="60" y="286" width="380" height="14" fill="url(#pt)" stroke="#3d5a2e" stroke-width="2"/>
        <rect x="60" y="60" width="14" height="240" fill="url(#pt)" stroke="#3d5a2e" stroke-width="2"/>
        <rect x="426" y="60" width="14" height="240" fill="url(#pt)" stroke="#3d5a2e" stroke-width="2"/>
        ${[120,170,220,270,320,370].map(x=>`
            <rect x="${x}" y="74" width="10" height="212" fill="url(#pt)" stroke="#3d5a2e"/>
            <path d="M${x-2} 74 L${x-2} 64 L${x+12} 64 L${x+12} 74" fill="none" stroke="#888" stroke-width="2"/>
            <path d="M${x-2} 286 L${x-2} 296 L${x+12} 296 L${x+12} 286" fill="none" stroke="#888" stroke-width="2"/>
        `).join('')}
        <text x="250" y="50" text-anchor="middle" fill="#ffc233" font-size="11">2×6 PT Rim Joist (10')</text>
        <line x1="125" y1="320" x2="175" y2="320" stroke="#4dabf7"/>
        <text x="150" y="340" text-anchor="middle" fill="#4dabf7" font-family="monospace" font-size="11">16.5" O.C.</text>
        <rect x="300" y="90" width="130" height="70" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <rect x="310" y="105" width="20" height="8" fill="url(#pt)" stroke="#3d5a2e"/>
        <text x="338" y="113" fill="white" font-size="10">2×6 PT</text>
        <path d="M310 135 L310 125 L330 125 L330 135" fill="none" stroke="#888" stroke-width="2"/>
        <text x="338" y="133" fill="white" font-size="10">Joist Hanger</text>
        <circle cx="320" cy="150" r="3" fill="#ffc233"/>
        <text x="338" y="153" fill="#ffc233" font-size="10">3" Screws</text>
    </svg>`,

    // Step 3: Floor Deck
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="osb" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="#c4a35a"/>
                <path d="M0 10 Q5 8,10 10 T20 10" stroke="#b89545" fill="none"/>
            </pattern>
        </defs>
        <rect x="60" y="60" width="380" height="240" fill="none" stroke="#5a7d4a" stroke-width="3" stroke-dasharray="10,5"/>
        <rect x="60" y="60" width="192" height="160" fill="url(#osb)" stroke="#8b7355" stroke-width="2"/>
        <rect x="252" y="60" width="188" height="160" fill="url(#osb)" stroke="#8b7355" stroke-width="2"/>
        <rect x="60" y="220" width="192" height="80" fill="url(#osb)" stroke="#8b7355" stroke-width="2"/>
        <rect x="252" y="220" width="188" height="80" fill="url(#osb)" stroke="#8b7355" stroke-width="2"/>
        <circle cx="156" cy="140" r="20" fill="#242424" stroke="#ff6b35" stroke-width="2"/>
        <text x="156" y="145" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="16" font-weight="bold">1</text>
        <circle cx="346" cy="140" r="20" fill="#242424" stroke="#ff6b35" stroke-width="2"/>
        <text x="346" y="145" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="16" font-weight="bold">2</text>
        <circle cx="156" cy="260" r="20" fill="#242424" stroke="#ff6b35" stroke-width="2"/>
        <text x="156" y="265" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="16" font-weight="bold">3</text>
        <line x1="252" y1="65" x2="252" y2="215" stroke="#ffc233" stroke-width="3"/>
        <text x="262" y="140" fill="#ffc233" font-size="10" transform="rotate(90,262,140)">T&G Joint</text>
        <rect x="300" y="85" width="130" height="60" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <rect x="310" y="100" width="24" height="16" fill="url(#osb)" stroke="#8b7355"/>
        <text x="342" y="112" fill="white" font-size="10">3/4" OSB T&G</text>
        <circle cx="320" cy="130" r="3" fill="#ffc233"/>
        <text x="332" y="133" fill="#ffc233" font-size="10">2" Screws</text>
    </svg>`,

    // Step 4: Back Wall
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="spf" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d4a574"/>
                <stop offset="50%" stop-color="#c49464"/>
                <stop offset="100%" stop-color="#b48454"/>
            </linearGradient>
        </defs>
        <rect x="80" y="280" width="340" height="15" fill="#c4a35a" stroke="#8b7355" stroke-width="2"/>
        <text x="250" y="310" text-anchor="middle" fill="#666" font-size="10">Floor Deck</text>
        <rect x="90" y="100" width="320" height="10" fill="url(#spf)" stroke="#8b5a2b"/>
        <rect x="90" y="110" width="320" height="10" fill="url(#spf)" stroke="#8b5a2b"/>
        <rect x="90" y="270" width="320" height="10" fill="url(#spf)" stroke="#8b5a2b"/>
        ${[100,145,190,235,280,325,370].map(x=>`
            <rect x="${x}" y="120" width="10" height="150" fill="url(#spf)" stroke="#8b5a2b"/>
        `).join('')}
        <line x1="100" y1="330" x2="145" y2="330" stroke="#4dabf7"/>
        <text x="122" y="350" text-anchor="middle" fill="#4dabf7" font-family="monospace" font-size="10">16.5" O.C.</text>
        <line x1="430" y1="100" x2="430" y2="280" stroke="#ff6b35" stroke-dasharray="5,5"/>
        <text x="455" y="190" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="12" transform="rotate(90,455,190)">6'-0"</text>
        <rect x="30" y="90" width="120" height="85" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <text x="90" y="110" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Back Wall</text>
        <rect x="40" y="125" width="20" height="6" fill="url(#spf)" stroke="#8b5a2b"/>
        <text x="68" y="132" fill="white" font-size="9">2×4 Studs (9)</text>
        <rect x="40" y="145" width="20" height="6" fill="url(#spf)" stroke="#8b5a2b"/>
        <text x="68" y="152" fill="white" font-size="9">2×4 Plates (3)</text>
        <circle cx="50" cy="165" r="3" fill="#ffc233"/>
        <text x="68" y="168" fill="#ffc233" font-size="9">3" Screws</text>
    </svg>`,

    // Step 5: Side Walls
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="spf2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d4a574"/>
                <stop offset="100%" stop-color="#b48454"/>
            </linearGradient>
        </defs>
        <rect x="100" y="260" width="300" height="15" fill="#c4a35a" stroke="#8b7355" stroke-width="2"/>
        <rect x="110" y="110" width="10" height="150" fill="url(#spf2)" stroke="#8b5a2b" opacity="0.5"/>
        <rect x="380" y="110" width="10" height="150" fill="url(#spf2)" stroke="#8b5a2b" opacity="0.5"/>
        <rect x="110" y="100" width="280" height="10" fill="url(#spf2)" stroke="#8b5a2b" opacity="0.5"/>
        <rect x="110" y="250" width="280" height="10" fill="url(#spf2)" stroke="#8b5a2b" opacity="0.5"/>
        <text x="250" y="180" text-anchor="middle" fill="#555" font-size="10">Back Wall (built)</text>
        <g transform="translate(55,0)">
            <rect x="30" y="100" width="8" height="160" fill="url(#spf2)" stroke="#8b5a2b"/>
            <rect x="30" y="92" width="75" height="8" fill="url(#spf2)" stroke="#8b5a2b"/>
            <rect x="30" y="260" width="75" height="8" fill="url(#spf2)" stroke="#8b5a2b"/>
            ${[48,66,84].map(x=>`<rect x="${x}" y="100" width="8" height="160" fill="url(#spf2)" stroke="#8b5a2b"/>`).join('')}
            <text x="67" y="290" text-anchor="middle" fill="#51cf66" font-size="11" font-weight="bold">LEFT</text>
        </g>
        <g transform="translate(295,0)">
            <rect x="97" y="100" width="8" height="160" fill="url(#spf2)" stroke="#8b5a2b"/>
            <rect x="30" y="92" width="75" height="8" fill="url(#spf2)" stroke="#8b5a2b"/>
            <rect x="30" y="260" width="75" height="8" fill="url(#spf2)" stroke="#8b5a2b"/>
            ${[48,66,84].map(x=>`<rect x="${x}" y="100" width="8" height="160" fill="url(#spf2)" stroke="#8b5a2b"/>`).join('')}
            <text x="67" y="290" text-anchor="middle" fill="#51cf66" font-size="11" font-weight="bold">RIGHT</text>
        </g>
        <line x1="85" y1="320" x2="160" y2="320" stroke="#ff6b35"/>
        <text x="122" y="340" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="11">7'-5"</text>
        <rect x="180" y="40" width="140" height="50" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <text x="250" y="60" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Side Walls (×2)</text>
        <text x="250" y="78" text-anchor="middle" fill="#a0a0a0" font-size="10">7 studs each</text>
    </svg>`,

    // Step 6: Front Wall with Door
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="spf3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d4a574"/>
                <stop offset="100%" stop-color="#b48454"/>
            </linearGradient>
        </defs>
        <rect x="80" y="280" width="340" height="15" fill="#c4a35a" stroke="#8b7355" stroke-width="2"/>
        <rect x="90" y="100" width="320" height="10" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="90" y="110" width="320" height="10" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="90" y="270" width="125" height="10" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="285" y="270" width="125" height="10" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="100" y="120" width="10" height="150" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="140" y="120" width="10" height="150" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="350" y="120" width="10" height="150" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="390" y="120" width="10" height="150" fill="url(#spf3)" stroke="#8b5a2b"/>
        <rect x="175" y="120" width="10" height="150" fill="#ffc233" stroke="#cc9900"/>
        <rect x="315" y="120" width="10" height="150" fill="#ffc233" stroke="#cc9900"/>
        <rect x="185" y="145" width="10" height="125" fill="#4dabf7" stroke="#3498db"/>
        <rect x="305" y="145" width="10" height="125" fill="#4dabf7" stroke="#3498db"/>
        <rect x="185" y="120" width="130" height="25" fill="#51cf66" stroke="#27ae60"/>
        <text x="250" y="137" text-anchor="middle" fill="white" font-size="9" font-weight="bold">2×6 HEADER</text>
        <rect x="195" y="145" width="110" height="125" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
        <text x="250" y="210" text-anchor="middle" fill="#555" font-size="11">DOOR</text>
        <text x="250" y="228" text-anchor="middle" fill="#555" font-size="10">OPENING</text>
        <line x1="195" y1="300" x2="305" y2="300" stroke="#ff6b35"/>
        <text x="250" y="318" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="11">38" R.O.</text>
        <rect x="30" y="85" width="125" height="95" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <text x="92" y="105" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Door Framing</text>
        <rect x="40" y="118" width="12" height="12" fill="#ffc233" stroke="#cc9900"/>
        <text x="60" y="128" fill="white" font-size="9">King Studs</text>
        <rect x="40" y="138" width="12" height="12" fill="#4dabf7" stroke="#3498db"/>
        <text x="60" y="148" fill="white" font-size="9">Jack Studs</text>
        <rect x="40" y="158" width="12" height="8" fill="#51cf66" stroke="#27ae60"/>
        <text x="60" y="166" fill="white" font-size="9">Header (2×6)</text>
    </svg>`,

    // Step 7: Roof Framing
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="raft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d4a574"/>
                <stop offset="100%" stop-color="#b48454"/>
            </linearGradient>
        </defs>
        <rect x="80" y="240" width="340" height="10" fill="#c49464" stroke="#8b5a2b" stroke-width="2"/>
        <rect x="70" y="80" width="360" height="10" fill="#8b5a2b" stroke="#5a3a1b" stroke-width="2"/>
        <text x="250" y="75" text-anchor="middle" fill="#ffc233" font-size="11">2×6 Ridge Board (10')</text>
        ${[90,140,190,240,290,340,390].map(x=>`
            <line x1="${x}" y1="90" x2="${x-80}" y2="240" stroke="url(#raft)" stroke-width="8"/>
            <line x1="${x}" y1="90" x2="${x+80}" y2="240" stroke="url(#raft)" stroke-width="8"/>
        `).join('')}
        ${[140,240,340].map(x=>`
            <line x1="${x-40}" y1="150" x2="${x+40}" y2="150" stroke="#51cf66" stroke-width="6"/>
        `).join('')}
        <path d="M50 240 L50 180 L90 180" fill="none" stroke="#ff6b35" stroke-dasharray="3,3"/>
        <text x="55" y="215" fill="#ff6b35" font-size="10">4</text>
        <text x="65" y="190" fill="#ff6b35" font-size="10">12</text>
        <text x="45" y="260" fill="#ff6b35" font-size="11">4:12</text>
        <rect x="310" y="280" width="130" height="75" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <line x1="320" y1="300" x2="350" y2="300" stroke="url(#raft)" stroke-width="6"/>
        <text x="358" y="304" fill="white" font-size="10">2×4 Rafters</text>
        <line x1="320" y1="320" x2="350" y2="320" stroke="#51cf66" stroke-width="4"/>
        <text x="358" y="324" fill="white" font-size="10">Collar Ties</text>
        <rect x="320" y="335" width="10" height="10" fill="#888" stroke="#666"/>
        <text x="358" y="345" fill="white" font-size="10">Hurricane Ties</text>
    </svg>`,

    // Step 8: Sheathing & Siding
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="ss" patternUnits="userSpaceOnUse" width="100" height="20">
                <rect width="100" height="20" fill="#a0522d"/>
                <line x1="0" y1="8" x2="100" y2="8" stroke="#8b4513"/>
                <line x1="0" y1="16" x2="100" y2="16" stroke="#8b4513"/>
            </pattern>
            <pattern id="osbr" patternUnits="userSpaceOnUse" width="15" height="15">
                <rect width="15" height="15" fill="#c4a35a"/>
                <circle cx="3" cy="3" r="1" fill="#b89545"/>
            </pattern>
        </defs>
        <rect x="100" y="130" width="300" height="150" fill="url(#ss)" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="60,150 100,130 100,280 60,300" fill="url(#ss)" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="440,150 400,130 400,280 440,300" fill="url(#ss)" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="40,150 250,60 250,80 60,160" fill="url(#osbr)" stroke="#8b7355" stroke-width="2"/>
        <polygon points="460,150 250,60 250,80 440,160" fill="url(#osbr)" stroke="#8b7355" stroke-width="2"/>
        <rect x="200" y="180" width="60" height="100" fill="#ff6b35" stroke="#cc4400" stroke-width="3" stroke-dasharray="5,3"/>
        <text x="230" y="225" text-anchor="middle" fill="white" font-size="9" font-weight="bold">SAVE</text>
        <text x="230" y="240" text-anchor="middle" fill="white" font-size="9" font-weight="bold">THIS!</text>
        <rect x="96" y="130" width="8" height="150" fill="#d4a574" stroke="#8b5a2b"/>
        <rect x="396" y="130" width="8" height="150" fill="#d4a574" stroke="#8b5a2b"/>
        <rect x="280" y="180" width="100" height="50" fill="#242424" stroke="#ff6b35" rx="4"/>
        <text x="330" y="198" text-anchor="middle" fill="#ff6b35" font-size="10">LP SmartSide</text>
        <text x="330" y="212" text-anchor="middle" fill="#a0a0a0" font-size="9">7 panels</text>
        <text x="330" y="224" text-anchor="middle" fill="#ffc233" font-size="9">8d galv nails</text>
        <rect x="140" y="70" width="80" height="40" fill="#242424" stroke="#4dabf7" rx="4"/>
        <text x="180" y="88" text-anchor="middle" fill="#4dabf7" font-size="10">Roof OSB</text>
        <text x="180" y="102" text-anchor="middle" fill="#ffc233" font-size="9">2" screws</text>
    </svg>`,

    // Step 9: Build the Door
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="ssd" patternUnits="userSpaceOnUse" width="80" height="16">
                <rect width="80" height="16" fill="#a0522d"/>
                <line x1="0" y1="8" x2="80" y2="8" stroke="#8b4513"/>
            </pattern>
            <linearGradient id="wf" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#d4a574"/>
                <stop offset="100%" stop-color="#b48454"/>
            </linearGradient>
        </defs>
        <text x="130" y="30" text-anchor="middle" fill="#a0a0a0" font-size="12">FRONT (Siding)</text>
        <text x="370" y="30" text-anchor="middle" fill="#a0a0a0" font-size="12">BACK (Frame)</text>
        <rect x="50" y="45" width="160" height="290" fill="url(#ssd)" stroke="#5a3a1b" stroke-width="3"/>
        <rect x="60" y="160" width="50" height="65" fill="#1a1a1a" stroke="#333" stroke-width="2" rx="2"/>
        <circle cx="100" cy="192" r="8" fill="#ffc233" stroke="#cc9900" stroke-width="2"/>
        <rect x="60" y="235" width="50" height="80" fill="#1a1a1a" stroke="#333" stroke-width="2" rx="2"/>
        <rect x="130" y="160" width="70" height="65" fill="#1a1a1a" stroke="#333" stroke-width="2" rx="2"/>
        <rect x="130" y="235" width="70" height="80" fill="#1a1a1a" stroke="#333" stroke-width="2" rx="2"/>
        <rect x="290" y="45" width="160" height="290" fill="none" stroke="#666" stroke-dasharray="5,5"/>
        <rect x="290" y="45" width="20" height="290" fill="url(#wf)" stroke="#8b5a2b" stroke-width="2"/>
        <rect x="430" y="45" width="20" height="290" fill="url(#wf)" stroke="#8b5a2b" stroke-width="2"/>
        <rect x="290" y="45" width="160" height="20" fill="url(#wf)" stroke="#8b5a2b" stroke-width="2"/>
        <rect x="290" y="315" width="160" height="20" fill="url(#wf)" stroke="#8b5a2b" stroke-width="2"/>
        <rect x="290" y="175" width="160" height="20" fill="url(#wf)" stroke="#8b5a2b" stroke-width="2"/>
        <text x="370" y="130" text-anchor="middle" fill="#666" font-size="10">2×4 Frame</text>
        <text x="370" y="260" text-anchor="middle" fill="#666" font-size="10">glued & screwed</text>
        <line x1="260" y1="45" x2="260" y2="335" stroke="#51cf66" stroke-width="2"/>
        <polygon points="255,180 265,180 260,170" fill="#51cf66"/>
        <polygon points="255,200 265,200 260,210" fill="#51cf66"/>
        <text x="250" y="190" text-anchor="end" fill="#51cf66" font-size="10">glue</text>
        <rect x="50" y="85" width="15" height="40" fill="#888" stroke="#666"/>
        <rect x="50" y="160" width="15" height="40" fill="#888" stroke="#666"/>
        <rect x="50" y="255" width="15" height="40" fill="#888" stroke="#666"/>
        <text x="35" y="110" text-anchor="end" fill="#ffc233" font-size="9">T-Hinge</text>
        <line x1="50" y1="355" x2="210" y2="355" stroke="#ff6b35"/>
        <text x="130" y="372" text-anchor="middle" fill="#ff6b35" font-family="monospace" font-size="11">35" × 79"</text>
    </svg>`,

    // Step 10: Roofing & Finish
    `<svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="shin" patternUnits="userSpaceOnUse" width="30" height="15">
                <rect width="30" height="15" fill="#4a4a4a"/>
                <rect x="0" y="0" width="14" height="14" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="0.5"/>
                <rect x="15" y="0" width="14" height="14" fill="#3a3a3a" stroke="#2a2a2a" stroke-width="0.5"/>
            </pattern>
        </defs>
        <rect x="100" y="130" width="300" height="150" fill="#a0522d" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="60,150 100,130 100,280 60,300" fill="#8b4513" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="440,150 400,130 400,280 440,300" fill="#8b4513" stroke="#5a3a1b" stroke-width="2"/>
        <polygon points="40,150 250,60 250,80 60,160" fill="url(#shin)" stroke="#333" stroke-width="2"/>
        <polygon points="460,150 250,60 250,80 440,160" fill="url(#shin)" stroke="#333" stroke-width="2"/>
        <line x1="250" y1="58" x2="250" y2="82" stroke="#2a2a2a" stroke-width="8"/>
        <line x1="35" y1="152" x2="60" y2="162" stroke="#888" stroke-width="3"/>
        <line x1="455" y1="152" x2="440" y2="162" stroke="#888" stroke-width="3"/>
        <rect x="195" y="175" width="70" height="105" fill="#a0522d" stroke="#5a3a1b" stroke-width="2"/>
        <rect x="200" y="180" width="28" height="35" fill="#1a1a1a" stroke="#333"/>
        <rect x="232" y="180" width="28" height="35" fill="#1a1a1a" stroke="#333"/>
        <rect x="200" y="220" width="28" height="55" fill="#1a1a1a" stroke="#333"/>
        <rect x="232" y="220" width="28" height="55" fill="#1a1a1a" stroke="#333"/>
        <circle cx="255" cy="235" r="4" fill="#ffc233"/>
        <rect x="188" y="172" width="7" height="108" fill="#d4a574" stroke="#8b5a2b"/>
        <rect x="265" y="172" width="7" height="108" fill="#d4a574" stroke="#8b5a2b"/>
        <rect x="188" y="165" width="84" height="7" fill="#d4a574" stroke="#8b5a2b"/>
        <circle cx="250" cy="40" r="30" fill="#51cf66"/>
        <text x="250" y="35" text-anchor="middle" fill="white" font-size="24">✓</text>
        <text x="250" y="52" text-anchor="middle" fill="white" font-size="9" font-weight="bold">COMPLETE!</text>
        <rect x="310" y="240" width="130" height="80" fill="#242424" stroke="#3d3d3d" rx="4"/>
        <text x="375" y="260" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Final Steps:</text>
        <text x="375" y="278" text-anchor="middle" fill="#a0a0a0" font-size="9">• Caulk all joints</text>
        <text x="375" y="292" text-anchor="middle" fill="#a0a0a0" font-size="9">• Prime cut edges</text>
        <text x="375" y="306" text-anchor="middle" fill="#a0a0a0" font-size="9">• Paint within 180 days</text>
    </svg>`
];
