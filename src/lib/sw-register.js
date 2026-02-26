/**
 * registerSW — registers /sw.js and sets up update checks.
 * Call this once from layout.jsx inside a useEffect.
 */
export async function registerSW() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always fetch fresh SW — never serve from HTTP cache
    });

    // Check for updates every 60 minutes while app is open
    setInterval(() => {
      registration.update().catch(() => {});
    }, 60 * 60 * 1000);

    // Immediately check for waiting SW
    if (registration.waiting) {
      window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: registration }));
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: registration }));
        }
      });
    });

    return registration;
  } catch (err) {
    console.warn('[SW] Registration failed:', err);
  }
}

/**
 * subscribeToPush — request push notification permission and subscribe
 * to the push service using the server's VAPID public key.
 */
export async function subscribeToPush(vapidPublicKey) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    return subscription;
  } catch (err) {
    console.warn('[Push] Subscribe failed:', err);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * unsubscribeFromPush — unsubscribe from push notifications.
 */
export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch (err) {
    console.warn('[Push] Unsubscribe failed:', err);
  }
}

/**
 * cacheCriticalUrls — pre-cache important URLs via the SW.
 */
export function cacheCriticalUrls(urls = []) {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage({ type: 'CACHE_URLS', urls });
}
