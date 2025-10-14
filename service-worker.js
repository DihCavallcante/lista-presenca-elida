const CACHE_NAME = 'adb-presenca-v1.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://i.ibb.co/v6BD6D3h/logo.png'
];

// InstalaÃ§Ã£o - cacheia os arquivos principais
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Arquivos cacheados com sucesso');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[Service Worker] Erro ao cachear:', err);
      })
  );
});

// AtivaÃ§Ã£o - remove caches antigos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Ativado com sucesso');
      return self.clients.claim();
    })
  );
});

// Fetch - estratÃ©gia Network First com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // âœ… NÃƒO INTERCEPTAR:
  // - RequisiÃ§Ãµes do Firebase/Firestore
  // - RequisiÃ§Ãµes de APIs externas
  // - RequisiÃ§Ãµes POST/PUT/DELETE
  if (
    url.origin.includes('firebase') ||
    url.origin.includes('googleapis') ||
    url.origin.includes('gstatic') ||
    url.origin.includes('firebaseapp') ||
    request.method !== 'GET'
  ) {
    // Deixa passar direto para a rede
    return;
  }

  // âœ… ESTRATÃ‰GIA: Network First (rede primeiro, cache como fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Se a resposta for vÃ¡lida, clona e armazena no cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta buscar do cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Servindo do cache:', request.url);
            return cachedResponse;
          }
          
          // Se for requisição HTML, retorna a página principal (para SPA)
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
          
          // Caso contrÃ¡rio, retorna erro
          return new Response('Offline - recurso não disponível', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});