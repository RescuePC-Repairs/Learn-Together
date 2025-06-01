import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Enable TypeScript support
  preprocess: [
    vitePreprocess({
      // This enables TypeScript in Svelte components
      script: {
        // This adds TypeScript type checking to Svelte components
        compilerOptions: {
          // Enable strict type checking
          strict: true,
          // Enable type checking in Svelte templates
          svelte: {
            compilerOptions: {
              // Enable TypeScript in Svelte templates
              generate: 'dom',
              // Enable type checking in Svelte templates
              dev: true,
              // Enable TypeScript in Svelte templates
              css: true,
              // Enable TypeScript in Svelte templates
              immutable: true,
              // Enable TypeScript in Svelte templates
              hydratable: true,
              // Enable TypeScript in Svelte templates
              legacy: false,
              // Enable TypeScript in Svelte templates
              customElement: false,
              // Enable TypeScript in Svelte templates
              tag: null,
              // Enable TypeScript in Svelte templates
              cssHash: ({ hash, css, name, filename }) =>
                `${name}-${hash(css)}`,
              // Enable TypeScript in Svelte templates
              loopGuardTimeout: 1000,
              // Enable TypeScript in Svelte templates
              preserveComments: false,
              // Enable TypeScript in Svelte templates
              preserveWhitespace: false,
              // Enable TypeScript in Svelte templates
              sourcemap: true,
            },
          },
        },
      },
    }),
  ],

  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    }),
    
    // Add environment variables to the client
    env: {
      dir: './', // Look for .env files in the project root
      publicPrefix: 'PUBLIC_', // Only expose variables prefixed with PUBLIC_ to the client
    },
    
    // Configure aliases
    alias: {
      $lib: './src/lib',
      $components: './src/lib/components',
      $stores: './src/lib/stores',
      $types: './src/types',
    },
    
    // For GitHub Pages
    paths: {
      base: process.argv.includes('dev') ? '' : '/Learn-Together',
    },
    appDir: 'internal', // This helps prevent routing issues with GitHub Pages
    // Add trailing slash for GitHub Pages
    trailingSlash: 'always',
    // Prerender all pages by default
    prerender: {
      default: true
    },
    // Handle SPA fallback
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false
    })
  },
  
  // Enable source maps for better debugging
  sourcemap: true,
  
  // Enable TypeScript in Svelte components
  extensions: ['.svelte', '.ts'],
};

export default config;
