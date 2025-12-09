import "dotenv/config";
import { createServer } from "http";
import { createApp, log } from "./app";
import { setupVite } from "./vite";

(async () => {
  const app = await createApp();
  const httpServer = createServer(app);

  // En desarrollo, configurar Vite
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  ).on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      log(`❌ Error: El puerto ${port} ya está en uso`, "error");
      log(`💡 Soluciones:`, "error");
      log(`   1. Matar el proceso: kill -9 $(lsof -ti:${port})`, "error");
      log(`   2. Usar otro puerto: PORT=3000 npm run dev`, "error");
      process.exit(1);
    } else {
      log(`❌ Error al iniciar el servidor: ${err.message}`, "error");
      throw err;
    }
  });
})();
