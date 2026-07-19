import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'playwright-report/',
      'test-results/',
      'public/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // (window as any) global contracts are a tracked cleanup
      // (IMPROVEMENTS.md: env.d.ts Window interface) — allow until then
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // placeholder integration: define:vars are intentionally unused until
    // the Algolia client is implemented
    files: ['**/AlgoliaSearch.astro', '**/AlgoliaSearch.astro/*'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
);
