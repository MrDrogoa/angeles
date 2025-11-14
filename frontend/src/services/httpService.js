import axios from "axios";

/**
 * Cliente HTTP configurado con axios
 * Incluye interceptores para manejo de autenticación y errores
 */

const httpService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request - Agregar token de autenticación
httpService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejo de errores
httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró o no es válido (401)
    if (error.response?.status === 401) {
      // Limpiar token y redirigir al login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user_data");

      // Redirigir al login
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default httpService;
