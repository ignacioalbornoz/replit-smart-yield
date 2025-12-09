import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

// Crear la app Express una sola vez (se reutiliza entre invocaciones)
let appPromise: Promise<any> | null = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Inicializar la app solo la primera vez
  if (!appPromise) {
    appPromise = createApp();
  }
  
  const app = await appPromise;

  // Pasar la request a Express usando el patrón de Vercel
  // Express manejará tanto las rutas API como los archivos estáticos
  return new Promise((resolve, reject) => {
    // Asegurar que los headers se establezcan correctamente
    // Vercel puede tener problemas si los headers no se establecen antes de escribir el body
    const originalEnd = res.end.bind(res);
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      // Si no hay Content-Type establecido, establecerlo como text/html para rutas no-API
      if (!res.getHeader("Content-Type") && !req.url?.startsWith("/api")) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
      }
      return originalEnd(chunk, encoding, cb);
    };
    
    app(req as any, res as any, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}

