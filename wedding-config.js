/* ==========================================================================
   TILOK & LAKSHMI — WEDDING CENTRAL CONFIGURATION
   Single point of configuration for all wedding information, dates, venue,
   events, media assets, RSVP settings, and PWA details.
   ========================================================================== */

const WEDDING_CONFIG = {
    // 1. COUPLE INFORMATION
    groomName: "Tilok",
    brideName: "Lakshmi",
    coupleInitials: "Tilok & Lakshmi",
    tagline: "Join us as we begin our eternal journey together on 11 February 2027.",
    announcement: "Welcome to the Digital Wedding Archive & Keepsake of Tilok & Lakshmi",

    // 2. WEDDING DATE & COUNTDOWN
    weddingDateISO: "2027-02-11T00:00:00+05:30", // 11 February 2027
    weddingDateFormatted: "11 February 2027",
    weddingDateShort: "11 • 02 • 2027",

    // 3. VENUE INFORMATION (Placeholders marked "To be added")
    venue: {
        name: "To be added",
        address: "To be added",
        city: "To be added",
        googleMapsUrl: "", // Paste Google Maps directions link here
        contactPhone: "To be added",
        contactEmail: "To be added",
        accommodationInfo: "Information regarding nearby hotels and stay arrangements will be provided here."
    },

    // 4. WEDDING EVENTS TIMELINE
    // ONLY Wedding Date (11 Feb 2027) is confirmed. All others are "To be added".
    events: [
        {
            id: "engagement",
            name: "Engagement",
            date: "To be added",
            time: "To be added",
            venue: "To be added",
            isConfirmed: false,
            description: "Official announcement and rings ceremony."
        },
        {
            id: "haldi",
            name: "Haldi Ceremony",
            date: "To be added",
            time: "To be added",
            venue: "To be added",
            isConfirmed: false,
            description: "Turmeric blessings with family singing traditional songs."
        },
        {
            id: "mehendi",
            name: "Mehendi & Henna",
            date: "To be added",
            time: "To be added",
            venue: "To be added",
            isConfirmed: false,
            description: "Henna artistry, music, and festive celebrations."
        },
        {
            id: "sangeet",
            name: "Sangeet Night",
            date: "To be added",
            time: "To be added",
            venue: "To be added",
            isConfirmed: false,
            description: "A musical evening of dance performances and celebration."
        },
        {
            id: "wedding",
            name: "The Wedding Ceremony",
            date: "11 February 2027",
            time: "To be added",
            venue: "To be added",
            isConfirmed: true, // CONFIRMED DATE!
            description: "Holy matrimony and sacred wedding rituals."
        },
        {
            id: "reception",
            name: "Grand Reception",
            date: "To be added",
            time: "To be added",
            venue: "To be added",
            isConfirmed: false,
            description: "Gala dinner, toasts, and dancing under the stars."
        }
    ],

    // 5. OUR STORY (Placeholders marked for easy update)
    ourStory: {
        title: "Two Hearts, One Journey",
        content: "Welcome to our wedding archive! We are excited to celebrate our special day with our family and cherished friends on 11 February 2027. More details about our journey will be shared here soon."
    },

    // 6. RSVP GOOGLE FORM INTEGRATION
    // Configurable Google Forms URL endpoint
    rsvp: {
        googleFormUrl: "", // Paste your Google Form action URL or Google Forms embed link here
        contactPerson: "Wedding RSVP Helpdesk",
        defaultPhone: "To be added"
    },

    // 7. GALLERY CATEGORIES
    galleryCategories: [
        "ALL",
        "Our Story",
        "Engagement",
        "Pre-Wedding",
        "Family",
        "Friends",
        "Wedding Preparations",
        "Wedding Day"
    ],

    // 8. ASSETS PATHS (For GitHub Pages subfolder compatibility)
    assets: {
        imagesPath: "./assets/images/",
        videosPath: "./assets/videos/",
        documentsPath: "./assets/documents/",
        iconsPath: "./assets/icons/"
    },

    // 9. PWA & APP DETAILS
    pwa: {
        appName: "Tilok & Lakshmi Wedding App",
        shortName: "T&L Wedding",
        themeColor: "#042F2E",
        backgroundColor: "#021F1B"
    }
};

// Export or freeze for safety
if (typeof window !== 'undefined') {
    window.WEDDING_CONFIG = WEDDING_CONFIG;
}
