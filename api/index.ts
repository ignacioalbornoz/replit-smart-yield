import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";
import fs from "fs";
import path from "path";

// Crear la app Express una sola vez (se reutiliza entre invocaciones)
let appPromise: Promise<any> | null = null;

// Cachear la ruta del directorio público
let publicPath: string | null = null;

function getPublicPath(): string {
  if (publicPath) return publicPath;
  
  // En Vercel, los archivos están en api/public (copiados durante el build)
  const possiblePaths = [
    path.resolve(process.cwd(), "api", "public"),
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist", "public"),
  ];
  
  publicPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
  console.log(`[Vercel] Public path resolved to: ${publicPath}`);
  return publicPath;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const url = req.url || "/";
  
  // Log para debugging
  console.log(`[Vercel] Request: ${req.method} ${url}`);
  
  // Si es una ruta API, pasar a Express
  if (url.startsWith("/api")) {
    if (!appPromise) {
      appPromise = createApp();
    }
    const app = await appPromise;
    
    return new Promise((resolve, reject) => {
      app(req as any, res as any, (err?: any) => {
        if (err) {
          console.error(`[Vercel] Error handling API request:`, err);
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  }
  
  // Para rutas no-API, servir archivos estáticos directamente
  const publicDir = getPublicPath();
  
  // Verificar si es un archivo estático (CSS, JS, imágenes, etc.)
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map'];
  const isStaticFile = staticExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  if (isStaticFile) {
    // Servir archivo estático
    const filePath = path.resolve(publicDir, url.slice(1)); // Remover el / inicial
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".json": "application/json",
      };
      
      const contentType = contentTypeMap[ext] || "application/octet-stream";
      
      try {
        const fileContent = await fs.promises.readFile(filePath);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.status(200).send(fileContent);
        return;
      } catch (err) {
        console.error(`[Vercel] Error serving static file:`, err);
        res.status(500).send("Internal Server Error");
        return;
      }
    } else {
      console.log(`[Vercel] Static file not found: ${filePath}`);
      res.status(404).send("Not Found");
      return;
    }
  }
  
  // Para todas las demás rutas, servir index.html (SPA routing)
  const indexPath = path.resolve(publicDir, "index.html");
  
  if (!fs.existsSync(indexPath)) {
    console.error(`[Vercel] index.html not found at: ${indexPath}`);
    res.status(404).send("Not Found");
    return;
  }
  
  try {
    const htmlContent = await fs.promises.readFile(indexPath, "utf-8");
    
    // Establecer headers explícitamente usando setHeader antes de send
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    
    // Usar res.send() directamente - esto debería establecer los headers correctamente
    res.status(200).send(htmlContent);
    console.log(`[Vercel] HTML served successfully, length: ${htmlContent.length}`);
  } catch (err) {
    console.error(`[Vercel] Error reading index.html:`, err);
    res.status(500).send("Internal Server Error");
  }
}

