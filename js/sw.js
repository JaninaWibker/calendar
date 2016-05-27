let CACHE_NAME = 'static-v1'
let urlsToCache = [
  '/calendar/',
  '/calendar/js/app.js',
  '/calendar/js/kalista.js',
  '/calendar/css/style.css',
  '/calendar/img/menu-title.jpeg',
  '/calendar/img/icon-large.png',
  '/calendar/img/icon.png',
  '/calendar/img/icon-small.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then( (cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then( (response) => {
        if(response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
