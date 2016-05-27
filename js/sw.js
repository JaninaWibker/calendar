this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.create('static-v1').then( (cache) => {
      return cache.add([
        '/calendar/',
        '/calendar/js/app.js',
        '/calendar/js/kalista.js',
        '/calendar/css/style.css',
        '/calendar/img/menu-title.jpeg',
        '/calendar/img/icon-large.png',
        '/calendar/img/icon.png',
        '/calendar/img/icon-small.png'
      ])
    })
  )
})

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).catch(() => {
      return event.default()
    }).catch( () => {
      return caches.math(
        '/calendar/fallback.json'
      )
    })
  )
})
