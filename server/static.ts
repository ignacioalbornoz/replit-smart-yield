import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // En Vercel, los archivos estáticos están en dist/public
  // En desarrollo local, también están en dist/public después del build
  const distPath = process.env.VERCEL 
    ? path.resolve(process.cwd(), "dist", "public")
    : path.resolve(__dirname, "..", "dist", "public");
    
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
