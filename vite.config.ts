import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  resolve: {
    alias: {
      $lib: './src/lib',
    },
  },

  fmt: {
    singleQuote: true,
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    // Svelte module script exports (e.g. buttonVariants from button.svelte) are
    // not resolved by oxlint-tsgolint, so we ignore the generated barrel files.
    ignorePatterns: ['src/lib/components/ui/button/index.ts'],
  },
  plugins: [tailwindcss(), sveltekit()],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', headless: true }],
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
        },
      },

      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
});
