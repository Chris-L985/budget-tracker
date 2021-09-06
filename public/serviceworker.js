const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const DATA_CACHE_NAME = 'data_cache_v1'
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x1228.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
];

// service worker event listener
self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responded with cache: + ' + e.request.url)
                return request
            } else {
                console.log('file not cached')
                return fetch(e.request)
            }
        })
    );
});

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache')
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheList.indexOf(key) === -1) {
                    console.log('deleting cache:' + keyList[i]);
                }
            }));
        })
    );
});