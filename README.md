# Monochrome Edge Astro Blog

> A minimal, elegant technical blog template built with Astro 5 and Monochrome Edge UI.

[🌐 Live Demo](https://1eedaegon.github.io/monochrome-edge-astro)

---

## 🚀 Quick Start

### 1. Use This Template

Click "Use this template" or clone:

```bash
git clone https://github.com/1eedaegon/monochrome-edge-astro.git my-blog
cd my-blog
npm install
npm run dev
```

### 2. Configure

**Deploying from a template copy? Zero config needed.** The deploy workflow
automatically uses your GitHub username for the site name, author, and GitHub
link, and derives `SITE_URL`/`BASE_PATH` from your Pages settings. Just enable
**Settings → Pages → Source: GitHub Actions** and push.

To customize the deployed site, set **repository variables**
(Settings → Secrets and variables → Actions → Variables). All are optional:

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_NAME` / `SITE_TITLE` | repository owner | Site name / browser title |
| `SITE_AUTHOR` | repository owner | Author metadata, footer |
| `SITE_DESCRIPTION` | template default | Meta description |
| `GH_USERNAME` | repository owner | GitHub profile link |
| `TWITTER_USERNAME` / `EMAIL` | — | Social links |
| `DEFAULT_THEME` / `DEFAULT_MODE` | `cold` / `auto` | Initial theme |
| `GA4_ENABLED` + `GA4_MEASUREMENT_ID` | off | Google Analytics |
| `COMMENTS_PROVIDER` + `GISCUS_*` | off | Comments (giscus) |

> Note: template copies start with a fresh git history, so the demo articles'
> auto-generated dates become the day you copied the template. Add a `date:`
> field to frontmatter to pin dates explicitly.

For **local development**, copy `.env.example` and edit:

```bash
cp .env.example .env
```

```env
SITE_NAME=Your Name
SITE_URL=https://yourusername.github.io
BASE_PATH=/your-repo-name   # GitHub Pages project site: "/repo-name", user site: "/"
SITE_AUTHOR=Your Name
GITHUB_USERNAME=yourusername
EMAIL=your@example.com
```

> See [`.env.example`](.env.example) for all available options (comments, search, analytics, monitoring).

### 3. Start Writing

Create `src/content/articles/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "Welcome to my blog"
tags: [hello, blog]
---

# Hello World!

This is my first post. Dates and reading time are auto-generated!

## Internal Links

Link to other posts: [[another-post]]

## External Links

Check out [Astro](https://astro.build)
```

That's it! Everything else is automatic.

---

## ✨ Features

- **Auto Metadata** - Dates from Git, reading time calculated
- **Wiki Links** - Use `[[article-name]]` to link posts
- **Series Support** - Group related posts with navigation
- **Search** - Full-text search (Ctrl+K)
- **Themes** - Warm/Cold themes + Dark mode
- **SEO Ready** - Sitemap, RSS, Open Graph
- **Comments** - Giscus integration (GitHub Discussions)
- **Analytics** - Google Analytics support
- **Code Copy** - One-click copy button for code blocks

---

## 📝 Writing Content

### Basic Post

```markdown
---
title: "Post Title"
tags: [javascript, tutorial]
---

Your content here...
```

### Series Post

```markdown
---
title: "React Hooks - Part 1"
series: "React Hooks Guide"
seriesOrder: 1
tags: [react, hooks]
---

First post in the series...
```

### With Category

```markdown
---
title: "Understanding Closures"
category: "JavaScript"
tags: [javascript, closures]
featured: true
---

Featured post on homepage...
```

### Linking Posts

**Internal links (Related Posts):**
```markdown
Check out my [[react-basics]] post.

With custom text: [[react-basics|this guide]].
```

**External links (References):**
```markdown
Read more at [MDN](https://developer.mozilla.org)

Or just paste: https://astro.build
```

---

## 🎨 Customization

### Change Site Title & Name

**Option 1: `.env` file (recommended)**

```env
SITE_NAME=Your Name
SITE_TITLE=Your Blog Title
SITE_AUTHOR=Your Name
```

**Option 2: `src/config.ts` directly**

```typescript
export const SITE = {
  name: 'Your Name',
  title: 'Your Blog Title',
  author: 'Your Name',
  // ...
};
```

### Change Logo & Favicon

Replace these files in `public/`:
- `public/favicon.svg` - Browser tab icon

**Favicon options:**
- Use `.svg` for scalable vector
- Or use `.png`: `favicon-16x16.png`, `favicon-32x32.png`

### Change Theme

Edit `src/config.ts`:

```typescript
export const SITE = {
  defaultTheme: 'cold',  // 'warm' or 'cold'
  defaultMode: 'dark',   // 'light', 'dark', or 'auto'
};
```

### Edit Navigation

```typescript
export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Code Work', href: '/code' },
];
```

### Edit About/Code Work Pages

Edit markdown files:
- `src/content/pages/about.md`
- `src/content/pages/code-work.md`

---

## 🛠️ Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📁 Project Structure

```
src/
├── content/
│   ├── articles/        # 📝 Write your posts here!
│   └── pages/          # About, Code Work pages
├── config.ts           # Site configuration
└── styles/global.css   # Theme colors
```

---

## 📊 Frontmatter Options

### Minimal

```yaml
---
title: "Post Title"  # Required
---
```

### Full Options

```yaml
---
title: "Post Title"
description: "SEO description"
tags: [tag1, tag2]
category: "Category"
series: "Series Name"
seriesOrder: 1
featured: true
draft: false
lang: ko  # or 'en'
---
```

Dates are auto-generated from Git history!

---

## 🔧 Optional Features

### Google Analytics

Add to `.env`:

```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Analytics will only load in production builds.

### Comments (Giscus)

1. Visit [giscus.app](https://giscus.app)
2. Configure your repository
3. Get the values and add to `.env`:

```env
GISCUS_ENABLED=true
GISCUS_REPO=username/repo
GISCUS_REPO_ID=R_xxxxx
GISCUS_CATEGORY=Announcements
GISCUS_CATEGORY_ID=DIC_xxxxx
```

Comments appear at the bottom of each article.

### Code Copy Button

Automatically enabled! Hover over code blocks to see the copy button.

---

## 🚢 Deploy

### GitHub Pages (Recommended)

1. `.env` 설정 (또는 GitHub Actions 환경변수로 설정):
   ```env
   SITE_URL=https://yourusername.github.io
   BASE_PATH=/your-repo-name
   ```
2. GitHub 레포 → **Settings** → **Pages** → Source를 **GitHub Actions**로 변경
3. `main` 브랜치에 push하면 자동 배포

> `BASE_PATH`와 `SITE_URL`은 워크플로우에서 GitHub Pages 설정을 자동 감지하므로, `.env`에 설정하지 않아도 배포 시 자동으로 적용됩니다. 로컬 개발 시에만 필요에 따라 설정하세요.

### Custom Domain

1. GitHub 레포 → **Settings** → **Pages** → **Custom domain**에 도메인 입력
2. `.env` 업데이트:
   ```env
   SITE_URL=https://yourdomain.com
   BASE_PATH=/
   ```

### Manual

```bash
npm run build
# ./dist/ 폴더를 호스팅에 업로드
```

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+K / Cmd+K** - Search
- **Esc** - Close modals
- **↑ / ↓** - Navigate results

---

## 📄 License

MIT License - Free to use!

---

## 🙏 Credits

- [Astro](https://astro.build)
- [Monochrome Edge UI](https://github.com/1eedaegon/monochrome-edge)

---

**Happy blogging!** Start writing in `src/content/articles/` ✍️
