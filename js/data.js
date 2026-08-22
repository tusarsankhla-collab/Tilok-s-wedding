/* ==========================================================================
   TILOK & LAKSHMI — PUBLIC MEDIA SEED DATA
   GitHub Pages-safe media paths.
   ========================================================================== */

function generateSVGDataURI(title, subtitle, bgColor1 = '#F7F5F0', bgColor2 = '#EFECE6', accentColor = '#D49B92') {
    const escapeXml = (value = '') => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const safeTitle = escapeXml(title);
    const safeSubtitle = escapeXml(subtitle);
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${bgColor1}" />
                <stop offset="100%" stop-color="${bgColor2}" />
            </linearGradient>
            <linearGradient id="fineArtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9FB1BD" />
                <stop offset="50%" stop-color="#D49B92" />
                <stop offset="100%" stop-color="#9EAFA2" />
            </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)" />
        <rect x="40" y="40" width="720" height="520" fill="none" stroke="url(#fineArtGrad)" stroke-width="2" opacity="0.75" rx="8" />
        <rect x="55" y="55" width="690" height="490" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.35" rx="4" />
        <circle cx="40" cy="40" r="8" fill="#D49B92"/>
        <circle cx="760" cy="40" r="8" fill="#9FB1BD"/>
        <circle cx="40" cy="560" r="8" fill="#9EAFA2"/>
        <circle cx="760" cy="560" r="8" fill="#E6C8B8"/>
        <text x="400" y="230" font-family="'Cormorant Garamond', Georgia, serif" font-size="54" font-style="italic" fill="#1E293B" text-anchor="middle">${safeTitle}</text>
        <text x="400" y="300" font-family="'Montserrat', sans-serif" font-size="15" fill="#64748B" letter-spacing="4" text-anchor="middle">${safeSubtitle.toUpperCase()}</text>
        <text x="400" y="380" font-family="'Cormorant Garamond', Georgia, serif" font-size="38" font-style="italic" fill="#D49B92" text-anchor="middle">Tilok &amp; Lakshmi</text>
        <text x="400" y="430" font-family="'Montserrat', sans-serif" font-size="13" fill="#9EAFA2" letter-spacing="6" text-anchor="middle">FINE ART CELEBRATION — 11 FEB 2027</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const INITIAL_MEDIA_DATABASE = [
    {
        id: 'invite-01',
        title: 'Dusty Rose Wax Seal 3D Invitation',
        description: 'Bespoke fine art 3D WebGL invitation suite with delicate wax seal and gold foil lettering.',
        mediaType: 'INVITATION',
        category: 'Our Story',
        fileUrl: generateSVGDataURI('The Digital Invitation', 'Fine Art 3D Experience', '#F7F5F0', '#EFECE6', '#D49B92'),
        posterUrl: generateSVGDataURI('The Digital Invitation', 'Cover Preview', '#F7F5F0', '#EFECE6', '#D49B92'),
        fileType: '3D WebGL / Canvas',
        fileSize: '4.8 MB',
        uploadDate: '2027-01-10',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        isFeatured: true,
        isWeddingFilm: false,
        folderPath: './assets/documents/3d-invitation.gltf'
    },
    {
        id: 'invite-02',
        title: 'Official Fine Art PDF Wedding Suite',
        description: 'Complete formal multi-page wedding invitation document including ceremony times, venue maps, and dress codes.',
        mediaType: 'DOCUMENT',
        category: 'Our Story',
        fileUrl: generateSVGDataURI('Wedding Invitation Suite', 'Formal PDF Document', '#F7F5F0', '#E5DFD5', '#9FB1BD'),
        posterUrl: generateSVGDataURI('Wedding Invitation Suite', 'Formal Fine Art Document', '#F7F5F0', '#E5DFD5', '#9FB1BD'),
        fileType: 'PDF Document',
        fileSize: '8.2 MB',
        uploadDate: '2027-01-12',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        isFeatured: true,
        isWeddingFilm: false,
        folderPath: './assets/documents/wedding-invitation-suite.pdf',
        pdfPages: [
            { pageNum: 1, title: 'Formal Wedding Invitation', content: 'Together with their families, Tilok & Lakshmi request the honour of your presence at their wedding celebration on 11 February 2027.' },
            { pageNum: 2, title: 'Schedule of Celebrations', content: 'Wedding Ceremony: 11 February 2027 (Confirmed)\nOther event schedules (Engagement, Haldi, Mehendi, Sangeet, Reception) to be added soon.' },
            { pageNum: 3, title: 'Venue & Accommodation', content: 'Venue details and guest accommodation guides to be added.' },
            { pageNum: 4, title: 'Dress Code & RSVP', content: 'Traditional & Fine Art Festive Wear. Please confirm your RSVP using the RSVP section.' }
        ]
    },
    {
        id: 'video-01',
        title: 'The Wedding Film — Tilok & Lakshmi',
        description: 'Our official cinematic wedding film. Add the final MP4 to assets/videos/ and it will play for every visitor.',
        mediaType: 'VIDEO',
        category: 'Wedding Day',
        fileUrl: './assets/videos/the-wedding-film.mp4',
        posterUrl: generateSVGDataURI('The Wedding Film', 'Cinematic Feature Film', '#F7F5F0', '#E5DFD5', '#9EAFA2'),
        fileType: 'MP4 Video',
        fileSize: 'Add published file size',
        duration: '14:20',
        uploadDate: '2027-02-11',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        isFeatured: true,
        isWeddingFilm: true,
        folderPath: './assets/videos/the-wedding-film.mp4'
    },
    {
        id: 'video-02',
        title: 'Pre-Wedding Cinema Teaser',
        description: 'Pre-wedding cinematic teaser. Replace the placeholder path once the final MP4 is added to the repository.',
        mediaType: 'VIDEO',
        category: 'Pre-Wedding',
        fileUrl: './assets/videos/pre-wedding-film.mp4',
        posterUrl: generateSVGDataURI('Pre-Wedding Film', 'Sunset Landscape', '#F7F5F0', '#EFECE6', '#D49B92'),
        fileType: 'MP4 Video',
        fileSize: 'Add published file size',
        duration: '03:45',
        uploadDate: '2027-01-20',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        isFeatured: false,
        isWeddingFilm: false,
        folderPath: './assets/videos/pre-wedding-film.mp4'
    },
    {
        id: 'doc-01',
        title: 'Official Wedding Itinerary',
        description: 'Complete schedule for the wedding celebrations.',
        mediaType: 'DOCUMENT',
        category: 'Wedding Day',
        fileUrl: generateSVGDataURI('Wedding Itinerary', 'Comprehensive Schedule', '#F7F5F0', '#EFECE6', '#9FB1BD'),
        posterUrl: generateSVGDataURI('Wedding Itinerary', 'Comprehensive Schedule', '#F7F5F0', '#EFECE6', '#9FB1BD'),
        fileType: 'PDF Document',
        fileSize: '2.4 MB',
        uploadDate: '2027-01-15',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        folderPath: './assets/documents/wedding-itinerary.pdf',
        pdfPages: [
            { pageNum: 1, title: 'Wedding Day Schedule', content: '11 February 2027 — Holy Matrimony & Sacred Wedding Rituals.\nTimings and venue information to be added.' }
        ]
    },
    {
        id: 'photo-01',
        title: 'Tilok & Lakshmi First Look',
        description: 'Quiet portrait moment capturing Tilok & Lakshmi in traditional wedding attire.',
        mediaType: 'IMAGE',
        category: 'Wedding Day',
        fileUrl: generateSVGDataURI('First Look Portrait', 'Tilok & Lakshmi', '#F7F5F0', '#E5DFD5', '#D49B92'),
        posterUrl: generateSVGDataURI('First Look Portrait', 'Tilok & Lakshmi', '#F7F5F0', '#E5DFD5', '#D49B92'),
        fileType: 'JPG Image',
        fileSize: '6.4 MB',
        uploadDate: '2027-02-11',
        visibility: 'GUESTS',
        status: 'PUBLISHED',
        isFeatured: true,
        folderPath: './assets/images/first-look-portrait.jpg'
    },
    {
        id: 'guest-01',
        title: 'Celebration Joy!',
        description: 'Tilok & Lakshmi celebrating with family and friends.',
        mediaType: 'IMAGE',
        category: 'Wedding Day',
        authorName: 'Family & Friends',
        fileUrl: generateSVGDataURI('Celebration Joy', 'Guest Upload', '#F7F5F0', '#E5DFD5', '#9EAFA2'),
        posterUrl: generateSVGDataURI('Celebration Joy', 'Guest Upload', '#F7F5F0', '#E5DFD5', '#9EAFA2'),
        fileType: 'JPG Image',
        fileSize: '3.1 MB',
        uploadDate: '2027-02-11',
        visibility: 'GUESTS',
        status: 'APPROVED',
        isGuestUpload: true,
        folderPath: './assets/images/celebration-joy.jpg'
    }
];
