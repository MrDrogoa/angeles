import httpService from "@/services/httpService.js";

/**
 * Repository para manejar autenticación y gestión de usuarios
 */
class AuthRepository {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} - Respuesta con el usuario creado
   */
  async register(userData) {
    try {
      const response = await httpService.post("/auth/register", userData);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrar usuario",
      };
    }
  }

  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales de acceso (email, password)
   * @returns {Promise<Object>} - Respuesta con el usuario y token
   */
  async login(credentials) {
    try {
      const response = await httpService.post("/auth/login", credentials);

      // Guardar token en localStorage
      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
      }

      if (response.data.sessionId) {
        localStorage.setItem("sessionId", response.data.sessionId);
      }

      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  async logout() {
    try {
      await httpService.post("/auth/logout");

      // Limpiar almacenamiento local
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user_data");

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      // Limpiar de todos modos
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user_data");

      return {
        success: false,
        error: error.response?.data?.message || "Error al cerrar sesión",
      };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {Boolean} - true si está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  /**
   * Obtener el usuario actual
   * @returns {Promise<Object>} - Usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await httpService.get("/auth/me");
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al obtener usuario",
      };
    }
  }

  /**
   * Actualizar perfil de usuario
   * @param {Object} userData - Datos del usuario a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  async updateProfile(userData) {
    try {
      const response = await httpService.put("/auth/profile", userData);
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al actualizar perfil",
      };
    }
  }

  /**
   * Cambiar contraseña
   * @param {Object} passwordData - Contraseña actual y nueva
   * @returns {Promise<Object>} - Confirmación del cambio
   */
  async changePassword(passwordData) {
    try {
      const response = await httpService.post(
        "/auth/change-password",
        passwordData
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al cambiar contraseña",
      };
    }
  }

  /**
   * Solicitar recuperación de contraseña
   * @param {String} email - Email del usuario
   * @returns {Promise<Object>} - Confirmación del envío
   */
  async requestPasswordReset(email) {
    try {
      const response = await httpService.post("/auth/forgot-password", {
        email,
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error al solicitar recuperación de contraseña:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al solicitar recuperación",
      };
    }
  }

  /**
   * Restablecer contraseña con token
   * @param {String} token - Token de recuperación
   * @param {String} newPassword - Nueva contraseña
   * @returns {Promise<Object>} - Confirmación del restablecimiento
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await httpService.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al restablecer contraseña",
      };
    }
  }

  /**
   * Verificar email con token
   * @param {String} token - Token de verificación
   * @returns {Promise<Object>} - Confirmación de verificación
   */
  async verifyEmail(token) {
    try {
      const response = await httpService.post("/auth/verify-email", { token });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error al verificar email:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al verificar email",
      };
    }
  }
}

export default new AuthRepository();
