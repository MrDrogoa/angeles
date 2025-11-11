import { ref, computed } from "vue";

// Estado global de autenticación
const users = ref([]);
const currentUser = ref(null);
const isAuthenticated = computed(() => currentUser.value !== null);

export function useAuthStore() {
  // Registrar nuevo usuario
  const registerUser = async (userData) => {
    try {
      // Validar que el usuario no exista
      const userExists = users.value.some((u) => u.email === userData.email);
      if (userExists) {
        return {
          success: false,
          message: "El correo ya está registrado",
        };
      }

      // TODO: Reemplazar con tu endpoint real del backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password,
          fechaNacimiento: userData.fechaNacimiento,
        }),
      });

      if (response.ok) {
        const newUser = {
          id: Date.now(), // Generar ID temporal
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password, // ⚠️ NUNCA guardar en cliente en producción
          fechaNacimiento: userData.fechaNacimiento,
          createdAt: new Date().toISOString(),
        };

        users.value.push(newUser);

        // Guardar en localStorage como respaldo
        localStorage.setItem("users", JSON.stringify(users.value));

        return {
          success: true,
          message: "¡Registro exitoso! Ahora puedes iniciar sesión.",
          user: newUser,
        };
      } else {
        return {
          success: false,
          message: "Error al registrar. Por favor intenta nuevamente.",
        };
      }
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        message: "Error de conexión. Por favor intenta nuevamente.",
      };
    }
  };

  // Iniciar sesión
  const loginUser = async (email, password) => {
    try {
      // TODO: Reemplazar con tu endpoint real del backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // Buscar usuario en la lista local (mientras no tengas backend)
        const user = users.value.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          currentUser.value = user;

          // Guardar en localStorage para persistencia
          localStorage.setItem("currentUser", JSON.stringify(user));

          return {
            success: true,
            message: "¡Bienvenido! Has iniciado sesión correctamente.",
            user,
          };
        } else {
          return {
            success: false,
            message: "Correo o contraseña incorrectos.",
          };
        }
      } else {
        return {
          success: false,
          message: "Error al iniciar sesión. Por favor intenta nuevamente.",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error de conexión. Por favor intenta nuevamente.",
      };
    }
  };

  // Cerrar sesión
  const logoutUser = () => {
    currentUser.value = null;
    localStorage.removeItem("currentUser");
    return {
      success: true,
      message: "Has cerrado sesión correctamente.",
    };
  };

  // Cargar usuarios desde localStorage al iniciar
  const loadUsersFromStorage = () => {
    const stored = localStorage.getItem("users");
    if (stored) {
      users.value = JSON.parse(stored);
    }

    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      currentUser.value = JSON.parse(storedCurrentUser);
    }
  };

  // Obtener usuario actual
  const getCurrentUser = () => {
    return currentUser.value;
  };

  // Obtener todos los usuarios
  const getAllUsers = () => {
    return users.value;
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
    loadUsersFromStorage,
    getCurrentUser,
    getAllUsers,
    isAuthenticated,
  };
}
