import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === "analyze"
      ? [
          visualizer({
            brotliSize: true,
            filename: "dist/bundle-analysis.html",
            gzipSize: true,
            open: false,
            template: "treemap",
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: true,
  },
}));
