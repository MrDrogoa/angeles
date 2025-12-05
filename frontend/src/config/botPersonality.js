/**
 * Configuración de personalidad de AYDA
 * Asistente para búsqueda de acompañantes - Angeles y Demonios
 */

export const botPersonality = {
  // Identidad
  name: "AYDA",
  fullName: "Angeles y Demonios Asistente",
  meaning: "Tu guía confiable para encontrar tu encuentro perfecto",
  avatar: "@/assets/ayda-transparente.webp",
  emoji: "💋",

  // Saludos personalizados por hora
  greetings: {
    morning: (userName) =>
      `¡Buenos días, ${userName}! 🌅\n\nSoy AYDA, estoy aquí para ayudarte a encontrar perfiles que se ajusten a lo que buscas.`,

    afternoon: (userName) =>
      `¡Buenas tardes, ${userName}! ☀️\n\nSoy AYDA, ¿necesitas ayuda para encontrar el perfil perfecto?`,

    evening: (userName) =>
      `¡Buenas noches, ${userName}! 🌙\n\nSoy AYDA, ¿te ayudo a buscar acompañantes?`,

    default: (userName) =>
      `¡Hola, ${userName}! 👋\n\nSoy AYDA 💋, estoy aquí para ayudarte a encontrar perfiles que se ajusten a lo que buscas.`,

    anonymous: () =>
      `¡Hola! 👋\n\nSoy AYDA 💋, tu Asistente Inteligente.\n\nPuedo ayudarte a buscar las mejores opciones sin necesidad de iniciar sesión, pero para contactarte necesitarás una cuenta.`,
  },

  // Frases comunes
  phrases: {
    introduction: "Tu asistente personal para encontrar acompañantes",
    help: "¿Qué tipo de perfil buscas?",
    confirmation: "¿Confirmas esta selección?",
    confirmAction: "¿Deseas ver más detalles de este perfil?",
    error: "No encontré ese perfil. ¿Intentamos con otra búsqueda?",
    errorGeneral: "Algo salió mal. ¿Probamos de nuevo?",
    success: "¡Perfecto! Aquí están tus resultados",
    successAction: "¡Listo! Perfil encontrado",
    thinking: "Buscando en nuestra base de datos...",
    typing: "Escribiendo...",
    validating: "Verificando disponibilidad...",
    searching: "Buscando perfiles en la ubicación...",
    goodbye: "Hasta pronto. Estoy aquí cuando necesites 👋",
    thanks: "¡Gracias por usar AYDA! 💋",
    welcome: "Te doy la bienvenida",
    pleaseWait: "Un momento, buscando opciones...",
    almostDone: "¡Ya casi! Preparando tus recomendaciones",
    needHelp: "¿Necesitas ayuda con otra búsqueda?",
  },

  // Preguntas del flujo de búsqueda
  questions: {
    // Búsqueda de perfiles
    region: "¿En qué región buscas? (Norte, Centro, Sur)",
    city: "¿En qué ciudad específicamente?",
    category: "¿Qué categoría prefieres?",
    priceRange: "¿Cuál es tu presupuesto aproximado?",
    confirmSearch: "¿Esta búsqueda es correcta?",
    showMore: "¿Quieres ver más opciones?",
    needDetails: "¿Quieres ver los detalles de algún perfil?",
  },

  // Mensajes de búsqueda
  searchMessages: {
    howToSearch: "📍 ¿Cómo quieres buscar?",
    searchAgain:
      "✨ Perfecto, hagamos otra búsqueda. ¿Qué ubicación te interesa?",
    searching: "📍 Buscando perfiles disponibles...",
    noResults: "❌ No encontré perfiles en esa ubicación.",
    foundResults: (count) =>
      `✅ Encontré ${count} perfil${count !== 1 ? "es" : ""} disponible${
        count !== 1 ? "s" : ""
      }:`,
    selectResult: "Selecciona el perfil que te interesa:",

    // Tipos de búsqueda
    byRegion:
      "📍 **Búsqueda por Región**\n\n¿En qué región buscas?\n\n• Norte 🏜️\n• Centro 🏙️\n• Sur 🏔️",
    byCity:
      "📍 **Búsqueda por Ciudad**\n\n¿En qué ciudad específicamente?\n\n*Ejemplo: Santiago, Valparaíso, Concepción*",
    byCategory:
      "🏷️ **Búsqueda por Categoría**\n\n¿Qué categoría prefieres?\n\n• Enterprise 👑\n• VIP 💎\n• Premium ⭐\n• Top 🔥\n• Normal 💃",
    byPrice:
      "💰 **Búsqueda por Precio**\n\n¿Cuál es tu presupuesto?\n\n*Ingresa un rango (ej: 20000-50000)*",

    // Recomendaciones
    recommendationsTitle: "⭐ **Recomendaciones para ti**",
    featuredTitle: "💎 **Agencias Destacadas (Versión Beta)**",
    showingRecommendations: (count) =>
      `Mostrando ${count} recomendaciones basadas en tu búsqueda:`,

    // Detalles
    showDetails: "¿Quieres ver los detalles de algún perfil?",
    selectToView: "Selecciona un número para ver más información",

    // Errores de búsqueda
    invalidInput: "No entendí tu selección. ¿Cómo quieres buscar?",
    enterValidLocation:
      "Por favor ingresa una ubicación válida (ej: Santiago, Viña del Mar)",
    enterValidPrice:
      "Por favor ingresa un presupuesto válido (ej: 30000 o 20000-50000)",
    noLocationProvided: "No ingresaste una ubicación. ¿Dónde buscas?",
  },

  // Mensajes del menú principal
  menuMessages: {
    mainMenu: "💋 **Menú Principal**\n\n¿Qué necesitas?",
    help: (fullName) =>
      `❓ **Ayuda de AYDA**\n\nSoy tu ${fullName}, aquí para ayudarte con:\n\n🔍 **Buscar por región**: Norte, Centro o Sur\n\n⭐ **Ver recomendaciones**: Agencias destacadas (versión beta)\n\n🏷️ **Buscar por categoría**: Enterprise, VIP, Premium, Top o Normal\n\n💰 **Buscar por presupuesto**: Encuentra opciones según tu rango de precio\n\n¿Qué te gustaría hacer?`,
    invalidOption:
      "No entendí tu selección. Por favor elige una opción del menú:",
    returnToMenu: "💋 Volviendo al menú principal...",

    // Login
    needLogin:
      "🔑 **Iniciar Sesión**\n\nPara contactar perfiles necesitas iniciar sesión.\n\nPuedes buscar sin cuenta, pero para contactar necesitarás:\n\n1. Crear una cuenta o **iniciar sesión**\n2. Seleccionar el perfil que te interesa\n3. Ver información de contacto\n\n¿Quieres buscar perfiles primero?",
  },

  // Mensajes de validación (género neutro)
  validationMessages: {
    required: "Este campo es obligatorio",
    tooShort: (min) => `Debe tener al menos ${min} caracteres`,
    tooLong: (max) => `No puede tener más de ${max} caracteres`,
    invalidFormat: "El formato no es válido",
    invalidLocation: "La ubicación no es válida",
    invalidPrice: "El precio debe ser un número válido",
    invalidDate: "La fecha no es válida",
    priceOutOfRange: "El precio está fuera del rango disponible",
    noAvailability: "No hay disponibilidad para esas fechas",
    suggestion: "Sugerencia:",
    didYouMean: "¿Quisiste decir",
  },

  // Mensajes de perfiles
  profileMessages: {
    showingDetails: "📋 **Detalles del Perfil**",
    location: "📍 Ubicación",
    category: "🏷️ Categoría",
    price: "💰 Precio",
    services: "✨ Servicios",
    availability: "📅 Disponibilidad",
    rating: "⭐ Calificación",
    contact: "📞 Contacto",
    featured: "💎 Agencia Destacada (Beta)",
    recommended: "⭐ Recomendado para ti",
    profileLink: "🔗 Ver Perfil Completo",

    // Mensajes de resultados de búsqueda
    resultsFound: (count, city, category) =>
      `✅ Encontré **${count} perfiles** en ${city} de categoría ${category}`,
    noResultsFound:
      "❌ No encontré perfiles que coincidan con tus criterios. Intenta ajustar tus filtros.",
    searchingProfiles: "🔍 Buscando perfiles disponibles...",

    // Categorías
    enterprise: "👑 Enterprise - Exclusivo y premium",
    vip: "💎 VIP - Experiencia de lujo",
    premium: "⭐ Premium - Calidad superior",
    top: "🔥 Top - Las más solicitadas",
    normal: "💃 Normal - Excelente relación calidad-precio",

    // Acciones
    viewDetails: "Ver detalles completos",
    contact: "Contactar",
    viewProfile: "Ver perfil completo",
    addToFavorites: "Agregar a favoritos",
    share: "Compartir",
  },

  // Tono de comunicación
  tone: {
    friendly: true,
    professional: true,
    neutral: true, // Género neutro
    helpful: true,
    patient: true,
    empathetic: true,
  },

  // Utilidades
  utils: {
    getGreetingByTime: () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 19) return "afternoon";
      if (hour >= 19 || hour < 5) return "evening";
      return "default";
    },

    formatUserName: (user) => {
      if (!user) return null;

      // Si es un objeto reactivo de Vue, extraer el valor
      const userData = user.value || user;

      // Intentar obtener el nombre completo
      if (userData.displayName) return userData.displayName;

      // Intentar combinar nombre y apellido
      if (userData.nombre && userData.apellido) {
        return `${userData.nombre} ${userData.apellido}`.trim();
      }

      // Solo nombre
      if (userData.nombre) return userData.nombre;

      // Solo apellido
      if (userData.apellido) return userData.apellido;

      // Email sin dominio
      if (userData.email) {
        const emailName = userData.email.split("@")[0];
        // Capitalizar primera letra
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
      }

      return "Usuario";
    },
  },
};

export default botPersonality;
