import type { APIRoute } from 'astro';
import { SITE, SOCIAL_LINKS } from '../../config';

/**
 * Sveltia CMS config, generated at build time so the GitHub repo, branch, and
 * base path never need hand-editing. Repo coordinates are derived from the
 * deploy environment:
 *  - owner: GH_USERNAME (injected by deploy.yml, defaults to repository owner)
 *  - repo:  BASE_PATH segment for project sites, `<owner>.github.io` for user sites
 *
 * Field definitions mirror src/content/schema.ts — keep the two in sync when
 * adding frontmatter fields. date/updated are intentionally optional: when
 * omitted, publish/update dates come from git history (src/utils/git-dates.ts).
 */
export const GET: APIRoute = () => {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const owner =
    SOCIAL_LINKS.github?.split('/').pop() || new URL(SITE.url).hostname.split('.')[0];
  const repo = basePath ? basePath.replace(/^\//, '') : `${owner}.github.io`;

  const config = `
backend:
  name: github
  repo: ${owner}/${repo}
  branch: main
  automatic_deployments: true

site_url: ${SITE.url}${basePath}
display_url: ${SITE.url}${basePath}
media_folder: public/images
public_folder: ${basePath}/images

slug:
  encoding: unicode
  clean_accents: true

collections:
  - name: articles
    label: Articles
    label_singular: Article
    folder: src/content/articles
    extension: md
    format: yaml-frontmatter
    create: true
    slug: "{{slug}}"
    preview_path: "articles/{{slug}}/"
    summary: "{{title}}{{fields.draft | ternary(' [draft]','')}}"
    sortable_fields: [title]
    fields:
      - { name: title, label: Title, widget: string }
      - { name: description, label: Description, widget: text, required: false, hint: "Search snippet / og:description. One or two sentences." }
      - { name: lang, label: Language, widget: select, options: [ko, en], default: ko }
      - { name: tags, label: Tags, widget: list, required: false, default: [] }
      - { name: category, label: Category, widget: string, required: false }
      - { name: series, label: Series, widget: string, required: false }
      - { name: seriesOrder, label: Series Order, widget: number, required: false, value_type: int }
      - { name: draft, label: Draft, widget: boolean, default: true, hint: "Draft posts build as unlisted noindex previews. Turn off to publish." }
      - { name: featured, label: Featured, widget: boolean, required: false, default: false }
      - { name: date, label: "Date (leave empty: derived from git history)", widget: datetime, required: false }
      - { name: updated, label: "Updated (leave empty: derived from git history)", widget: datetime, required: false }
      - { name: author, label: Author, widget: string, required: false }
      - { name: ogImage, label: "OG Image (URL or /absolute/path)", widget: string, required: false, pattern: ["^(https?://|/).+", "Must be a URL or an absolute /path"] }
      - { name: canonical, label: Canonical URL, widget: string, required: false, pattern: ["^https?://.+", "Must be a full URL"] }
      - { name: relatedPosts, label: Related Post Slugs, widget: list, required: false, default: [] }
      - { name: body, label: Body, widget: markdown }

  - name: pages
    label: Pages
    folder: src/content/pages
    extension: md
    format: yaml-frontmatter
    create: false
    fields:
      - { name: title, label: Title, widget: string }
      - { name: description, label: Description, widget: text, required: false }
      - { name: body, label: Body, widget: markdown }
`.trimStart();

  return new Response(config, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
