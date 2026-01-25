// Parts Modal - displays part details
const PartsModal = {
    modalEl: null,

    init() {
        // Create modal container if not exists
        if (!document.getElementById('parts-modal')) {
            const modal = document.createElement('div');
            modal.id = 'parts-modal';
            modal.className = 'parts-modal';
            modal.innerHTML = `
                <div class="parts-modal-backdrop"></div>
                <div class="parts-modal-content">
                    <button class="parts-modal-close" aria-label="Close">&times;</button>
                    <div class="parts-modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modalEl = modal;

            // Close handlers
            modal.querySelector('.parts-modal-backdrop').addEventListener('click', () => this.close());
            modal.querySelector('.parts-modal-close').addEventListener('click', () => this.close());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modalEl.classList.contains('open')) {
                    this.close();
                }
            });
        }
    },

    open(partId) {
        const part = partsData.find(p => p.id === partId);
        if (!part) {
            console.warn(`Part not found: ${partId}`);
            return;
        }

        const stepTitle = steps[part.step - 1]?.title || `Step ${part.step}`;

        const body = this.modalEl.querySelector('.parts-modal-body');
        body.innerHTML = `
            <h2 class="parts-modal-id">${part.id}</h2>
            <p class="parts-modal-desc">${part.description}</p>
            <dl class="parts-modal-details">
                <div class="parts-modal-row">
                    <dt>Material</dt>
                    <dd>${part.material}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Size</dt>
                    <dd>${part.length}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Quantity</dt>
                    <dd>${part.qty}</dd>
                </div>
                <div class="parts-modal-row">
                    <dt>Step</dt>
                    <dd>${stepTitle}</dd>
                </div>
                ${part.notes ? `
                <div class="parts-modal-row full-width">
                    <dt>Notes</dt>
                    <dd>${part.notes}</dd>
                </div>
                ` : ''}
            </dl>
            <button class="parts-modal-goto" data-step="${part.step - 1}">
                Go to Step ${part.step}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        `;

        // Go to step handler
        body.querySelector('.parts-modal-goto').addEventListener('click', (e) => {
            const stepIndex = parseInt(e.currentTarget.dataset.step);
            this.close();
            loadStep(stepIndex);
        });

        this.modalEl.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modalEl.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => PartsModal.init());
