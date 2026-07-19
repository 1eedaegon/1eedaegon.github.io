/**
 * Track external link clicks
 */
import { trackExternalLink } from '../utils/analytics';

function initExternalLinkTracking() {
  // Find all external links
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach((link) => {
    const anchor = link as HTMLAnchorElement;
    const href = anchor.href;

    // Check if it's an external link (different domain)
    try {
      const linkUrl = new URL(href);
      const currentUrl = new URL(window.location.href);

      if (linkUrl.hostname !== currentUrl.hostname) {
        // Mark as external
        anchor.setAttribute('rel', 'noopener noreferrer');
        if (!anchor.hasAttribute('target')) {
          anchor.setAttribute('target', '_blank');
        }

        if (anchor.dataset.externalTrackingInitialized === 'true') return;
        anchor.dataset.externalTrackingInitialized = 'true';

        // Add click tracking
        anchor.addEventListener('click', () => {
          const linkText = anchor.textContent || anchor.getAttribute('aria-label') || href;
          trackExternalLink(href, linkText);
        });
      }
    } catch (_err) {
      // Invalid URL, skip
    }
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExternalLinkTracking);
} else {
  initExternalLinkTracking();
}

// Re-initialize after view transitions
document.addEventListener('astro:after-swap', initExternalLinkTracking);
