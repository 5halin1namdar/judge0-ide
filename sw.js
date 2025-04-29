/* sw.js  – offline-first service worker */
const CACHE = 'citi-code-craft-v1';

/* List *every* local asset you want available offline. */
const ASSETS = [
  '/', '/index.html',

  /* your own CSS */
  '/css/ide.css', '/css/semantic.css', '/css/site.css',

  /* your own JS modules */
  '/js/ai.js','/js/configuration.js','/js/electron.js','/js/ide.js',
  '/js/local_storage.js','/js/puter.js','/js/query.js','/js/style.js','/js/theme.js',

  /* vendored libraries */
  '/vendor/js.puter.com/v2.js',

  '/vendor/cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/marked/15.0.6/marked.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.3/purify.min.js',

  '/vendor/cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css',

  '/vendor/cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-dark-theme.css',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-light-theme.css',

  '/vendor/cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js',
  '/vendor/cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css',

  /* self-hosted font files */
  '/vendor/fonts/JetBrainsMono/JetBrainsMono-Regular.woff2',
  '/vendor/fonts/JetBrainsMono/JetBrainsMono-Italic.woff2',

  /* monaco-editor that is already checked into your repo */
  '/vendor/monaco-editor-0.44.0/min/vs/loader.js',
  '/vendor/monaco-editor-0.44.0/min/vs/editor/editor.main.nls.js',
  '/vendor/monaco-editor-0.44.0/min/vs/editor/editor.main.js',
  // …add the rest of the Monaco js/css/worker files you use …
];

/* install: cache everything listed above */
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* activate: clean up old caches */
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* fetch: cache-first strategy */
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
