// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import { legacyRedirects } from "./redirects.mjs";

const site = "https://www.acgl.fr";

export default defineConfig({
  site,
  trailingSlash: "never",
  adapter: vercel(),
  redirects: legacyRedirects,
  integrations: [
    react(),
    keystatic(),
    sitemap({
      lastmod: new Date(),
      filter: (page) =>
        !page.includes("/keystatic") && !page.includes("/api/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
