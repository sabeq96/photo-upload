import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dotenv from "dotenv";

const config = dotenv.config();
const env = config.parsed as {
  VITE_SERVER_URL: string;
  VITE_POCKETBASE_URL: string;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: env.VITE_SERVER_URL,
        changeOrigin: true,
      },
      "/db": {
        target: env.VITE_POCKETBASE_URL,
        rewrite: (path) => path.replace(/^\/db/, ""),
        changeOrigin: true,
      },
    },
  },
});
