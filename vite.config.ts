import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/v1/wallet/',
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["api.winedge.io","test2.269technology.com"],
  },
  plugins: [
    react(),
    wasm(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  // Build target modern JS to allow top-level await in wasm loaders
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
