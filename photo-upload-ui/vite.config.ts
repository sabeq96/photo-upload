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
  plugins: [react(), tailwindcss()],
});
