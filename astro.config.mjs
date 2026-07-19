// @ts-check
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeNoTranslate } from "./src/utils/rehype-notranslate";
import { rehypeStripH1 } from "./src/utils/rehype-strip-h1";

// Draft articles build as unlisted preview pages but must stay out of the sitemap.
const ARTICLES_DIR = "./src/content/articles";
const draftSlugs = fs
  .readdirSync(ARTICLES_DIR)
  .filter((file) => file.endsWith(".md"))
  .filter((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    return matter(raw).data.draft === true;
  })
  .map((file) => file.replace(/\.md$/, ""));

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  base: process.env.BASE_PATH ? process.env.BASE_PATH.replace(/\/$/, "") + "/" : "/",
  integrations: [
    sitemap({
      filter: (page) => !draftSlugs.some((slug) => page.includes(`/articles/${slug}/`)),
    }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["heading-link"],
            },
          },
        ],
        rehypeNoTranslate,
        rehypeStripH1,
      ],
    }),
  },
  vite: {
    optimizeDeps: {
      exclude: ["@monochrome-edge/ui"],
    },
  },
});
