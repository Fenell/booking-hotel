import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// https://vite.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@components": path.resolve(__dirname, "src/components"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@apis": path.resolve(__dirname, "src/apis"),
      "@feature": path.resolve(__dirname, "src/feature"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
});
