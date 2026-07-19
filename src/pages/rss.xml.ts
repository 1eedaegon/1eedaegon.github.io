import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { articleSourcePath, resolvePostDates } from '../utils/git-dates';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('articles', ({ data }) => !data.draft);

  // Resolve dates for all posts
  const postsWithDates = await Promise.all(
    allPosts.map(async (post) => {
      const filePath = articleSourcePath(post);
      const dateInfo = await resolvePostDates(filePath, post.data);
      return { ...post, dateInfo };
    })
  );

  // Sort by date
  const sortedPosts = postsWithDates.sort(
    (a, b) => b.dateInfo.date.getTime() - a.dateInfo.date.getTime()
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site?.toString() || SITE.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description || '',
      link: `${import.meta.env.BASE_URL}articles/${post.id.replace('.md', '')}`,
      pubDate: post.dateInfo.date,
      categories: post.data.tags,
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
