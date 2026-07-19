export const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getBasePath = (baseUrl: string) => trimTrailingSlash(baseUrl);

export const slugifySegment = (value: string) =>
  encodeURIComponent(
    value.toLowerCase().trim().replace(/\s+/g, '-').replace(/\//g, '-'),
  );

export const articleIdToSlug = (id: string) =>
  id.replace(/\.md$/, '').split('/').map(encodeURIComponent).join('/');

export const articlePath = (basePath: string, id: string) =>
  `${getBasePath(basePath)}/articles/${articleIdToSlug(id)}`;

export const articlesPath = (basePath: string) =>
  `${getBasePath(basePath)}/articles`;

export const categoryPath = (basePath: string, category: string) =>
  `${getBasePath(basePath)}/categories/${slugifySegment(category)}`;

export const seriesPath = (basePath: string, series: string) =>
  `${getBasePath(basePath)}/series/${slugifySegment(series)}`;

export const tagFilterPath = (basePath: string, tag: string) =>
  `${articlesPath(basePath)}?tag=${encodeURIComponent(tag)}`;

export const sameOriginPath = (
  url: string,
  origin: string,
  basePath: string,
): string | null => {
  try {
    const parsedUrl = new URL(url, origin);
    const normalizedBasePath = getBasePath(basePath);

    if (parsedUrl.origin !== origin) {
      return null;
    }

    const isInBasePath =
      !normalizedBasePath ||
      parsedUrl.pathname === normalizedBasePath ||
      parsedUrl.pathname.startsWith(`${normalizedBasePath}/`);

    if (!isInBasePath) {
      return null;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch (_error) {
    return null;
  }
};
