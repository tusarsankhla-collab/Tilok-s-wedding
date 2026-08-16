/* ==========================================================================
   Elegance & Heritage — Digital Archive Real-Time Search & Filtering Engine
   ========================================================================== */

class MediaSearchFilterEngine {
    constructor() {
        this.searchInput = document.getElementById('momentsSearchInput');
        this.typeSelect = document.getElementById('filterTypeSelect');
        this.eventSelect = document.getElementById('filterEventSelect');
        this.gridContainer = document.getElementById('momentsMasonryGrid');

        this.bindEvents();
    }

    bindEvents() {
        this.searchInput?.addEventListener('input', () => this.filterAndRender());
        this.typeSelect?.addEventListener('change', () => this.filterAndRender());
        this.eventSelect?.addEventListener('change', () => this.filterAndRender());
    }

    filterAndRender() {
        if (!this.gridContainer) return;

        const query = (this.searchInput?.value || '').toLowerCase().trim();
        const selectedType = this.typeSelect?.value || 'ALL';
        const selectedEvent = this.eventSelect?.value || 'ALL';

        const visibleItems = storage.getGuestVisibleItems();

        const filtered = visibleItems.filter(item => {
            // Type Match
            if (selectedType !== 'ALL' && item.mediaType !== selectedType) return false;

            // Event Category Match
            if (selectedEvent !== 'ALL' && item.category !== selectedEvent) return false;

            // Keyword Search Match
            if (query.length > 0) {
                const titleMatch = (item.title || '').toLowerCase().includes(query);
                const descMatch = (item.description || '').toLowerCase().includes(query);
                const catMatch = (item.category || '').toLowerCase().includes(query);
                const authorMatch = (item.authorName || '').toLowerCase().includes(query);
                return titleMatch || descMatch || catMatch || authorMatch;
            }

            return true;
        });

        this.renderGrid(filtered);
    }

    renderGrid(items) {
        this.gridContainer.innerHTML = '';

        if (items.length === 0) {
            this.gridContainer.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:4rem; color:#94A3B8;">
                    <i data-lucide="search-x" style="width:48px; height:48px; margin-bottom:1rem; color:#D4AF37;"></i>
                    <h3>No media found matching your search</h3>
                    <p style="font-size:0.9rem;">Try clearing your filters or searching for different keywords.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'moment-card';
            card.innerHTML = `
                <div class="moment-thumb-wrap" data-id="${item.id}">
                    <img src="${item.posterUrl || item.fileUrl}" alt="${item.title}">
                    <div class="moment-type-badge">
                        <i data-lucide="${
                            item.mediaType === 'VIDEO' ? 'film' :
                            item.mediaType === 'DOCUMENT' ? 'file-text' :
                            item.mediaType === 'INVITATION' ? 'mail' : 'image'
                        }"></i>
                        <span>${item.mediaType}</span>
                    </div>
                </div>
                <div class="moment-info">
                    <span class="badge badge-gold" style="margin-bottom:0.4rem;">${item.category}</span>
                    <h3 class="moment-title">${item.title}</h3>
                    <p class="moment-caption">${item.description || ''}</p>
                </div>
            `;

            card.addEventListener('click', () => this.openItemDetail(item));
            this.gridContainer.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    openItemDetail(item) {
        if (item.mediaType === 'VIDEO' && typeof videoPlatform !== 'undefined') {
            videoPlatform.openVideo(item);
            return;
        }

        if (item.mediaType === 'DOCUMENT' && typeof pdfViewer !== 'undefined') {
            pdfViewer.openDocument(item);
            return;
        }

        // Open Detail Lightbox Modal for Images and Invitations
        const modal = document.getElementById('mediaDetailModal');
        const visualSide = document.getElementById('detailVisualSide');
        const categoryBadge = document.getElementById('detailCategoryBadge');
        const visibilityBadge = document.getElementById('detailVisibilityBadge');
        const titleElem = document.getElementById('detailTitle');
        const descElem = document.getElementById('detailDescription');
        const dateElem = document.getElementById('detailDate');
        const fileTypeElem = document.getElementById('detailFileType');
        const fileSizeElem = document.getElementById('detailFileSize');
        const statusElem = document.getElementById('detailStatus');

        if (visualSide) {
            visualSide.innerHTML = `<img src="${item.fileUrl || item.posterUrl}" alt="${item.title}">`;
        }

        if (categoryBadge) categoryBadge.textContent = item.category;
        if (visibilityBadge) visibilityBadge.textContent = item.visibility;
        if (titleElem) titleElem.textContent = item.title;
        if (descElem) descElem.textContent = item.description || 'Editorial memory in our digital wedding archive.';
        if (dateElem) dateElem.textContent = item.uploadDate || 'Oct 24, 2026';
        if (fileTypeElem) fileTypeElem.textContent = item.fileType || 'JPG Image';
        if (fileSizeElem) fileSizeElem.textContent = item.fileSize || '3.5 MB';
        if (statusElem) statusElem.textContent = item.status;

        const downloadBtn = document.getElementById('detailDownloadBtn');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = item.fileUrl;
                link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}`;
                link.click();
                showToast(`Downloading "${item.title}"...`, 'download');
            };
        }

        const closeBtn = document.getElementById('closeMediaDetailBtn');
        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

        if (modal) modal.classList.remove('hidden');
    }
}

const searchEngine = new MediaSearchFilterEngine();
