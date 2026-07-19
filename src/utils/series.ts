import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Get all posts in a series, sorted by seriesOrder
 */
export async function getSeriesPosts(
  series: string,
): Promise<CollectionEntry<'articles'>[]> {
  const posts = await getCollection('articles', ({ data }) => {
    return data.series === series && !data.draft;
  });

  return posts.sort((a, b) => {
    const orderA = a.data.seriesOrder || 0;
    const orderB = b.data.seriesOrder || 0;
    return orderA - orderB;
  });
}

/**
 * Get previous and next posts in a series
 */
export interface SeriesNavigation {
  prev: CollectionEntry<'articles'> | null;
  next: CollectionEntry<'articles'> | null;
  all: CollectionEntry<'articles'>[];
  current: number;
  total: number;
}

export async function getSeriesNavigation(
  currentPost: CollectionEntry<'articles'>,
  seriesPosts?: CollectionEntry<'articles'>[],
): Promise<SeriesNavigation | null> {
  if (!currentPost.data.series) return null;

  const posts = seriesPosts || (await getSeriesPosts(currentPost.data.series));
  const currentIndex = posts.findIndex((p) => p.id === currentPost.id);

  if (currentIndex === -1) return null;

  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    all: posts,
    current: currentIndex + 1,
    total: posts.length,
  };
}

/**
 * Get all series names
 */
export async function getAllSeries(): Promise<string[]> {
  const posts = await getCollection('articles', ({ data }) => !data.draft);
  const series = new Set(
    posts.map((p) => p.data.series).filter((s): s is string => s !== undefined),
  );
  return Array.from(series).sort();
}
