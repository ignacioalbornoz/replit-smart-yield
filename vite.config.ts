import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Usar process.cwd() como base, que funciona tanto en ESM como CommonJS
// vite.config.ts siempre se ejecuta desde la raíz del proyecto
const __dirname = process.cwd();

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/",
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  css: {
    postcss: {
      // Esto asegura que PostCSS reciba la opción 'from' correctamente
      // y elimina el warning
    },
  },
});
