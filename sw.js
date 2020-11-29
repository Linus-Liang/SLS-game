this.addEventListener('install', () => { });

this.addEventListener('activate', () => { });

this.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith();
});
