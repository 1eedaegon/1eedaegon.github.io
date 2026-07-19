export interface TocItem {
  depth: number;
  text: string;
  slug: string;
  children: TocItem[];
}

export interface MarkdownHeading {
  depth: number;
  text: string;
  slug: string;
}

/**
 * Generate hierarchical TOC from flat headings
 */
export function generateTOC(
  headings: MarkdownHeading[],
  maxDepth = 3,
): TocItem[] {
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const heading of headings) {
    if (heading.depth > maxDepth) continue;

    const item: TocItem = {
      depth: heading.depth,
      text: heading.text,
      slug: heading.slug,
      children: [],
    };

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }

    stack.push(item);
  }

  return toc;
}

/**
 * Flatten TOC for simple list rendering
 */
export function flattenTOC(toc: TocItem[]): MarkdownHeading[] {
  const result: MarkdownHeading[] = [];

  function traverse(items: TocItem[]) {
    for (const item of items) {
      result.push({
        depth: item.depth,
        text: item.text,
        slug: item.slug,
      });
      if (item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(toc);
  return result;
}

/**
 * Generate slug from heading text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
