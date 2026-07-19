import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent } from 'hast';
import { LANG_ICONS, LANG_NAMES } from './code-lang-icons';

/**
 * Build-time code block chrome: wraps each fenced code block in
 * .code-block-wrapper and adds
 *  - a faint language watermark (logo + name) inside the top-left of the box
 *  - an always-visible ghost copy button inside the top-right
 * Rendering server-side means no client-side DOM construction; the only JS
 * left is the copy click handler (src/scripts/copy-code.ts, event-delegated).
 */

function svg(props: Record<string, unknown>, children: ElementContent[]): Element {
  return {
    type: 'element',
    tagName: 'svg',
    properties: { xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true', ...props },
    children,
  };
}

function langWatermark(lang: string): Element | null {
  const icon = LANG_ICONS[lang];
  const name = LANG_NAMES[lang] || (lang ? lang.toUpperCase() : '');
  if (!name) return null;

  const children: ElementContent[] = [];
  if (icon) {
    children.push(
      svg({ class: 'code-watermark-icon', viewBox: '0 0 24 24', fill: 'currentColor' }, [
        { type: 'element', tagName: 'path', properties: { d: icon.path }, children: [] },
      ]),
    );
  }
  children.push({
    type: 'element',
    tagName: 'span',
    properties: { class: 'code-watermark-name' },
    children: [{ type: 'text', value: name }],
  });

  return {
    type: 'element',
    tagName: 'div',
    properties: { class: 'code-watermark' },
    children,
  };
}

function copyButton(): Element {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
  };
  return {
    type: 'element',
    tagName: 'button',
    properties: { type: 'button', class: 'copy-button', 'aria-label': 'Copy code' },
    children: [
      svg({ ...stroke, class: 'copy-icon' }, [
        {
          type: 'element',
          tagName: 'rect',
          properties: { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' },
          children: [],
        },
        {
          type: 'element',
          tagName: 'path',
          properties: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' },
          children: [],
        },
      ]),
      svg({ ...stroke, class: 'check-icon' }, [
        {
          type: 'element',
          tagName: 'polyline',
          properties: { points: '20 6 9 17 4 12' },
          children: [],
        },
      ]),
    ],
  };
}

function extractLang(pre: Element): string {
  const dataLang = pre.properties?.dataLanguage;
  if (typeof dataLang === 'string' && dataLang) return dataLang.toLowerCase();

  const code = pre.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code',
  );
  const classNames = ([] as unknown[]).concat(
    code?.properties?.className ?? [],
    pre.properties?.className ?? [],
  );
  for (const cls of classNames) {
    const match = /^language-(.+)$/.exec(String(cls));
    if (match) return match[1].toLowerCase();
  }
  return '';
}

export function rehypeCodeBlocks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || typeof index !== 'number') return;

      const parentClasses = ([] as unknown[]).concat(
        (parent as Element).properties?.className ?? [],
      );
      if (parentClasses.includes('code-block-wrapper')) return; // already wrapped

      const lang = extractLang(node);
      const children: ElementContent[] = [node];
      const watermark = langWatermark(lang);
      if (watermark) children.push(watermark);
      children.push(copyButton());

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: { class: 'code-block-wrapper' },
        children,
      };
      parent.children[index] = wrapper;
    });
  };
}
