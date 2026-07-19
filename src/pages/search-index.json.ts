import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { generateSearchIndex } from '../utils/search';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => {
    // Exclude drafts in production
    return import.meta.env.PROD ? !data.draft : true;
  });

  const searchData = generateSearchIndex(articles, import.meta.env.BASE_URL);

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
