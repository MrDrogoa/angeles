// Configuración de la API del backend
export const API_URL = "https://sexyangeles.cl";

// URL base para desarrollo local (cuando el backend esté en localhost)
export const API_URL_DEV = "http://localhost:3000";

// Usar la URL según el entorno (automático con Vite)
export const getApiUrl = () => {
  return import.meta.env.PROD ? API_URL : API_URL_DEV;
};
