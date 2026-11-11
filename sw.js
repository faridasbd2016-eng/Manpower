/* AMAZ Manpower — offline service worker */
const CACHE = 'amaz-manpower-v4.8.0';
const SHELL = ['./', './index.html', './manifest.webmanifest', './app-icon-192.png', './app-icon-512.png', './app-icon-maskable.png', './app-apple-touch.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET') return;                                   // Cloud Sync (POST) kokhono cache hoy na
  if(url.origin !== self.location.origin && !/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) return;   // Supabase / Apps Script / Google — shorasori net e
  // notun version er khobor shob shomoy net theke
  if(url.pathname.endsWith('/version.json')){ e.respondWith(fetch(req, {cache:'no-store'}).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}}))); return; }
  // app page: age net (notun update pete), na pele cache (offline)
  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // icon, CDN library (PDF / QR / Excel), font: age cache, na thakle net theke ene cache
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if(r.ok || r.type === 'opaque'){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
