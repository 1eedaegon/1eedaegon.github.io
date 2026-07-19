import { getCollection, type CollectionEntry } from 'astro:content';
import { slugifySegment } from './url';

/**
 * Get all posts in a category
 */
export async function getCategoryPosts(category: string): Promise<CollectionEntry<'articles'>[]> {
  const posts = await getCollection('articles', ({ data }) => {
    return data.category === category && !data.draft;
  });

  return posts.sort((a, b) => {
    // Sort by date if available
    const dateA = a.data.date?.getTime() || 0;
    const dateB = b.data.date?.getTime() || 0;
    return dateB - dateA;
  });
}

/**
 * Get all categories with post counts
 */
export interface CategoryWithCount {
  name: string;
  count: number;
  slug: string;
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const posts = await getCollection('articles', ({ data }) => !data.draft);

  const categoryCounts = posts.reduce((acc, post) => {
    const category = post.data.category;
    if (category) {
      acc.set(category, (acc.get(category) || 0) + 1);
    }
    return acc;
  }, new Map<string, number>());

  return Array.from(categoryCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: slugifySegment(name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get category name from slug
 */
export function getCategoryFromSlug(slug: string, categories: CategoryWithCount[]): string | undefined {
  return categories.find(c => c.slug === slug)?.name;
}
