import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authRepository from "../repositories/authRepository.js";
import { debugAuth, migrateAuthTokens } from "../utils/authDebug.js";
import sessionSyncService from "../services/SessionSyncService.js";

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const user = ref(null);

  const isLoading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role || "guest");
  const isAdmin = computed(() => userRole.value === "admin");
  const isOwner = computed(() => userRole.value === "owner");
  const userFullName = computed(() => {
    if (!user.value) return "";
    return `${user.value.nombre || ""} ${user.value.apellido || ""}`.trim();
  });

  // Configurar sincronización entre pestañas
  sessionSyncService.onLogin((userData) => {
    console.log("🔄 Login detectado en otra pestaña, sincronizando...");
    user.value = userData;
  });

  sessionSyncService.onLogout(() => {
    console.log(
      "🔄 Logout detectado en otra pestaña, limpiando sesión local..."
    );
    user.value = null;

    // Redirigir al login si no estamos ya allí
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/login";
    }
  });

  // Actions
  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const setError = (errorMessage) => {
    error.value = errorMessage;
  };

  const clearError = () => {
    error.value = null;
  };

  const setUser = (userData) => {
    user.value = userData;
    console.log("✅ Usuario establecido en store:", userData?.email);

    // Persistir datos del usuario en localStorage (para sincronización entre pestañas)
    if (userData && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            id: userData.id,
            email: userData.email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            role: userData.role,
            timestamp: Date.now(),
          })
        );
        console.log("💾 Datos de usuario persistidos en localStorage");
      } catch (error) {
        console.warn("⚠️ Error al persistir datos de usuario:", error);
      }

      // Notificar a otras pestañas sobre el login
      sessionSyncService.notifyLogin(userData);
    }
  };

  const clearUser = () => {
    user.value = null;

    // Limpiar localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user_data");

      // Limpiar también sessionStorage
      sessionStorage.clear();

      // Limpiar cookies manualmente (las httpOnly se limpian en el backend)
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }

      console.log("🧹 Storage y cookies limpiados");
    }

    console.log("🚪 Usuario eliminado del store");
  };

  // Verificar si hay cookies de autenticación o datos persistidos
  const hasAuthCookies = () => {
    // En el navegador, verificar si hay cookies que puedan indicar autenticación
    if (typeof document !== "undefined") {
      const cookies = document.cookie;
      const hasAuthCookies =
        cookies.includes("ACCESS_TOKEN") ||
        cookies.includes("REFRESH_TOKEN") ||
        cookies.includes("accessToken") ||
        cookies.includes("refreshToken") ||
        cookies.includes("session") ||
        cookies.includes("auth");

      // También verificar localStorage como respaldo
      const hasStorageTokens =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("sessionId");

      // Verificar si hay datos de usuario persistidos
      const hasPersistedUser = localStorage.getItem("user_data");

      const hasAuth =
        hasAuthCookies || !!hasStorageTokens || !!hasPersistedUser;
      console.log(`🍪 Cookies detectadas: ${hasAuthCookies ? "Sí" : "No"}`);
      console.log(
        `💾 Tokens en localStorage: ${hasStorageTokens ? "Sí" : "No"}`
      );
      console.log(`👤 Usuario persistido: ${hasPersistedUser ? "Sí" : "No"}`);
      console.log(`🔐 Autenticación disponible: ${hasAuth ? "Sí" : "No"}`);

      return hasAuth;
    }
    return false;
  };

  // Login
  const login = async (credentials) => {
    try {
      setLoading(true);
      clearError();

      console.log("🔐 Iniciando login...");
      const response = await authRepository.login(credentials);

      if (response.user) {
        setUser(response.user);
        console.log("✅ Login exitoso:", response.user.email);

        // Verificar persistencia después del login
        setTimeout(() => {
          console.log("🔍 Verificando persistencia post-login...");
          debugAuth();
        }, 1000);

        return { success: true, user: response.user };
      } else {
        throw new Error("No se recibieron datos del usuario");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Error en el login";
      setError(errorMessage);
      console.error("❌ Error en login:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      clearError();

      console.log("📝 Iniciando registro...");
      const response = await authRepository.register(userData);

      if (response.user) {
        setUser(response.user);
        console.log("✅ Registro exitoso:", response.user.email);
        return { success: true, user: response.user };
      } else {
        console.log("✅ Registro exitoso, verificar email");
        return { success: true, requiresVerification: true };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Error en el registro";
      setError(errorMessage);
      console.error("❌ Error en registro:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      console.log("🚪 Iniciando logout...");

      // Notificar a otras pestañas ANTES de limpiar
      sessionSyncService.notifyLogout();

      // Intentar logout en el backend
      try {
        await authRepository.logout();
      } catch (err) {
        console.warn(
          "⚠️ Error al hacer logout en backend (continuando de todos modos):",
          err.message
        );
      }

      // Limpiar estado local
      clearUser();
      clearError();

      console.log("✅ Logout exitoso");
      return { success: true };
    } catch (err) {
      console.error("❌ Error en logout:", err);
      // Aún así limpiamos el usuario local
      clearUser();
      sessionSyncService.notifyLogout();
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Variable para evitar múltiples llamadas simultáneas
  let checkAuthPromise = null;

  // Verificar usuario actual
  const checkAuth = async () => {
    try {
      // Si ya está inicializado, no hacer nada
      if (isInitialized.value) {
        return;
      }

      // Si ya hay una verificación en curso, esperar a que termine
      if (checkAuthPromise) {
        return await checkAuthPromise;
      }

      // Crear la promesa de verificación
      checkAuthPromise = (async () => {
        setLoading(true);
        console.log("🔍 Verificando autenticación existente...");

        // Migrar tokens si existen en sessionStorage
        migrateAuthTokens();

        // Debug de estado actual
        debugAuth();

        // Intentar cargar usuario desde localStorage (para recargas rápidas)
        const persistedUserData = localStorage.getItem("user_data");
        if (persistedUserData) {
          try {
            const userData = JSON.parse(persistedUserData);
            const age = Date.now() - (userData.timestamp || 0);

            // Si los datos tienen menos de 1 hora, usarlos temporalmente
            if (age < 3600000) {
              // 1 hora en ms
              user.value = userData;
              console.log(
                "💾 Usuario restaurado desde localStorage (temporal):",
                userData.email
              );
            } else {
              console.log(
                "⏰ Datos de usuario en localStorage expirados, limpiando..."
              );
              localStorage.removeItem("user_data");
            }
          } catch (error) {
            console.warn(
              "⚠️ Error al parsear datos de usuario desde localStorage:",
              error
            );
            localStorage.removeItem("user_data");
          }
        }

        // Verificar si hay cookies antes de hacer la petición
        if (!hasAuthCookies()) {
          console.log(
            "👤 No hay cookies de sesión ni tokens - usuario no autenticado"
          );
          clearUser();
          return;
        }

        try {
          const response = await authRepository.getCurrentUser();

          if (response.user) {
            setUser(response.user);
            console.log("✅ Sesión restaurada para:", response.user.email);
          } else {
            console.log("👤 Usuario no autenticado");
            clearUser();
          }
        } catch (err) {
          console.log("❌ Error verificando sesión:", err.message);

          // Si recibimos un 401, significa que los tokens son inválidos
          if (err.response?.status === 401) {
            console.log(
              "🗑️ Tokens inválidos detectados (401), limpiando localStorage"
            );
            clearUser(); // Esto limpiará localStorage también
            return;
          }

          // Si tenemos tokens en localStorage pero la verificación falló por otro motivo,
          // podría ser un problema temporal de red
          const hasStorageTokens = localStorage.getItem("accessToken");
          if (hasStorageTokens && !err.response) {
            console.log(
              "⚠️ Hay tokens almacenados pero falló la verificación por red - manteniendo estado temporalmente"
            );
            // No limpiar el usuario inmediatamente si ya está cargado desde localStorage
            if (!user.value) {
              clearUser();
            }
          } else {
            console.log(
              "👤 No hay sesión activa - iniciando sin autenticación"
            );
            clearUser();
          }
        }
      })();

      await checkAuthPromise;
    } finally {
      setLoading(false);
      isInitialized.value = true;
      checkAuthPromise = null; // Resetear la promesa
    }
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      clearError();

      console.log("✏️ Actualizando perfil...");
      const response = await authRepository.updateProfile(profileData);

      if (response.user) {
        setUser(response.user);
        // Notificar a otras pestañas sobre la actualización
        sessionSyncService.notifyUserUpdate(response.user);
        console.log("✅ Perfil actualizado");
        return { success: true, user: response.user };
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Error actualizando perfil";
      setError(errorMessage);
      console.error("❌ Error actualizando perfil:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      clearError();

      console.log("🔒 Cambiando contraseña...");
      await authRepository.changePassword(passwordData);

      console.log("✅ Contraseña cambiada exitosamente");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Error cambiando contraseña";
      setError(errorMessage);
      console.error("❌ Error cambiando contraseña:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    user,
    isLoading,
    error,
    isInitialized,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isOwner,
    userFullName,

    // Actions
    setLoading,
    setError,
    clearError,
    setUser,
    clearUser,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
  };
});
