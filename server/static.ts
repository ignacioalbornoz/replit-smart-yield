import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // En Vercel, los archivos estáticos están en dist/public relativo al proyecto
  // En desarrollo local, también están en dist/public después del build
  // Usar __dirname para encontrar la ruta correcta desde el código compilado
  const distPath = process.env.VERCEL 
    ? path.resolve(process.cwd(), "dist", "public")
    : path.resolve(__dirname, "..", "dist", "public");
    
  // Log para debugging en Vercel (se puede eliminar después)
  if (process.env.VERCEL) {
    console.log(`[Vercel] Serving static files from: ${distPath}`);
    console.log(`[Vercel] Directory exists: ${fs.existsSync(distPath)}`);
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log(`[Vercel] Files in dist/public:`, files.slice(0, 10));
    }
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
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
