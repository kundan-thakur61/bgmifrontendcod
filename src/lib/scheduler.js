/**
 * scheduler.js — Non-critical task deferral utilities
 *
 * Use these helpers to split long main-thread tasks into idle-time chunks.
 * All functions have fallbacks for browsers that don't support the modern APIs.
 *
 * Performance Impact:
 *  - Reduces "Minimize main-thread work" Lighthouse metric
 *  - Eliminates long tasks (>50ms) by deferring to idle periods
 *  - Uses scheduler.postTask (Chrome 94+) > requestIdleCallback (Chrome 47+) > setTimeout fallback
 */

/**
 * Run a callback during browser idle time.
 * @param {Function} callback - Work to perform when browser is idle
 * @param {{ timeout?: number, priority?: 'user-blocking' | 'user-visible' | 'background' }} options
 * @returns {Function} Cancel function — call to abort before it fires
 */
export function runWhenIdle(callback, options = {}) {
    const { timeout = 3000, priority = 'background' } = options;

    // 1. scheduler.postTask — most modern, supports priorities (Chrome 94+)
    if (typeof scheduler !== 'undefined' && typeof scheduler.postTask === 'function') {
        const controller = new TaskController({ priority });
        scheduler.postTask(callback, { signal: controller.signal, priority }).catch(() => { });
        return () => controller.abort();
    }

    // 2. requestIdleCallback — wide support (Chrome 47+, Firefox 55+)
    if (typeof requestIdleCallback !== 'undefined') {
        const handle = requestIdleCallback(callback, { timeout });
        return () => cancelIdleCallback(handle);
    }

    // 3. setTimeout(0) — universal fallback
    const handle = setTimeout(callback, 0);
    return () => clearTimeout(handle);
}

/**
 * Defer non-critical work until after the page has painted and is interactive.
 * Waits for requestAnimationFrame (next paint) + setTimeout (after paint tasks drain),
 * then schedules via requestIdleCallback.
 *
 * Ideal for: analytics setup, chat widgets, social embeds, etc.
 *
 * @param {Function} callback
 * @returns {Function} Cancel function
 */
export function afterPaint(callback) {
    let cancelled = false;
    let idleHandle;

    requestAnimationFrame(() => {
        setTimeout(() => {
            if (cancelled) return;

            if (typeof requestIdleCallback !== 'undefined') {
                idleHandle = requestIdleCallback(callback, { timeout: 2000 });
            } else {
                callback();
            }
        }, 0);
    });

    return () => {
        cancelled = true;
        if (idleHandle && typeof cancelIdleCallback !== 'undefined') {
            cancelIdleCallback(idleHandle);
        }
    };
}

/**
 * Split an array of work items into chunks processed during idle frames.
 * Prevents long tasks by processing a small batch per idle period.
 *
 * @param {any[]} items - Array of items to process
 * @param {Function} processor - Called with each item
 * @param {{ chunkSize?: number }} options
 */
export function processInChunks(items, processor, { chunkSize = 5 } = {}) {
    const queue = [...items];

    const processChunk = (deadline) => {
        // If using requestIdleCallback, check remaining time
        const hasTime = deadline
            ? () => deadline.timeRemaining() > 1
            : () => true;

        while (queue.length > 0 && hasTime()) {
            const batch = queue.splice(0, chunkSize);
            batch.forEach(processor);
        }

        if (queue.length > 0) {
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(processChunk, { timeout: 1000 });
            } else {
                setTimeout(() => processChunk(null), 16);
            }
        }
    };

    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(processChunk, { timeout: 1000 });
    } else {
        setTimeout(() => processChunk(null), 0);
    }
}
