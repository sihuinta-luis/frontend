// Configuración para diferentes entornos
const config = {
  // URL de la API
  apiUrl: import.meta.env.VITE_API || "/api",

  // Modo de desarrollo (true = usar datos simulados, false = usar API real)
  useMockData: true,

  // Tiempo de caducidad de los datos en caché (en milisegundos)
  cacheTTL: 5 * 60 * 1000, // 5 minutos
};

export default config;
