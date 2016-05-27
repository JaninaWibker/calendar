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
          console.log('[sw] response found in cache')
          return response
        }
        console.log('[sw] no response found in cache')
        return fetch(event.request).then( (response) => {
          console.log('[sw] network response: ', response)
          return response
        }).catch( (error) => {
          console.log('[sw] network failed')

          throw error
        })
      })
  )
})
