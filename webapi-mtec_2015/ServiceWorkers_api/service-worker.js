importScripts('cache-polyfill.js');

var CACHE_NAME_STATIC = 'demo-static-v9',
    CACHE_NAME_API = 'demo-api-v3';

self.addEventListener('install', function(event) {
    event.waitUntil(
        // Cache static
        caches.open(CACHE_NAME_STATIC).then(function(cache) {

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
    var cacheWhitelist = [CACHE_NAME_STATIC];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
					console.log(cacheName);
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
	var requestURL = new URL(event.request.url);

    event.respondWith(
        caches.match(event.request)
        .then(
			function (response) {

		        // we have a copy of the response in our cache, so return it
		        if (response) {
					console.log("Response from cache");
		        	return response;  //no network request necessary
		        }

		        var fetchRequest = event.request.clone();

		        return fetch(fetchRequest).then(
					function(response) {

			            var shouldCache = false;
						if (response.type === "basic" && response.status === 200) {
							shouldCache = CACHE_NAME_STATIC;
						} else if (response.type === "cors") { // Not same origin!
							if (requestURL.hostname.indexOf("openweathermap") > -1) {
								shouldCache = CACHE_NAME_API;
								console.log("Cache an API request");
							}
						}

						// Chache what ever we need.
			            if (shouldCache) {
							console.log("New valid request. Caching for " + shouldCache);

			                var responseToCache = response.clone();

			                caches.open(shouldCache)
			                    .then(function(cache) {
			                        var cacheRequest = event.request.clone();
			                        cache.put(cacheRequest, responseToCache);
			                    });
			            }

						// response...
			            return response;
			        });
	    	})
	);
});
