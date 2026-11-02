/* GYM GUIDE: service worker بسيط.
   - الملفات الثابتة (الصور والأيقونات): من الذاكرة أول، وتتحدّث من الشبكة بالخلفية.
   - الصفحة نفسها: من الشبكة أول عشان توصلك التحديثات، وإذا ما فيه إنترنت تنفتح من الذاكرة.
   بيانات تمارينك مو هنا؛ هي في localStorage وما يلمسها هذا الملف. */
var CACHE = 'gym-guide-v1';
var CORE = [
 "./",
 "index.html",
 "manifest.webmanifest",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "img/hero.jpg",
 "img/ek-0008-relaxation.png",
 "img/ek-0008-tension.png",
 "img/ek-0018-relaxation.png",
 "img/ek-0018-tension.png",
 "img/ek-0033-relaxation.png",
 "img/ek-0033-tension.png",
 "img/ek-0042-relaxation.png",
 "img/ek-0042-tension.png",
 "img/ek-0043-relaxation.png",
 "img/ek-0043-tension.png",
 "img/ek-0048-relaxation.png",
 "img/ek-0048-tension.png",
 "img/ek-0049-relaxation.png",
 "img/ek-0049-tension.png",
 "img/ek-0051-relaxation.png",
 "img/ek-0051-tension.png",
 "img/ek-0052-relaxation.png",
 "img/ek-0052-tension.png",
 "img/ek-0054-relaxation.png",
 "img/ek-0054-tension.png",
 "img/ek-0055-relaxation.png",
 "img/ek-0055-tension.png",
 "img/ek-0056-relaxation.png",
 "img/ek-0056-tension.png",
 "img/ek-0062-relaxation.png",
 "img/ek-0062-tension.png",
 "img/ek-0066-relaxation.png",
 "img/ek-0066-tension.png",
 "img/ek-0077-relaxation.png",
 "img/ek-0077-tension.png",
 "img/ek-0078-relaxation.png",
 "img/ek-0078-tension.png",
 "img/ek-0080-relaxation.png",
 "img/ek-0080-tension.png",
 "img/ek-0081-relaxation.png",
 "img/ek-0081-tension.png",
 "img/ek-0085-relaxation.png",
 "img/ek-0085-tension.png",
 "img/ek-0171-relaxation.png",
 "img/ek-0171-tension.png",
 "img/ek-0189-relaxation.png",
 "img/ek-0189-tension.png",
 "img/ek-0194-relaxation.png",
 "img/ek-0194-tension.png",
 "img/ek-0204-relaxation.png",
 "img/ek-0204-tension.png",
 "img/ek-0205-relaxation.png",
 "img/ek-0205-tension.png",
 "img/ek-0206-relaxation.png",
 "img/ek-0206-tension.png"
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var isFont = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !isFont) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) {
      var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put('index.html', copy); }); return r;
    }).catch(function () { return caches.match('index.html').then(function (m) { return m || caches.match('./'); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (r) {
      if (r && (r.ok || r.type === 'opaque')) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
