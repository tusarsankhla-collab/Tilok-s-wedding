/* ==========================================================================
   Elegance & Heritage — Video Platform & Cinema Streaming Player
   ========================================================================== */

class VideoPlatformManager {
    constructor() {
        this.modal = document.getElementById('videoPlayerModal');
        this.videoElem = document.getElementById('cinemaVideoElement');
        this.playPauseBtn = document.getElementById('videoPlayPauseBtn');
        this.progressWrap = document.getElementById('videoProgressWrap');
        this.progressFilled = document.getElementById('videoProgressFilled');
        this.currentTimeElem = document.getElementById('videoCurrentTime');
        this.totalDurationElem = document.getElementById('videoTotalDuration');
        this.muteBtn = document.getElementById('videoMuteBtn');
        this.fullscreenBtn = document.getElementById('videoFullscreenBtn');
        this.titleElem = document.getElementById('videoModalTitle');

        this.currentCategory = 'ALL';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('closeVideoModalBtn')?.addEventListener('click', () => this.close());
        this.playPauseBtn?.addEventListener('click', () => this.togglePlay());
        this.muteBtn?.addEventListener('click', () => this.toggleMute());
        this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        
        if (this.videoElem) {
            this.videoElem.addEventListener('timeupdate', () => this.updateProgress());
            this.videoElem.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
        }

        if (this.progressWrap) {
            this.progressWrap.addEventListener('click', (e) => this.seek(e));
        }
    }

    openVideo(videoItem) {
        if (!videoItem || !this.videoElem) return;

        this.titleElem.textContent = videoItem.title;
        this.videoElem.src = videoItem.fileUrl;
        this.videoElem.poster = videoItem.posterUrl || '';
        
        if (this.modal) this.modal.classList.remove('hidden');
        
        this.videoElem.play().then(() => {
            this.updatePlayPauseIcon(true);
        }).catch(err => {
            console.log("Autoplay with sound prevented by browser:", err);
            this.updatePlayPauseIcon(false);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    close() {
        if (this.videoElem) {
            this.videoElem.pause();
            this.videoElem.src = '';
        }
        if (this.modal) this.modal.classList.add('hidden');
    }

    togglePlay() {
        if (!this.videoElem) return;
        if (this.videoElem.paused) {
            this.videoElem.play();
            this.updatePlayPauseIcon(true);
        } else {
            this.videoElem.pause();
            this.updatePlayPauseIcon(false);
        }
    }

    updatePlayPauseIcon(isPlaying) {
        if (!this.playPauseBtn) return;
        this.playPauseBtn.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    toggleMute() {
        if (!this.videoElem) return;
        this.videoElem.muted = !this.videoElem.muted;
        this.muteBtn.innerHTML = this.videoElem.muted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    toggleFullscreen() {
        if (!this.videoElem) return;
        if (this.videoElem.requestFullscreen) {
            this.videoElem.requestFullscreen();
        }
    }

    onMetadataLoaded() {
        if (!this.videoElem || !this.totalDurationElem) return;
        this.totalDurationElem.textContent = this.formatTime(this.videoElem.duration);
    }

    updateProgress() {
        if (!this.videoElem || !this.progressFilled || !this.currentTimeElem) return;
        const pct = (this.videoElem.currentTime / this.videoElem.duration) * 100;
        this.progressFilled.style.width = `${pct}%`;
        this.currentTimeElem.textContent = this.formatTime(this.videoElem.currentTime);
    }

    seek(e) {
        if (!this.videoElem || !this.progressWrap) return;
        const rect = this.progressWrap.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.videoElem.currentTime = pos * this.videoElem.duration;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    renderVideoGrid(category = 'ALL') {
        const grid = document.getElementById('videoGridContainer');
        if (!grid) return;

        const allVideos = storage.getGuestVisibleItems().filter(i => i.mediaType === 'VIDEO' && !i.isShortReel);
        const filtered = category === 'ALL' ? allVideos : allVideos.filter(i => i.category === category);

        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#94A3B8;">No video films found in this category.</div>`;
            return;
        }

        filtered.forEach(v => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="v-card-thumb" data-id="${v.id}">
                    <img src="${v.posterUrl}" alt="${v.title}">
                    <div class="v-play-overlay">
                        <div class="v-play-icon"><i data-lucide="play"></i></div>
                    </div>
                    <span class="v-duration-badge">${v.duration || 'HD Film'}</span>
                </div>
                <div class="v-card-body">
                    <span class="v-card-cat">${v.category}</span>
                    <h4 class="v-card-title">${v.title}</h4>
                    <p class="v-card-desc">${v.description}</p>
                </div>
            `;

            card.querySelector('.v-card-thumb').addEventListener('click', () => this.openVideo(v));
            grid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderShorts() {
        const container = document.getElementById('shortsContainer');
        if (!container) return;

        const shorts = storage.getGuestVisibleItems().filter(i => i.isShortReel);
        container.innerHTML = '';

        shorts.forEach(s => {
            const reel = document.createElement('div');
            reel.className = 'short-reel-card';
            reel.innerHTML = `
                <img src="${s.posterUrl}" alt="${s.title}">
                <div class="short-reel-overlay">
                    <span class="short-reel-title">${s.title}</span>
                    <span class="short-reel-author">By ${s.authorName || 'Guest'}</span>
                </div>
            `;
            reel.addEventListener('click', () => this.openVideo(s));
            container.appendChild(reel);
        });
    }

    renderCategoryPills() {
        const container = document.getElementById('videoCategoryPills');
        if (!container) return;

        container.innerHTML = '';
        const cats = ['ALL', ...INITIAL_CATEGORIES];

        cats.forEach(cat => {
            const pill = document.createElement('button');
            pill.className = `cat-pill ${cat === this.currentCategory ? 'active' : ''}`;
            pill.textContent = cat;
            pill.addEventListener('click', () => {
                this.currentCategory = cat;
                document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.renderVideoGrid(cat);
            });
            container.appendChild(pill);
        });
    }
}

const videoPlatform = new VideoPlatformManager();
