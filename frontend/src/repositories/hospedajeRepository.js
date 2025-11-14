import httpService from "@/services/httpService.js";

/**
 * Repository para gestionar hospedajes
 */
export class HospedajeRepository {
  /**
   * Buscar hospedajes por ubicación
   */
  static async searchByLocation(location, limit = 10) {
    try {
      console.log(`🔍 HospedajeRepository: Buscando en ${location}...`);

      const response = await httpService.get("/hospedajes/search", {
        params: { ubicacion: location, limit },
      });

      console.log(
        `✅ HospedajeRepository: ${response.data.count} resultados encontrados`
      );
      return {
        success: true,
        hospedajes: response.data.hospedajes,
        count: response.data.count,
      };
    } catch (error) {
      console.error("❌ HospedajeRepository: Error en búsqueda:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error en la búsqueda",
        hospedajes: [],
      };
    }
  }

  /**
   * Obtener hospedajes por categoría
   */
  static async getByCategory(category) {
    try {
      console.log(
        `🏷️ HospedajeRepository: Obteniendo categoría ${category}...`
      );

      const response = await httpService.get(
        `/hospedajes/category/${category}`
      );

      return {
        success: true,
        hospedajes: response.data.hospedajes,
        count: response.data.count,
      };
    } catch (error) {
      console.error(
        "❌ HospedajeRepository: Error obteniendo categoría:",
        error
      );
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener hospedajes",
        hospedajes: [],
      };
    }
  }

  /**
   * Obtener hospedajes destacados (que pagan comisión)
   */
  static async getFeatured(limit = 5) {
    try {
      console.log("⭐ HospedajeRepository: Obteniendo destacados...");

      const response = await httpService.get("/hospedajes/featured", {
        params: { limit },
      });

      return {
        success: true,
        hospedajes: response.data.hospedajes,
        count: response.data.count,
      };
    } catch (error) {
      console.error(
        "❌ HospedajeRepository: Error obteniendo destacados:",
        error
      );
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener destacados",
        hospedajes: [],
      };
    }
  }

  /**
   * Obtener recomendaciones personalizadas
   */
  static async getRecommendations(filters = {}) {
    try {
      console.log("💡 HospedajeRepository: Obteniendo recomendaciones...");

      const response = await httpService.post(
        "/hospedajes/recommendations",
        filters
      );

      return {
        success: true,
        hospedajes: response.data.hospedajes,
        count: response.data.count,
      };
    } catch (error) {
      console.error(
        "❌ HospedajeRepository: Error obteniendo recomendaciones:",
        error
      );
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener recomendaciones",
        hospedajes: [],
      };
    }
  }

  /**
   * Obtener detalles de un hospedaje
   */
  static async getById(id) {
    try {
      console.log(`🏠 HospedajeRepository: Obteniendo hospedaje ${id}...`);

      const response = await httpService.get(`/hospedajes/${id}`);

      return {
        success: true,
        hospedaje: response.data.hospedaje,
      };
    } catch (error) {
      console.error(
        "❌ HospedajeRepository: Error obteniendo hospedaje:",
        error
      );
      return {
        success: false,
        error: error.response?.data?.message || "Hospedaje no encontrado",
        hospedaje: null,
      };
    }
  }

  /**
   * Filtrar hospedajes
   */
  static async filter(filters) {
    try {
      console.log("🔎 HospedajeRepository: Aplicando filtros...");

      const response = await httpService.post("/hospedajes/filter", filters);

      return {
        success: true,
        hospedajes: response.data.hospedajes,
        count: response.data.count,
      };
    } catch (error) {
      console.error("❌ HospedajeRepository: Error filtrando:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al filtrar",
        hospedajes: [],
      };
    }
  }

  /**
   * Obtener ubicaciones disponibles
   */
  static async getLocations() {
    try {
      console.log("📍 HospedajeRepository: Obteniendo ubicaciones...");

      const response = await httpService.get("/hospedajes/locations");

      return {
        success: true,
        locations: response.data.locations,
      };
    } catch (error) {
      console.error(
        "❌ HospedajeRepository: Error obteniendo ubicaciones:",
        error
      );
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener ubicaciones",
        locations: [],
      };
    }
  }
}

export default HospedajeRepository;
