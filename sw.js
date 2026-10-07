/* Nage & Vélo Cardio — service worker (hors connexion) */
const CACHE = "nage-velo-v1";
const ASSETS = ["./", "./index.html", "./app.css", "./app.js", "./data.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/icon-maskable-512.png", "./icons/favicon-64.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    const fallback = () => caches.match("./index.html").then(r => r || caches.match("./"));
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3500));
    e.respondWith(Promise.race([fetch(req), timeout]).then(r => {
      if (!r || !r.ok) return fallback().then(c => c || r);
      const cp = r.clone(); caches.open(CACHE).then(c => c.put("./index.html", cp)); return r;
    }).catch(() => fallback()));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
