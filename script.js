
// ── Randoms Landing Pages — Shared Scripts ──────────────────────
// Used by: index.html, post.html, short.html, profile.html

(function() {
    'use strict';

    // ── Constants ────────────────────────────────────────────────
    const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ras.androidzing';
    const CUSTOM_SCHEME = 'randomsapp://';
    const OVERLAY_ID = 'playstore-overlay';

    // ── App Detection ────────────────────────────────────────────
    // Try to open the app via custom scheme
    function tryOpenApp(path) {
        const url = CUSTOM_SCHEME + path;
        
        // Attempt to open the app
        const startTime = Date.now();
        window.location.href = url;
        
        // If we're still here after 500ms, app probably isn't installed
        setTimeout(function() {
            if (Date.now() - startTime < 600) {
                // Still on this page, app not opened
                console.log('App not installed, showing web version');
            }
        }, 500);
    }

    // ── Overlay Management ───────────────────────────────────────
    function showPlayStoreOverlay() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    function hidePlayStoreOverlay() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    function openPlayStore() {
        window.open(PLAY_STORE_URL, '_blank');
    }

    // ── URL Parameter Parser ────────────────────────────────────
    function getParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    }

    // ── Format Large Numbers ────────────────────────────────────
    function formatCount(num) {
        if (typeof num === 'string') num = parseInt(num, 10);
        if (isNaN(num)) return '';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num > 0 ? num.toString() : '';
    }

    // ── Format Time ────────────────────────────────────────────
    function formatTime(timestamp) {
        if (!timestamp) return '';
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);
        
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h';
        if (diff < 604800) return Math.floor(diff / 86400) + 'd';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[time.getMonth()] + ' ' + time.getDate();
    }

    // ── Like Animation ──────────────────────────────────────────
    function triggerLikeAnimation(elementId) {
        const anim = document.getElementById(elementId || 'like-anim');
        if (!anim) return;
        
        anim.classList.remove('show');
        void anim.offsetWidth; // Force reflow
        anim.classList.add('show');
        
        // Auto-remove after animation
        setTimeout(function() {
            anim.classList.remove('show');
        }, 900);
    }

    // ── Caption Toggle ──────────────────────────────────────────
    function toggleCaption(elementId) {
        const caption = document.getElementById(elementId || 'caption-text');
        if (!caption) return;
        
        caption.classList.toggle('expanded');
        
        const btn = caption.querySelector('.more-less');
        if (btn) {
            btn.textContent = caption.classList.contains('expanded') ? 'less' : 'more';
        }
    }

    // ── Double-Tap Detection ────────────────────────────────────
    function setupDoubleTap(elementId, onDoubleTap, onSingleTap) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let tapCount = 0;
        let tapTimer = null;
        
        element.addEventListener('click', function() {
            tapCount++;
            
            if (tapCount === 1) {
                tapTimer = setTimeout(function() {
                    if (onSingleTap) onSingleTap();
                    tapCount = 0;
                }, 250);
            } else if (tapCount === 2) {
                clearTimeout(tapTimer);
                tapCount = 0;
                if (onDoubleTap) onDoubleTap();
            }
        });
    }

    // ── Make All Interactive Elements Redirect ──────────────────
    function bindInteractionsToPlayStore(containerSelector) {
        const container = document.querySelector(containerSelector || '.container');
        if (!container) return;
        
        // All buttons except cancel buttons
        container.querySelectorAll('button:not(.cancel-btn)').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                // Don't double-handle if already has specific handler
                if (btn.hasAttribute('data-no-redirect')) return;
            });
        });
    }

    // ── Expose to Global Scope ──────────────────────────────────
    window.RandomsLanding = {
        showPlayStore: showPlayStoreOverlay,
        hidePlayStore: hidePlayStoreOverlay,
        openPlayStore: openPlayStore,
        getParams: getParams,
        formatCount: formatCount,
        formatTime: formatTime,
        triggerLikeAnimation: triggerLikeAnimation,
        toggleCaption: toggleCaption,
        setupDoubleTap: setupDoubleTap,
        tryOpenApp: tryOpenApp,
        PLAY_STORE_URL: PLAY_STORE_URL
    };

})();
