// Parts Grid - full parts list grouped by step
const PartsGrid = {
    containerEl: null,
    expandedSteps: new Set([1]), // Start with step 1 expanded
    searchTerm: '',

    init() {
        this.containerEl = document.getElementById('parts-grid-container');
    },

    show() {
        if (!this.containerEl) return;
        this.render();
        this.containerEl.style.display = 'block';
    },

    hide() {
        if (!this.containerEl) return;
        this.containerEl.style.display = 'none';
    },

    render() {
        // Group parts by step
        const byStep = {};
        partsData.forEach(part => {
            const step = part.step || 0;
            if (!byStep[step]) byStep[step] = [];
            byStep[step].push(part);
        });

        // Filter by search term
        const term = this.searchTerm.toLowerCase();
        const filteredByStep = {};
        let hasResults = false;

        Object.keys(byStep).forEach(step => {
            const filtered = byStep[step].filter(part =>
                !term ||
                part.id.toLowerCase().includes(term) ||
                part.description.toLowerCase().includes(term) ||
                part.material.toLowerCase().includes(term)
            );
            if (filtered.length > 0) {
                filteredByStep[step] = filtered;
                hasResults = true;
                // Auto-expand steps with search matches
                if (term) this.expandedSteps.add(parseInt(step));
            }
        });

        // Build HTML
        let html = `
            <div class="parts-grid-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search parts..." value="${this.searchTerm}" id="parts-search-input">
            </div>
        `;

        if (!hasResults) {
            html += `<div class="parts-grid-empty">No parts match "${this.searchTerm}"</div>`;
        } else {
            const sortedSteps = Object.keys(filteredByStep).map(Number).sort((a, b) => a - b);

            sortedSteps.forEach(stepNum => {
                const parts = filteredByStep[stepNum];
                const stepTitle = steps[stepNum - 1]?.title || `Step ${stepNum}`;
                const isExpanded = this.expandedSteps.has(stepNum);

                html += `
                    <div class="parts-grid-group">
                        <button class="parts-grid-header ${isExpanded ? 'expanded' : ''}" data-step="${stepNum}">
                            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                            <span class="step-title">${stepTitle}</span>
                            <span class="step-count">${parts.length} piece${parts.length !== 1 ? 's' : ''}</span>
                        </button>
                        <div class="parts-grid-rows ${isExpanded ? 'expanded' : ''}">
                            ${parts.map(part => `
                                <button class="parts-grid-row" data-part-id="${part.id}">
                                    <span class="part-id">${part.id}</span>
                                    <span class="part-desc">${part.description}</span>
                                    <span class="part-qty">${part.qty}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
        }

        this.containerEl.innerHTML = html;

        // Attach event handlers
        this.containerEl.querySelector('#parts-search-input')?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.render();
            // Re-focus input after render
            this.containerEl.querySelector('#parts-search-input')?.focus();
        });

        this.containerEl.querySelectorAll('.parts-grid-header').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.step);
                if (this.expandedSteps.has(step)) {
                    this.expandedSteps.delete(step);
                } else {
                    this.expandedSteps.add(step);
                }
                this.render();
            });
        });

        this.containerEl.querySelectorAll('.parts-grid-row').forEach(btn => {
            btn.addEventListener('click', () => {
                PartsModal.open(btn.dataset.partId);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => PartsGrid.init());
