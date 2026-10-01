import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sampleImages() {
  const samplesDir = path.resolve(__dirname, "public/samples");
  const extensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
  const files = fs.existsSync(samplesDir)
    ? fs.readdirSync(samplesDir).filter((file) => extensions.has(path.extname(file).toLowerCase()))
    : [];
  const imageData = files
    .map((file) => ({
      src: `/samples/${encodeURIComponent(file)}`,
      name: file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      isBack: /^back\./i.test(file),
      file,
    }))
    .sort((a, b) => Number(a.isBack) - Number(b.isBack) || a.file.localeCompare(b.file));

  return imageData.map(({ file: _file, ...image }) => image);
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  define: {
    __SAMPLE_IMAGES__: JSON.stringify(sampleImages()),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
