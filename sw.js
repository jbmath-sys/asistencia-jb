const CACHE_NAME = "asistencia-jb-v3";
const APP_SHELL = [
  "/asistencia-jb/",
  "/asistencia-jb/index.html",
  "/asistencia-jb/manifest.webmanifest",
  "/asistencia-jb/icons/icon-192.png",
  "/asistencia-jb/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request)));
  } else {
    e.respondWith(
      fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
