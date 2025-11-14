/**
 * Servicio de sincronización de sesión entre pestañas
 * Utiliza BroadcastChannel API para comunicación entre pestañas
 */

class SessionSyncService {
  constructor() {
    // Canal de comunicación entre pestañas
    this.channel = null;
    this.listeners = {
      login: [],
      logout: [],
    };

    // Inicializar canal si está disponible
    if (typeof BroadcastChannel !== "undefined") {
      this.initChannel();
    } else {
      console.warn("BroadcastChannel no está disponible en este navegador");
    }
  }

  /**
   * Inicializar el canal de comunicación
   */
  initChannel() {
    try {
      this.channel = new BroadcastChannel("auth_sync");

      // Escuchar mensajes del canal
      this.channel.onmessage = (event) => {
        const { type, data } = event.data;

        switch (type) {
          case "LOGIN":
            this.triggerLoginListeners(data);
            break;
          case "LOGOUT":
            this.triggerLogoutListeners();
            break;
          default:
            console.warn("Tipo de mensaje desconocido:", type);
        }
      };

      console.log("✓ Canal de sincronización inicializado");
    } catch (error) {
      console.error("Error al inicializar canal de sincronización:", error);
    }
  }

  /**
   * Registrar listener para eventos de login
   * @param {Function} callback - Función a ejecutar cuando se detecte login
   */
  onLogin(callback) {
    if (typeof callback === "function") {
      this.listeners.login.push(callback);
    }
  }

  /**
   * Registrar listener para eventos de logout
   * @param {Function} callback - Función a ejecutar cuando se detecte logout
   */
  onLogout(callback) {
    if (typeof callback === "function") {
      this.listeners.logout.push(callback);
    }
  }

  /**
   * Notificar a otras pestañas sobre login
   * @param {Object} userData - Datos del usuario que inició sesión
   */
  notifyLogin(userData) {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: "LOGIN",
          data: userData,
          timestamp: Date.now(),
        });
        console.log("📡 Login notificado a otras pestañas");
      } catch (error) {
        console.error("Error al notificar login:", error);
      }
    }
  }

  /**
   * Notificar a otras pestañas sobre logout
   */
  notifyLogout() {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: "LOGOUT",
          timestamp: Date.now(),
        });
        console.log("📡 Logout notificado a otras pestañas");
      } catch (error) {
        console.error("Error al notificar logout:", error);
      }
    }
  }

  /**
   * Ejecutar todos los listeners de login
   * @param {Object} userData - Datos del usuario
   */
  triggerLoginListeners(userData) {
    this.listeners.login.forEach((callback) => {
      try {
        callback(userData);
      } catch (error) {
        console.error("Error al ejecutar listener de login:", error);
      }
    });
  }

  /**
   * Ejecutar todos los listeners de logout
   */
  triggerLogoutListeners() {
    this.listeners.logout.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error al ejecutar listener de logout:", error);
      }
    });
  }

  /**
   * Cerrar el canal de comunicación
   */
  close() {
    if (this.channel) {
      this.channel.close();
      console.log("✓ Canal de sincronización cerrado");
    }
  }

  /**
   * Limpiar todos los listeners
   */
  clearListeners() {
    this.listeners.login = [];
    this.listeners.logout = [];
  }
}

// Exportar instancia única (singleton)
export default new SessionSyncService();
