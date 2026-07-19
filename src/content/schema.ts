import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const absolutePath = z.string().regex(/^\/(?!\/).+/, 'Must be an absolute site path');
const url = z.url();
const urlOrAbsolutePath = z.union([url, absolutePath]);
const optionalUrl = url.optional();

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    lang: z.enum(['ko', 'en']).default('ko'),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    author: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    ogImage: urlOrAbsolutePath.optional(),
    canonical: optionalUrl,
    relatedPosts: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const profileSections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/profile-sections' }),
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('education'),
      order: z.number().default(0),
      institution: z.string(),
      degree: z.string(),
      period: z.string(),
      description: z.string().optional(),
      focus: z.string().optional(),
    }),
    z.object({
      type: z.literal('experience'),
      order: z.number().default(0),
      company: z.string(),
      position: z.string(),
      period: z.string(),
      description: z.string(),
      technologies: z.array(z.string()).default([]),
      achievements: z.array(z.string()).default([]),
    }),
    z.object({
      type: z.literal('contribution'),
      order: z.number().default(0),
      project: z.string(),
      role: z.string(),
      period: z.string(),
      description: z.string(),
      link: url,
      technologies: z.array(z.string()).default([]),
    }),
    z.object({
      type: z.literal('research'),
      order: z.number().default(0),
      title: z.string(),
      organization: z.string(),
      period: z.string(),
      description: z.string(),
      links: z.array(z.object({
        label: z.string(),
        url,
      })).default([]),
    }),
    z.object({
      type: z.literal('vitae'),
      order: z.number().default(0),
      title: z.string(),
      description: z.string().optional(),
      url: urlOrAbsolutePath,
    }),
    z.object({
      type: z.literal('repo'),
      order: z.number().default(0),
      name: z.string(),
      description: z.string(),
      status: z.enum(['active', 'archived', 'maintenance']).default('active'),
      tags: z.array(z.string()).default([]),
      links: z.object({
        github: optionalUrl,
        demo: optionalUrl,
        docs: optionalUrl,
      }).optional(),
    }),
    z.object({
      type: z.literal('service'),
      order: z.number().default(0),
      name: z.string(),
      description: z.string(),
      status: z.enum(['active', 'beta', 'development']).default('active'),
      tags: z.array(z.string()).default([]),
      link: url,
    }),
    z.object({
      type: z.literal('model'),
      order: z.number().default(0),
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      link: url,
      platform: z.string().default('Hugging Face'),
    }),
    z.object({
      type: z.literal('chain'),
      order: z.number().default(0),
      name: z.string(),
      chain: z.string(),
      address: z.string(),
      explorer: url,
      description: z.string().optional(),
    }),
  ]),
});

export const collections = {
  articles,
  pages,
  'profile-sections': profileSections,
};
