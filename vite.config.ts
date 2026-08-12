/** Quiet Current: Vite root intentionally targets the handoff-friendly client directory. */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "./client",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
