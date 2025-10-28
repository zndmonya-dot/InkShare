const CACHE_NAME = 'inklink-v1'
const CACHE_STATIC = 'inklink-static-v1'
const CACHE_DYNAMIC = 'inklink-dynamic-v1'
const CACHE_API = 'inklink-api-v1'

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/offline',
]

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_API]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Next.js開発用リクエストをバイパス
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/__nextjs') ||
    url.pathname.includes('webpack-hmr') ||
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  ) {
    return
  }

  // API リクエスト: Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone()
          caches.open(CACHE_API).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response(
              JSON.stringify({ error: 'オフラインです' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            )
          })
        })
    )
    return
  }

  // 静的ファイル: Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone()
          caches.open(CACHE_STATIC).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
      })
    )
    return
  }

  // ページ: Network First with Offline Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone()
        caches.open(CACHE_DYNAMIC).then((cache) => {
          cache.put(request, responseToCache)
        })
        return response
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/offline')
        })
      })
  )
})

// プッシュ通知の受信
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '新しい更新があります',
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    tag: 'inklink-notification',
    requireInteraction: false,
    actions: [
      { action: 'open', title: '開く' },
      { action: 'close', title: '閉じる' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('InkLink', options)
  )
})

// 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

