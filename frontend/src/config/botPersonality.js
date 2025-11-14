/**
 * Configuración de personalidad de AMIN
 * Asistente de Hospedajes
 */

export const botPersonality = {
  // Identidad
  name: "AMIN",
  fullName: "Asistente de Hospedajes Inteligente",
  meaning: "Tu guía confiable para encontrar el hospedaje perfecto",
  avatar: "@/assets/amin-transparente.webp",
  emoji: "🏠",

  // Saludos personalizados por hora
  greetings: {
    morning: (userName) =>
      `¡Buenos días, ${userName}! 🌅\n\nSoy AMIN, tu Asistente de Hospedajes. ¿Buscas un lugar donde quedarte?`,

    afternoon: (userName) =>
      `¡Buenas tardes, ${userName}! ☀️\n\nSoy AMIN, tu Asistente de Hospedajes. ¿En qué ubicación buscas alojamiento?`,

    evening: (userName) =>
      `¡Buenas noches, ${userName}! 🌙\n\nSoy AMIN, tu Asistente de Hospedajes. Estoy aquí para ayudarte a encontrar el lugar perfecto.`,

    default: (userName) =>
      `¡Hola, ${userName}! 👋\n\nSoy AMIN 🏠, tu Asistente de Hospedajes. ¿Dónde quieres quedarte?`,

    anonymous: () =>
      `¡Hola! 👋\n\nSoy AMIN 🏠, tu Asistente de Hospedajes.\n\nPuedo ayudarte a buscar alojamientos sin necesidad de iniciar sesión, pero para reservar necesitarás una cuenta.`,
  },

  // Frases comunes (todas en género neutro)
  phrases: {
    introduction: "Tu asistente personal de hospedajes",
    help: "¿Qué tipo de alojamiento buscas?",
    confirmation: "¿Confirmas esta selección?",
    confirmAction: "¿Deseas ver más detalles de este hospedaje?",
    error: "No encontré ese hospedaje. ¿Intentamos con otra búsqueda?",
    errorGeneral: "Algo salió mal. ¿Probamos de nuevo?",
    success: "¡Perfecto! Aquí están tus resultados",
    successAction: "¡Listo! Hospedaje encontrado",
    thinking: "Buscando en nuestra base de datos...",
    typing: "Escribiendo...",
    validating: "Verificando disponibilidad...",
    searching: "Buscando hospedajes en la ubicación...",
    goodbye: "Hasta pronto. Estoy aquí cuando necesites alojamiento 👋",
    thanks: "¡Gracias por usar AMIN! 🏠",
    welcome: "Te doy la bienvenida",
    pleaseWait: "Un momento, buscando opciones...",
    almostDone: "¡Ya casi! Preparando tus recomendaciones",
    needHelp: "¿Necesitas ayuda con otra búsqueda?",
  },

  // Preguntas del flujo de búsqueda
  questions: {
    // Búsqueda de hospedajes
    location: "¿En qué ubicación buscas hospedaje?",
    category: "¿Qué categoría prefieres?",
    priceRange: "¿Cuál es tu presupuesto aproximado?",
    services: "¿Qué servicios necesitas?",
    dates: "¿Para qué fechas?",
    guests: "¿Cuántas personas?",
    confirmSearch: "¿Esta búsqueda es correcta?",
    showMore: "¿Quieres ver más opciones?",
    needDetails: "¿Quieres ver los detalles de algún hospedaje?",
  },

  // Mensajes de búsqueda
  searchMessages: {
    howToSearch: "🔍 ¿Cómo quieres buscar hospedaje?",
    searchAgain:
      "🔍 Perfecto, hagamos otra búsqueda. ¿Qué ubicación te interesa?",
    searching: "🔍 Buscando hospedajes disponibles...",
    noResults: "❌ No encontré hospedajes en esa ubicación.",
    foundResults: (count) =>
      `✅ Encontré ${count} hospedaje${count !== 1 ? "s" : ""} disponible${
        count !== 1 ? "s" : ""
      }:`,
    selectResult: "Selecciona el hospedaje que te interesa:",

    // Tipos de búsqueda
    byLocation:
      "📍 **Búsqueda por Ubicación**\n\n¿En qué ciudad o zona buscas hospedaje?\n\n*Ejemplo: Santiago Centro, Providencia, Las Condes*",
    byCategory:
      "🏷️ **Búsqueda por Categoría**\n\n¿Qué tipo de hospedaje prefieres?\n\n• VIP 💎\n• Premium ⭐\n• Normal 🏠\n• Masajistas 💆",
    byPrice:
      "💰 **Búsqueda por Precio**\n\n¿Cuál es tu presupuesto?\n\n*Ingresa un rango (ej: 20000-50000)*",

    // Recomendaciones
    recommendationsTitle: "⭐ **Recomendaciones para ti**",
    featuredTitle: "💎 **Hospedajes Destacados**",
    showingRecommendations: (count) =>
      `Mostrando ${count} recomendaciones basadas en tu búsqueda:`,

    // Detalles
    showDetails: "¿Quieres ver los detalles de algún hospedaje?",
    selectToView: "Selecciona un número para ver más información",

    // Errores de búsqueda
    invalidInput: "No entendí tu selección. ¿Cómo quieres buscar?",
    enterValidLocation:
      "Por favor ingresa una ubicación válida (ej: Santiago, Viña del Mar)",
    enterValidPrice:
      "Por favor ingresa un presupuesto válido (ej: 30000 o 20000-50000)",
    noLocationProvided: "No ingresaste una ubicación. ¿Dónde buscas hospedaje?",
  },

  // Mensajes del menú principal
  menuMessages: {
    mainMenu: "🏠 **Menú Principal**\n\n¿Qué necesitas?",
    help: (fullName) =>
      `❓ **Ayuda de AMIN**\n\nSoy tu ${fullName}, aquí para ayudarte con:\n\n🔍 **Buscar por ubicación**: Encuentra hospedajes en la ciudad o zona que prefieras\n\n⭐ **Ver recomendaciones**: Hospedajes destacados seleccionados para ti\n\n🏷️ **Buscar por categoría**: VIP, Premium, Normal o Masajistas\n\n💰 **Buscar por presupuesto**: Encuentra opciones según tu rango de precio\n\n¿Qué te gustaría hacer?`,
    invalidOption:
      "No entendí tu selección. Por favor elige una opción del menú:",
    returnToMenu: "🏠 Volviendo al menú principal...",

    // Login
    needLogin:
      "🔑 **Iniciar Sesión**\n\nPara reservar hospedajes necesitas iniciar sesión.\n\nPuedes buscar sin cuenta, pero para contactar a los anfitriones necesitarás:\n\n1. Crear una cuenta o **iniciar sesión**\n2. Seleccionar el hospedaje que te interesa\n3. Hacer tu reserva\n\n¿Quieres buscar hospedajes primero?",
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

  // Mensajes de hospedajes
  hospedajeMessages: {
    showingDetails: "📋 **Detalles del Hospedaje**",
    location: "📍 Ubicación",
    category: "🏷️ Categoría",
    price: "💰 Precio",
    services: "✨ Servicios",
    availability: "📅 Disponibilidad",
    rating: "⭐ Calificación",
    contact: "📞 Contacto",
    featured: "💎 Hospedaje Destacado",
    recommended: "⭐ Recomendado para ti",

    // Categorías
    vip: "💎 VIP - Experiencia premium",
    premium: "⭐ Premium - Confort superior",
    normal: "🏠 Normal - Relación calidad-precio",
    masajistas: "💆 Masajistas - Servicios especializados",

    // Acciones
    viewDetails: "Ver detalles completos",
    contact: "Contactar anfitrión",
    reserve: "Reservar ahora",
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
