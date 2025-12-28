import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
<<<<<<< HEAD

export default defineConfig({
  plugins: [react()],
  base: "/",
=======
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
>>>>>>> e8994b90eed9f49548e5019cf2418a10b6887a49
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
=======
>>>>>>> e8994b90eed9f49548e5019cf2418a10b6887a49
});
