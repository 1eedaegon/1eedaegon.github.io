#!/usr/bin/env node
/**
 * Scaffold a new article: `npm run new -- "포스트 제목"`
 * Creates src/content/articles/<slug>.md with draft frontmatter.
 * Dates are intentionally omitted — they derive from git history on publish.
 */
import fs from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = path.join(process.cwd(), 'src', 'content', 'articles');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\w\s가-힣-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

if (!slug) {
  console.error('Could not derive a slug from that title.');
  process.exit(1);
}

const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
if (fs.existsSync(filePath)) {
  console.error(`Already exists: src/content/articles/${slug}.md`);
  process.exit(1);
}

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
tags: []
draft: true
---

`;

fs.writeFileSync(filePath, frontmatter);

console.log(`Created  src/content/articles/${slug}.md`);
console.log('');
console.log('Next steps:');
console.log('  1. npm run dev        # live preview at /articles/' + slug);
console.log('  2. Write, then fill in description');
console.log(
  '  3. Push with draft: true for an unlisted preview on the live site',
);
console.log('  4. Remove draft (or set false) to publish');
