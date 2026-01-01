import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [mdx()],
  vite: {
    optimizeDeps: {
      exclude: ['@supabase/supabase-js'],
    },
    // Define env variables for client-side access (server-side can use process.env)
    envPrefix: 'PUBLIC_',
  },
});
