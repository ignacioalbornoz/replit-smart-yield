import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // En Vercel, los archivos estáticos se sirven directamente por Vercel (no por Express)
  // Solo necesitamos servir index.html para las rutas SPA
  // En desarrollo local, están en dist/public después del build
  let distPath: string;
  
  if (process.env.VERCEL) {
    // En Vercel, los archivos estáticos se sirven directamente por Vercel
    // Solo necesitamos el index.html para las rutas SPA
    // Intentar encontrar el index.html en diferentes ubicaciones posibles
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

  if (process.env.VERCEL) {
    // En Vercel, los archivos estáticos se sirven directamente por Vercel
    // Solo necesitamos servir index.html para las rutas SPA que no sean archivos estáticos
    app.use("*", (_req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Not Found");
      }
    });
  } else {
    // En desarrollo local, servir todos los archivos estáticos
    app.use(express.static(distPath, {
      maxAge: "1y",
      etag: true,
      lastModified: true,
      index: false, // No servir index.html automáticamente para archivos estáticos
    }));

    // fall through to index.html if the file doesn't exist (SPA routing)
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
}
