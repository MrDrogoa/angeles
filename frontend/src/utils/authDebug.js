/**
 * Utilidades de depuración para autenticación
 */

/**
 * Depurar estado de autenticación
 * Muestra en consola el estado actual de tokens y datos de usuario
 */
export function debugAuth() {
  console.group("🔍 Estado de Autenticación");

  // Verificar localStorage
  const accessToken = localStorage.getItem("accessToken");
  const sessionId = localStorage.getItem("sessionId");
  const userData = localStorage.getItem("user_data");

  console.log("📦 LocalStorage:");
  console.log(
    "  - accessToken:",
    accessToken ? "✓ Presente" : "✗ No encontrado"
  );
  console.log("  - sessionId:", sessionId ? "✓ Presente" : "✗ No encontrado");
  console.log("  - user_data:", userData ? "✓ Presente" : "✗ No encontrado");

  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      console.log(
        "  - Usuario:",
        parsed.email || parsed.nombre || "Sin identificar"
      );
    } catch (error) {
      console.warn("  - Error al parsear user_data");
    }
  }

  // Verificar cookies
  console.log("\n🍪 Cookies:");
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const authCookies = cookies.filter(
    (c) =>
      c.toLowerCase().includes("token") ||
      c.toLowerCase().includes("auth") ||
      c.toLowerCase().includes("session")
  );

  if (authCookies.length > 0) {
    authCookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      console.log(`  - ${name}: ✓`);
    });
  } else {
    console.log("  - No hay cookies de autenticación");
  }

  // Estado general
  console.log("\n📊 Estado:");
  console.log(
    "  - Autenticado:",
    !!(accessToken || sessionId) ? "✓ Sí" : "✗ No"
  );

  console.groupEnd();
}

/**
 * Migrar tokens de autenticación
 * Útil para migrar de un sistema antiguo a uno nuevo
 */
export function migrateAuthTokens() {
  console.log("🔄 Iniciando migración de tokens...");

  // Verificar si hay tokens en formato antiguo
  const oldToken = localStorage.getItem("token");
  const oldAuth = localStorage.getItem("auth");

  if (oldToken && !localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", oldToken);
    console.log("✓ Token migrado a accessToken");
  }

  if (oldAuth) {
    try {
      const authData = JSON.parse(oldAuth);
      if (authData.token && !localStorage.getItem("accessToken")) {
        localStorage.setItem("accessToken", authData.token);
        console.log("✓ Token extraído de auth y guardado como accessToken");
      }
      if (authData.user && !localStorage.getItem("user_data")) {
        localStorage.setItem("user_data", JSON.stringify(authData.user));
        console.log("✓ Datos de usuario migrados");
      }
    } catch (error) {
      console.warn("⚠️ Error al migrar datos de auth:", error);
    }
  }

  console.log("✓ Migración completada");
}

/**
 * Limpiar datos de depuración
 */
export function clearAuthDebug() {
  console.log("🧹 Limpiando datos de autenticación...");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("sessionId");
  localStorage.removeItem("user_data");
  localStorage.removeItem("token");
  localStorage.removeItem("auth");

  // Limpiar cookies
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  console.log("✓ Datos limpiados");
}

/**
 * Verificar validez del token
 * @param {string} token - Token a verificar
 * @returns {boolean} - true si el token parece válido
 */
export function isTokenValid(token) {
  if (!token) return false;

  // Verificar si es un JWT válido (formato básico)
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Intentar decodificar el payload
    const payload = JSON.parse(atob(parts[1]));

    // Verificar si el token ha expirado
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.warn("⚠️ Token expirado");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.warn("⚠️ Error al validar token:", error);
    return false;
  }
}

/**
 * Obtener información del token sin verificar firma
 * ADVERTENCIA: No usar para validación de seguridad
 * @param {string} token - Token JWT
 * @returns {Object|null} - Payload del token o null si es inválido
 */
export function decodeToken(token) {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.warn("⚠️ Error al decodificar token:", error);
    return null;
  }
}

// Exportar funciones como objeto por defecto también
export default {
  debugAuth,
  migrateAuthTokens,
  clearAuthDebug,
  isTokenValid,
  decodeToken,
};
