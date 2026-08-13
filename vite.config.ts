/** Quiet Current: preserve the editorial public site while the Express server provides data and file APIs. */
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

export default defineConfig({
  root: path.resolve(import.meta.dirname, "client"),
  plugins: [react(), vitePluginManusRuntime()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    emptyOutDir: true,
  },
});
