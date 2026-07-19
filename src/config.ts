// Environment variables with fallbacks
const getEnv = (key: string, fallback: string) => {
  return import.meta.env[key] || fallback;
};

export const SITE = {
  name: getEnv("SITE_NAME", "Your Name"),
  title: getEnv("SITE_TITLE", "Your Name"),
  description: getEnv(
    "SITE_DESCRIPTION",
    "A minimal, elegant technical blog built with Astro and Monochrome Edge UI",
  ),
  url: getEnv("SITE_URL", "https://yourusername.github.io"),
  author: getEnv("SITE_AUTHOR", "Your Name"),
  locale: "ko-KR",
  defaultTheme: getEnv("DEFAULT_THEME", "cold") as "warm" | "cold",
  defaultMode: getEnv("DEFAULT_MODE", "auto") as "light" | "dark" | "auto",
};

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const NAVIGATION = [
  { name: "Home", href: `${base}/` },
  { name: "About", href: `${base}/about` },
  { name: "Code Work", href: `${base}/code` },
];

// GH_USERNAME is the CI-injectable alias (GitHub Actions reserves the GITHUB_ env prefix)
const githubUsername = getEnv("GH_USERNAME", getEnv("GITHUB_USERNAME", ""));

export const SOCIAL_LINKS = {
  github: githubUsername ? `https://github.com/${githubUsername}` : null,
  twitter: getEnv("TWITTER_USERNAME", "")
    ? `https://twitter.com/${getEnv("TWITTER_USERNAME", "")}`
    : null,
  email: getEnv("EMAIL", "") || null,
};

// New modular integrations system
export const INTEGRATIONS = {
  // Comments System
  comments: {
    provider: getEnv("COMMENTS_PROVIDER", "none") as
      | "none"
      | "giscus"
      | "utterances"
      | "disqus"
      | "cusdis",
    giscus: {
      repo: getEnv("GISCUS_REPO", ""),
      repoId: getEnv("GISCUS_REPO_ID", ""),
      category: getEnv("GISCUS_CATEGORY", ""),
      categoryId: getEnv("GISCUS_CATEGORY_ID", ""),
      mapping: getEnv("GISCUS_MAPPING", "pathname"),
      theme: getEnv("GISCUS_THEME", "preferred_color_scheme"),
      lang: getEnv("GISCUS_LANG", "ko"),
    },
    utterances: {
      repo: getEnv("UTTERANCES_REPO", ""),
      theme: getEnv("UTTERANCES_THEME", "github-light"),
      issueTerm: getEnv("UTTERANCES_ISSUE_TERM", "pathname"),
    },
    disqus: {
      shortname: getEnv("DISQUS_SHORTNAME", ""),
    },
    cusdis: {
      appId: getEnv("CUSDIS_APP_ID", ""),
      host: getEnv("CUSDIS_HOST", "https://cusdis.com"),
    },
  },

  // Search System
  search: {
    provider: getEnv("SEARCH_PROVIDER", "local") as
      | "local"
      | "algolia"
      | "none",
    algolia: {
      appId: getEnv("ALGOLIA_APP_ID", ""),
      apiKey: getEnv("ALGOLIA_API_KEY", ""),
      indexName: getEnv("ALGOLIA_INDEX_NAME", ""),
    },
  },

  // Analytics
  analytics: {
    ga4: {
      enabled: getEnv("GA4_ENABLED", "false") === "true",
      measurementId: getEnv(
        "GA4_MEASUREMENT_ID",
        getEnv("GOOGLE_ANALYTICS_ID", ""),
      ),
    },
    plausible: {
      enabled: getEnv("PLAUSIBLE_ENABLED", "false") === "true",
      domain: getEnv("PLAUSIBLE_DOMAIN", ""),
      src: (() => {
        const src = getEnv("PLAUSIBLE_SRC", "https://plausible.io/js/script.js");
        return src.startsWith("https://") ? src : "https://plausible.io/js/script.js";
      })(),
    },
  },

  // Monitoring
  monitoring: {
    sentry: {
      enabled: getEnv("SENTRY_ENABLED", "false") === "true",
      dsn: getEnv("SENTRY_DSN", ""),
      environment: getEnv("SENTRY_ENVIRONMENT", "production"),
      tracesSampleRate: parseFloat(getEnv("SENTRY_TRACES_SAMPLE_RATE", "1.0")),
    },
  },
};
