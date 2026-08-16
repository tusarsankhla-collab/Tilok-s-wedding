/* ==========================================================================
   TILOK & LAKSHMI — PERSISTENCE & STORAGE ARCHITECTURE MANAGER
   GitHub Pages Production Ready
   ========================================================================== */

class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'tilok_lakshmi_wedding_archive_v2';
        this.PHASE_KEY = 'tilok_lakshmi_wedding_phase_v2';
        this.ADMIN_KEY = 'tilok_lakshmi_wedding_admin_v2';
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_DATABASE));
        }
        if (!localStorage.getItem(this.PHASE_KEY)) {
            localStorage.setItem(this.PHASE_KEY, 'before');
        }
        if (!localStorage.getItem(this.ADMIN_KEY)) {
            localStorage.setItem(this.ADMIN_KEY, 'true');
        }
    }

    getAllItems() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Storage read error:", e);
            return INITIAL_MEDIA_DATABASE;
        }
    }

    saveAllItems(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }

    getGuestVisibleItems(isAdmin = false) {
        const all = this.getAllItems();
        return all.filter(item => {
            if (isAdmin) return true;
            if (item.visibility === 'PRIVATE') return false;
            
            if (item.isGuestUpload) {
                return item.status === 'APPROVED';
            }
            
            return item.status === 'PUBLISHED';
        });
    }

    getItemById(id) {
        return this.getAllItems().find(item => item.id === id);
    }

    saveMediaItem(item) {
        const items = this.getAllItems();
        const existingIndex = items.findIndex(i => i.id === item.id);
        
        if (!item.folderPath) {
            item.folderPath = this.getFolderPathForType(item.mediaType, item.isGuestUpload);
        }

        if (existingIndex >= 0) {
            items[existingIndex] = { ...items[existingIndex], ...item };
        } else {
            if (!item.id) item.id = 'media-' + Date.now();
            items.unshift(item);
        }
        
        this.saveAllItems(items);
        return item;
    }

    deleteItem(id) {
        const items = this.getAllItems().filter(i => i.id !== id);
        this.saveAllItems(items);
    }

    updateStatus(id, newStatus) {
        const items = this.getAllItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.status = newStatus;
            this.saveAllItems(items);
        }
    }

    toggleFeatured(id) {
        const items = this.getAllItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.isFeatured = !item.isFeatured;
            this.saveAllItems(items);
        }
    }

    setWeddingFilm(id) {
        const items = this.getAllItems();
        items.forEach(i => {
            if (i.id === id) {
                i.isWeddingFilm = true;
                i.isFeatured = true;
            } else {
                i.isWeddingFilm = false;
            }
        });
        this.saveAllItems(items);
    }

    getPhase() {
        return localStorage.getItem(this.PHASE_KEY) || 'before';
    }

    setPhase(phase) {
        localStorage.setItem(this.PHASE_KEY, phase);
    }

    getFolderPathForType(type, isGuest = false) {
        if (isGuest) return './assets/images/';
        switch (type) {
            case 'IMAGE': return './assets/images/';
            case 'VIDEO': return './assets/videos/';
            case 'DOCUMENT': return './assets/documents/';
            case 'INVITATION': return './assets/documents/';
            default: return './assets/images/';
        }
    }
}

const storage = new StorageManager();
