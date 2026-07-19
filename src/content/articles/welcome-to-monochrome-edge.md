---
title: "Welcome to Monochrome Edge Blog"
description: "A minimal, elegant technical blog built with Astro and Monochrome Edge UI"
tags: [astro, blog, monochrome-edge]
featured: true
---

# Welcome to Monochrome Edge Blog

Welcome to your new blog! This is a minimal, elegant technical blog built with **Astro 5** and **Monochrome Edge UI**.

## Features

This blog template comes with many powerful features out of the box:

### Automatic Metadata Generation

- **Dates**: Automatically extracted from Git history
- **Reading Time**: Calculated from content
- **Table of Contents**: Generated from headings
- **Backlinks**: Automatically tracked between posts

### Beautiful Design

The Monochrome Edge UI provides:

- 🎨 **Dual Themes**: Warm and Cold themes
- 🌓 **Dark Mode**: With system preference support
- 📱 **Responsive**: Mobile-first design
- ⚡ **Fast**: Zero JavaScript by default

### Developer Experience

- 📝 Write in **Markdown**
- 🔍 **Fuzzy Search** with Fuse.js
- 🔗 **Wiki-style Links** with `[[brackets]]`
- 📊 **SEO Optimized** with sitemap and RSS

## Getting Started

To create a new blog post, simply add a markdown file to `src/content/articles/`:

```markdown
---
title: "My First Post"
tags: [hello, world]
---

# Content goes here...
```

That's it! The date, reading time, and other metadata will be automatically generated.

## Code Example

Here's a simple TypeScript example:

```typescript
interface BlogPost {
  title: string;
  date: Date;
  tags: string[];
}

function createPost(data: BlogPost) {
  console.log(\`Creating post: \${data.title}\`);
}
```

## Links and References

You can link to other posts using wiki-style links: [[astro-tips]] or regular markdown links: [Astro Documentation](https://astro.build)

## Conclusion

Enjoy your new blog! Start writing and the system will handle the rest.

Happy blogging! 🚀
