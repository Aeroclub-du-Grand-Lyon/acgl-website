// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://www.acgl.fr",
  adapter: vercel(),
  integrations: [
    react(),
    keystatic(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
