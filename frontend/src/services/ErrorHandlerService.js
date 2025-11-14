/**
 * Error Handler Service
 * Servicio para manejo centralizado de errores
 */

class ErrorHandler {
  handleError(error, context = "") {
    console.error(`[Error Handler] ${context}:`, error);

    // Extraer mensaje de error
    let message = "Ha ocurrido un error inesperado";

    if (error.response) {
      // Error de respuesta HTTP
      message = error.response.data?.message || error.response.statusText;
    } else if (error.message) {
      // Error de JavaScript
      message = error.message;
    }

    return {
      success: false,
      error: message,
      details: error,
    };
  }

  handleValidationError(field, message) {
    return {
      success: false,
      field,
      error: message,
      type: "validation",
    };
  }

  handleNetworkError() {
    return {
      success: false,
      error: "Error de conexión. Verifica tu internet.",
      type: "network",
    };
  }

  handleAuthError() {
    return {
      success: false,
      error: "Necesitas iniciar sesión para continuar.",
      type: "auth",
    };
  }

  formatErrorMessage(error) {
    if (typeof error === "string") {
      return error;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.message) {
      return error.message;
    }

    return "Error desconocido";
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;
