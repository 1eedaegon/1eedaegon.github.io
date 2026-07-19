---
title: "Astro Components and Layouts"
description: "Master Astro components, layouts, and props for building reusable UI"
series: "Astro Complete Guide"
seriesOrder: 2
category: "Tutorial"
tags: [astro, components, layouts]
---

# Astro Components and Layouts

In [[astro-series-part1|Part 1]], we covered the basics of Astro. Now let's dive into components and layouts!

## Astro Components

Components are the building blocks of your Astro site. They use the `.astro` extension.

### Basic Component

Create `src/components/Card.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>

<style>
  .card {
    border: 1px solid var(--border);
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

### Using the Component

```astro
---
import Card from '../components/Card.astro';
---

<Card 
  title="Hello"
  description="This is a card component"
/>
```

## Layouts

Layouts wrap your pages with common UI elements like headers and footers.

### Base Layout

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>{title}</title>
  </head>
  <body>
    <header>
      <nav>My Site</nav>
    </header>
    
    <main>
      <slot />
    </main>
    
    <footer>
      <p>© 2025 My Site</p>
    </footer>
  </body>
</html>
```

### Using Layouts

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <h1>About Me</h1>
  <p>This content is wrapped in the layout!</p>
</BaseLayout>
```

## Component Props

### Type Safety

Astro supports TypeScript for type-safe props:

```astro
---
interface Props {
  title: string;
  count?: number;  // Optional
  items: string[];
}

const { title, count = 0, items } = Astro.props;
---
```

### Default Values

```astro
---
const { 
  variant = 'primary',
  size = 'medium'
} = Astro.props;
---
```

## Slots

Slots let you pass content into components:

```astro
---
// Button.astro
---
<button class="btn">
  <slot />  <!-- Content goes here -->
</button>
```

### Named Slots

```astro
---
// Card.astro
---
<div class="card">
  <header>
    <slot name="header" />
  </header>
  <div class="content">
    <slot />  <!-- Default slot -->
  </div>
</div>
```

Usage:

```astro
<Card>
  <h3 slot="header">Title</h3>
  <p>Content</p>
</Card>
```

## Scoped Styles

Styles in `.astro` files are automatically scoped:

```astro
<div class="container">
  <h1>Hello</h1>
</div>

<style>
  /* Only applies to this component */
  .container {
    max-width: 800px;
  }
</style>
```

## Next Steps

In [[astro-series-part3|Part 3]], we'll explore content collections and working with Markdown.

## Key Takeaways

- Components are reusable UI building blocks
- Layouts provide consistent page structure
- Props enable component customization
- Slots allow flexible content composition
- Styles are scoped by default
