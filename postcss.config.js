export default (ctx) => {
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
    // Asegurar que la opción 'from' se pase correctamente
    // Vite debería pasar esto automáticamente, pero lo incluimos por si acaso
    from: ctx?.from || ctx?.file?.path || undefined,
  };
}
