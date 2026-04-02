/**
 * Service worker minimal : hors-ligne limitée (coquille SPA + ressources mises en cache à la volée).
 * Mettre à jour CACHE pour forcer le renouvellement après déploiement.
 */
const CACHE = 'cinum-pwa-v2'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/logo.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (
          response.ok &&
          (request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'font' ||
            /\.(?:js|css|woff2?|svg|png|jpe?g|webp)$/i.test(url.pathname))
        ) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
    })
  )
})
