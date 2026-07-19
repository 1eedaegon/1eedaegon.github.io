import type { APIRoute } from 'astro';

// Generated at build time so the sitemap URL always reflects SITE_URL/BASE_PATH.
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const body = [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${basePath}/admin/`,
    '',
    `Sitemap: ${sitemapUrl.href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
