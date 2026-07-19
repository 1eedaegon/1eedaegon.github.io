---
title: "Git-Based Date Management"
description: "How this blog automatically manages post dates using Git history"
tags: [git, automation, blog]
---

# Git-Based Date Management

One of the unique features of this blog is automatic date management using Git history. You don't need to manually specify creation or update dates!

## How It Works

### Date Resolution Priority

1. **Frontmatter** - If you explicitly set a `date` field, it takes precedence
2. **Git History** - The first commit timestamp for the file
3. **Filesystem** - File creation timestamp (fallback)
4. **Current Time** - Last resort

### Update Detection

The blog automatically detects when a post has been substantively updated:

```typescript
// Checks for real content changes
function hasSubstantiveChanges(file) {
  // Ignores:
  // - Typo fixes
  // - Formatting changes
  // - Comment updates
  
  // Considers substantive:
  // - 5+ lines changed
  // - New code blocks
  // - New sections
}
```

## Benefits

### Zero Configuration

Just write your post and commit:

```bash
# Create new post
echo "---
title: My Post
tags: [hello]
---

Content here" > my-post.md

# Commit
git add my-post.md
git commit -m "Add new post"

# Date is automatically set!
```

### Accurate History

Git provides an accurate, tamper-proof history of when content was created and modified.

### No Manual Updates

When you make significant changes, the `updated` field is automatically set.

## Overriding Dates

You can still manually set dates if needed:

```yaml
---
title: "My Post"
date: 2025-12-25  # Future post!
updated: 2025-12-26
---
```

## Implementation

The magic happens in `src/utils/git-dates.ts`:

```typescript
export async function resolvePostDates(
  filePath: string,
  frontmatter: { date?: Date; updated?: Date }
): Promise<DateInfo> {
  // Check frontmatter first
  if (frontmatter.date) {
    return { date: frontmatter.date, source: 'frontmatter' };
  }
  
  // Try Git
  const gitDate = execSync(`git log --format=%aI "${filePath}"`);
  
  // Fallback to filesystem
  // ...
}
```

## Conclusion

Git-based date management makes blogging effortless. Write content, commit, and let the system handle the metadata!
