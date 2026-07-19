import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin to automatically add translate="no" attribute to code blocks
 * This prevents Google Translate from translating code snippets while allowing
 * regular text to be translated.
 */
export function rehypeNoTranslate() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Add translate="no" to all <pre> and <code> elements
      if (node.tagName === 'pre' || node.tagName === 'code') {
        node.properties = node.properties || {};
        node.properties.translate = 'no';
      }
    });
  };
}
