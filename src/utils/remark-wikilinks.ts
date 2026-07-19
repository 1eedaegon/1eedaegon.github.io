import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';
import type { Root, Content, Parent } from 'mdast';

/**
 * Obsidian-style wikilinks, rendered at build time:
 *   [[slug]] / [[slug|label]]   → link to the article (label defaults to the
 *                                 target's title)
 *   ![[image.png]]              → inline image (colocated relative path, or
 *                                 base-prefixed for /absolute public paths)
 *   ![[slug]]                   → embed card (title + description + link)
 * Unknown targets render as a .wikilink-broken span so lychee stays green.
 * Code spans/fences are untouched (they are not `text` nodes).
 * Backlinks/related-posts extraction (src/utils/relationships.ts) reads the
 * same syntax from the raw markdown, so links and relationships stay in sync.
 */

interface Options {
  base: string; // site base path, e.g. "/" or "/repo/"
  articlesDir?: string;
}

interface ArticleMeta {
  title: string;
  description?: string;
}

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|avif)$/i;
const WIKILINK = /(!?)\[\[([^\][|]+)(?:\|([^\][]+))?\]\]/g;

let metaCache: Map<string, ArticleMeta> | null = null;

function articleMeta(articlesDir: string): Map<string, ArticleMeta> {
  if (metaCache) return metaCache;
  metaCache = new Map();
  for (const file of fs.readdirSync(articlesDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
    const { data } = matter(raw);
    metaCache.set(file.replace(/\.md$/, ''), {
      title:
        typeof data.title === 'string' ? data.title : file.replace(/\.md$/, ''),
      description:
        typeof data.description === 'string' ? data.description : undefined,
    });
  }
  return metaCache;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function remarkWikilinks(options: Options) {
  const base = options.base.replace(/\/$/, '');
  const articlesDir = options.articlesDir ?? './src/content/articles';

  return (tree: Root) => {
    const meta = articleMeta(articlesDir);

    visit(tree, 'text', (node, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== 'number') return;
      if (parent.type === 'link' || parent.type === 'linkReference') return;

      const value = node.value;
      if (!value.includes('[[')) return;

      const parts: Content[] = [];
      let cursor = 0;
      let match: RegExpExecArray | null;
      WIKILINK.lastIndex = 0;

      while ((match = WIKILINK.exec(value)) !== null) {
        const [raw, bang, rawTarget, rawLabel] = match;
        const target = rawTarget.trim();
        const label = rawLabel?.trim();

        if (match.index > cursor) {
          parts.push({ type: 'text', value: value.slice(cursor, match.index) });
        }
        cursor = match.index + raw.length;

        const isEmbed = bang === '!';
        const known = meta.get(target);

        if (isEmbed && IMAGE_EXT.test(target)) {
          const url = target.startsWith('/')
            ? `${base}${target}`
            : `./${target}`;
          parts.push({ type: 'image', url, alt: label ?? '' });
        } else if (isEmbed && known) {
          const href = `${base}/articles/${encodeURI(target)}/`;
          const desc = known.description
            ? `<span class="wikilink-embed-desc">${escapeHtml(known.description)}</span>`
            : '';
          parts.push({
            type: 'html',
            value:
              `<a class="wikilink-embed" href="${href}">` +
              `<strong class="wikilink-embed-title">${escapeHtml(label ?? known.title)}</strong>` +
              desc +
              `<span class="wikilink-embed-cta" aria-hidden="true">Read post →</span>` +
              `</a>`,
          });
        } else if (!isEmbed && known) {
          parts.push({
            type: 'link',
            url: `${base}/articles/${encodeURI(target)}/`,
            children: [{ type: 'text', value: label ?? known.title }],
          });
        } else {
          parts.push({
            type: 'html',
            value: `<span class="wikilink-broken" title="Post not found: ${escapeHtml(target)}">${escapeHtml(raw)}</span>`,
          });
        }
      }

      if (!parts.length) return;
      if (cursor < value.length) {
        parts.push({ type: 'text', value: value.slice(cursor) });
      }

      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
