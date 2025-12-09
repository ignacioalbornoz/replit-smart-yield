import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // En Vercel, los archivos estáticos están en api/public (copiados durante el build)
  // En desarrollo local, están en dist/public después del build
  let distPath: string;
  
  if (process.env.VERCEL) {
    // En Vercel, los archivos están en api/public (relativo a la función serverless)
    const possiblePaths = [
      path.resolve(__dirname, "..", "api", "public"),
      path.resolve(process.cwd(), "api", "public"),
      path.resolve(process.cwd(), "dist", "public"),
      path.resolve(__dirname, "..", "dist", "public"),
    ];
    
    distPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
  } else {
    // En desarrollo local
    distPath = path.resolve(__dirname, "..", "dist", "public");
  }
    
  // Log para debugging
  console.log(`[Static] Serving static files from: ${distPath}`);
  console.log(`[Static] Directory exists: ${fs.existsSync(distPath)}`);
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`[Static] Files found:`, files.slice(0, 10));
  }
  
  if (!fs.existsSync(distPath)) {
    console.error(`[ERROR] Could not find the build directory: ${distPath}`);
    console.error(`[ERROR] Current working directory: ${process.cwd()}`);
    console.error(`[ERROR] __dirname: ${__dirname}`);
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Servir archivos estáticos (CSS, JS, imágenes, etc.) con maxAge para cache
  // IMPORTANTE: Servir desde la raíz para que /assets/... funcione correctamente
  app.use(express.static(distPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    index: false, // No servir index.html automáticamente para archivos estáticos
  }));

  // fall through to index.html if the file doesn't exist (SPA routing)
  // Esto debe ir DESPUÉS de express.static para que los archivos estáticos se sirvan primero
  app.get("*", async (req, res, next) => {
    // Si es una ruta API, dejar que el siguiente middleware la maneje
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    // Verificar si el archivo solicitado existe en el directorio estático
    // Si existe, express.static ya lo debería haber servido, pero verificamos por si acaso
    const requestedFile = path.resolve(distPath, req.path.slice(1)); // Remover el / inicial
    const isFileRequest = req.path.includes(".") && !req.path.endsWith("/");
    
    if (isFileRequest && fs.existsSync(requestedFile)) {
      // El archivo existe pero express.static no lo sirvió, intentar servirlo manualmente
      const ext = path.extname(requestedFile).toLowerCase();
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
        const fileContent = await fs.promises.readFile(requestedFile);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.send(fileContent);
        return;
      } catch (err) {
        console.error(`[Static] Error serving file ${req.path}:`, err);
        return next();
      }
    }
    
    // Si no es un archivo o el archivo no existe, servir index.html (SPA routing)
    const indexPath = path.resolve(distPath, "index.html");
    
    if (!fs.existsSync(indexPath)) {
      console.error(`[Static] index.html not found at: ${indexPath}`);
      return res.status(404).send("Not Found");
    }
    
    try {
      // Leer el archivo y enviarlo con el Content-Type correcto
      const htmlContent = await fs.promises.readFile(indexPath, "utf-8");
      
      // Establecer headers ANTES de enviar la respuesta
      // Esto es crítico para Vercel - los headers deben establecerse antes de escribir el body
      res.status(200);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("X-Content-Type-Options", "nosniff");
      
      // Usar res.end() en lugar de res.send() para mayor control
      res.end(htmlContent);
    } catch (err) {
      console.error(`[Static] Error reading index.html:`, err);
      if (!res.headersSent) {
        res.status(500).setHeader("Content-Type", "text/plain").end("Internal Server Error");
      }
    }
  });
}
