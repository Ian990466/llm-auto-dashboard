import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/openclaw": {
        target: "http://localhost:18789",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openclaw/, ""),
      },
    },
  },
});
