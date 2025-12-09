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
  // Obtener la URL sin query string para el routing
  const urlPath = req.url?.split('?')[0] || "/";
  const fullUrl = req.url || "/";
  
  // Log para debugging
  console.log(`[Vercel] Request: ${req.method} ${fullUrl} (path: ${urlPath})`);
  
  // Si es una ruta API, pasar a Express
  if (urlPath.startsWith("/api")) {
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
  const isStaticFile = staticExtensions.some(ext => urlPath.toLowerCase().endsWith(ext));
  
  if (isStaticFile) {
    // Servir archivo estático - remover el / inicial y normalizar el path
    const relativePath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
    const filePath = path.resolve(publicDir, relativePath);
    
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
        // Usar writeHead para establecer headers antes de enviar contenido
        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        });
        res.end(fileContent);
        return;
      } catch (err) {
        console.error(`[Vercel] Error serving static file:`, err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
    } else {
      console.log(`[Vercel] Static file not found: ${filePath}`);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }
  }
  
  // Para todas las demás rutas, servir index.html (SPA routing)
  const indexPath = path.resolve(publicDir, "index.html");
  
  if (!fs.existsSync(indexPath)) {
    console.error(`[Vercel] index.html not found at: ${indexPath}`);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }
  
  try {
    // Verificar que los headers no se hayan enviado ya
    if (res.headersSent) {
      console.error(`[Vercel] WARNING: Headers already sent before serving HTML!`);
      return;
    }
    
    const htmlContent = await fs.promises.readFile(indexPath, "utf-8");
    
    // CRÍTICO: Establecer headers usando writeHead ANTES de enviar cualquier contenido
    // Esto es absolutamente necesario para que Vercel sirva el HTML correctamente
    // Si no se hace así, el navegador intentará descargar el archivo
    // Usar writeHead con todos los headers necesarios en un solo llamado
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": Buffer.byteLength(htmlContent, "utf-8").toString(),
    });
    
    // Usar res.end() para enviar el contenido después de establecer los headers
    res.end(htmlContent, "utf-8");
    console.log(`[Vercel] HTML served successfully, length: ${htmlContent.length}, Content-Type: text/html`);
  } catch (err) {
    console.error(`[Vercel] Error reading index.html:`, err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }
}

