import type { CollectionEntry } from "astro:content";

export interface InternalLink {
  id: string;
  title: string;
  type: "wiki" | "markdown";
}

export interface ExternalLink {
  url: string;
  title: string;
}

export interface Backlink {
  id: string;
  title: string;
  excerpt: string;
}

export interface Relationships {
  internal: InternalLink[];
  external: ExternalLink[];
  backlinks: Backlink[];
}

/**
 * Extract wiki-style links [[link]] from content
 */
export function extractWikiLinks(content: string): string[] {
  const matches = content.match(/\[\[([^\]]+)\]\]/g);
  if (!matches) return [];

  return matches.map((match) => {
    const inner = match.slice(2, -2);
    return inner.split("|")[0].trim();
  });
}

/**
 * Extract internal markdown links [text](/articles/slug)
 */
export function extractInternalLinks(content: string): string[] {
  const matches = content.match(/\[([^\]]+)\]\(\/articles\/([^)]+)\)/g);
  if (!matches) return [];

  return matches
    .map((match) => {
      const urlMatch = match.match(/\(\/articles\/([^)]+)\)/);
      return urlMatch ? urlMatch[1] : "";
    })
    .filter(Boolean);
}

/**
 * Extract external links
 */
export function extractExternalLinks(content: string): ExternalLink[] {
  const matches = content.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g);
  if (!matches) return [];

  return matches
    .map((match) => {
      const titleMatch = match.match(/\[([^\]]+)\]/);
      const urlMatch = match.match(/\((https?:\/\/[^)]+)\)/);

      return {
        title: titleMatch ? titleMatch[1] : "",
        url: urlMatch ? urlMatch[1] : "",
      };
    })
    .filter((link) => link.url && link.title);
}

/**
 * Build backlink map from all posts
 */
export async function buildBacklinkMap(
  posts: CollectionEntry<"articles">[]
): Promise<Map<string, Backlink[]>> {
  const backlinkMap = new Map<string, Backlink[]>();

  for (const post of posts) {
    if (!post.body) continue;

    const wikiLinks = extractWikiLinks(post.body);
    const mdLinks = extractInternalLinks(post.body);
    const allLinks = [...wikiLinks, ...mdLinks];

    for (const targetId of allLinks) {
      if (!backlinkMap.has(targetId)) {
        backlinkMap.set(targetId, []);
      }

      // Create excerpt (first 150 chars around the link)
      const linkIndex = post.body.indexOf(targetId);
      const start = Math.max(0, linkIndex - 75);
      const end = Math.min(post.body.length, linkIndex + 75);
      const excerpt = post.body.slice(start, end).replace(/\n/g, " ");

      backlinkMap.get(targetId)!.push({
        id: post.id,
        title: post.data.title,
        excerpt: excerpt.trim(),
      });
    }
  }

  return backlinkMap;
}

/**
 * Get relationships for a specific post
 */
export async function getRelationships(
  post: CollectionEntry<"articles">,
  allPosts: CollectionEntry<"articles">[],
  backlinkMap: Map<string, Backlink[]>
): Promise<Relationships> {
  if (!post.body) {
    return {
      internal: [],
      external: [],
      backlinks: [],
    };
  }

  const wikiLinks = extractWikiLinks(post.body);
  const mdLinks = extractInternalLinks(post.body);

  // Map link IDs to post titles
  const postMap = new Map(allPosts.map((p) => [p.id.replace(".md", ""), p]));

  const internal: InternalLink[] = [];

  // Process wiki links
  for (const linkId of wikiLinks) {
    const linkedPost = postMap.get(linkId);
    if (linkedPost) {
      internal.push({
        id: linkId,
        title: linkedPost.data.title,
        type: "wiki",
      });
    }
  }

  // Process markdown links
  for (const linkId of mdLinks) {
    const linkedPost = postMap.get(linkId);
    if (linkedPost) {
      internal.push({
        id: linkId,
        title: linkedPost.data.title,
        type: "markdown",
      });
    }
  }

  // Get external links
  const external = extractExternalLinks(post.body);

  // Get backlinks
  const postId = post.id.replace(".md", "");
  const backlinks = backlinkMap.get(postId) || [];

  return {
    internal,
    external,
    backlinks,
  };
}

/**
 * Convert wiki links to markdown links in content
 */
export function convertWikiLinksToMarkdown(
  content: string,
  postMap: Map<string, CollectionEntry<"articles">>
): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
    const [id, displayText] = inner.split("|").map((s: string) => s.trim());
    const post = postMap.get(id);

    if (!post) return match;

    const text = displayText || post.data.title;
    return `[${text}](/articles/${id})`;
  });
}
