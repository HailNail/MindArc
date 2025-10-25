import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss(), svgr()],
  base: "/",
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
