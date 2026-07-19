import type { CollectionEntry } from 'astro:content';
import { articleIdToSlug, articlePath, sameOriginPath } from './url';

export interface SearchIndexItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  date: string;
  url: string;
}

/**
 * Generate search index from posts
 */
export function generateSearchIndex(
  posts: CollectionEntry<'articles'>[],
  basePath: string,
): SearchIndexItem[] {
  return posts.map((post) => {
    // Extract first 500 chars of content for search
    const plainContent = post.body
      ? post.body
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/#+ /g, '') // Remove heading markers
          .replace(
            /!?\[\[([^\][|]+)(?:\|([^\][]+))?\]\]/g,
            (_m, target, label) => label || target,
          ) // Wikilinks to text
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
          .slice(0, 500)
      : '';

    return {
      id: articleIdToSlug(post.id),
      title: post.data.title,
      description: post.data.description || '',
      tags: post.data.tags,
      content: plainContent,
      date: post.data.date?.toISOString() || '',
      url: articlePath(basePath, post.id),
    };
  });
}

export function isSearchIndexItem(item: unknown): item is SearchIndexItem {
  if (!item || typeof item !== 'object') return false;

  const candidate = item as SearchIndexItem;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every((tag) => typeof tag === 'string') &&
    typeof candidate.content === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.url === 'string'
  );
}

export function normalizeSearchIndexItem(
  item: SearchIndexItem,
  origin: string,
  basePath: string,
): SearchIndexItem | null {
  const url = sameOriginPath(item.url, origin, basePath);
  return url ? { ...item, url } : null;
}

/**
 * Client-side search configuration for Fuse.js
 */
export const SEARCH_CONFIG = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'tags', weight: 2 },
    { name: 'content', weight: 1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};
