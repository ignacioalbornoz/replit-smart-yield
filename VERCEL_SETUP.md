# Configuración en Vercel

Este proyecto está configurado para funcionar en Vercel como una aplicación full-stack con Express.

## Configuración en el Dashboard de Vercel

### 1. Framework Preset
- Selecciona **Vite** como Framework Preset

### 2. Build Command
- **Build Command**: `npm run build`
- Activa el toggle "Override" si quieres personalizarlo

### 3. Output Directory
- **Output Directory**: `dist/public`
- Este es el directorio donde se compilan los archivos estáticos del cliente

### 4. Install Command
- **Install Command**: `npm install` (por defecto)
- No necesitas cambiar esto

### 5. Development Command
- **Development Command**: `npm run dev` (por defecto)
- No necesitas cambiar esto

## Variables de Entorno

En la sección "Environment Variables" de Vercel, configura:

- `NODE_ENV`: `production`
- `PORT`: (Vercel lo maneja automáticamente, no necesitas configurarlo)

Si usas almacenamiento JSON (por defecto), no necesitas configurar `DATABASE_URL`.

## Estructura del Proyecto

- `api/index.ts` - Función serverless que maneja todas las requests (API y frontend)
- `server/` - Código del servidor Express
- `client/` - Código del cliente React
- `dist/public/` - Archivos estáticos compilados (se genera con `npm run build`)

## Cómo Funciona

1. Vercel ejecuta `npm run build` que:
   - Compila el cliente React con Vite → `dist/public/`
   - Compila el servidor Express → `dist/index.cjs`

2. Todas las requests (tanto `/api/*` como rutas del frontend) se redirigen a `api/index.ts`

3. La función `api/index.ts` inicializa la app Express y maneja todas las requests

## Despliegue

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente el `vercel.json`
3. El build se ejecutará automáticamente
4. Tu aplicación estará disponible en la URL de Vercel

## Notas

- El archivo `data.json` se creará automáticamente en el sistema de archivos de Vercel
- En Vercel, cada función serverless tiene su propio sistema de archivos efímero
- Si necesitas persistencia de datos, considera usar una base de datos externa o Vercel KV

