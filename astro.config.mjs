// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeNoTranslate } from './src/utils/rehype-notranslate';
import { rehypeStripH1 } from './src/utils/rehype-strip-h1';
import { rehypeCodeBlocks } from './src/utils/rehype-code-blocks';
import { remarkWikilinks } from './src/utils/remark-wikilinks';

const base = process.env.BASE_PATH
  ? process.env.BASE_PATH.replace(/\/$/, '') + '/'
  : '/';

// Draft articles build as unlisted preview pages but must stay out of the sitemap.
const ARTICLES_DIR = './src/content/articles';
const draftSlugs = fs
  .readdirSync(ARTICLES_DIR)
  .filter((file) => file.endsWith('.md'))
  .filter((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    return matter(raw).data.draft === true;
  })
  .map((file) => file.replace(/\.md$/, ''));

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base,
  integrations: [
    sitemap({
      // compare both raw and percent-encoded slugs — sitemap URLs are encoded,
      // so a hangul draft slug would otherwise leak through the filter
      filter: (page) =>
        !draftSlugs.some(
          (slug) =>
            page.includes(`/articles/${slug}/`) ||
            page.includes(`/articles/${encodeURI(slug)}/`),
        ),
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
    processor: unified({
      remarkPlugins: [[remarkWikilinks, { base }]],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-link'],
            },
          },
        ],
        rehypeNoTranslate,
        rehypeStripH1,
        rehypeCodeBlocks,
      ],
    }),
  },
  vite: {
    optimizeDeps: {
      exclude: ['@monochrome-edge/ui'],
    },
  },
});
