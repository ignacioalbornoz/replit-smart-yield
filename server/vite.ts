import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

// Obtener __dirname de forma compatible con ESM y CommonJS
// Este archivo solo se usa en desarrollo, pero esbuild lo incluye en el bundle
// Usar process.cwd() como base, que funciona en ambos contextos
// Nota: En desarrollo real, esto funciona porque estamos en la raíz del proyecto
const __dirname = process.cwd();

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Middleware de Vite debe ejecutarse primero para manejar archivos estáticos y HMR
  // Agregar logging para ver qué está manejando Vite
  app.use((req, res, next) => {
    if (req.path.includes('.css') || req.path.includes('@vite') || req.path.includes('/src/')) {
      console.log(`[Vite] Request: ${req.method} ${req.path}`);
    }
    next();
  });
  
  app.use(vite.middlewares);

  // Solo manejar rutas HTML (SPA routing), dejar que vite.middlewares maneje los archivos estáticos
  app.use("*", async (req, res, next) => {
    // Si es una ruta API, dejar que el siguiente middleware la maneje
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Si la respuesta ya fue enviada por vite.middlewares, no hacer nada
    if (res.headersSent) {
      return;
    }
    
    // Verificar si es una solicitud de archivo estático
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map'];
    const isStaticFile = staticExtensions.some(ext => req.path.toLowerCase().endsWith(ext));
    
    if (isStaticFile) {
      // Si es un archivo estático y llegamos aquí, vite.middlewares no lo encontró
      // Esto no debería pasar en desarrollo, pero por si acaso dejamos que el siguiente middleware lo maneje
      console.warn(`[Vite] Static file not handled by vite.middlewares: ${req.path}`);
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Vite transformIndexHtml debe transformar el HTML e inyectar los módulos CSS y JS
      // En desarrollo, Vite inyecta automáticamente el CSS cuando detecta imports en los módulos JS
      // NO modificar el template antes de transformarlo - Vite necesita el template original
      const page = await vite.transformIndexHtml(url, template);
      
      // Log para debugging
      console.log(`[Vite] Transforming HTML for: ${url}`);
      console.log(`[Vite] HTML includes script: ${page.includes('/src/main.tsx') || page.includes('type="module"')}`);
      console.log(`[Vite] HTML includes style tags: ${page.includes('<style') || page.includes('link rel="stylesheet"')}`);
      console.log(`[Vite] HTML includes vite client: ${page.includes('@vite/client')}`);
      
      // Verificar que el HTML transformado tiene el cliente de Vite
      // El cliente de Vite es necesario para que el CSS se inyecte dinámicamente
      if (!page.includes('@vite/client')) {
        console.warn('[Vite] WARNING: HTML does not include @vite/client - CSS may not load!');
      }
      
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
