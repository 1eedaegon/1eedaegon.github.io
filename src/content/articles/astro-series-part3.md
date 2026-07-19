---
title: "Content Collections in Astro"
description: "Learn how to manage and query content with Astro's powerful Content Collections API"
series: "Astro Complete Guide"
seriesOrder: 3
category: "Tutorial"
tags: [astro, content-collections, markdown]
---

# Content Collections in Astro

Welcome to Part 3! In [[astro-series-part1|Part 1]] and [[astro-series-part2|Part 2]], we covered Astro basics and components. Now let's master content management with Content Collections.

## What are Content Collections?

Content Collections provide a type-safe way to manage your content (Markdown, MDX, JSON) with:

- Type safety with Zod schemas
- Auto-completion in your editor
- Validation at build time
- Powerful query API

## Setting Up Collections

### 1. Define Your Schema

Create `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

### 2. Add Content

Create `src/content/articles/hello-world.md`:

```markdown
---
title: "Hello World"
description: "My first post"
tags: [hello, blog]
date: 2025-01-01
---

# Hello World!

This is my first blog post.
```

## Querying Collections

### Get All Entries

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('articles');
---

<ul>
  {posts.map(post => (
    <li>{post.data.title}</li>
  ))}
</ul>
```

### Filter Entries

```astro
---
const publishedPosts = await getCollection('articles', ({ data }) => {
  return !data.draft;
});
---
```

### Get Single Entry

```astro
---
import { getEntry } from 'astro:content';

const post = await getEntry('articles', 'hello-world');
---

<h1>{post.data.title}</h1>
```

## Rendering Content

```astro
---
import { render } from 'astro:content';

const post = await getEntry('articles', 'hello-world');
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Dynamic Routes

Create `src/pages/articles/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('articles');
  
  return posts.map(post => ({
    params: { slug: post.id.replace('.md', '') },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <time>{post.data.date?.toLocaleDateString()}</time>
  <Content />
</article>
```

## Advanced Schemas

### Nested Objects

```typescript
const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  }),
});
```

### Enums

```typescript
schema: z.object({
  status: z.enum(['draft', 'published', 'archived']),
  lang: z.enum(['ko', 'en']).default('ko'),
})
```

### References

```typescript
schema: z.object({
  relatedPosts: z.array(z.string()),
})
```

## Sorting and Filtering

### Sort by Date

```astro
---
const posts = await getCollection('articles');
const sorted = posts.sort((a, b) => 
  b.data.date.getTime() - a.data.date.getTime()
);
---
```

### Filter by Tag

```astro
---
const tag = 'astro';
const filtered = await getCollection('articles', ({ data }) => 
  data.tags.includes(tag)
);
---
```

## Frontmatter Validation

Content Collections validate your frontmatter at build time:

```markdown
---
title: "Valid Post"
date: 2025-01-01
tags: [astro]
---
```

❌ This will fail:
```markdown
---
title: 123  # Should be string!
date: "invalid-date"
---
```

## Working with MDX

```typescript
import { defineCollection } from 'astro:content';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  // ... schema
});
```

Now you can use components in your content:

```mdx
---
title: "Interactive Post"
---

import Button from '../../components/Button.astro';

# Hello!

<Button>Click me</Button>
```

## Best Practices

1. **Use TypeScript** - Get full type safety
2. **Validate early** - Define strict schemas
3. **Keep it organized** - Use clear folder structure
4. **Use references** - Link related content

## Next Steps

You now know how to manage content in Astro! Check out the [Astro docs](https://docs.astro.build) for more advanced topics.

## Summary

- Content Collections provide type-safe content management
- Define schemas with Zod
- Query with `getCollection()` and `getEntry()`
- Render with `render()`
- Build dynamic routes with `getStaticPaths()`

This series covered the fundamentals of Astro. Now go build something amazing! 🚀
