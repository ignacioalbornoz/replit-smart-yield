import { defineConfig } from "drizzle-kit";

// Solo requerir DATABASE_URL si realmente se va a usar PostgreSQL
// Si no está configurado, el proyecto usará almacenamiento en archivo JSON
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL no está configurado. El proyecto usará almacenamiento en archivo JSON.");
  console.warn("   Si quieres usar PostgreSQL, configura DATABASE_URL en tu archivo .env");
  // No lanzar error, solo advertir
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/dummy",
  },
});
