const CACHE_NAME = 'ttt-teacher-v1';
// Liste aller Dateien, die offline verfügbar sein müssen:
const ASSETS = [
    './',
    './index.html',
    // Füge hier die Pfade zu deinen CSS- oder JS-Dateien hinzu, z.B.:
    // './style.css',
    // './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// 1. Installieren des Service Workers und Cachen der Dateien
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Aktivieren und alte Caches löschen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// 3. Netzwerkanfragen abfangen und Cache-First-Strategie nutzen
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Wenn die Datei im Cache ist, nutze sie; andernfalls hole sie aus dem Netzwerk
            return cachedResponse || fetch(event.request);
        })
    );
});
