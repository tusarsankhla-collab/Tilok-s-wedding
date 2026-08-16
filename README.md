# Tilok & Lakshmi — Digital Wedding Archive & PWA

Welcome to the official Progressive Web App (PWA) and Digital Wedding Archive for **Tilok & Lakshmi** (Wedding Date: **11 February 2027**).

This project is a mobile-first, installable wedding PWA designed with an **Elegance & Heritage — Urban Rich Teal** theme and fine-art calligraphic aesthetics. It runs 100% free without paid backends and is compatible with free static hosting on **GitHub Pages**.

---

## 📁 How to Update Wedding Content & Information

All wedding information is managed from **one central file**:
👉 [`js/wedding-config.js`](./js/wedding-config.js)

### 1. Changing Couple Names, Dates & Venue
Open `js/wedding-config.js` in any text editor and edit the relevant lines:
```javascript
groomName: "Tilok",
brideName: "Lakshmi",
weddingDateISO: "2027-02-11T00:00:00+05:30",
weddingDateFormatted: "11 February 2027",

venue: {
    name: "Your Venue Name Here",
    address: "Full Street Address, City",
    googleMapsUrl: "https://maps.google.com/your-location-link",
    contactPhone: "+91 98765 43210"
}
```

### 2. Adding Photos
- Place your images (JPG, PNG, WEBP) inside:
  `./assets/images/`
- Add the photo entries into `js/data.js` or `js/wedding-config.js`.

### 3. Adding PDF Invitations & Documents
- Place your PDF files inside:
  `./assets/documents/`
- Example: `./assets/documents/wedding-invitation.pdf`

### 4. Adding Videos
- Place local videos inside:
  `./assets/videos/`
- Or paste YouTube / Vimeo / Direct MP4 video URLs inside `js/data.js` or `js/wedding-config.js`.

### 5. Connecting RSVP to Google Forms
Open `js/wedding-config.js` and paste your Google Form response URL:
```javascript
rsvp: {
    googleFormUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
}
```

---

## 💻 How to Run & Test Locally

### Method A: Direct Browser Launch
Double-click `index.html` or open `index.html` in Chrome, Edge, Firefox, or Safari.

### Method B: Testing PWA & Service Worker (Local HTTP Server)
Because browsers restrict Service Workers on raw `file://` URLs, use a local server:
1. Using Python (Terminal / Command Prompt):
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and go to:
   `http://localhost:8000`
3. Open **Chrome DevTools** (`F12`) -> **Application** tab -> **Service Workers** & **Manifest** to test PWA installation and offline caching!

---

## 🚀 Free Deployment to GitHub Pages (Step-by-Step)

1. Create a free account on [GitHub.com](https://github.com).
2. Create a new repository named `wedding-app` (set to **Public**).
3. Upload all project files (`index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `assets/`, `README.md`) into your GitHub repository.
4. Go to repository **Settings** -> **Pages** (on the left sidebar).
5. Under **Build and deployment** -> **Branch**, select `main` (or `master`) branch and `/ (root)` folder.
6. Click **Save**.
7. In 1–2 minutes, your website will be live at:
   `https://<your-username>.github.io/wedding-app/`
8. Generate a QR code pointing to your live GitHub Pages URL for printing on physical wedding cards!

---

## 📋 Information Remaining to Provide / Placeholders to Update

Before printing your final QR code on invitation cards, update these placeholder values in `js/wedding-config.js`:
- [ ] Confirmed Venue Name & Full Address
- [ ] Venue Google Maps Directions URL
- [ ] Venue Contact Phone Number & Email
- [ ] Specific Event Dates & Timings for Engagement, Haldi, Mehendi, Sangeet & Reception
- [ ] Accommodation & Hotel Stay Guide for Out-of-Town Guests
- [ ] Custom Google Form RSVP URL
