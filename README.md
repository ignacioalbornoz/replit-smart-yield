# replit-smart-yield

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

**Nota:** El proyecto usa almacenamiento en archivo JSON por defecto, así que **no necesitas PostgreSQL** para ejecutarlo. Los datos se guardan en `data.json` en la raíz del proyecto.

## Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno (opcional):**
   
   Crea un archivo `.env` en la raíz del proyecto si quieres cambiar el puerto:
   ```env
   PORT=5000
   ```
   
   Por defecto el servidor corre en el puerto 5000.

## Ejecutar el Proyecto

### Modo Desarrollo

Para ejecutar el servidor en modo desarrollo (con hot-reload):
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000` (o el puerto que hayas configurado en `PORT`).

Los datos se guardan automáticamente en `data.json` en la raíz del proyecto.

### Modo Producción

1. **Compilar el proyecto:**
   ```bash
   npm run build
   ```

2. **Ejecutar el servidor:**
   ```bash
   npm start
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm start` - Ejecuta el servidor en modo producción
- `npm run db:push` - Ejecuta las migraciones de base de datos (solo si usas PostgreSQL)
- `npm run check` - Verifica los tipos de TypeScript

## Almacenamiento de Datos

Por defecto, el proyecto usa **almacenamiento en archivo JSON** (`data.json`). Los datos se persisten automáticamente entre reinicios del servidor.

Si prefieres usar PostgreSQL en lugar de archivo JSON:
1. Configura `DATABASE_URL` en tu archivo `.env`
2. Ejecuta `npm run db:push` para crear las tablas
3. Modifica `server/storage.ts` para usar una implementación basada en PostgreSQL

## Estructura del Proyecto

- `client/` - Aplicación React frontend
- `server/` - Servidor Express backend
- `shared/` - Esquemas y tipos compartidos
- `script/` - Scripts de construcción
- `data.json` - Archivo de datos (se crea automáticamente)