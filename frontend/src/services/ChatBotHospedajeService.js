/**
 * Servicio para integrar el ChatBot con la búsqueda de hospedajes
 */

import HospedajeRepository from "@/repositories/hospedajeRepository.js";

export class ChatBotHospedajeService {
  /**
   * Buscar hospedajes por ubicación
   */
  static async searchByLocation(location) {
    try {
      console.log(`🔍 ChatBot: Buscando hospedajes en ${location}...`);

      const response = await HospedajeRepository.searchByLocation(location);

      if (response.success) {
        return {
          success: true,
          hospedajes: response.hospedajes,
          count: response.count,
          message: this.formatSearchResults(
            response.hospedajes,
            response.count
          ),
        };
      } else {
        return {
          success: false,
          error: response.error,
          message: `No encontré hospedajes en ${location}. ¿Quieres buscar en otra ubicación?`,
        };
      }
    } catch (error) {
      console.error("❌ ChatBot: Error en búsqueda:", error);
      return {
        success: false,
        error: error.message,
        message: "Hubo un error al buscar. ¿Intentamos de nuevo?",
      };
    }
  }

  /**
   * Obtener recomendaciones personalizadas
   */
  static async getRecommendations(filters = {}) {
    try {
      console.log("⭐ ChatBot: Obteniendo recomendaciones...");

      const response = await HospedajeRepository.getRecommendations(filters);

      if (response.success && response.count > 0) {
        return {
          success: true,
          hospedajes: response.hospedajes,
          count: response.count,
          message: this.formatRecommendations(response.hospedajes),
        };
      } else {
        return {
          success: false,
          message: "No hay recomendaciones disponibles en este momento.",
        };
      }
    } catch (error) {
      console.error("❌ ChatBot: Error obteniendo recomendaciones:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al obtener recomendaciones.",
      };
    }
  }

  /**
   * Buscar por categoría
   */
  static async searchByCategory(category) {
    try {
      console.log(`🏷️ ChatBot: Buscando categoría ${category}...`);

      const response = await HospedajeRepository.getByCategory(category);

      if (response.success) {
        return {
          success: true,
          hospedajes: response.hospedajes,
          count: response.count,
          message: this.formatCategoryResults(
            category,
            response.hospedajes,
            response.count
          ),
        };
      } else {
        return {
          success: false,
          message: `No encontré hospedajes en la categoría ${category}.`,
        };
      }
    } catch (error) {
      console.error("❌ ChatBot: Error en búsqueda por categoría:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al buscar por categoría.",
      };
    }
  }

  /**
   * Obtener detalles de un hospedaje
   */
  static async getHospedajeDetails(id) {
    try {
      console.log(`📋 ChatBot: Obteniendo detalles del hospedaje ${id}...`);

      const response = await HospedajeRepository.getById(id);

      if (response.success) {
        return {
          success: true,
          hospedaje: response.hospedaje,
          message: this.formatHospedajeDetails(response.hospedaje),
        };
      } else {
        return {
          success: false,
          message: "No encontré ese hospedaje.",
        };
      }
    } catch (error) {
      console.error("❌ ChatBot: Error obteniendo detalles:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al obtener detalles.",
      };
    }
  }

  /**
   * Formatear resultados de búsqueda
   */
  static formatSearchResults(hospedajes, count) {
    if (count === 0) {
      return "No encontré hospedajes con esos criterios. ¿Quieres buscar en otra ubicación?";
    }

    let message = `✅ Encontré **${count}** hospedaje${
      count !== 1 ? "s" : ""
    } disponible${count !== 1 ? "s" : ""}:\n\n`;

    hospedajes.slice(0, 5).forEach((h, index) => {
      const destacado = h.destacado ? "💎 " : "";
      message += `${destacado}**${index + 1}. ${h.nombre}**\n`;
      message += `   📍 ${h.ubicacion || "Ubicación no especificada"}\n`;
      message += `   💰 ${this.formatPrice(h.precio)}\n`;
      message += `   ⭐ ${h.rating || "Sin calificación"}\n\n`;
    });

    if (count > 5) {
      message += `\n_...y ${count - 5} opciones más_\n\n`;
    }

    message += "Selecciona un número para ver más detalles.";

    return message;
  }

  /**
   * Formatear recomendaciones
   */
  static formatRecommendations(hospedajes) {
    let message = "⭐ **Recomendaciones para ti**\n\n";
    message += "_Estos hospedajes están seleccionados especialmente:_\n\n";

    hospedajes.forEach((h, index) => {
      const destacado = h.destacado ? "💎 " : "";
      message += `${destacado}**${index + 1}. ${h.nombre}**\n`;
      message += `   📍 ${h.ubicacion}\n`;
      message += `   🏷️ ${this.getCategoryEmoji(h.categoria)} ${h.categoria}\n`;
      message += `   💰 ${this.formatPrice(h.precio)}\n\n`;
    });

    message += "¿Cuál te interesa?";

    return message;
  }

  /**
   * Formatear resultados por categoría
   */
  static formatCategoryResults(category, hospedajes, count) {
    const emoji = this.getCategoryEmoji(category);
    let message = `${emoji} **Hospedajes ${category.toUpperCase()}**\n\n`;
    message += `Encontré ${count} opciones:\n\n`;

    hospedajes.slice(0, 5).forEach((h, index) => {
      message += `**${index + 1}. ${h.nombre}**\n`;
      message += `   📍 ${h.ubicacion}\n`;
      message += `   💰 ${this.formatPrice(h.precio)}\n\n`;
    });

    return message;
  }

  /**
   * Formatear detalles de hospedaje
   */
  static formatHospedajeDetails(hospedaje) {
    let message = `📋 **${hospedaje.nombre}**\n\n`;

    if (hospedaje.destacado) {
      message += "💎 _Hospedaje Destacado_\n\n";
    }

    message += `📍 **Ubicación:** ${hospedaje.ubicacion}\n`;
    message += `🏷️ **Categoría:** ${this.getCategoryEmoji(
      hospedaje.categoria
    )} ${hospedaje.categoria}\n`;
    message += `💰 **Precio:** ${this.formatPrice(hospedaje.precio)}\n`;
    message += `⭐ **Calificación:** ${
      hospedaje.rating || "Sin calificar"
    }\n\n`;

    if (hospedaje.descripcion) {
      message += `📝 **Descripción:**\n${hospedaje.descripcion}\n\n`;
    }

    if (hospedaje.servicios && hospedaje.servicios.length > 0) {
      message += `✨ **Servicios:**\n`;
      hospedaje.servicios.forEach((s) => {
        message += `   • ${s}\n`;
      });
      message += "\n";
    }

    message += "¿Quieres contactar al anfitrión o ver más opciones?";

    return message;
  }

  /**
   * Formatear precio
   */
  static formatPrice(precio) {
    if (!precio) return "Consultar precio";
    return `$${precio.toLocaleString("es-CL")} CLP`;
  }

  /**
   * Obtener emoji de categoría
   */
  static getCategoryEmoji(category) {
    const emojis = {
      vip: "💎",
      premium: "⭐",
      normal: "🏠",
      masajistas: "💆",
    };
    return emojis[category?.toLowerCase()] || "🏠";
  }

  /**
   * Validar ubicación
   */
  static validateLocation(location) {
    if (!location || location.trim().length < 2) {
      return {
        isValid: false,
        message: "Por favor ingresa una ubicación válida (mínimo 2 caracteres)",
      };
    }

    // Verificar que solo contenga letras, espacios y algunos caracteres especiales
    const locationRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-,\.]+$/;
    if (!locationRegex.test(location.trim())) {
      return {
        isValid: false,
        message: "La ubicación solo puede contener letras, espacios y guiones",
      };
    }

    return {
      isValid: true,
      location: location.trim(),
    };
  }

  /**
   * Validar rango de precio
   */
  static validatePriceRange(priceInput) {
    // Puede ser un solo número o un rango (ej: 20000-50000)
    const rangeRegex = /^(\d+)-(\d+)$/;
    const singleRegex = /^(\d+)$/;

    if (rangeRegex.test(priceInput)) {
      const [, min, max] = priceInput.match(rangeRegex);
      return {
        isValid: true,
        min: parseInt(min),
        max: parseInt(max),
      };
    } else if (singleRegex.test(priceInput)) {
      const price = parseInt(priceInput);
      return {
        isValid: true,
        max: price,
        min: 0,
      };
    } else {
      return {
        isValid: false,
        message: "Formato de precio inválido. Usa: 30000 o 20000-50000",
      };
    }
  }
}

export default ChatBotHospedajeService;
