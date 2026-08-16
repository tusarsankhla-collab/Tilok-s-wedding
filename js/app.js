/* ==========================================================================
   TILOK & LAKSHMI — MAIN APPLICATION & PWA ORCHESTRATOR
   Handles Service Worker registration, PWA install prompts, live countdown,
   WEDDING_CONFIG bindings, event timeline rendering, and RSVP submission.
   ========================================================================== */

let invitation3DInstance = null;
let deferredPwaPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Register Service Worker for PWA (Relative path for GitHub Pages)
    registerServiceWorker();

    // 3. Setup PWA Install Prompt Listener
    setupPWAInstallPrompt();

    // 4. Initialize 3D WebGL Invitation
    invitation3DInstance = new Invitation3DEngine('threeJsContainer');

    // 5. Apply Config Data & Start Live Countdown to 11 Feb 2027
    applyWeddingConfigToDOM();
    startCountdownTimer();

    // 6. Render Dynamic Views
    renderAppViews();

    // 7. Bind Event Listeners
    bindEditDetailsModal();
    bindPhaseSwitcher();
    bindNavLinks();
    bindInvitationControls();
    bindDocumentGrid();
    bindRsvpForm();
});

// PWA Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((reg) => {
                    console.log('[SW] Service Worker registered successfully with scope:', reg.scope);
                })
                .catch((err) => {
                    console.log('[SW] Service Worker registration failed:', err);
                });
        });
    }
}

// PWA Installation Prompt Handler
function setupPWAInstallPrompt() {
    const banner = document.getElementById('pwaInstallBanner');
    const btnInstall = document.getElementById('btnInstallPwa');
    const btnDismiss = document.getElementById('btnDismissPwa');

    // Check if previously dismissed or already running in standalone mode
    const isDismissed = localStorage.getItem('pwa_dismissed_v1');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;

        if (!isDismissed && !isStandalone && banner) {
            banner.classList.remove('hidden');
        }
    });

    btnInstall?.addEventListener('click', () => {
        if (!deferredPwaPrompt) return;
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install prompt');
                showToast('Thank you for installing our Wedding App!', 'heart');
            }
            deferredPwaPrompt = null;
            banner?.classList.add('hidden');
        });
    });

    btnDismiss?.addEventListener('click', () => {
        localStorage.setItem('pwa_dismissed_v1', 'true');
        banner?.classList.add('hidden');
    });
}

// Global Toast System
function showToast(message, icon = 'sparkles') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i data-lucide="${icon}" style="color:var(--color-dusty-rose);"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Apply Central Config Data to DOM
function applyWeddingConfigToDOM() {
    const cfg = window.WEDDING_CONFIG || {};

    const initials = `${cfg.groomName} & ${cfg.brideName}`;

    // Update Headings & Logos
    const navLogo = document.getElementById('navLogoInitials');
    const heroTitle = document.getElementById('heroCoupleNames');
    const heroTagline = document.getElementById('heroTagline');
    const heroDate = document.getElementById('heroDate');
    const heroVenue = document.getElementById('heroVenue');
    const coverInitials = document.getElementById('coverInitials');
    const coverDate = document.getElementById('coverDate');
    const footerLogo = document.getElementById('footerLogoNames');
    const footerCopy = document.getElementById('footerCopyrightNames');
    const storyText = document.getElementById('storyText');

    if (navLogo) navLogo.textContent = initials;
    if (heroTitle) heroTitle.textContent = initials;
    if (heroTagline) heroTagline.textContent = cfg.tagline || '';
    if (heroDate) heroDate.textContent = cfg.weddingDateFormatted || '11 February 2027';
    if (heroVenue) heroVenue.textContent = `Venue: ${cfg.venue?.name || 'To be added'}`;
    if (coverInitials) coverInitials.textContent = initials;
    if (coverDate) coverDate.textContent = '11 · 02 · 2027';
    if (footerLogo) footerLogo.textContent = initials;
    if (footerCopy) footerCopy.textContent = initials;
    if (storyText) storyText.textContent = cfg.ourStory?.content || '';

    // Update Venue Card
    const venueNameText = document.getElementById('venueNameText');
    const venueAddressText = document.getElementById('venueAddressText');
    const venuePhoneText = document.getElementById('venuePhoneText');
    const venueEmailText = document.getElementById('venueEmailText');
    const accommodationText = document.getElementById('accommodationText');

    if (venueNameText) venueNameText.textContent = cfg.venue?.name || 'To be added';
    if (venueAddressText) venueAddressText.textContent = `Address: ${cfg.venue?.address || 'To be added'}`;
    if (venuePhoneText) venuePhoneText.textContent = cfg.venue?.contactPhone || 'To be added';
    if (venueEmailText) venueEmailText.textContent = cfg.venue?.contactEmail || 'To be added';
    if (accommodationText) accommodationText.textContent = cfg.venue?.accommodationInfo || 'Information regarding nearby hotels and stay arrangements will be provided here.';

    // Bind Directions Button
    const btnDirections = document.getElementById('btnGetDirections');
    if (btnDirections) {
        btnDirections.onclick = () => {
            if (cfg.venue?.googleMapsUrl) {
                window.open(cfg.venue.googleMapsUrl, '_blank');
            } else {
                showToast('Google Maps location will be added once the venue is confirmed.', 'map-pin');
            }
        };
    }
}

// Live Countdown Timer to 11 February 2027
function startCountdownTimer() {
    const cfg = window.WEDDING_CONFIG || {};
    const targetDate = new Date(cfg.weddingDateISO || "2027-02-11T00:00:00+05:30").getTime();

    function updateClock() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const daysElem = document.getElementById('countDays');
        const hoursElem = document.getElementById('countHours');
        const minsElem = document.getElementById('countMins');
        const secsElem = document.getElementById('countSecs');

        if (diff <= 0) {
            if (daysElem) daysElem.textContent = '00';
            if (hoursElem) hoursElem.textContent = '00';
            if (minsElem) minsElem.textContent = '00';
            if (secsElem) secsElem.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysElem) daysElem.textContent = days < 10 ? `0${days}` : days;
        if (hoursElem) hoursElem.textContent = hours < 10 ? `0${hours}` : hours;
        if (minsElem) minsElem.textContent = mins < 10 ? `0${mins}` : mins;
        if (secsElem) secsElem.textContent = secs < 10 ? `0${secs}` : secs;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// Render Master Application Views
function renderAppViews() {
    renderEventsTimeline();

    // Spotlight Featured Film
    const allItems = storage.getGuestVisibleItems();
    const featuredFilm = allItems.find(i => i.isWeddingFilm) || allItems.find(i => i.mediaType === 'VIDEO');

    if (featuredFilm) {
        const poster = document.getElementById('spotlightPoster');
        const title = document.getElementById('spotlightTitle');
        const desc = document.getElementById('spotlightDesc');
        const duration = document.getElementById('spotlightDuration');
        const btnPlay = document.getElementById('btnPlayFeaturedFilm');

        if (poster) poster.src = featuredFilm.posterUrl || featuredFilm.fileUrl;
        if (title) title.textContent = featuredFilm.title;
        if (desc) desc.textContent = featuredFilm.description;
        if (duration) duration.textContent = featuredFilm.duration || '14 mins';

        if (btnPlay) {
            btnPlay.onclick = () => {
                if (typeof videoPlatform !== 'undefined') videoPlatform.openVideo(featuredFilm);
            };
        }
    }

    // Video Platform Grid & Short Reels
    if (typeof videoPlatform !== 'undefined') {
        videoPlatform.renderCategoryPills();
        videoPlatform.renderVideoGrid();
        videoPlatform.renderShorts();
    }

    // Search Engine Gallery Grid
    if (typeof searchEngine !== 'undefined') {
        searchEngine.filterAndRender();
    }

    // Memory Wall
    if (typeof memoryWall !== 'undefined') {
        memoryWall.renderMemoryWall();
    }

    // Admin Pending Counter
    if (typeof adminManager !== 'undefined') {
        adminManager.updatePendingBadge();
    }
}

// Render Wedding Events Timeline from WEDDING_CONFIG
function renderEventsTimeline() {
    const container = document.getElementById('eventsTimelineContainer');
    if (!container) return;

    const events = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.events) ? window.WEDDING_CONFIG.events : [];
    container.innerHTML = '';

    events.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-time-box">
                <span class="event-date">${ev.date}</span>
                <span class="event-time">${ev.time}</span>
            </div>
            <div class="event-info">
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
                    <h3 class="font-cursive" style="margin:0;">${ev.name}</h3>
                    <span class="badge ${ev.isConfirmed ? 'badge-teal' : 'badge-glass'}">
                        ${ev.isConfirmed ? 'CONFIRMED' : 'To be added'}
                    </span>
                </div>
                <div class="event-venue">
                    <i data-lucide="map-pin"></i> Venue: ${ev.venue}
                </div>
                <p style="color:#64748B; font-size:0.9rem;">${ev.description}</p>
            </div>
        `;
        container.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// RSVP Form Handler (Google Form Configurable)
function bindRsvpForm() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const guestName = document.getElementById('rsvpGuestName').value;
        const guestCount = document.getElementById('rsvpGuestCount').value;
        const phone = document.getElementById('rsvpPhone').value;
        const dietary = document.getElementById('rsvpDietary').value;
        const message = document.getElementById('rsvpMessage').value;

        const selectedEvents = Array.from(document.querySelectorAll('input[name="rsvpEvent"]:checked')).map(cb => cb.value);

        const rsvpData = {
            guestName,
            guestCount,
            phone,
            selectedEvents,
            dietary,
            message,
            submittedAt: new Date().toISOString()
        };

        // If Google Form URL is configured in WEDDING_CONFIG, post to it
        const cfg = window.WEDDING_CONFIG || {};
        if (cfg.rsvp?.googleFormUrl) {
            fetch(cfg.rsvp.googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(rsvpData)
            }).then(() => {
                showToast(`Thank you ${guestName}! Your RSVP was submitted.`, 'heart');
                form.reset();
            }).catch(err => {
                console.error("Google Forms post error:", err);
                showToast(`Thank you ${guestName}! RSVP recorded.`, 'heart');
                form.reset();
            });
        } else {
            // Fallback client-side confirmation
            showToast(`Thank you ${guestName}! Your RSVP for ${guestCount} guest(s) is received.`, 'heart');
            form.reset();
        }
    });
}

// Wedding Timeline Phase Evolution Switcher
function bindPhaseSwitcher() {
    const buttons = document.querySelectorAll('.phase-btn');
    const announcement = document.getElementById('announcementText');

    const currentPhase = storage.getPhase();
    updatePhaseUI(currentPhase);

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const phase = e.currentTarget.dataset.phase;
            buttons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            storage.setPhase(phase);
            updatePhaseUI(phase);
            showToast(`Switched view to "${phase.toUpperCase()} WEDDING" phase`, 'sparkles');
        });
    });

    function updatePhaseUI(phase) {
        buttons.forEach(b => {
            if (b.dataset.phase === phase) b.classList.add('active');
            else b.classList.remove('active');
        });

        const cfg = window.WEDDING_CONFIG || {};
        const couple = cfg.coupleInitials || 'Tilok & Lakshmi';

        if (phase === 'before') {
            if (announcement) announcement.textContent = `Welcome! Formal Wedding Invitation & Ceremony Details for ${couple}`;
        } else if (phase === 'during') {
            if (announcement) announcement.textContent = `Celebrations Underway! Live Event Schedule & Guest Photo Uploads Active for ${couple}`;
        } else if (phase === 'after') {
            if (announcement) announcement.textContent = `Relive The Magic! Full Wedding Film, Guest Memory Wall & Digital Archive Live for ${couple}`;
        }
    }
}

// Edit Wedding Details Modal Controls
function bindEditDetailsModal() {
    const modal = document.getElementById('editDetailsModal');
    const form = document.getElementById('editDetailsForm');
    
    const openBtns = [
        document.getElementById('btnHeaderEditDetails')
    ];

    openBtns.forEach(btn => {
        btn?.addEventListener('click', () => {
            const cfg = window.WEDDING_CONFIG || {};
            document.getElementById('editGroomName').value = cfg.groomName || 'Tilok';
            document.getElementById('editBrideName').value = cfg.brideName || 'Lakshmi';
            document.getElementById('editWeddingDate').value = cfg.weddingDateFormatted || '11 February 2027';
            document.getElementById('editWeddingVenue').value = cfg.venue?.name || 'To be added';
            document.getElementById('editWeddingTagline').value = cfg.tagline || '';

            if (modal) modal.classList.remove('hidden');
        });
    });

    document.getElementById('closeEditDetailsBtn')?.addEventListener('click', () => modal?.classList.add('hidden'));
    document.getElementById('cancelEditDetailsBtn')?.addEventListener('click', () => modal?.classList.add('hidden'));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const groomName = document.getElementById('editGroomName').value;
        const brideName = document.getElementById('editBrideName').value;
        const weddingDateFormatted = document.getElementById('editWeddingDate').value;
        const venueName = document.getElementById('editWeddingVenue').value;
        const tagline = document.getElementById('editWeddingTagline').value;

        if (window.WEDDING_CONFIG) {
            window.WEDDING_CONFIG.groomName = groomName;
            window.WEDDING_CONFIG.brideName = brideName;
            window.WEDDING_CONFIG.coupleInitials = `${groomName} & ${brideName}`;
            window.WEDDING_CONFIG.weddingDateFormatted = weddingDateFormatted;
            window.WEDDING_CONFIG.tagline = tagline;
            if (!window.WEDDING_CONFIG.venue) window.WEDDING_CONFIG.venue = {};
            window.WEDDING_CONFIG.venue.name = venueName;
        }

        applyWeddingConfigToDOM();
        
        if (modal) modal.classList.add('hidden');
        showToast('Wedding details updated live across the archive!', 'check');
    });
}

// Navigation & Smooth Scroll
function bindNavLinks() {
    const links = document.querySelectorAll('.nav-link');
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const menuLinks = document.getElementById('navMenuLinks');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            links.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            if (menuLinks) menuLinks.classList.remove('show-mobile');
        });
    });

    mobileBtn?.addEventListener('click', () => {
        if (menuLinks) menuLinks.classList.toggle('show-mobile');
    });
}

// 3D & Digital Invitation Buttons
function bindInvitationControls() {
    document.getElementById('btnUnseal3D')?.addEventListener('click', () => {
        if (invitation3DInstance) invitation3DInstance.toggleUnseal();
    });

    document.getElementById('btnRotate3D')?.addEventListener('click', () => {
        if (invitation3DInstance) invitation3DInstance.rotateContinuous();
    });

    document.getElementById('btnFullscreen3D')?.addEventListener('click', () => {
        const viewport = document.getElementById('invitation3DViewport');
        if (viewport && viewport.requestFullscreen) viewport.requestFullscreen();
    });

    document.getElementById('btnOpenPdfViewer')?.addEventListener('click', () => {
        const invitePdf = storage.getItemById('invite-02');
        if (invitePdf && typeof pdfViewer !== 'undefined') {
            pdfViewer.openDocument(invitePdf);
        }
    });

    document.getElementById('quickPdfInviteBtn')?.addEventListener('click', () => {
        const invitePdf = storage.getItemById('invite-02');
        if (invitePdf && typeof pdfViewer !== 'undefined') {
            pdfViewer.openDocument(invitePdf);
        }
    });

    const fmt3d = document.getElementById('fmt3dBtn');
    const fmtPdf = document.getElementById('fmtPdfBtn');
    const fmtVideo = document.getElementById('fmtVideoBtn');

    fmtPdf?.addEventListener('click', () => {
        const invitePdf = storage.getItemById('invite-02');
        if (invitePdf && typeof pdfViewer !== 'undefined') pdfViewer.openDocument(invitePdf);
    });

    fmtVideo?.addEventListener('click', () => {
        const inviteVideo = storage.getItemById('video-02');
        if (inviteVideo && typeof videoPlatform !== 'undefined') videoPlatform.openVideo(inviteVideo);
    });
}

// Digital Document Library ("THE ARCHIVE")
function bindDocumentGrid() {
    const grid = document.getElementById('documentsGridContainer');
    if (!grid) return;

    const docs = storage.getGuestVisibleItems().filter(i => i.mediaType === 'DOCUMENT');
    grid.innerHTML = '';

    docs.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-card';
        card.innerHTML = `
            <div class="doc-icon-box">
                <i data-lucide="file-text"></i>
            </div>
            <div class="doc-content">
                <span class="doc-type-badge">${doc.category} • ${doc.fileSize || '3.5 MB'}</span>
                <h3 class="doc-title font-cursive">${doc.title}</h3>
                <p class="doc-desc">${doc.description}</p>
                <div class="doc-actions">
                    <button class="btn btn-primary-teal doc-btn view-doc-btn">
                        <i data-lucide="book-open"></i> VIEW DOCUMENT
                    </button>
                    <button class="btn btn-outline-teal doc-btn download-doc-btn">
                        <i data-lucide="download"></i> DOWNLOAD
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.view-doc-btn').addEventListener('click', () => {
            if (typeof pdfViewer !== 'undefined') pdfViewer.openDocument(doc);
        });

        card.querySelector('.download-doc-btn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = doc.fileUrl;
            link.download = `${doc.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
            link.click();
            showToast(`Downloading ${doc.title}...`, 'download');
        });

        grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}
