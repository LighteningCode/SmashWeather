const CACHE_NAME = 'SITE_CONTENT_V1';


const urlsToCache = [
    "./weatherStates/weather-clear.png",
    "./weatherStates/weather-clear-night.png",
    "./weatherStates/weather-part-clouds.png",
    "./weatherStates/weather-cloudy.png",
    "./weatherStates/weather-light-rains.png",
    "./weatherStates/weather-rain-heavy.png",
    "./weatherStates/weather-thunderstorm.png",
    "./weatherStates/weather-scattered-showers.png",
    "./weatherStates/weather-windy.png",
    "./weatherStates/weather-error.png",
    "./index.html",
]


self.addEventListener('install', installer => {
    console.log('Installing');

    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    };

    installer.waitUntil(done());
});


self.addEventListener('fetch', fetchEvent => {
    // respond to fetch request with a match from the cache
    // if not in cache, then request from network and cache
    // if there is a server error, show the offline page
    const url = fetchEvent.request.url;


    const getResponse = async (request) => {

        let response;

        response = await caches.match(request);
        if (response && response.status === 200) {
            console.log(`File in cache. Returning cached version of ${url}`);
            return response;
        }

        try {
            response = await fetch(request);
            if (response && response.status === 404) {
                return caches.match('/404.html');
            }
        } catch (e) {
            return caches.match('./offline.html')
        }

        if (!url.includes('openweathermap')) {
            const clone = response.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(url, clone);
        }

        return response;
    };


    fetchEvent.respondWith(getResponse(fetchEvent.request));


});


self.addEventListener('activate', activator => {
    console.log('Activating');

    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if (!currentCaches.includes(name)) {
                return caches.delete(name);
            }
        }));
    };

    activator.waitUntil(done());
});

