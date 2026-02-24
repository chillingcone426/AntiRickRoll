import blockedIds from './blockedIds.js';

(() => {
    // We grab the storage every time in case an id gets added while we're browsing (futureproofing)
    const checkLink = () => chrome.storage.local.get(['bypassed', 'totalRickRolls', 'extDisabled', 'customUrls'], res => {
        const customUrls = res.customUrls ?? [];
        // Check if blocking is enabled and if url matches built-in blocked ids or custom urls
        const isBlocked = !res.extDisabled && (
            blockedIds.some(i => location.href.includes(i)) ||
            customUrls.some(u => location.href.toLowerCase().includes(u.toLowerCase()))
        );
        if (isBlocked) {
            // If not bypassed (user clicked continue), show warning page
            if (!res.bypassed) {
                // Update total rickrolls blocked counter
                chrome.storage.local.set({ totalRickRolls: (res.totalRickRolls ?? 0) + 1 });

                location.replace(chrome.runtime.getURL('warn/warn.html') + '?' + location.href);
            } else {
                chrome.storage.local.set({ bypassed: false });
            }
        }
    });

    // Make sure we're not already on a blocked link
    checkLink();

    // Hook into youtube navigation event
    addEventListener('yt-navigate-start', checkLink);
})();
