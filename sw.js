/* ==========================================================================
   TILOK & LAKSHMI — PWA SERVICE WORKER
   Network-first shell with versioned cache so GitHub Pages updates are picked up.
   ========================================================================== */
const CACHE_NAME='wedding-pwa-v3.0';
const SHELL_ASSETS=['./','./index.html','./manifest.json','./css/main.css','./css/components.css','./css/responsive.css','./js/wedding-config.js','./js/app.js','./js/data.js','./js/storage.js','./js/3d-invitation.js','./js/pdf-viewer.js','./js/video-player.js','./js/media-manager.js','./js/memory-wall.js','./js/search-filter.js','./assets/icons/icon-192.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(response=>{if(response&&response.status===200&&response.type==='basic'){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy))}return response}).catch(()=>caches.match(e.request).then(cached=>cached||(e.request.mode==='navigate'?caches.match('./index.html'):undefined))))});
