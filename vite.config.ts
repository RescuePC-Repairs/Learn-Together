import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfig = {
    plugins: [sveltekit()],
    base: process.env.NODE_ENV === 'production' ? '/Learn-Together/' : '/',
    server: {
      port: 3000,
      strictPort: true,
      host: true
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: true
    }
  };
  
  return config;
});
