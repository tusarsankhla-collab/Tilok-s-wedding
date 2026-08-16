/* ==========================================================================
   Elegance & Heritage — Memory Wall & Smooth Guest File Uploader
   ========================================================================== */

class MemoryWallManager {
    constructor() {
        this.uploadModal = document.getElementById('guestUploadModal');
        this.uploadForm = document.getElementById('guestUploadForm');
        this.fileInput = document.getElementById('guestFileInput');
        this.dropzone = document.getElementById('guestDropzone');
        this.previewBox = document.getElementById('guestFilePreviewBox');
        this.progressWrap = document.getElementById('guestUploadProgressWrap');
        this.progressFill = document.getElementById('guestUploadProgressFill');
        this.progressPercent = document.getElementById('guestProgressPercent');

        this.selectedFile = null;

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btnShareMoment')?.addEventListener('click', () => this.openUploadModal());
        document.getElementById('btnOpenUploadModal')?.addEventListener('click', () => this.openUploadModal());
        document.getElementById('closeGuestUploadBtn')?.addEventListener('click', () => this.closeUploadModal());
        document.getElementById('cancelGuestUploadBtn')?.addEventListener('click', () => this.closeUploadModal());

        if (this.dropzone && this.fileInput) {
            this.dropzone.addEventListener('click', () => this.fileInput.click());
            this.fileInput.addEventListener('change', (e) => this.handleFileSelected(e));
        }

        this.uploadForm?.addEventListener('submit', (e) => this.handleGuestSubmit(e));
    }

    openUploadModal() {
        if (!this.uploadModal) return;
        this.uploadForm.reset();
        this.selectedFile = null;
        if (this.previewBox) this.previewBox.classList.add('hidden');
        if (this.progressWrap) this.progressWrap.classList.add('hidden');
        this.uploadModal.classList.remove('hidden');
    }

    closeUploadModal() {
        if (this.uploadModal) this.uploadModal.classList.add('hidden');
    }

    handleFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;

        this.selectedFile = file;
        const sizeMb = (file.size / 1024 / 1024).toFixed(2);

        document.getElementById('guestFileName').textContent = file.name;
        document.getElementById('guestFileSize').textContent = `${sizeMb} MB`;

        if (this.previewBox) this.previewBox.classList.remove('hidden');
    }

    handleGuestSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitGuestUploadBtn');
        const authorName = document.getElementById('guestAuthorName').value;
        const memoryTitle = document.getElementById('guestMemoryTitle').value;
        const eventCategory = document.getElementById('guestEventCategory').value;
        const memoryNote = document.getElementById('guestMemoryNote').value;

        // Smooth Large File Upload Progress Simulation
        if (this.progressWrap && this.progressFill && this.progressPercent) {
            this.progressWrap.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            let progress = 0;
            const interval = setInterval(() => {
                progress += 25;
                this.progressFill.style.width = `${progress}%`;
                this.progressPercent.textContent = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    this.finalizeGuestSubmit(authorName, memoryTitle, eventCategory, memoryNote);
                    if (submitBtn) submitBtn.disabled = false;
                }
            }, 100);
        } else {
            this.finalizeGuestSubmit(authorName, memoryTitle, eventCategory, memoryNote);
        }
    }

    finalizeGuestSubmit(authorName, memoryTitle, eventCategory, memoryNote) {
        let fileUrl = '';
        let fileSize = '3.8 MB';

        if (this.selectedFile) {
            fileUrl = URL.createObjectURL(this.selectedFile);
            fileSize = `${(this.selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
        } else {
            fileUrl = generateSVGDataURI(memoryTitle, `Shared by ${authorName}`, '#065F46', '#021F1B', '#6EE7B7');
        }

        const newGuestMedia = {
            id: 'guest-' + Date.now(),
            title: memoryTitle,
            description: memoryNote,
            mediaType: 'IMAGE',
            category: eventCategory,
            authorName,
            fileUrl,
            posterUrl: fileUrl,
            fileType: 'JPG Image',
            fileSize,
            uploadDate: new Date().toISOString().split('T')[0],
            visibility: 'GUESTS',
            status: 'PENDING', // PENDING moderation queue
            isGuestUpload: true,
            folderPath: '/wedding/guest-uploads/'
        };

        storage.saveMediaItem(newGuestMedia);
        this.closeUploadModal();

        showToast('Thank you! Your memory was uploaded seamlessly for review.', 'sparkles');
        
        if (typeof adminManager !== 'undefined') {
            adminManager.updatePendingBadge();
        }
    }

    renderMemoryWall() {
        const grid = document.getElementById('memoryWallGrid');
        if (!grid) return;

        const approvedItems = storage.getGuestVisibleItems().filter(i => 
            i.category === 'MEMORIES' || i.isGuestUpload || i.isFeatured
        );

        grid.innerHTML = '';

        const photoCountElem = document.getElementById('approvedPhotoCount');
        const audioCountElem = document.getElementById('audioNoteCount');
        const wishesCountElem = document.getElementById('wishesCount');

        if (photoCountElem) photoCountElem.textContent = approvedItems.length;
        if (audioCountElem) audioCountElem.textContent = Math.floor(approvedItems.length * 1.5);
        if (wishesCountElem) wishesCountElem.textContent = approvedItems.length + 8;

        if (approvedItems.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#94A3B8;">The Memory Wall is ready. Be the first guest to share your photos!</div>`;
            return;
        }

        approvedItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <img src="${item.posterUrl || item.fileUrl}" alt="${item.title}" class="memory-img">
                <blockquote class="memory-quote font-cursive">"${item.description || item.title}"</blockquote>
                <div class="memory-author">
                    <i data-lucide="heart" style="color:#2DD4BF; width:16px; height:16px;"></i>
                    <span>${item.authorName || 'Sophia & Alexander'}</span>
                </div>
            `;
            grid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

const memoryWall = new MemoryWallManager();
