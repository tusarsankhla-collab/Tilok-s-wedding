/* ==========================================================================
   Elegance & Heritage — Custom PDF Document Viewer Engine
   ========================================================================== */

class PDFDocumentViewer {
    constructor() {
        this.modal = document.getElementById('pdfViewerModal');
        this.titleElem = document.getElementById('pdfViewerTitle');
        this.currentPageElem = document.getElementById('pdfCurrentPage');
        this.totalPagesElem = document.getElementById('pdfTotalPages');
        this.zoomValElem = document.getElementById('pdfZoomVal');
        this.thumbnailsList = document.getElementById('pdfThumbnailsList');
        this.pageSheet = document.getElementById('pdfPageSheet');

        this.currentDoc = null;
        this.currentPage = 1;
        this.zoomLevel = 100; // %

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('pdfCloseBtn')?.addEventListener('click', () => this.close());
        document.getElementById('pdfPrevPage')?.addEventListener('click', () => this.prevPage());
        document.getElementById('pdfNextPage')?.addEventListener('click', () => this.nextPage());
        document.getElementById('pdfZoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('pdfZoomOut')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('pdfDownloadBtn')?.addEventListener('click', () => this.downloadDoc());
    }

    openDocument(docItem) {
        if (!docItem) return;

        this.currentDoc = docItem;
        this.currentPage = 1;
        this.zoomLevel = 100;

        if (this.titleElem) this.titleElem.textContent = docItem.title + ' (PDF)';
        
        const pages = docItem.pdfPages || [
            { pageNum: 1, title: docItem.title, content: docItem.description || 'Official wedding document.' }
        ];

        if (this.totalPagesElem) this.totalPagesElem.textContent = pages.length;

        // Render Thumbnails
        this.renderThumbnails(pages);

        // Render Current Page
        this.renderPage(this.currentPage);

        if (this.modal) this.modal.classList.remove('hidden');
    }

    close() {
        if (this.modal) this.modal.classList.add('hidden');
    }

    renderThumbnails(pages) {
        if (!this.thumbnailsList) return;
        this.thumbnailsList.innerHTML = '';

        pages.forEach(p => {
            const thumb = document.createElement('div');
            thumb.className = `pdf-thumb-item ${p.pageNum === this.currentPage ? 'active' : ''}`;
            thumb.innerHTML = `
                <div style="font-weight:600; color:#D4AF37;">Page ${p.pageNum}</div>
                <div style="font-size:0.7rem; color:#94A3B8; margin-top:2px;">${p.title}</div>
            `;
            thumb.addEventListener('click', () => {
                this.currentPage = p.pageNum;
                this.renderPage(this.currentPage);
                this.updateActiveThumbnail();
            });
            this.thumbnailsList.appendChild(thumb);
        });
    }

    updateActiveThumbnail() {
        if (!this.thumbnailsList) return;
        const thumbs = this.thumbnailsList.querySelectorAll('.pdf-thumb-item');
        thumbs.forEach((t, index) => {
            if (index + 1 === this.currentPage) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
    }

    renderPage(pageNum) {
        if (!this.currentDoc || !this.pageSheet) return;

        const pages = this.currentDoc.pdfPages || [];
        const pageData = pages.find(p => p.pageNum === pageNum) || {
            pageNum: 1,
            title: this.currentDoc.title,
            content: this.currentDoc.description
        };

        if (this.currentPageElem) this.currentPageElem.textContent = pageNum;
        this.pageSheet.style.transform = `scale(${this.zoomLevel / 100})`;

        this.pageSheet.innerHTML = `
            <div style="text-align:center; border-bottom:2px solid #D4AF37; padding-bottom:1.5rem; margin-bottom:2rem;">
                <h4 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:1.8rem; color:#1E1B4B; margin-bottom:0.3rem;">SOPHIA & ALEXANDER</h4>
                <div style="font-size:0.75rem; letter-spacing:3px; text-transform:uppercase; color:#9A7B1C;">OFFICIAL WEDDING DOCUMENTATION</div>
            </div>

            <div style="margin-bottom:2rem;">
                <h2 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:2.2rem; color:#0F172A; margin-bottom:1rem;">${pageData.title}</h2>
                <div style="font-size:1rem; line-height:1.8; color:#334155; white-space:pre-line;">
                    ${pageData.content}
                </div>
            </div>

            <div style="margin-top:auto; border-top:1px solid #E2E8F0; padding-top:1rem; display:flex; justify-content:space-between; font-size:0.75rem; color:#64748B;">
                <span>Document: ${this.currentDoc.title}</span>
                <span>Page ${pageNum} of ${pages.length || 1}</span>
            </div>
        `;
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPage(this.currentPage);
            this.updateActiveThumbnail();
        }
    }

    nextPage() {
        const pages = this.currentDoc?.pdfPages || [1];
        if (this.currentPage < pages.length) {
            this.currentPage++;
            this.renderPage(this.currentPage);
            this.updateActiveThumbnail();
        }
    }

    zoomIn() {
        if (this.zoomLevel < 200) {
            this.zoomLevel += 25;
            if (this.zoomValElem) this.zoomValElem.textContent = `${this.zoomLevel}%`;
            this.renderPage(this.currentPage);
        }
    }

    zoomOut() {
        if (this.zoomLevel > 50) {
            this.zoomLevel -= 25;
            if (this.zoomValElem) this.zoomValElem.textContent = `${this.zoomLevel}%`;
            this.renderPage(this.currentPage);
        }
    }

    downloadDoc() {
        if (!this.currentDoc) return;
        const link = document.createElement('a');
        link.href = this.currentDoc.fileUrl || '#';
        link.download = `${this.currentDoc.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (typeof showToast === 'function') {
            showToast(`Downloading "${this.currentDoc.title}"...`, 'sparkles');
        }
    }
}

const pdfViewer = new PDFDocumentViewer();
