import { visit, EXIT } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin that removes the first <h1> from rendered markdown.
 * The article layout always renders the title as its own <h1>, so leaving the
 * markdown H1 in the DOM produces duplicate <h1> elements (previously hidden
 * with display:none, which screen readers and crawlers still ignore poorly).
 * The heading text is still available via `render(post).headings` because
 * Astro collects headings before rehype output is finalized.
 */
export function rehypeStripH1() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'h1' && parent && typeof index === 'number') {
        parent.children.splice(index, 1);
        return EXIT;
      }
    });
  };
}
