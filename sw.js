/* AMAZ Manpower — offline service worker (v4.10.3)
   Ekbar internet shoho khullei app ta cache e thake; erpor internet chharao khole. */
const APP_PREFIX = 'amaz-manpower-';
const CACHE = APP_PREFIX + 'v4.10.3';
const LIBS = APP_PREFIX + 'libs-v1';            // CDN library — version bodlaleo mucha hoy na
const SHELL = ['./index.html', './manifest.webmanifest', './app-icon-192.png', './app-icon-512.png', './app-icon-maskable.png', './app-apple-touch.png'];
const CDN = /(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

// install: addAll noy — prottekta file alada, ekta na pele baki gulo thik e save hoy
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(u => fetch(u, {cache: 'reload'}).then(r => {
      if (!r || !r.ok) return;
      const jobs = [c.put(u, r.clone())];
      if (u === './index.html') jobs.push(c.put('./', r.clone()));
      return Promise.all(jobs);
    }).catch(() => {})));
    // index.html na pele './' theke cheshta (ulta-o)
    if (!(await c.match('./index.html'))) {
      try { const r = await fetch('./', {cache: 'reload'}); if (r.ok) { await c.put('./index.html', r.clone()); await c.put('./', r); } } catch (_) {}
    }
    await self.skipWaiting();
  })());
});

// activate: notun cache e index.html thakle tobei ei app er purono cache mucha
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    if (await c.match('./index.html')) {
      const ks = await caches.keys();
      await Promise.all(ks.filter(k => k.startsWith(APP_PREFIX) && k !== CACHE && k !== LIBS).map(k => caches.delete(k)));
    }
    await self.clients.claim();
  })());
});

function offlinePage() {
  const h = '<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AMAZ Manpower</title>' +
    '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f1d40;color:#fff;font-family:system-ui,"Noto Sans Bengali",sans-serif;text-align:center;padding:24px;box-sizing:border-box}' +
    '.b{max-width:360px}h1{font-size:22px;margin:12px 0 8px}p{opacity:.85;line-height:1.6;margin:0 0 20px}button{background:#2563eb;color:#fff;border:0;border-radius:12px;padding:13px 28px;font-size:16px;font-weight:600}</style></head>' +
    '<body><div class="b"><div style="font-size:46px">📡</div><h1>ইন্টারনেট নেই</h1><p>অ্যাপটা এখনো এই ফোন/কম্পিউটারে সেভ হয়নি। একবার ইন্টারনেট সহ খুলুন — এরপর ইন্টারনেট ছাড়াও খুলবে।</p>' +
    '<button onclick="location.reload()">🔄 আবার চেষ্টা</button></div></body></html>';
  return new Response(h, {status: 200, headers: {'Content-Type': 'text/html; charset=utf-8'}});
}

async function cachedIndex() {
  // shob cache theke khoja — purono version er cache theke-o khulbe
  return (await caches.match('./index.html', {ignoreSearch: true})) ||
         (await caches.match('./', {ignoreSearch: true})) ||
         (await caches.match('index.html', {ignoreSearch: true}));
}

async function handleNavigate(req) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 3500);
  try {
    const r = await fetch(req, {signal: ctl.signal});
    clearTimeout(t);
    if (r && r.ok && r.type !== 'opaqueredirect') {
      const c = await caches.open(CACHE);
      await Promise.all([c.put('./index.html', r.clone()), c.put('./', r.clone())]).catch(() => {});
      return r;
    }
    return (await cachedIndex()) || r;
  } catch (_) {
    clearTimeout(t);
    return (await cachedIndex()) || offlinePage();
  }
}

async function handleLib(req) {
  const c = await caches.open(LIBS);
  const hit = await c.match(req);
  if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()).catch(() => {});
    return r;
  } catch (_) {
    return new Response('', {status: 504, statusText: 'Offline'});
  }
}

async function handleSame(req) {
  const hit = await caches.match(req, {ignoreSearch: true});
  if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r && r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()).catch(() => {}); }
    return r;
  } catch (_) {
    return new Response('', {status: 504, statusText: 'Offline'});
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // Cloud Sync (POST) kokhono cache hoy na
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const isPage = req.mode === 'navigate' || (same && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')));
  if (isPage) { e.respondWith(handleNavigate(req)); return; }
  if (same && url.pathname.endsWith('/version.json')) {
    e.respondWith(fetch(req, {cache: 'no-store'}).catch(() => new Response('{}', {headers: {'Content-Type': 'application/json'}})));
    return;
  }
  if (CDN.test(url.hostname)) { e.respondWith(handleLib(req)); return; }
  if (same) { e.respondWith(handleSame(req)); return; }
  // Supabase / Apps Script / Google — shorasori net e (cache noy)
});

// notification e click korle app ta samne ane (khola na thakle khule)
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(L => {
    for (const c of L) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  }));
});
