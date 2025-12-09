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
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}

