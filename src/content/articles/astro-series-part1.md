---
title: "Getting Started with Astro"
description: "Learn the basics of Astro and why it's perfect for building fast websites"
series: "Astro Complete Guide"
seriesOrder: 1
category: "Tutorial"
tags: [astro, tutorial, web-development]
featured: true
---

# Getting Started with Astro

Welcome to the first part of our Astro Complete Guide series! In this series, you'll learn everything you need to build fast, modern websites with Astro.

## What is Astro?

Astro is a modern web framework that delivers lightning-fast performance by shipping zero JavaScript by default. It's perfect for content-focused websites like blogs, documentation, and portfolios.

## Why Astro?

### 1. Zero JavaScript by Default

Unlike other frameworks, Astro doesn't ship JavaScript unless you explicitly need it. This results in:

- Faster page loads
- Better SEO
- Improved Core Web Vitals scores

### 2. Component Islands

Astro uses the "Islands Architecture" - you can use any UI framework (React, Vue, Svelte) only where you need interactivity.

### 3. Content-First

Built for content-heavy sites with:

- Markdown support
- Content collections
- Type-safe frontmatter

## Installation

```bash
npm create astro@latest
```

Choose a template or start from scratch!

## Project Structure

```
my-astro-site/
├── src/
│   ├── pages/          # Routes
│   ├── layouts/        # Page layouts
│   ├── components/     # Reusable components
│   └── content/        # Markdown content
├── public/            # Static assets
└── astro.config.mjs   # Configuration
```

## Your First Page

Create `src/pages/index.astro`:

```astro
---
const title = "Hello Astro!";
---

<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>Welcome to my Astro site!</p>
  </body>
</html>
```

## Next Steps

In the next part, we'll dive into [[astro-series-part2|Astro components and layouts]].

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)
