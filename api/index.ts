import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

// Crear la app Express una sola vez (se reutiliza entre invocaciones)
let appPromise: Promise<any> | null = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Log para debugging
  console.log(`[Vercel] Request: ${req.method} ${req.url}`);
  console.log(`[Vercel] Headers sent: ${res.headersSent}`);
  
  // Inicializar la app solo la primera vez
  if (!appPromise) {
    appPromise = createApp();
  }
  
  const app = await appPromise;

  // Interceptar la respuesta ANTES de que Express la maneje
  // Esto es crítico para asegurar que los headers se establezcan correctamente
  const originalWriteHead = res.writeHead.bind(res);
  const originalSetHeader = res.setHeader.bind(res);
  const originalEnd = res.end.bind(res);
  const originalSend = (res as any).send?.bind(res);
  
  // Interceptar writeHead para asegurar Content-Type
  res.writeHead = function(statusCode: number, statusMessage?: any, headers?: any) {
    if (typeof statusMessage === 'object' && !headers) {
      headers = statusMessage;
      statusMessage = undefined;
    }
    if (!headers) headers = {};
    
    // Si es una ruta no-API y no hay Content-Type, establecerlo como text/html
    if (!req.url?.startsWith("/api") && !headers["Content-Type"] && !res.getHeader("Content-Type")) {
      headers["Content-Type"] = "text/html; charset=utf-8";
      console.log(`[Vercel] Setting Content-Type in writeHead: text/html`);
    }
    
    console.log(`[Vercel] writeHead called with status: ${statusCode}, Content-Type:`, headers["Content-Type"] || res.getHeader("Content-Type"));
    return originalWriteHead(statusCode, statusMessage as any, headers);
  };
  
  // Interceptar end para asegurar Content-Type antes de enviar
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    // Si no hay Content-Type establecido y no es una ruta API, establecerlo
    if (!res.getHeader("Content-Type") && !req.url?.startsWith("/api")) {
      console.log(`[Vercel] Setting Content-Type in end() for: ${req.url}`);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
    }
    console.log(`[Vercel] end() called, Content-Type:`, res.getHeader("Content-Type"));
    return originalEnd(chunk, encoding, cb);
  };

  // Pasar la request a Express usando el patrón de Vercel
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err?: any) => {
      if (err) {
        console.error(`[Vercel] Error handling request:`, err);
        reject(err);
      } else {
        console.log(`[Vercel] Request handled successfully`);
        resolve(undefined);
      }
    });
  });
}

