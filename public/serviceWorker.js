importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

if (workbox){
    console.log(`Workbox berhasil dimuat`);
    workbox.precaching.precacheAndRoute([
        { url: '/', revision: '3' },
        { url: '/index.html', revision: '4' },
        { url: '/detail_team.html', revision: '3' },
        { url: '/nav.html', revision: '3' },
        { url: '/manifest.json', revision: '3' },
        { url: '/serviceWorker.js', revision: '3' },
        { url: '/pages/favorit.html', revision: '3' },
        { url: '/pages/home.html', revision: '3' },
        { url: '/pages/pertandingan.html', revision: '3' },
        { url: '/pages/team.html', revision: '3' },
        { url: '/pages/about.html', revision: '3' },
        { url: '/css/materialize.css', revision: '3' },
        { url: '/css/style.css', revision: '3' },
        { url: '/asset/icon/android-icon-36x36.png', revision: '3' },
        { url: '/asset/icon/android-icon-48x48.png', revision: '3' },
        { url: '/asset/icon/android-icon-72x72.png', revision: '3' },
        { url: '/asset/icon/android-icon-96x96.png', revision: '3' },
        { url: '/asset/icon/android-icon-144x144.png', revision: '3' },
        { url: '/asset/icon/android-icon-192x192.png', revision: '3' },
        { url: '/asset/icon/apple-icon-57x57.png', revision: '3' },
        { url: '/asset/icon/apple-icon-60x60.png', revision: '3' },
        { url: '/asset/icon/apple-icon-72x72.png', revision: '3' },
        { url: '/asset/icon/apple-icon-76x76.png', revision: '3' },
        { url: '/asset/icon/apple-icon-114x114.png', revision: '3' },
        { url: '/asset/icon/apple-icon-120x120.png', revision: '3' },
        { url: '/asset/icon/apple-icon-144x144.png', revision: '3' },
        { url: '/asset/icon/apple-icon-152x152.png', revision: '3' },
        { url: '/asset/icon/apple-icon-180x180.png', revision: '3' },
        { url: '/asset/icon/apple-icon-precomposed.png', revision: '3' },
        { url: '/asset/icon/apple-icon.png', revision: '3' },
        { url: '/asset/icon/favicon-16x16.png', revision: '3' },
        { url: '/asset/icon/favicon-32x32.png', revision: '3' },
        { url: '/asset/icon/favicon-96x96.png', revision: '3' },
        { url: '/asset/icon/ms-icon-70x70.png', revision: '3' },
        { url: '/asset/icon/ms-icon-144x144.png', revision: '3' },
        { url: '/asset/icon/ms-icon-150x150.png', revision: '3' },
        { url: '/asset/icon/ms-icon-310x310.png', revision: '3' },
        { url: '/asset/icon/vokasiicon.png', revision: '3' },
        { url: '/asset/icon/vokasitext.png', revision: '3' },
        { url: '/asset/icon/arrow.png', revision: '3' },
        { url: '/asset/img/foto.jpg', revision: '3' },
        { url: '/js/api.js', revision: '3' },
        { url: '/js/database.js', revision: '3' },
        { url: '/js/nav.js', revision: '3' },
        { url: '/js/idb.js', revision: '3' },
        { url: '/js/sw-register.js', revision: '3' },
        { url: '/js/materialize.js', revision: '3' },
        { url: '/js/script.js', revision: '3' },
        ]);

    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            ]
        })
        );


    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/'),
        workbox.strategies.staleWhileRevalidate()
        )

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
  })
    );

    workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
    );

    workbox.routing.registerRoute(
    new RegExp('/pages/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'pages'
        })
    );

}

else{
  console.log(`Workbox gagal dimuat`);
}

//Response Push Notification
self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
} else {
    body = 'Push message no payload';
}
var options = {
    body: body,
    icon: './asset/icon/vokasiicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
  }
};
event.waitUntil(
    self.registration.showNotification('Push Notification', options)
    );
});