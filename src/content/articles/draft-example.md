---
title: "Draft Preview Example"
description: "How the draft workflow behaves: this page builds as an unlisted preview but never appears in lists, feeds, or the sitemap."
tags: ["meta", "workflow"]
draft: true
---

This article has `draft: true` in its frontmatter, which makes it an **unlisted preview**:

## Wikilink rendering demo

A reference link: [[astro-tips]] — and with a custom label: [[astro-tips|my tips post]].

A broken target renders harmlessly: [[no-such-post]]

```ts
const example: string = 'code blocks show a faint language watermark';
```


- It does **not** appear on the home page, article list, RSS feed, or search index in production.
- It is excluded from `sitemap-index.xml` and carries a `noindex` robots meta tag.
- Its URL still builds, so you can push a draft and check the fully rendered page (theme, Shiki highlighting, series navigation) on the live site before publishing.

To publish, remove the `draft` flag (or set it to `false`) and push again.
