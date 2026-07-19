/**
 * Analytics tracking utility
 * Supports Google Analytics 4 (GA4) and custom analytics providers
 */

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>,
) {
  // Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  trackEvent('page_view', {
    page_location: url,
    page_title: title || document.title,
  });
}

/**
 * Track code copy event
 */
export function trackCodeCopy(language?: string) {
  trackEvent('code_copy', {
    event_category: 'engagement',
    event_label: language || 'unknown',
  });
}

/**
 * Track share event
 */
export function trackShare(platform: string, url: string) {
  trackEvent('share', {
    event_category: 'engagement',
    method: platform,
    content_type: 'article',
    item_id: url,
  });
}

/**
 * Track search event
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent('search', {
    event_category: 'engagement',
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, linkText?: string) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText,
    link_domain: new URL(url).hostname,
  });
}

/**
 * Track file download
 */
export function trackDownload(fileName: string, fileType?: string) {
  trackEvent('file_download', {
    event_category: 'engagement',
    file_name: fileName,
    file_extension: fileType || fileName.split('.').pop(),
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number) {
  trackEvent('scroll', {
    event_category: 'engagement',
    percent_scrolled: percentage,
  });
}

/**
 * Track reading time
 */
export function trackReadingTime(seconds: number, articleTitle?: string) {
  trackEvent('reading_time', {
    event_category: 'engagement',
    value: seconds,
    article_title: articleTitle || document.title,
  });
}

/**
 * Track video play
 */
export function trackVideoPlay(videoTitle: string, videoUrl?: string) {
  trackEvent('video_play', {
    event_category: 'engagement',
    video_title: videoTitle,
    video_url: videoUrl,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, success: boolean = true) {
  trackEvent('form_submit', {
    event_category: 'engagement',
    form_name: formName,
    success: success,
  });
}

/**
 * Track 404 error
 */
export function track404(url: string, referrer?: string) {
  trackEvent('page_not_found', {
    event_category: 'error',
    page_location: url,
    referrer: referrer || document.referrer,
  });
}

/**
 * Track timing (performance)
 */
export function trackTiming(name: string, value: number, category?: string) {
  trackEvent('timing_complete', {
    event_category: category || 'performance',
    name: name,
    value: Math.round(value),
  });
}

// Make trackEvent available globally for inline use
if (typeof window !== 'undefined') {
  (window as any).trackEvent = trackEvent;
}
