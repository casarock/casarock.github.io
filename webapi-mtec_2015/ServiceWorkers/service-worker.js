importScripts('cache-polyfill.js');

var CACHE_NAME = 'demo-static-v1';
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {

			return cache.addAll([
				'/index.html',
				'/css/style.css',
				'/images/',
				'/images/600px-JavaScript-logo.png',
				'/images/HTML5_Badge_512.png'
			]);
		})
	)
});

self.addEventListener('activate', function(event) {
	var cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			// Cache hit - return response
			if (response) {
				console.log("Came from cache!");
				return response;
			}

			// Clone the request.
			var fetchRequest = event.request.clone();

			return fetch(fetchRequest).then(
				function(response) {
					// Check if we received a valid response
					if (!response || response.status !== 200 || response.type !== 'basic') {
						console.log("Response invalid");
						return response;
					}

					// Clone the response.
					var responseToCache = response.clone();

					caches.open(CACHE_NAME)
						.then(function(cache) {
							var cacheRequest = event.request.clone();
                            console.log("Put something into cache...");
							cache.put(cacheRequest, responseToCache);
						});

					return response;
				}
			);
		})
	);
});
