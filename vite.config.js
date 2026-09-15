import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // we ship our own public/manifest.json (RTL metadata)
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
