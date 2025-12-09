export default (ctx) => {
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
    // Asegurar que la opción 'from' se pase correctamente
    ...(ctx?.from && { from: ctx.from }),
  };
}
