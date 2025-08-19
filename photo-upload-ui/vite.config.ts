import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/spa",
  build: {
    outDir: "../directus/extensions/spa-dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/directus": {
        target: "http://localhost:8055",
        rewrite: (path) => path.replace(/^\/directus/, ""),
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
