/**
 * BattleZone Advanced Service Worker
 * Strategies:
 *  - Cache First      → static assets (images, fonts, icons)
 *  - Network First    → API calls (fresh data, fallback to cache)
 *  - Stale-While-Rev  → Next.js pages / HTML
 *  - Cache Only       → offline fallback
 *
 * Advanced APIs:
 *  - Background Sync  → retry failed match-joins / form POSTs
 *  - Push Handling    → show rich push notifications
 *  - Periodic Sync    → refresh match data in background
 *  - Share Target     → receive shared screenshots
 *  - Badging API      → update app icon badge count
 */

const SW_VERSION = 'bz-sw-v3';

const STATIC_CACHE   = `${SW_VERSION}-static`;
const DYNAMIC_CACHE  = `${SW_VERSION}-dynamic`;
const API_CACHE      = `${SW_VERSION}-api`;
const IMAGE_CACHE    = `${SW_VERSION}-images`;
const FONT_CACHE     = `${SW_VERSION}-fonts`;

const OFFLINE_URL    = '/offline';

// ── Assets to pre-cache on install ──────────────────────────────────────────
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/matches',
  '/tournaments',
  '/leaderboard',
  '/manifest.json',
];

// ── Install: Precache shell ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: Clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const VALID_CACHES = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !VALID_CACHES.includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Routing strategies ────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and browser-extension requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // 1. Fonts → Cache First (very long TTL)
  if (url.hostname === 'fonts.gstatic.com' || url.pathname.includes('/fonts/')) {
    event.respondWith(cacheFirst(request, FONT_CACHE, { maxAge: 60 * 60 * 24 * 365 }));
    return;
  }

  // 2. Images → Cache First with size limit
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, { maxEntries: 80, maxAge: 60 * 60 * 24 * 30 }));
    return;
  }

  // 3. API calls → Network First, fallback to cache (60s TTL)
  if (url.pathname.startsWith('/api/') || url.hostname === 'api.battlexzone.com') {
    event.respondWith(networkFirst(request, API_CACHE, { maxAge: 60 }));
    return;
  }

  // 4. Next.js static chunks → Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, { maxAge: 60 * 60 * 24 * 365 }));
    return;
  }

  // 5. Next.js image optimisation → Cache First
  if (url.pathname.startsWith('/_next/image')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, { maxAge: 60 * 60 * 24 * 30 }));
    return;
  }

  // 6. HTML pages → Stale-While-Revalidate, offline fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // 7. Everything else → Network with dynamic cache fallback
  event.respondWith(networkFirst(request, DYNAMIC_CACHE, { maxAge: 60 * 5 }));
});

// ── Strategy: Cache First ────────────────────────────────────────────────────
async function cacheFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    const cachedDate = cached.headers.get('sw-cached-at');
    if (cachedDate && options.maxAge) {
      const age = (Date.now() - parseInt(cachedDate, 10)) / 1000;
      if (age > options.maxAge) {
        // Stale — fetch fresh in background
        fetchAndCache(request, cache, options).catch(() => {});
      }
    }
    return cached;
  }
  return fetchAndCache(request, cache, options);
}

// ── Strategy: Network First ──────────────────────────────────────────────────
async function networkFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      await putInCache(cache, request, response.clone(), options);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response(JSON.stringify({ error: 'offline', cached: false }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ── Strategy: Stale-While-Revalidate ────────────────────────────────────────
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request.clone())
    .then((response) => {
      if (response.ok) putInCache(cache, request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  // No cache — wait for network
  const response = await fetchPromise;
  if (response) return response;

  // Total offline — serve offline page
  return caches.match(OFFLINE_URL) || new Response('Offline', { status: 503 });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
async function fetchAndCache(request, cache, options = {}) {
  const response = await fetch(request.clone());
  if (response.ok) {
    await putInCache(cache, request, response.clone(), options);
  }
  return response;
}

async function putInCache(cache, request, response, options = {}) {
  // Add timestamp header for TTL checks
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', String(Date.now()));
  const timestampedResponse = new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
  await cache.put(request, timestampedResponse);

  // Enforce maxEntries by deleting oldest
  if (options.maxEntries) {
    const keys = await cache.keys();
    if (keys.length > options.maxEntries) {
      await cache.delete(keys[0]);
    }
  }
}

// ── Background Sync: Retry failed match joins ────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-match-join') {
    event.waitUntil(replayQueuedRequests('match-join-queue'));
  }
  if (event.tag === 'sync-tournament-register') {
    event.waitUntil(replayQueuedRequests('tournament-register-queue'));
  }
  if (event.tag === 'sync-wallet-deposit') {
    event.waitUntil(replayQueuedRequests('wallet-deposit-queue'));
  }
});

async function replayQueuedRequests(queueKey) {
  // Read queued requests from IndexedDB
  const db = await openDB();
  const requests = await getAll(db, queueKey);
  for (const item of requests) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });
      if (response.ok) {
        await deleteFromDB(db, queueKey, item.id);
        // Notify all clients of success
        const clients = await self.clients.matchAll();
        clients.forEach((client) =>
          client.postMessage({ type: 'SYNC_SUCCESS', tag: queueKey, data: item })
        );
      }
    } catch (err) {
      console.warn('[SW] Background sync failed for', queueKey, err);
    }
  }
}

// ── Periodic Background Sync: Refresh match data ────────────────────────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-matches') {
    event.waitUntil(refreshMatchData());
  }
});

async function refreshMatchData() {
  try {
    const response = await fetch('/api/matches?status=upcoming&limit=10');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/matches?status=upcoming&limit=10', response.clone());
      const clients = await self.clients.matchAll({ type: 'window' });
      if (clients.length > 0) {
        clients.forEach((c) => c.postMessage({ type: 'MATCHES_REFRESHED' }));
      }
    }
  } catch (err) {
    console.warn('[SW] Periodic sync failed:', err);
  }
}

// ── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {
    data = { title: 'BattleZone', body: event.data?.text() || 'New notification' };
  }

  const {
    title = 'BattleZone',
    body = '',
    icon = '/images/icon-192.png',
    badge = '/images/icon-96.png',
    url = '/',
    tag = 'default',
    actions = [],
    data: extraData = {},
    vibrate = [200, 100, 200],
    requireInteraction = false,
    silent = false,
  } = data;

  const options = {
    body,
    icon,
    badge,
    tag,
    actions,
    data: { url, ...extraData },
    vibrate,
    requireInteraction,
    silent,
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      // Update badge count
      updateBadge(extraData.unreadCount);
    })
  );
});

// ── Notification Click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/notifications';
  const action = event.action;

  let navigateTo = targetUrl;
  if (action === 'view-match') navigateTo = event.notification.data?.matchUrl || '/matches';
  if (action === 'join-match') navigateTo = event.notification.data?.matchUrl || '/matches';
  if (action === 'dismiss') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const focused = clients.find((c) => c.url === navigateTo && 'focus' in c);
      if (focused) return focused.focus();
      if (clients.length > 0) return clients[0].navigate(navigateTo);
      return self.clients.openWindow(navigateTo);
    })
  );
});

// ── Notification Close ───────────────────────────────────────────────────────
self.addEventListener('notificationclose', () => {
  // Track dismissed notifications for analytics
});

// ── Badging API ──────────────────────────────────────────────────────────────
function updateBadge(count) {
  if (!count && count !== 0) return;
  if ('setAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).catch(() => {});
    } else {
      navigator.clearAppBadge().catch(() => {});
    }
  }
}

// ── Message Handling (from main thread) ─────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'SET_BADGE') {
    updateBadge(event.data.count);
  }
  if (event.data?.type === 'CLEAR_BADGE') {
    updateBadge(0);
  }
  if (event.data?.type === 'QUEUE_REQUEST') {
    queueRequest(event.data.queueKey, event.data.request);
  }
  if (event.data?.type === 'CACHE_URLS') {
    precacheUrls(event.data.urls);
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(event.data.cacheName || DYNAMIC_CACHE);
  }
});

async function precacheUrls(urls = []) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await Promise.allSettled(urls.map((url) => cache.add(url)));
}

// ── IndexedDB helpers for background sync queue ──────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('bz-sync-queue', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('match-join-queue')) {
        db.createObjectStore('match-join-queue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('tournament-register-queue')) {
        db.createObjectStore('tournament-register-queue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('wallet-deposit-queue')) {
        db.createObjectStore('wallet-deposit-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getAll(db, storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function deleteFromDB(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function queueRequest(queueKey, requestData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(queueKey, 'readwrite');
    const req = tx.objectStore(queueKey).add(requestData);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
