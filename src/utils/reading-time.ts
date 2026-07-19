/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  // Remove code blocks for more accurate count
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');

  // Remove HTML tags
  const withoutHtml = withoutCode.replace(/<[^>]*>/g, '');

  // Count words (supports Korean, English, etc.)
  const koreanChars = (withoutHtml.match(/[가-힣]/g) || []).length;
  const englishWords = (withoutHtml.match(/\b[a-zA-Z]+\b/g) || []).length;

  // Korean: 1 character ≈ 0.5 words
  const totalWords = englishWords + koreanChars * 0.5;

  return Math.ceil(totalWords / wordsPerMinute);
}

/**
 * Get word count
 */
export function getWordCount(content: string): number {
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  const withoutHtml = withoutCode.replace(/<[^>]*>/g, '');

  const koreanChars = (withoutHtml.match(/[가-힣]/g) || []).length;
  const englishWords = (withoutHtml.match(/\b[a-zA-Z]+\b/g) || []).length;

  return Math.floor(englishWords + koreanChars * 0.5);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number, locale = 'ko'): string {
  if (locale === 'ko') {
    return `${minutes}분`;
  }
  return `${minutes} min read`;
}
