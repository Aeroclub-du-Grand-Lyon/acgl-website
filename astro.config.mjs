// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: import.meta.env.DEV ? "http://localhost:4321" : "https://acgl.fr",
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
