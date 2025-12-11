// Configuración de la API del backend
export const API_URL = "https://easyventas.cl";

// URL base para desarrollo local (cuando el backend esté en localhost)
export const API_URL_DEV = "http://localhost:3000";

// Por ahora usamos local para pruebas
export const API_URL_CURRENT = "http://localhost:3000";

// Usar la URL según el entorno
export const getApiUrl = () => {
  return import.meta.env.PROD ? API_URL : API_URL_DEV;
};
