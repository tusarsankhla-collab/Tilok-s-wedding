/* ==========================================================================
   Elegance & Heritage — Admin Media Suite & Smooth Large File Uploader
   ========================================================================== */

class AdminMediaManager {
    constructor() {
        this.adminSuiteSection = document.getElementById('admin-suite');
        this.tabContent = document.getElementById('adminTabContent');
        this.modal = document.getElementById('adminMediaModal');
        this.form = document.getElementById('adminMediaForm');
        
        this.fileInput = document.getElementById('adminFileInput');
        this.dropzone = document.getElementById('adminDropzone');
        this.previewBox = document.getElementById('adminFilePreviewBox');
        this.progressWrap = document.getElementById('adminUploadProgressWrap');
        this.progressFill = document.getElementById('adminUploadProgressFill');
        this.progressPercent = document.getElementById('adminProgressPercent');

        this.selectedFile = null;
        this.currentTab = 'ALL';

        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('btnOpenAdmin')?.addEventListener('click', () => this.toggleAdminView());
        document.getElementById('btnCloseAdmin')?.addEventListener('click', () => this.hideAdminView());
        document.getElementById('btnAdminUploadNew')?.addEventListener('click', () => this.openAddModal());
        document.getElementById('closeAdminMediaBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelAdminMediaBtn')?.addEventListener('click', () => this.closeModal());
        
        if (this.dropzone && this.fileInput) {
            this.dropzone.addEventListener('click', () => this.fileInput.click());
            this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        this.form?.addEventListener('submit', (e) => this.handleSaveMedia(e));

        // Tab Switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentTab = targetTab;
                this.renderTabContent(targetTab);
            });
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        this.selectedFile = file;
        const sizeMb = (file.size / 1024 / 1024).toFixed(2);
        
        document.getElementById('adminFileName').textContent = file.name;
        document.getElementById('adminFileSize').textContent = `${sizeMb} MB`;
        
        if (this.previewBox) this.previewBox.classList.remove('hidden');
    }

    toggleAdminView() {
        if (!this.adminSuiteSection) return;
        this.adminSuiteSection.classList.toggle('hidden');
        if (!this.adminSuiteSection.classList.contains('hidden')) {
            this.renderTabContent(this.currentTab);
            this.updatePendingBadge();
            window.scrollTo({ top: this.adminSuiteSection.offsetTop - 80, behavior: 'smooth' });
        }
    }

    hideAdminView() {
        if (this.adminSuiteSection) this.adminSuiteSection.classList.add('hidden');
    }

    updatePendingBadge() {
        const badge = document.getElementById('pendingModerationBadge');
        if (!badge) return;
        const pendingCount = storage.getAllItems().filter(i => i.isGuestUpload && i.status === 'PENDING').length;
        badge.textContent = pendingCount;
    }

    renderTabContent(tab) {
        if (!this.tabContent) return;
        this.tabContent.innerHTML = '';
        this.updatePendingBadge();

        if (tab === 'STORAGE') {
            this.renderStorageTree();
            return;
        }

        const allItems = storage.getAllItems();
        let itemsToDisplay = allItems;

        if (tab === 'IMAGES') itemsToDisplay = allItems.filter(i => i.mediaType === 'IMAGE');
        else if (tab === 'VIDEOS') itemsToDisplay = allItems.filter(i => i.mediaType === 'VIDEO');
        else if (tab === 'DOCUMENTS') itemsToDisplay = allItems.filter(i => i.mediaType === 'DOCUMENT');
        else if (tab === 'INVITATIONS') itemsToDisplay = allItems.filter(i => i.category === 'INVITATION');
        else if (tab === 'MODERATION') itemsToDisplay = allItems.filter(i => i.isGuestUpload && i.status === 'PENDING');

        if (itemsToDisplay.length === 0) {
            this.tabContent.innerHTML = `
                <div style="text-align:center; padding:4rem; color:#94A3B8;">
                    <i data-lucide="inbox" style="width:48px; height:48px; margin-bottom:1rem; color:#2DD4BF;"></i>
                    <h3>No items found in this section</h3>
                    <p style="font-size:0.9rem;">Click 'Upload New Media' to add media files.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        const table = document.createElement('table');
        table.className = 'admin-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Preview</th>
                    <th>Title & Path</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Visibility</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${itemsToDisplay.map(item => `
                    <tr>
                        <td>
                            <img src="${item.posterUrl || item.fileUrl}" class="table-thumb" alt="${item.title}">
                        </td>
                        <td>
                            <strong>${item.title}</strong><br>
                            <small style="color:#64748B; font-family:monospace;">${item.folderPath || '/wedding/archive/'}</small>
                        </td>
                        <td><span class="badge badge-teal">${item.category}</span></td>
                        <td>${item.fileType}</td>
                        <td>
                            <span class="badge ${item.visibility === 'PRIVATE' ? 'badge-status-pending' : 'badge-glass'}">${item.visibility}</span>
                        </td>
                        <td>
                            <span class="badge ${
                                item.status === 'PUBLISHED' || item.status === 'APPROVED' ? 'badge-status-published' :
                                item.status === 'DRAFT' ? 'badge-status-draft' : 'badge-status-pending'
                            }">${item.status}</span>
                        </td>
                        <td>
                            <button class="btn-icon toggle-featured-btn" data-id="${item.id}" title="Toggle Featured">
                                <i data-lucide="${item.isFeatured ? 'star' : 'star-off'}" style="${item.isFeatured ? 'color:#2DD4BF;' : ''}"></i>
                            </button>
                        </td>
                        <td>
                            <div class="action-btns">
                                ${tab === 'MODERATION' ? `
                                    <button class="btn-icon approve-btn" data-id="${item.id}" title="Approve Guest Submission" style="background:#10B981; color:#000;">
                                        <i data-lucide="check"></i>
                                    </button>
                                    <button class="btn-icon reject-btn" data-id="${item.id}" title="Reject Submission" style="background:#EF4444; color:#FFF;">
                                        <i data-lucide="x"></i>
                                    </button>
                                ` : `
                                    <button class="btn-icon edit-btn" data-id="${item.id}" title="Edit Metadata">
                                        <i data-lucide="edit-3"></i>
                                    </button>
                                    <button class="btn-icon delete-btn" data-id="${item.id}" title="Delete Item">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                `}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        this.tabContent.appendChild(table);
        this.bindTableActionListeners();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    bindTableActionListeners() {
        this.tabContent.querySelectorAll('.toggle-featured-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                storage.toggleFeatured(id);
                this.renderTabContent(this.currentTab);
                if (typeof renderAppViews === 'function') renderAppViews();
            });
        });

        this.tabContent.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                storage.updateStatus(id, 'APPROVED');
                showToast('Guest photo approved and added to Memory Wall!', 'check');
                this.renderTabContent(this.currentTab);
                if (typeof renderAppViews === 'function') renderAppViews();
            });
        });

        this.tabContent.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                storage.updateStatus(id, 'REJECTED');
                showToast('Guest submission rejected.', 'x');
                this.renderTabContent(this.currentTab);
            });
        });

        this.tabContent.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm("Are you sure you want to delete this item from the Digital Archive?")) {
                    storage.deleteItem(id);
                    showToast('Item deleted successfully.', 'trash');
                    this.renderTabContent(this.currentTab);
                    if (typeof renderAppViews === 'function') renderAppViews();
                }
            });
        });

        this.tabContent.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.openEditModal(id);
            });
        });
    }

    renderStorageTree() {
        const allItems = storage.getAllItems();
        const treeMap = {};

        allItems.forEach(item => {
            const folder = item.folderPath || '/wedding/archive/';
            if (!treeMap[folder]) treeMap[folder] = [];
            treeMap[folder].push(item);
        });

        const treeBox = document.createElement('div');
        treeBox.className = 'storage-tree-box';

        let treeHTML = `<h4 style="color:#2DD4BF; margin-bottom:1.5rem;"><i data-lucide="hard-drive"></i> Cloud Storage Hierarchy (/wedding)</h4>`;
        
        for (const [folder, files] of Object.entries(treeMap)) {
            treeHTML += `
                <div class="tree-folder">
                    <i data-lucide="folder" style="color:#2DD4BF; width:16px; height:16px;"></i> ${folder} (${files.length} items)
                </div>
            `;
            files.forEach(f => {
                treeHTML += `
                    <div class="tree-file">
                        ├─ <i data-lucide="file-text" style="width:14px; height:14px;"></i> ${f.title} (${f.fileType} • ${f.fileSize || '3.2 MB'} • ${f.visibility})
                    </div>
                `;
            });
        }

        treeBox.innerHTML = treeHTML;
        this.tabContent.appendChild(treeBox);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    openAddModal() {
        document.getElementById('adminModalTitle').innerHTML = '<i data-lucide="upload"></i> Add Media to Archive';
        document.getElementById('adminEditItemId').value = '';
        this.selectedFile = null;
        if (this.previewBox) this.previewBox.classList.add('hidden');
        if (this.progressWrap) this.progressWrap.classList.add('hidden');
        this.form.reset();
        this.modal.classList.remove('hidden');
    }

    openEditModal(id) {
        const item = storage.getItemById(id);
        if (!item) return;

        document.getElementById('adminModalTitle').innerHTML = '<i data-lucide="edit-3"></i> Edit Media Item';
        document.getElementById('adminEditItemId').value = item.id;
        document.getElementById('adminTitle').value = item.title;
        document.getElementById('adminDescription').value = item.description || '';
        document.getElementById('adminMediaType').value = item.mediaType;
        document.getElementById('adminCategory').value = item.category;
        document.getElementById('adminVisibility').value = item.visibility;
        document.getElementById('adminStatus').value = item.status;
        document.getElementById('adminFeatured').checked = !!item.isFeatured;
        document.getElementById('adminWeddingFilm').checked = !!item.isWeddingFilm;

        if (this.previewBox) this.previewBox.classList.add('hidden');
        if (this.progressWrap) this.progressWrap.classList.add('hidden');

        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }

    handleSaveMedia(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitAdminMediaBtn');
        const editId = document.getElementById('adminEditItemId').value;
        const title = document.getElementById('adminTitle').value;
        const description = document.getElementById('adminDescription').value;
        const mediaType = document.getElementById('adminMediaType').value;
        const category = document.getElementById('adminCategory').value;
        const visibility = document.getElementById('adminVisibility').value;
        const status = document.getElementById('adminStatus').value;
        const isFeatured = document.getElementById('adminFeatured').checked;
        const isWeddingFilm = document.getElementById('adminWeddingFilm').checked;

        // Smooth Large File Processing Progress Animation
        if (this.progressWrap && this.progressFill && this.progressPercent) {
            this.progressWrap.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                this.progressFill.style.width = `${progress}%`;
                this.progressPercent.textContent = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    this.finalizeSaveMedia(editId, title, description, mediaType, category, visibility, status, isFeatured, isWeddingFilm);
                    if (submitBtn) submitBtn.disabled = false;
                }
            }, 100);
        } else {
            this.finalizeSaveMedia(editId, title, description, mediaType, category, visibility, status, isFeatured, isWeddingFilm);
        }
    }

    finalizeSaveMedia(editId, title, description, mediaType, category, visibility, status, isFeatured, isWeddingFilm) {
        let fileUrl = '';
        let posterUrl = '';
        let fileSize = '4.5 MB';

        if (this.selectedFile) {
            fileUrl = URL.createObjectURL(this.selectedFile);
            posterUrl = mediaType === 'IMAGE' ? fileUrl : generateSVGDataURI(title, category, '#064E3B', '#021F1B', '#2DD4BF');
            fileSize = `${(this.selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
        } else if (editId) {
            const existing = storage.getItemById(editId);
            fileUrl = existing.fileUrl;
            posterUrl = existing.posterUrl;
            fileSize = existing.fileSize;
        } else {
            fileUrl = generateSVGDataURI(title, category, '#064E3B', '#021F1B', '#2DD4BF');
            posterUrl = fileUrl;
        }

        const mediaObj = {
            id: editId || 'media-' + Date.now(),
            title,
            description,
            mediaType,
            category,
            visibility,
            status,
            isFeatured,
            isWeddingFilm,
            fileUrl,
            posterUrl,
            fileType: mediaType === 'IMAGE' ? 'JPG Image' : mediaType === 'VIDEO' ? 'MP4 Video' : 'PDF Document',
            fileSize,
            uploadDate: new Date().toISOString().split('T')[0]
        };

        if (isWeddingFilm) {
            storage.setWeddingFilm(mediaObj.id);
        } else {
            storage.saveMediaItem(mediaObj);
        }

        showToast(editId ? 'Media updated successfully!' : 'Large file uploaded smoothly!', 'check');
        this.closeModal();
        this.renderTabContent(this.currentTab);
        if (typeof renderAppViews === 'function') renderAppViews();
    }
}

const adminManager = new AdminMediaManager();
