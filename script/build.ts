import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
    target: "node18",
    // Inyectar polyfill para import.meta.url antes del código
    banner: {
      js: `
        // Polyfill para import.meta en CommonJS
        if (typeof globalThis !== 'undefined' && !globalThis.import) {
          const { pathToFileURL } = require('url');
          const { realpathSync } = require('fs');
          const filename = realpathSync(__filename);
          globalThis.import = { meta: { url: pathToFileURL(filename).href } };
        }
      `,
    },
  });

  // Copiar archivos estáticos a api/public para que la función serverless pueda acceder
  // Esto es necesario en Vercel porque las funciones serverless tienen su propio sistema de archivos
  const staticSource = path.resolve("dist/public");
  const staticDest = path.resolve("api/public");
  
  if (existsSync(staticSource)) {
    console.log("copying static files to api/public for Vercel...");
    await rm(staticDest, { recursive: true, force: true });
    await cp(staticSource, staticDest, { recursive: true });
    console.log("static files copied successfully");
  } else {
    console.warn("Warning: dist/public not found, static files may not be available");
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
