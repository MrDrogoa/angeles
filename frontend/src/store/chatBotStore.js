import { defineStore } from "pinia";
import { useReportsStore } from "./reportsStore.js";
import { useExpressReportsStore } from "./expressReportsStore.js";
import { useAuthStore } from "./authStore.js";
import botRepository from "../repositories/botRepository.js";
import { realTimeValidator } from "../services/RealTimeValidationService.js";
import { errorHandler } from "../services/ErrorHandlerService.js";
import botPersonalityService from "../services/BotPersonalityService.js";
// Importar datos de JSON
import nacionalidadesData from "../data/nacionalidades.json";
import countriesData from "../data/countries.json";
import paisesData from "../data/paises.json";

export const useChatBotStore = defineStore("chatBot", {
  state: () => ({
    // Estado de la conversación
    messages: [],
    isTyping: false,
    currentFlow: "menu", // Estado principal del flujo
    currentStep: 0,

    // Máquina de Estados - Fase 5
    currentState: "MENU",
    stateHistory: [],
    validationState: {
      isValidating: false,
      currentField: null,
      fieldErrors: {},
      fieldSuggestions: {},
    },

    // Estados disponibles según el plan
    states: {
      // Estados principales
      MENU: "menu",
      SEARCH_TYPE: "search_type",
      SEARCH_INPUT: "search_input",
      SEARCH_RESULTS: "search_results",

      // Estados de creación de reportes
      CREATE_REPORT: "create_report",
      CREATE_EXPRESS: "create_express",

      // Estados del flujo de reporte completo
      REPORT_NAME: "report_name",
      REPORT_LASTNAME: "report_lastname",
      REPORT_IDENTIFICATION: "report_identification",
      REPORT_NATIONALITY: "report_nationality",
      REPORT_PHONE: "report_phone",
      REPORT_EMAIL: "report_email",
      REPORT_BIRTH_DATE: "report_birth_date",
      REPORT_GENDER: "report_gender",
      REPORT_HOSTING_TYPE: "report_hosting_type",
      REPORT_AGENCY: "report_agency",
      REPORT_RESERVATION: "report_reservation",
      REPORT_CHECK_IN: "report_check_in",
      REPORT_CHECK_OUT: "report_check_out",
      REPORT_GUESTS: "report_guests",
      REPORT_EVALUATIONS: "report_evaluations",
      REPORT_COMMENTS: "report_comments",

      // Estados del flujo express
      EXPRESS_NAME: "express_name",
      EXPRESS_LASTNAME: "express_lastname",
      EXPRESS_IDENTIFICATION: "express_identification",
      EXPRESS_PHONE: "express_phone",
      EXPRESS_EVALUATIONS: "express_evaluations",
      EXPRESS_COMMENTS: "express_comments",

      // Estados de confirmación
      CONFIRM: "confirm",
      COMPLETE: "complete",
      ERROR: "error",
    },

    // Datos temporales del formulario en progreso
    tempReportData: {},
    tempExpressData: {},
    tempSearchData: {},

    // Historial y sesión
    sessionId: null,
    lastInteraction: null,

    // === TRACKING DE BACKEND (NUEVO - NO INTERFIERE CON LÓGICA EXISTENTE) ===
    backendSessionId: null, // SessionId del backend para tracking
    sessionStarted: false, // Si la sesión de tracking está activa
    trackingEnabled: true, // Habilitar/deshabilitar tracking

    // === NAVEGACIÓN Y BREADCRUMBS ===
    navigationHistory: [], // Historial de estados para navegación
    breadcrumbs: [], // Ruta actual en el flujo
    canGoBack: false, // Si se puede volver atrás
    previousState: null, // Estado anterior

    // UI state
    isVisible: false,
    isMinimized: false,
    hasShownWelcome: false, // Controla si ya mostró el mensaje de bienvenida
    showHelpBubble: false, // Muestra la viñeta de ayuda en el botón flotante
    helpReminderInterval: null, // Intervalo para recordatorios periódicos

    // Estado de confirmación
    showConfirmation: false,
    confirmationType: null, // 'complete' o 'express'
    isSubmitting: false,

    // Estado de autenticación
    requiresAuth: true,
    authChecked: false,

    // Configuración
    config: {
      typingDelay: 1000,
      maxMessages: 100,
      autoSave: true,
      helpReminderInterval: 120000, // 2 minutos
    },
  }),

  getters: {
    // Obtener último mensaje
    lastMessage: (state) => state.messages[state.messages.length - 1],

    // Verificar si el bot está esperando respuesta
    isWaitingForResponse: (state) => {
      const lastMsg = state.messages[state.messages.length - 1];
      return lastMsg && lastMsg.sender === "bot" && lastMsg.expectsResponse;
    },

    // Obtener mensajes visibles (límite para performance)
    visibleMessages: (state) => state.messages.slice(-50),

    // Verificar si hay formulario en progreso
    hasFormInProgress: (state) => {
      return (
        Object.keys(state.tempReportData).length > 0 ||
        Object.keys(state.tempExpressData).length > 0
      );
    },

    // Verificar autenticación
    isUserAuthenticated() {
      const authStore = useAuthStore();
      // ⚠️ TEMPORAL: Forzando autenticación para testing
      // ⚠️ REVERTIR: Cambiar 'return true' por 'return authStore.isAuthenticated'
      return true; // return authStore.isAuthenticated
    },

    // Verificar permisos
    canCreateReports() {
      const authStore = useAuthStore();
      return authStore.isAdmin || authStore.isOwner;
    },

    // Verificar si puede buscar
    canSearch() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated; // Todos los usuarios autenticados pueden buscar
    },

    // Obtener datos del usuario
    currentUser() {
      const authStore = useAuthStore();
      return authStore.user;
    },

    // Obtener progreso actual
    currentProgress: (state) => {
      if (state.currentFlow === "create_report") {
        const totalSteps = 30; // 30 pasos totales: datos personales (1-10) + evaluaciones (11-28) + comentarios (29) + resumen (30)
        return Math.round((state.currentStep / totalSteps) * 100);
      } else if (state.currentFlow === "create_express") {
        const totalSteps = 12; // Aproximado para reporte express
        return Math.round((state.currentStep / totalSteps) * 100);
      }
      return 0;
    },

    // Obtener información detallada del progreso
    progressInfo: (state) => {
      const info = {
        percentage: 0,
        currentStep: 0,
        totalSteps: 0,
        completedSteps: 0,
        remainingSteps: 0,
        completedFields: [],
        pendingFields: [],
        flowType: state.currentFlow,
      };

      if (state.currentFlow === "create_report") {
        info.totalSteps = 30;
        info.currentStep = state.currentStep;
        info.completedSteps = Math.max(0, state.currentStep - 1);
        info.remainingSteps = info.totalSteps - info.currentStep;
        info.percentage = Math.round(
          (info.currentStep / info.totalSteps) * 100
        );

        // Campos completados
        const fields = [
          "nombre",
          "apellido",
          "identificacion",
          "telefono",
          "email",
          "genero",
          "fechaNacimiento",
          "nacionalidad",
        ];
        fields.forEach((field) => {
          if (state.tempReportData[field]) {
            info.completedFields.push(field);
          } else {
            info.pendingFields.push(field);
          }
        });
      } else if (state.currentFlow === "create_express") {
        info.totalSteps = 8;
        info.currentStep = state.currentStep;
        info.completedSteps = Math.max(0, state.currentStep - 1);
        info.remainingSteps = info.totalSteps - info.currentStep;
        info.percentage = Math.round(
          (info.currentStep / info.totalSteps) * 100
        );

        // Campos completados
        const fields = ["nombre", "apellido", "identificacion", "telefono"];
        fields.forEach((field) => {
          if (state.tempExpressData[field]) {
            info.completedFields.push(field);
          } else {
            info.pendingFields.push(field);
          }
        });
      }

      return info;
    },

    // Obtener pasos del formulario
    formSteps: (state) => {
      if (state.currentFlow === "create_report") {
        return [
          {
            step: 1,
            label: "Nombre",
            icon: "👤",
            completed: !!state.tempReportData.nombre,
          },
          {
            step: 2,
            label: "Apellido",
            icon: "👤",
            completed: !!state.tempReportData.apellido,
          },
          {
            step: 3,
            label: "Apodos",
            icon: "✨",
            completed: state.currentStep > 3,
          },
          {
            step: 4,
            label: "Tipo ID",
            icon: "🆔",
            completed: !!state.tempReportData.idType,
          },
          {
            step: 5,
            label: "Identificación",
            icon: "🔢",
            completed: !!state.tempReportData.identificacion,
          },
          {
            step: 6,
            label: "Teléfono",
            icon: "📱",
            completed: !!state.tempReportData.telefono,
          },
          {
            step: 7,
            label: "Email",
            icon: "📧",
            completed: !!state.tempReportData.email,
          },
          {
            step: 8,
            label: "Género",
            icon: "👥",
            completed: !!state.tempReportData.genero,
          },
          {
            step: 9,
            label: "Fecha Nac.",
            icon: "🎂",
            completed: !!state.tempReportData.fechaNacimiento,
          },
          {
            step: 10,
            label: "Nacionalidad",
            icon: "🌍",
            completed: !!state.tempReportData.nacionalidad,
          },
          {
            step: 11,
            label: "Hospedaje",
            icon: "🏠",
            completed: !!state.tempReportData.tipoHospedaje,
          },
          {
            step: 12,
            label: "Agencia",
            icon: "🏢",
            completed: !!state.tempReportData.agencia,
          },
          {
            step: 13,
            label: "Check-in",
            icon: "📅",
            completed: !!state.tempReportData.fechaIngreso,
          },
          {
            step: 14,
            label: "Evaluaciones",
            icon: "⭐",
            completed: state.currentStep > 14,
          },
          { step: 15, label: "Confirmar", icon: "✅", completed: false },
        ];
      } else if (state.currentFlow === "create_express") {
        return [
          {
            step: 1,
            label: "Nombre",
            icon: "👤",
            completed: !!state.tempExpressData.nombre,
          },
          {
            step: 2,
            label: "Apellido",
            icon: "👤",
            completed: !!state.tempExpressData.apellido,
          },
          {
            step: 3,
            label: "Apodos",
            icon: "�️",
            completed: state.currentStep > 3,
          },
          {
            step: 4,
            label: "Identificación",
            icon: "🆔",
            completed: !!state.tempExpressData.identificacion,
          },
          {
            step: 5,
            label: "Teléfono",
            icon: "�",
            completed: !!state.tempExpressData.telefono,
          },
          {
            step: 6,
            label: "Nacionalidad",
            icon: "🌍",
            completed: state.currentStep > 8,
          },
          {
            step: 7,
            label: "Evaluaciones",
            icon: "⭐",
            completed: state.currentStep > 13,
          },
          { step: 8, label: "Confirmar", icon: "✅", completed: false },
        ];
      }
      return [];
    },

    // ===== GETTERS DE MÁQUINA DE ESTADOS - FASE 5 =====

    // Verificar si está en un estado específico
    isInState: (state) => (stateName) => {
      return state.currentState === stateName;
    },

    // Verificar si puede transicionar a un estado
    canTransitionTo: (state) => (targetState) => {
      const validTransitions = {
        MENU: ["SEARCH_TYPE", "CREATE_REPORT", "CREATE_EXPRESS"],
        SEARCH_TYPE: ["SEARCH_INPUT", "MENU"],
        SEARCH_INPUT: ["SEARCH_RESULTS", "SEARCH_TYPE", "MENU"],
        SEARCH_RESULTS: ["SEARCH_TYPE", "MENU"],
        CREATE_REPORT: ["REPORT_NAME", "MENU"],
        REPORT_NAME: ["REPORT_LASTNAME", "CREATE_REPORT"],
        REPORT_LASTNAME: ["REPORT_IDENTIFICATION", "REPORT_NAME"],
        // ... más transiciones según necesidad
      };

      return (
        validTransitions[state.currentState]?.includes(targetState) || false
      );
    },

    // Obtener campos requeridos para el estado actual
    getCurrentStateFields: (state) => {
      const stateFields = {
        REPORT_NAME: { field: "nombre", type: "text", required: true },
        REPORT_LASTNAME: { field: "apellido", type: "text", required: true },
        REPORT_IDENTIFICATION: {
          field: "identificacion",
          type: "identification",
          required: true,
        },
        REPORT_NATIONALITY: {
          field: "nacionalidad",
          type: "select",
          required: false,
        },
        REPORT_PHONE: { field: "telefono", type: "phone", required: false },
        REPORT_EMAIL: { field: "email", type: "email", required: false },
        EXPRESS_NAME: { field: "nombre", type: "text", required: true },
        EXPRESS_LASTNAME: { field: "apellido", type: "text", required: true },
        EXPRESS_IDENTIFICATION: {
          field: "identificacion",
          type: "identification",
          required: true,
        },
        EXPRESS_PHONE: { field: "telefono", type: "phone", required: false },
      };

      return stateFields[state.currentState] || null;
    },

    // Verificar si hay errores de validación
    hasValidationErrors: (state) => {
      return Object.keys(state.validationState.fieldErrors).length > 0;
    },

    // Obtener siguiente estado en el flujo
    getNextState: (state) => {
      const reportFlow = [
        "REPORT_NAME",
        "REPORT_LASTNAME",
        "REPORT_IDENTIFICATION",
        "REPORT_NATIONALITY",
        "REPORT_PHONE",
        "REPORT_EMAIL",
        "REPORT_BIRTH_DATE",
        "REPORT_GENDER",
        "REPORT_HOSTING_TYPE",
        "REPORT_AGENCY",
        "REPORT_RESERVATION",
        "REPORT_CHECK_IN",
        "REPORT_CHECK_OUT",
        "REPORT_GUESTS",
        "REPORT_EVALUATIONS",
        "REPORT_COMMENTS",
        "CONFIRM",
      ];

      const expressFlow = [
        "EXPRESS_NAME",
        "EXPRESS_LASTNAME",
        "EXPRESS_IDENTIFICATION",
        "EXPRESS_PHONE",
        "EXPRESS_EVALUATIONS",
        "EXPRESS_COMMENTS",
        "CONFIRM",
      ];

      const currentIndex = reportFlow.indexOf(state.currentState);
      if (currentIndex !== -1 && currentIndex < reportFlow.length - 1) {
        return reportFlow[currentIndex + 1];
      }

      const expressIndex = expressFlow.indexOf(state.currentState);
      if (expressIndex !== -1 && expressIndex < expressFlow.length - 1) {
        return expressFlow[expressIndex + 1];
      }

      return null;
    },
  },

  actions: {
    // ===== MÉTODOS DE TRACKING DEL BACKEND (NUEVOS - NO MODIFICAN LÓGICA EXISTENTE) =====

    /**
     * Iniciar sesión de tracking en el backend
     * Se llama automáticamente al abrir el bot si trackingEnabled = true
     */
    async startBackendTracking() {
      if (!this.trackingEnabled || this.sessionStarted) return;

      try {
        const authStore = useAuthStore();

        // Solo crear sesión si el usuario está autenticado
        if (!authStore.isAuthenticated) return;

        console.log("🔍 Iniciando tracking de sesión del bot...");

        const result = await botRepository.createConversation({
          platform: "web",
          language: "es",
          userAgent: navigator.userAgent,
        });

        if (result.success && result.sessionId) {
          this.backendSessionId = result.sessionId;
          this.sessionStarted = true;
          console.log("✅ Sesión de tracking iniciada:", this.backendSessionId);
        }
      } catch (error) {
        console.warn("⚠️ Error iniciando tracking (no crítico):", error);
        // No bloquear la funcionalidad si falla el tracking
      }
    },

    /**
     * Completar sesión de tracking al crear reporte exitosamente
     */
    async completeBackendTracking(reportId) {
      if (!this.trackingEnabled || !this.backendSessionId) return;

      try {
        await botRepository.completeConversation(
          this.backendSessionId,
          reportId
        );
        console.log("✅ Sesión de tracking completada");
        this.backendSessionId = null;
        this.sessionStarted = false;
      } catch (error) {
        console.warn("⚠️ Error completando tracking (no crítico):", error);
      }
    },

    /**
     * Abandonar sesión de tracking al cerrar sin completar
     */
    async abandonBackendTracking() {
      if (!this.trackingEnabled || !this.backendSessionId) return;

      try {
        await botRepository.abandonConversation(this.backendSessionId);
        console.log("⚠️ Sesión de tracking abandonada");
        this.backendSessionId = null;
        this.sessionStarted = false;
      } catch (error) {
        console.warn("⚠️ Error abandonando tracking (no crítico):", error);
      }
    },

    /**
     * Registrar uso de sugerencia (para analytics)
     */
    async trackSuggestionUsed(field, suggestion) {
      if (!this.trackingEnabled || !this.backendSessionId) return;

      try {
        await botRepository.recordSuggestionUsed(
          this.backendSessionId,
          field,
          suggestion
        );
      } catch (error) {
        console.warn("⚠️ Error registrando sugerencia (no crítico):", error);
      }
    },

    /**
     * Enviar feedback del usuario
     */
    async submitUserFeedback(feedbackData) {
      if (!this.trackingEnabled) return;

      try {
        const authStore = useAuthStore();

        await botRepository.submitFeedback({
          sessionId: this.backendSessionId,
          userId: authStore.user?.uid,
          userEmail: authStore.user?.email,
          currentState: this.currentState,
          currentFlow: this.currentFlow,
          ...feedbackData,
        });

        console.log("✅ Feedback enviado");
        return { success: true };
      } catch (error) {
        console.warn("⚠️ Error enviando feedback:", error);
        return { success: false, error: error.message };
      }
    },

    // ===== MÉTODOS EXISTENTES (NO MODIFICADOS) =====

    // Inicializar sesión del bot
    initializeSession() {
      this.sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      this.lastInteraction = new Date();
      this.loadFromLocalStorage();

      // Verificar autenticación
      this.checkAuthenticationStatus();

      // Mensaje de bienvenida si no hay mensajes
      if (this.messages.length === 0) {
        this.addWelcomeMessage();
      }

      // Verificar si ya se mostró la bienvenida en localStorage
      try {
        const welcomed = localStorage.getItem("chatbot_welcomed");
        if (welcomed === "true") {
          this.hasShownWelcome = true;
        }
      } catch (error) {
        console.warn("Error checking welcome flag:", error);
      }

      // NUEVO: Iniciar tracking en backend (no bloquea si falla)
      this.startBackendTracking();
    },

    // ===== MÉTODOS DE MÁQUINA DE ESTADOS - FASE 5 =====

    /**
     * Transicionar a un nuevo estado
     */
    transitionToState(newState, data = {}) {
      console.log(
        `🔄 ChatBot: Transicionando de ${this.currentState} a ${newState}`
      );

      // Verificar si la transición es válida
      if (!this.canTransitionTo(newState)) {
        console.warn(
          `⚠️ Transición inválida de ${this.currentState} a ${newState}`
        );
        return false;
      }

      // Guardar estado anterior en historial
      this.stateHistory.push({
        state: this.currentState,
        timestamp: new Date(),
        data: { ...data },
      });

      // Cambiar al nuevo estado
      const previousState = this.currentState;
      this.currentState = newState;

      // Ejecutar acciones específicas del estado
      this.onStateEnter(newState, previousState, data);

      return true;
    },

    /**
     * Volver al estado anterior
     */
    goToPreviousState() {
      if (this.stateHistory.length === 0) {
        console.warn("⚠️ No hay estado anterior en el historial");
        return false;
      }

      const previousState = this.stateHistory.pop();
      console.log(`↩️ ChatBot: Volviendo al estado ${previousState.state}`);

      this.currentState = previousState.state;
      this.onStateEnter(
        previousState.state,
        this.currentState,
        previousState.data
      );

      return true;
    },

    /**
     * Resetear máquina de estados al menú principal
     */
    resetToMenu() {
      console.log("🏠 ChatBot: Regresando al menú principal");

      this.currentState = "MENU";
      this.stateHistory = [];
      this.currentStep = 0;
      this.currentFlow = "menu";

      // Limpiar datos temporales
      this.tempReportData = {};
      this.tempExpressData = {};
      this.tempSearchData = {};

      // Limpiar validaciones
      this.validationState.fieldErrors = {};
      this.validationState.fieldSuggestions = {};
      this.validationState.currentField = null;
      this.validationState.isValidating = false;

      this.addBotMessage(
        "💋 Regresamos al menú principal. ¿Qué te gustaría hacer?",
        "options",
        [
          { id: "1", text: "📍 Buscar por región", value: "search_region" },
          {
            id: "2",
            text: "🏷️ Buscar por categoría",
            value: "search_category",
          },
          {
            id: "3",
            text: "💰 Buscar por presupuesto",
            value: "search_price",
          },
          {
            id: "4",
            text: "⭐ Ver agencias destacadas",
            value: "featured",
          },
          { id: "5", text: "❓ Ayuda", value: "help" },
        ],
        true
      );
    },

    /**
     * Acciones a ejecutar al entrar a un estado
     */
    onStateEnter(newState, previousState, data = {}) {
      console.log(`📍 ChatBot: Entrando al estado ${newState}`);

      switch (newState) {
        case "MENU":
          this.handleMenuState();
          break;

        // DESHABILITADO - Ahora se usa flujo simplificado en processMenuInput
        // case 'SEARCH_TYPE':
        //   this.handleSearchTypeState()
        //   break

        case "CREATE_REPORT":
          this.transitionToState("REPORT_NAME");
          break;

        case "CREATE_EXPRESS":
          this.transitionToState("EXPRESS_NAME");
          break;

        case "REPORT_NAME":
          this.handleReportNameState();
          break;

        case "REPORT_LASTNAME":
          this.handleReportLastnameState();
          break;

        case "REPORT_IDENTIFICATION":
          this.handleReportIdentificationState();
          break;

        case "REPORT_NATIONALITY":
          this.handleReportNationalityState();
          break;

        case "REPORT_PHONE":
          this.handleReportPhoneState();
          break;

        case "REPORT_EMAIL":
          this.handleReportEmailState();
          break;

        case "EXPRESS_NAME":
          this.handleExpressNameState();
          break;

        case "EXPRESS_LASTNAME":
          this.handleExpressLastnameState();
          break;

        case "EXPRESS_IDENTIFICATION":
          this.handleExpressIdentificationState();
          break;

        case "EXPRESS_PHONE":
          this.handleExpressPhoneState();
          break;

        case "CONFIRM":
          this.handleConfirmState();
          break;

        case "COMPLETE":
          this.handleCompleteState();
          break;

        default:
          console.warn(`⚠️ Estado ${newState} no tiene handler definido`);
      }
    },

    /**
     * Manejar entrada de usuario basada en el estado actual
     */
    processUserInputByState(input, option = null) {
      console.log(
        `📝 ChatBot: Procesando input en estado ${this.currentState}`
      );

      // Si hay una opción, usar su valor
      const userInput = option?.value || input;

      switch (this.currentState) {
        case "MENU":
          return this.processMenuInput(userInput);

        // DESHABILITADO - Ahora se maneja en processMenuInput directamente
        // case 'SEARCH_TYPE':
        //   return this.processSearchTypeInput(userInput)

        case "SEARCH_INPUT":
          return this.processSearchInput(userInput);

        case "REPORT_NAME":
          return this.processReportNameInput(userInput);

        case "REPORT_LASTNAME":
          return this.processReportLastnameInput(userInput);

        case "REPORT_IDENTIFICATION":
          return this.processReportIdentificationInput(userInput);

        case "REPORT_NATIONALITY":
          return this.processReportNationalityInput(userInput);

        case "REPORT_PHONE":
          return this.processReportPhoneInput(userInput);

        case "REPORT_EMAIL":
          return this.processReportEmailInput(userInput);

        case "EXPRESS_NAME":
          return this.processExpressNameInput(userInput);

        case "EXPRESS_LASTNAME":
          return this.processExpressLastnameInput(userInput);

        case "EXPRESS_IDENTIFICATION":
          return this.processExpressIdentificationInput(userInput);

        case "EXPRESS_PHONE":
          return this.processExpressPhoneInput(userInput);

        case "CONFIRM":
          return this.processConfirmInput(userInput);

        default:
          console.warn(
            `⚠️ No hay procesador para el estado ${this.currentState}`
          );
          return this.resetToMenu();
      }
    },

    // Verificar estado de autenticación
    checkAuthenticationStatus() {
      const authStore = useAuthStore();
      this.authChecked = true;

      if (!authStore.isAuthenticated) {
        console.warn("🔒 ChatBot: Usuario no autenticado");
        // El bot puede funcionar pero con funcionalidades limitadas
        this.requiresAuth = true;
      } else {
        console.log("✅ ChatBot: Usuario autenticado:", authStore.user?.email);
        this.requiresAuth = false;
      }
    },

    // Verificar permisos antes de ejecutar acción
    checkPermissionForAction(action) {
      // ⚠️ TEMPORAL: Autenticación desactivada para testing
      // ⚠️ REVERTIR: Descomentar las siguientes 6 líneas para reactivar autenticación
      /*
      if (!this.isUserAuthenticated) {
        return {
          hasPermission: false,
          message: '🔒 Necesitas **iniciar sesión** para usar esta función.\n\nPor favor, autentícate primero y vuelve a intentarlo.'
        }
      }
      */

      if (action === "create_report" || action === "create_express") {
        if (!this.canCreateReports) {
          return {
            hasPermission: false,
            message:
              "⚠️ No tienes permisos para **crear reportes**.\n\nSolo administradores y owners pueden crear reportes.",
          };
        }
      }

      if (action === "search") {
        if (!this.canSearch) {
          return {
            hasPermission: false,
            message:
              "⚠️ No tienes permisos para **buscar reportes**.\n\nContacta al administrador para obtener acceso.",
          };
        }
      }

      return { hasPermission: true };
    },

    // Agregar mensaje de bienvenida
    addWelcomeMessage() {
      // Personalizar mensaje según estado de autenticación
      const authStore = useAuthStore();

      // Usar el servicio de personalidad para obtener el saludo
      const welcomeText = botPersonalityService.getGreeting(authStore.user);

      // Filtrar opciones según permisos
      const allOptions = [
        { id: "1", text: "🔍 Buscar reportes", value: "search" },
        { id: "2", text: "📝 Crear reporte completo", value: "create_report" },
        { id: "3", text: "⚡ Crear reporte express", value: "create_express" },
        { id: "4", text: "🏠 Navegar en la app", value: "navigate_dashboard" },
        { id: "5", text: "❓ Ayuda", value: "help" },
      ];

      // Filtrar opciones que requieren permisos especiales
      let availableOptions = allOptions;
      if (!authStore.isAuthenticated) {
        availableOptions = [
          { id: "5", text: "❓ Ayuda", value: "help" },
          { id: "6", text: "🔑 Iniciar sesión", value: "login" },
        ];
      } else if (!this.canCreateReports) {
        availableOptions = allOptions.filter(
          (opt) => !["create_report", "create_express"].includes(opt.value)
        );
      }

      const welcomeMessage = {
        id: `msg_${Date.now()}`,
        sender: "bot",
        text: welcomeText,
        timestamp: new Date(),
        type: "menu",
        options: availableOptions,
        expectsResponse: true,
      };

      this.messages.push(welcomeMessage);
      this.currentFlow = "menu";
      this.currentStep = 0;
    },

    // Agregar mensaje del usuario
    addUserMessage(text, option = null) {
      const message = {
        id: `msg_${Date.now()}`,
        sender: "user",
        text: text,
        timestamp: new Date(),
        option: option,
      };

      this.messages.push(message);
      this.lastInteraction = new Date();
      this.saveToLocalStorage();

      // Procesar respuesta del usuario
      this.processUserInput(text, option);
    },

    // Agregar mensaje del bot con simulación de escritura
    async addBotMessage(
      text,
      type = "text",
      options = null,
      expectsResponse = false,
      searchResults = null
    ) {
      // Simular escritura basada en la longitud del mensaje
      await this.simulateTyping(null, text.length);

      const message = {
        id: `msg_${Date.now()}`,
        sender: "bot",
        text: text,
        timestamp: new Date(),
        type: type,
        options: options,
        expectsResponse: expectsResponse,
        searchResults: searchResults, // Agregar resultados de búsqueda
      };

      this.messages.push(message);
      this.saveToLocalStorage();

      return message;
    },

    // Simular que el bot está escribiendo con duración variable según el contenido
    async simulateTyping(duration = null, messageLength = 0) {
      this.isTyping = true;

      let delay = duration;
      if (!delay) {
        // Calcular duración basada en longitud del mensaje
        // Mensajes cortos: 500-1000ms
        // Mensajes medianos: 1000-2000ms
        // Mensajes largos: 2000-3000ms
        if (messageLength > 0) {
          const baseDelay = 500;
          const lengthFactor = Math.min(messageLength / 50, 5); // Max 5x multiplier
          delay = baseDelay + lengthFactor * 400;
        } else {
          delay = this.config.typingDelay;
        }
      }

      // Añadir variación aleatoria para parecer más natural (+/- 20%)
      const variation = delay * 0.2;
      const randomDelay = delay + (Math.random() * variation * 2 - variation);

      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(300, randomDelay))
      );
      this.isTyping = false;
    },

    // Procesar entrada del usuario
    async processUserInput(text, option = null) {
      await this.simulateTyping();

      // Verificar si es una acción especial del bot
      const actionValue = option?.value || text;
      if (
        actionValue &&
        (actionValue.startsWith("view_") ||
          [
            "search_again",
            "back_to_menu",
            "create_report",
            "create_express",
          ].includes(actionValue))
      ) {
        const response = await this.handleBotAction(actionValue);
        if (response) {
          this.addBotMessage(
            response.text,
            response.type || "text",
            response.options || null,
            response.expectsResponse || false
          );
        }
        return;
      }

      // Usar el servicio de flujos para procesar la respuesta normal
      const response = await this.handleFlowStep(text, option);

      if (response) {
        this.addBotMessage(
          response.text,
          response.type || "text",
          response.options || null,
          response.expectsResponse || false
        );
      }
    },

    // Manejar paso del flujo actual
    async handleFlowStep(input, option) {
      switch (this.currentFlow) {
        case "menu":
          return this.handleMenuSelection(option?.value || input);

        case "search":
          return this.handleSearchFlow(input, option);

        case "search_region":
        case "search_category":
        case "search_price":
          return this.handleSearchFlow(input, option);

        case "create_report":
          return this.handleCreateReportFlow(input, option);

        case "create_express":
          return this.handleCreateExpressFlow(input, option);

        default:
          return {
            text: "Lo siento, algo salió mal. Volvamos al menú principal.",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };
      }
    },

    // Manejar acciones específicas del bot
    async handleBotAction(action, data = null) {
      console.log(`🤖 ChatBot: Ejecutando acción ${action}`, data);

      if (action.startsWith("view_")) {
        // Extraer ID y tipo del reporte
        const parts = action.split("_");
        const reportId = parts[1];
        const reportType = parts[2];

        return this.handleViewReport(reportId, reportType);
      }

      switch (action) {
        case "search_again":
          this.currentFlow = "search";
          this.currentStep = 1;
          this.tempSearchData = {};
          return {
            text: "🔍 Perfecto, vamos a hacer otra búsqueda. ¿Cómo quieres buscar?",
            type: "options",
            options: [
              {
                id: "1",
                text: "🆔 Por identificación (RUT/Cédula/Pasaporte)",
                value: "by_id",
              },
              { id: "2", text: "📱 Por número de teléfono", value: "by_phone" },
              { id: "3", text: "👤 Por nombre", value: "by_name" },
              { id: "4", text: "🔙 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };

        case "back_to_menu":
          this.resetToMenu();
          return {
            text: "🏠 Volvamos al menú principal. ¿Qué te gustaría hacer?",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };

        case "create_report":
          this.currentFlow = "create_report";
          this.currentStep = 1;
          this.tempReportData = {};
          return {
            text: "📝 Excelente, vamos a crear un reporte completo. Empecemos con los datos personales.\n\n¿Cuál es el **nombre** de la persona?",
            type: "input",
            expectsResponse: true,
          };

        case "create_express":
          this.currentFlow = "create_express";
          this.currentStep = 1;
          this.tempExpressData = {};
          return {
            text: "⚡ Perfecto, vamos a crear un reporte express. Es más rápido y simple.\n\n¿Cuál es el **nombre** de la persona?",
            type: "input",
            expectsResponse: true,
          };

        default:
          return {
            text: "Acción no reconocida. Volvamos al menú principal.",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };
      }
    },

    // Manejar visualización de reporte específico
    async handleViewReport(reportId, reportType) {
      try {
        console.log(
          `👁️ ChatBot: Cargando detalles del reporte ${reportId} (${reportType})`
        );

        // Aquí podrías cargar el reporte completo si es necesario
        // Para ahora, mostraremos un mensaje informativo

        return {
          text: `👁️ **Detalles del reporte ${
            reportType === "express" ? "Express" : "Completo"
          }**\n\n🔗 Para ver todos los detalles, puedes:\n\n1. Usar la **búsqueda avanzada** en el menú principal\n2. Ir a la sección de **reportes** de la aplicación\n\n*Próximamente podrás ver todos los detalles directamente aquí.*`,
          type: "options",
          options: [
            { id: "1", text: "🔍 Hacer otra búsqueda", value: "search_again" },
            { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
          ],
          expectsResponse: true,
        };
      } catch (error) {
        console.error("❌ ChatBot: Error al cargar reporte:", error);
        return {
          text: "❌ No pude cargar los detalles del reporte. ¿Quieres intentar de nuevo?",
          type: "options",
          options: [
            { id: "1", text: "🔍 Hacer otra búsqueda", value: "search_again" },
            { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
          ],
          expectsResponse: true,
        };
      }
    },

    // Manejar selección del menú principal
    handleMenuSelection(selection) {
      // Verificar permisos antes de ejecutar la acción
      const permissionCheck = this.checkPermissionForAction(selection);
      if (!permissionCheck.hasPermission) {
        return {
          text: permissionCheck.message,
          type: "menu",
          options: this.getAvailableMenuOptions(),
          expectsResponse: true,
        };
      }

      switch (selection) {
        case "search_region":
        case "1":
          this.currentFlow = "search_region";
          this.currentStep = 1;
          return {
            text: "📍 **¿En qué región buscas?**\n\nSelecciona una región:",
            type: "options",
            options: [
              {
                id: "1",
                text: "🏜️ Norte",
                value: "region_norte",
              },
              { id: "2", text: "🏙️ Centro", value: "region_centro" },
              { id: "3", text: "🏔️ Sur", value: "region_sur" },
              { id: "4", text: "🔙 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };

        case "search_category":
        case "2":
          this.currentFlow = "search_category";
          this.currentStep = 1;
          return {
            text: "🏷️ **¿Qué categoría prefieres?**\n\nSelecciona una categoría:",
            type: "options",
            options: [
              { id: "1", text: "👑 Enterprise", value: "category_enterprise" },
              { id: "2", text: "💎 VIP", value: "category_vip" },
              { id: "3", text: "⭐ Premium", value: "category_premium" },
              { id: "4", text: "🔥 Top", value: "category_top" },
              { id: "5", text: "💃 Normal", value: "category_normal" },
              { id: "6", text: "🔙 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };

        case "search_price":
        case "3":
          this.currentFlow = "search_price";
          this.currentStep = 1;
          return {
            text: "💰 **¿Cuál es tu presupuesto?**\n\nEscribe un monto (ej: 30000) o un rango (ej: 20000-50000):",
            type: "input",
            expectsResponse: true,
          };

        case "featured":
        case "4":
          this.currentFlow = "featured";
          return {
            text: "⭐ **Agencias Destacadas (Versión Beta)**\n\nEstas agencias pagan para aparecer como recomendadas:\n\n💎 Agencia Premium 1\n📍 Santiago Centro\n💰 $45.000 - $80.000\n🔗 Ver perfil\n\n💎 Agencia VIP 2\n📍 Providencia\n💰 $50.000 - $100.000\n🔗 Ver perfil\n\n*Nota: Esta es una versión beta. Próximamente más funciones.*",
            type: "options",
            options: [
              { id: "1", text: "🔍 Buscar por región", value: "search_region" },
              { id: "2", text: "🏠 Menú principal", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };

        case "create_report":
        case "2":
          this.currentFlow = "create_report";
          this.currentStep = 1;
          this.tempReportData = {};
          return {
            text: `${botPersonalityService.getCreateMessage(
              "starting"
            )}\n\n${botPersonalityService.getCreateMessage("askName")}`,
            type: "input",
            expectsResponse: true,
          };

        case "create_express":
        case "3":
          this.currentFlow = "create_express";
          this.currentStep = 1;
          this.tempExpressData = {};
          return {
            text: `${botPersonalityService.getCreateMessage(
              "startingExpress"
            )}\n\n${botPersonalityService.getCreateMessage("askName")}`,
            type: "input",
            expectsResponse: true,
          };

        case "login":
        case "6":
          return {
            text: botPersonalityService.getMenuMessage("needLogin"),
            type: "options",
            options: [
              { id: "1", text: "❓ Ayuda general", value: "help" },
              { id: "2", text: "🔄 Verificar sesión", value: "check_auth" },
            ],
            expectsResponse: true,
          };

        case "check_auth":
          this.checkAuthenticationStatus();
          if (this.isUserAuthenticated) {
            return {
              text: "✅ ¡Perfecto! Ya tienes sesión iniciada. Ahora puedes usar todas las funciones.",
              type: "menu",
              options: this.getAvailableMenuOptions(),
              expectsResponse: true,
            };
          } else {
            return {
              text: "❌ Aún no tienes sesión iniciada. Por favor, inicia sesión en la aplicación principal.",
              type: "options",
              options: [
                { id: "1", text: "🔑 Cómo iniciar sesión", value: "login" },
                { id: "2", text: "❓ Ayuda", value: "help" },
              ],
              expectsResponse: true,
            };
          }

        case "navigate_dashboard":
        case "4":
          // NUEVO: Abandonar sesión de tracking si existe y hay formulario en progreso
          const hasUnfinishedForm =
            Object.keys(this.tempReportData).length > 0 ||
            Object.keys(this.tempExpressData).length > 0;
          if (hasUnfinishedForm) {
            this.abandonBackendTracking();
          }

          // Cerrar el bot y limpiar completamente
          this.isVisible = false;
          // Iniciar recordatorio periódico ya que cerramos el bot
          this.startPeriodicHelpReminder();
          setTimeout(() => {
            this.messages = []; // Limpiar mensajes
            this.currentState = "MENU";
            this.currentFlow = "menu";
            this.currentStep = 0;
            this.tempReportData = {};
            this.tempExpressData = {};
            this.tempSearchData = {};
            this.validationState.fieldErrors = {};
            this.validationState.fieldSuggestions = {};
            // Limpiar localStorage
            this.clearLocalStorage();
          }, 300);
          return null; // No retornar mensaje

        case "help":
        case "5":
          return {
            text: botPersonalityService.getMenuMessage(
              "help",
              botPersonalityService.getFullName()
            ),
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };

        default:
          return {
            text: botPersonalityService.getMenuMessage("invalidOption"),
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };
      }
    },

    // Manejar flujo de búsqueda (versión mejorada con subflujos)
    handleSearchFlow(input, option) {
      switch (this.currentStep) {
        case 1: // Selección del tipo de búsqueda principal
          if (option?.value === "back_to_menu") {
            this.resetToMenu();
            return {
              text: "🏠 Volvamos al menú principal. ¿Qué te gustaría hacer?",
              type: "menu",
              options: this.getMenuOptions(),
              expectsResponse: true,
            };
          }

          // Guardar tipo de búsqueda seleccionado
          this.tempSearchData = { type: option?.value || input };

          switch (option?.value || input) {
            case "by_id":
            case "1":
              // Ir directamente a pedir el número de identificación
              this.currentStep = 3;
              this.tempSearchData.idType = "any_id"; // Buscar en todos los tipos
              return {
                text: botPersonalityService.getSearchMessage(
                  "byIdentification"
                ),
                type: "input",
                expectsResponse: true,
              };

            case "by_phone":
            case "2":
              // Ir directamente a pedir el número de teléfono
              this.currentStep = 13;
              this.tempSearchData.phoneType = "complete_phone";
              return {
                text: botPersonalityService.getSearchMessage("byPhone"),
                type: "input",
                expectsResponse: true,
              };

            case "by_name":
            case "3":
              this.currentStep = 22;
              return {
                text: botPersonalityService.getSearchMessage("byName"),
                type: "options",
                options: [
                  { id: "1", text: "👤 Nombre completo", value: "full_name" },
                  { id: "2", text: "📝 Solo nombre", value: "first_name" },
                  { id: "3", text: "👨‍👩‍👧‍👦 Solo apellido", value: "last_name" },
                  { id: "4", text: "🏷️ Por apodo/alias", value: "nickname" },
                  { id: "5", text: "🔙 Atrás", value: "back" },
                ],
                expectsResponse: true,
              };

            case "advanced":
            case "4":
              this.currentStep = 32;
              return {
                text: "🔬 Búsqueda avanzada disponible. ¿Qué filtros quieres usar?",
                type: "options",
                options: [
                  {
                    id: "1",
                    text: "📅 Por fecha de creación",
                    value: "by_date",
                  },
                  { id: "2", text: "⭐ Por calificación", value: "by_rating" },
                  {
                    id: "3",
                    text: "🏠 Por hostal/ubicación",
                    value: "by_location",
                  },
                  {
                    id: "4",
                    text: "👤 Por creador del reporte",
                    value: "by_creator",
                  },
                  { id: "5", text: "🔙 Atrás", value: "back" },
                ],
                expectsResponse: true,
              };

            // Nuevos flujos de búsqueda por región/categoría/precio
            case "region_norte":
            case "region_centro":
            case "region_sur":
              this.tempSearchData.region = option?.value;
              this.currentStep = 100; // Selección de ciudad
              const regionName =
                option?.value === "region_norte"
                  ? "Norte"
                  : option?.value === "region_centro"
                  ? "Centro"
                  : "Sur";
              const cities = this.getCitiesByRegion(option?.value);
              return {
                text: `📍 Región ${regionName} seleccionada. ¿En qué ciudad buscas?`,
                type: "options",
                options: cities.concat([
                  { id: "99", text: "🔙 Cambiar región", value: "back" },
                ]),
                expectsResponse: true,
              };

            case "category_enterprise":
            case "category_vip":
            case "category_premium":
            case "category_top":
            case "category_normal":
              this.tempSearchData.category = option?.value.replace(
                "category_",
                ""
              );
              this.currentStep = 102; // Pedir presupuesto
              const categoryNames = {
                enterprise: "Enterprise 👑",
                vip: "VIP 💎",
                premium: "Premium ⭐",
                top: "Top 🔥",
                normal: "Normal 💃",
              };
              return {
                text: `${
                  categoryNames[this.tempSearchData.category]
                } seleccionada. ¿Cuál es tu presupuesto máximo? (en $)`,
                type: "input",
                expectsResponse: true,
              };

            case "price_low":
            case "price_medium":
            case "price_high":
            case "price_custom":
              this.currentStep = 103;
              if (option?.value === "price_custom") {
                return {
                  text: "💰 Ingresa tu presupuesto máximo (solo el número):",
                  type: "input",
                  expectsResponse: true,
                };
              } else {
                this.tempSearchData.priceRange = option?.value;
                return this.searchProfiles();
              }

            default:
              return {
                text: "No entendí tu selección. ¿Cómo quieres buscar?",
                type: "options",
                options: [
                  { id: "1", text: "🆔 Por identificación", value: "by_id" },
                  { id: "2", text: "📱 Por teléfono", value: "by_phone" },
                  { id: "3", text: "👤 Por nombre", value: "by_name" },
                  { id: "4", text: "🔬 Búsqueda avanzada", value: "advanced" },
                  { id: "5", text: "🔙 Volver al menú", value: "back_to_menu" },
                ],
                expectsResponse: true,
              };
          }

        // ========== NUEVOS FLUJOS DE BÚSQUEDA POR REGIÓN/CATEGORÍA/PRECIO ==========
        case 100: // Selección de ciudad después de región
          if (option?.value === "back") {
            this.currentStep = 1;
            // Volver a mostrar selección de región
            return {
              text: "🗺️ ¿En qué región quieres buscar?",
              type: "options",
              options: [
                { id: "1", text: "🌊 Norte", value: "region_norte" },
                { id: "2", text: "🏙️ Centro", value: "region_centro" },
                { id: "3", text: "🏔️ Sur", value: "region_sur" },
                { id: "4", text: "🔙 Volver al menú", value: "back_to_menu" },
              ],
              expectsResponse: true,
            };
          }

          this.tempSearchData.city = option?.text
            ?.replace(/[🏙️📍🌊🏔️⛰️🏖️🌴🏢]/g, "")
            .trim();
          this.currentStep = 101; // Preguntar categoría
          return {
            text: `Ciudad ${this.tempSearchData.city} seleccionada. ¿Qué categoría te interesa?`,
            type: "options",
            options: [
              { id: "1", text: "👑 Enterprise", value: "category_enterprise" },
              { id: "2", text: "💎 VIP", value: "category_vip" },
              { id: "3", text: "⭐ Premium", value: "category_premium" },
              { id: "4", text: "🔥 Top", value: "category_top" },
              { id: "5", text: "💃 Normal", value: "category_normal" },
              { id: "6", text: "🔙 Cambiar ciudad", value: "back" },
            ],
            expectsResponse: true,
          };

        case 101: // Selección de categoría (ya manejado en case 1, pero agregamos back)
          if (option?.value === "back") {
            this.currentStep = 100;
            const cities = this.getCitiesByRegion(this.tempSearchData.region);
            return {
              text: "📍 ¿En qué ciudad buscas?",
              type: "options",
              options: cities.concat([
                { id: "99", text: "🔙 Cambiar región", value: "back" },
              ]),
              expectsResponse: true,
            };
          }
          break;

        case 102: // Entrada de presupuesto
          const budget = parseInt(input?.replace(/[^0-9]/g, ""));
          if (isNaN(budget) || budget <= 0) {
            return {
              text: "❌ Por favor ingresa un presupuesto válido (solo números). Ejemplo: 50000",
              type: "input",
              expectsResponse: true,
            };
          }
          this.tempSearchData.maxPrice = budget;
          return this.searchProfiles();

        case 103: // Presupuesto personalizado
          const customBudget = parseInt(input?.replace(/[^0-9]/g, ""));
          if (isNaN(customBudget) || customBudget <= 0) {
            return {
              text: "❌ Por favor ingresa un monto válido (solo números).",
              type: "input",
              expectsResponse: true,
            };
          }
          this.tempSearchData.maxPrice = customBudget;
          return this.searchProfiles();

        // ========== SUBFLUJOS DE BÚSQUEDA POR ID ==========
        case 2: // Tipo de identificación específico
          if (option?.value === "back") {
            this.currentStep = 1;
            return this.getSearchTypeOptions();
          }

          this.tempSearchData.idType = option?.value;
          this.currentStep = 3;

          switch (option?.value) {
            case "rut":
              return {
                text: "🇨🇱 Ingresa el RUT **sin puntos ni guión**:\n\n*Ejemplo: 123456789*",
                type: "input",
                expectsResponse: true,
              };
            case "cedula":
              return {
                text: "🆔 Ingresa el número de cédula:\n\n*Ejemplo: 1234567890*",
                type: "input",
                expectsResponse: true,
              };
            case "pasaporte":
              return {
                text: "🛂 Ingresa el número de pasaporte:\n\n*Ejemplo: A12345678*",
                type: "input",
                expectsResponse: true,
              };
            case "any_id":
              return {
                text: "🔍 Ingresa cualquier número de identificación:\n\n*Buscaré en todos los tipos*",
                type: "input",
                expectsResponse: true,
              };
          }
          break;

        case 3: // Entrada de identificación específica
          return this.handleIdSearch(input);

        // ========== SUBFLUJOS DE BÚSQUEDA POR TELÉFONO ==========
        case 12: // Tipo de búsqueda por teléfono
          if (option?.value === "back") {
            this.currentStep = 1;
            return this.getSearchTypeOptions();
          }

          this.tempSearchData.phoneType = option?.value;
          this.currentStep = 13;

          switch (option?.value) {
            case "complete_phone":
              return {
                text: "📱 Ingresa el número completo (solo números):\n\n*Ejemplo: 3001234567 o 56912345678*",
                type: "input",
                expectsResponse: true,
              };
            case "partial_phone":
              return {
                text: "🔍 Ingresa la parte del número que recuerdes (mínimo 4 dígitos):\n\n*Ejemplo: 1234 o 5678*",
                type: "input",
                expectsResponse: true,
              };
            case "country_phone":
              return {
                text: "🌍 ¿De qué país es el teléfono?",
                type: "options",
                options: [
                  { id: "1", text: "🇨🇱 Chile (+56)", value: "+56" },
                  { id: "2", text: "🇨🇴 Colombia (+57)", value: "+57" },
                  { id: "3", text: "🇦🇷 Argentina (+54)", value: "+54" },
                  { id: "4", text: "🇵🇪 Perú (+51)", value: "+51" },
                  { id: "5", text: "🌎 Otro", value: "other" },
                ],
                expectsResponse: true,
              };
          }
          break;

        case 13: // Entrada de teléfono específica
          return this.handlePhoneSearch(input, option);

        // ========== SUBFLUJOS DE BÚSQUEDA POR NOMBRE ==========
        case 22: // Tipo de búsqueda por nombre
          if (option?.value === "back") {
            this.currentStep = 1;
            return this.getSearchTypeOptions();
          }

          this.tempSearchData.nameType = option?.value;
          this.currentStep = 23;

          switch (option?.value) {
            case "full_name":
              return {
                text: "👤 Ingresa el nombre completo:\n\n*Ejemplo: Juan Carlos Pérez*",
                type: "input",
                expectsResponse: true,
              };
            case "first_name":
              return {
                text: "📝 Ingresa solo el nombre:\n\n*Ejemplo: María*",
                type: "input",
                expectsResponse: true,
              };
            case "last_name":
              return {
                text: "👨‍👩‍👧‍👦 Ingresa solo el apellido:\n\n*Ejemplo: González*",
                type: "input",
                expectsResponse: true,
              };
            case "nickname":
              return {
                text: "🏷️ Ingresa el apodo o alias:\n\n*Ejemplo: Juancho, La Mari*",
                type: "input",
                expectsResponse: true,
              };
          }
          break;

        case 23: // Entrada de nombre específica
          return this.handleNameSearch(input);

        // ========== SUBFLUJOS DE BÚSQUEDA AVANZADA ==========
        case 32: // Tipos de búsqueda avanzada
          if (option?.value === "back") {
            this.currentStep = 1;
            return this.getSearchTypeOptions();
          }

          this.tempSearchData.advancedType = option?.value;
          this.currentStep = 33;

          switch (option?.value) {
            case "by_date":
              return {
                text: "📅 ¿En qué período quieres buscar?",
                type: "options",
                options: [
                  { id: "1", text: "📆 Hoy", value: "today" },
                  { id: "2", text: "📅 Esta semana", value: "this_week" },
                  { id: "3", text: "🗓️ Este mes", value: "this_month" },
                  {
                    id: "4",
                    text: "📋 Últimos 3 meses",
                    value: "last_3_months",
                  },
                  {
                    id: "5",
                    text: "📝 Fecha específica",
                    value: "specific_date",
                  },
                ],
                expectsResponse: true,
              };
            // Implementar otros casos...
          }
          break;

        default:
          this.resetToMenu();
          return {
            text: "Ocurrió un error en la búsqueda. Volvamos al menú principal.",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };
      }
    },

    // Manejar flujo de creación de reporte (implementación básica)
    async handleCreateReportFlow(input, option) {
      const step = this.currentStep;

      // Inicializar flujo si es el primer paso
      if (step === 0) {
        this.currentStep = 1;
        this.tempReportData = {};
        return {
          text:
            "¡Perfecto! Vamos a crear un reporte completo paso a paso. 📝\n\n" +
            "Empecemos con los datos personales. ¿Cuál es el **nombre** de la persona?",
          type: "input",
          expectsResponse: true,
        };
      }

      switch (step) {
        case 1: // Nombre
          const nameValidation = await this.processInputWithValidation(
            input,
            "nombre"
          );
          if (nameValidation.success) {
            this.tempReportData.nombre = nameValidation.value;
            this.currentStep = 2;
            return {
              text: `¡Perfecto ${nameValidation.value}! ✅ ¿Y cuál es el **apellido**?`,
              type: "input",
              expectsResponse: true,
            };
          } else {
            this.showValidationFeedback(nameValidation, "nombre");
            return {
              text: "Por favor, intenta nuevamente:",
              type: "input",
              expectsResponse: true,
            };
          }

        case 2: // Apellido
          const surnameValidation = await this.processInputWithValidation(
            input,
            "apellido"
          );
          if (surnameValidation.success) {
            this.tempReportData.apellido = surnameValidation.value;
            this.currentStep = 3;
            return {
              text: '¿Tiene algún **apodo** o nombre alternativo? (escribe "no" si no tiene)',
              type: "input",
              expectsResponse: true,
            };
          } else {
            this.showValidationFeedback(surnameValidation, "apellido");
            return {
              text: "Por favor, intenta nuevamente:",
              type: "input",
              expectsResponse: true,
            };
          }

        case 3: // Apodos (opcional)
          this.tempReportData.nickNames =
            input.trim().toLowerCase() !== "no" && input.trim() !== ""
              ? [input.trim()]
              : [];
          this.currentStep = 4;
          return {
            text: "¿Qué tipo de **identificación** tiene?",
            type: "options",
            options: [
              { id: "1", text: "🇨🇱 RUT (Chile)", value: "rut" },
              { id: "2", text: "🆔 Cédula", value: "cedula" },
              { id: "3", text: "� Pasaporte", value: "pasaporte" },
            ],
            expectsResponse: true,
          };

        case 4: // Tipo de identificación
          const idType = option?.value;
          if (["rut", "cedula", "pasaporte"].includes(idType)) {
            this.tempReportData.idType = idType;
            this.currentStep = 5;

            let example = "";
            if (idType === "rut")
              example = " (sin puntos ni guión, ej: 123456789)";
            else if (idType === "cedula") example = " (ej: 1234567890)";
            else if (idType === "pasaporte") example = " (ej: A12345678)";

            const types = {
              rut: "RUT",
              cedula: "Cédula",
              pasaporte: "Pasaporte",
            };

            return {
              text: `Perfecto. Ahora ingresa el **${types[idType]}**${example}:`,
              type: "input",
              expectsResponse: true,
            };
          }
          break;

        case 5: // Número de identificación
          if (this.validateIdentification(input, this.tempReportData.idType)) {
            this.tempReportData.identificacion = input.trim();
            this.currentStep = 6;

            // Crear opciones de código de país desde paises.json
            const countryOptions = [];
            let optionId = 1;

            // Agregar países de América (los más comunes para migrantes)
            for (const [region, paises] of Object.entries(paisesData)) {
              for (const [code, data] of Object.entries(paises)) {
                countryOptions.push({
                  id: String(optionId++),
                  text: `${data.nombre} (${data.prefijo})`,
                  value: data.prefijo,
                });
              }
            }

            return {
              text: "¿De qué país es el **número de teléfono**? Selecciona el código:",
              type: "options",
              options: countryOptions,
              expectsResponse: true,
            };
          } else {
            return {
              text: "Por favor ingresa una identificación válida según el tipo seleccionado.",
              type: "input",
              expectsResponse: true,
            };
          }

        case 6: // Código de país
          const countryCode = option?.value;
          if (countryCode) {
            this.tempReportData.telefonoCodigoPais = countryCode;
            this.currentStep = 7;
            return {
              text: `Perfecto. Ahora ingresa el **número de teléfono** (sin código de país, ej: 912345678):`,
              type: "input",
              expectsResponse: true,
            };
          }
          break;

        case 7: // Número de teléfono
          // Validación simple: solo números, 8-15 dígitos
          const phoneNumber = input.trim().replace(/\s/g, "");
          if (/^\d{8,15}$/.test(phoneNumber)) {
            // Guardar teléfono con código de país
            this.tempReportData.telefono = [
              {
                countryCode: this.tempReportData.telefonoCodigoPais,
                number: phoneNumber,
              },
            ];
            this.currentStep = 8;
            return {
              text: '¿Cuál es su **email**? (opcional, escribe "no" para omitir)',
              type: "input",
              expectsResponse: true,
            };
          } else {
            return {
              text: "⚠️ El número debe tener entre 8 y 15 dígitos.\n\nEjemplo: 912345678\n\nPor favor, intenta nuevamente:",
              type: "input",
              expectsResponse: true,
            };
          }

        case 8: // Email (opcional)
          if (input.trim().toLowerCase() === "no" || input.trim() === "") {
            this.tempReportData.email = "";
          } else {
            const emailValidation = await this.processInputWithValidation(
              input,
              "email"
            );
            if (!emailValidation.success) {
              this.showValidationFeedback(emailValidation, "email");
              return {
                text: "Por favor, intenta nuevamente:",
                type: "input",
                expectsResponse: true,
              };
            }
            this.tempReportData.email = emailValidation.value;
          }

          this.currentStep = 9;
          return {
            text: "¿Cuál es su **género**?",
            type: "options",
            options: [
              { id: "1", text: "👨 Masculino", value: "masculino" },
              { id: "2", text: "👩 Femenino", value: "femenino" },
              { id: "3", text: "🏳️‍⚧️ Transgénero", value: "transgenero" },
              { id: "4", text: "🤝 Otro", value: "otro" },
              {
                id: "5",
                text: "❓ Prefiero no especificar",
                value: "sin_datos",
              },
            ],
            expectsResponse: true,
          };

        case 9: // Género
          const gender = option?.value;
          if (
            [
              "masculino",
              "femenino",
              "transgenero",
              "otro",
              "sin_datos",
            ].includes(gender)
          ) {
            this.tempReportData.genero = gender;
            this.currentStep = 10;

            // Crear opciones de nacionalidad desde paises.json
            const nacionalidadesOptions = [];
            const paisesUnicos = new Set();
            let optionId = 1;

            // Extraer nombres únicos de países desde paises.json
            for (const [region, paises] of Object.entries(paisesData)) {
              for (const [code, data] of Object.entries(paises)) {
                if (!paisesUnicos.has(data.nombre)) {
                  paisesUnicos.add(data.nombre);
                  nacionalidadesOptions.push({
                    id: String(optionId++),
                    text: data.nombre,
                    value: data.nombre,
                  });
                }
              }
            }

            // Ordenar alfabéticamente
            nacionalidadesOptions.sort((a, b) => a.text.localeCompare(b.text));

            // Agregar opción de omitir
            nacionalidadesOptions.push({
              id: "0",
              text: "❓ Omitir",
              value: "omitir",
            });

            return {
              text: "¿Cuál es su **nacionalidad**?",
              type: "options",
              options: nacionalidadesOptions,
              expectsResponse: true,
            };
          }
          break;

        case 10: // Nacionalidad (opcional)
          const nationality = option?.value;
          this.tempReportData.nacionalidad =
            nationality !== "omitir" ? nationality : "";
          this.currentStep = 11;
          return {
            text:
              "¡Excelente! Ahora evaluaremos diferentes aspectos. 📊\n\n" +
              "Responde con:\n" +
              "✅ **Sí** - Cumple satisfactoriamente\n" +
              "❌ **No** - No cumple\n" +
              "🟡 **A veces** - Cumple parcialmente\n" +
              "❓ **Sin datos** - No tienes información\n\n" +
              "**¿Paga puntualmente?**",
            type: "options",
            options: [
              { id: "1", text: "✅ Sí", value: "si" },
              { id: "2", text: "❌ No", value: "no" },
              { id: "3", text: "🟡 A veces", value: "sipoco" },
              { id: "4", text: "❓ Sin datos", value: "sin" },
            ],
            expectsResponse: true,
          };

        default:
          if (step >= 11 && step <= 28) {
            // Manejar evaluaciones (18 evaluaciones estándar)
            return this.handleEvaluation(step - 11, option?.value);
          } else if (step === 29) {
            // Comentarios adicionales
            this.tempReportData.comentariosAdicionales = input.trim();
            this.currentStep = 30;

            // Mostrar resumen del reporte
            const summary = this.formatReportSummary(this.tempReportData);

            return {
              text:
                "📋 **Resumen del reporte completo:**\n\n" +
                summary +
                "\n\n¿Está todo correcto?",
              type: "form_summary",
              options: [
                {
                  id: "1",
                  text: "✅ Sí, guardar reporte",
                  value: "save",
                  primary: true,
                },
                { id: "2", text: "✏️ Editar algo", value: "edit" },
                { id: "3", text: "❌ Cancelar", value: "cancel" },
              ],
              expectsResponse: true,
              formData: this.tempReportData,
            };
          } else if (step === 30) {
            // Confirmación final
            return this.handleFinalReportConfirmation(option?.value);
          }
      }

      // Fallback en caso de error
      return {
        text: "Algo salió mal. Volvamos al menú principal.",
        type: "menu",
        options: this.getMenuOptions(),
        expectsResponse: true,
      };
    },

    // Manejar flujo de creación express (implementación completa)
    handleCreateExpressFlow(input, option) {
      const step = this.currentStep;

      // Inicializar flujo si es el primer paso
      if (step === 0) {
        this.currentStep = 1;
        this.tempExpressData = {};
        return {
          text:
            "⚡ ¡Perfecto! Vamos a crear un reporte express rápido. 🚀\n\n" +
            "Empecemos con los datos básicos. ¿Cuál es el **nombre** de la persona?",
          type: "input",
          expectsResponse: true,
        };
      }

      switch (step) {
        case 1: // Nombre
          if (this.validateName(input)) {
            this.tempExpressData.nombre = input.trim();
            this.currentStep = 2;
            return {
              text: "¿Y cuál es el **apellido**?",
              type: "input",
              expectsResponse: true,
            };
          } else {
            return {
              text: "Por favor ingresa un nombre válido (mínimo 2 caracteres, solo letras y espacios).",
              type: "input",
              expectsResponse: true,
            };
          }

        case 2: // Apellido
          if (this.validateName(input)) {
            this.tempExpressData.apellido = input.trim();
            this.currentStep = 3;
            return {
              text: "¿Qué tipo de **identificación** tiene?",
              type: "options",
              options: [
                { id: "1", text: "🇨🇱 RUT (Chile)", value: "rut" },
                { id: "2", text: "🆔 Cédula", value: "cedula" },
                { id: "3", text: "🛂 Pasaporte", value: "pasaporte" },
              ],
              expectsResponse: true,
            };
          } else {
            return {
              text: "Por favor ingresa un apellido válido (mínimo 2 caracteres, solo letras y espacios).",
              type: "input",
              expectsResponse: true,
            };
          }

        case 3: // Tipo de identificación
          const idType = option?.value;
          if (["rut", "cedula", "pasaporte"].includes(idType)) {
            this.tempExpressData.idType = idType;
            this.currentStep = 4;

            let example = "";
            if (idType === "rut")
              example = " (sin puntos ni guión, ej: 123456789)";
            else if (idType === "cedula") example = " (ej: 1234567890)";
            else if (idType === "pasaporte") example = " (ej: A12345678)";

            const types = {
              rut: "RUT",
              cedula: "Cédula",
              pasaporte: "Pasaporte",
            };

            return {
              text: `Perfecto. Ahora ingresa el **${types[idType]}**${example}:`,
              type: "input",
              expectsResponse: true,
            };
          }
          break;

        case 4: // Número de identificación
          if (this.validateIdentification(input, this.tempExpressData.idType)) {
            this.tempExpressData.identificacion = input.trim();
            this.currentStep = 5;
            return {
              text: "¿Cuál es su **número de teléfono**? (sin código de país, ej: 912345678)",
              type: "input",
              expectsResponse: true,
            };
          } else {
            return {
              text: "Por favor ingresa una identificación válida según el tipo seleccionado.",
              type: "input",
              expectsResponse: true,
            };
          }

        case 5: // Teléfono
          if (this.validatePhone(input)) {
            this.tempExpressData.telefono = this.parsePhone(input);
            this.currentStep = 6;
            return {
              text:
                "¡Excelente! Ahora las evaluaciones express. ⭐\n\n" +
                "Evalúa del 1 al 5 (1=Muy malo, 5=Excelente):\n\n" +
                "**¿Paga y avisa con anticipación?** (1-5)",
              type: "options",
              options: [
                { id: "1", text: "⭐ 1 - Muy malo", value: "1" },
                { id: "2", text: "⭐⭐ 2 - Malo", value: "2" },
                { id: "3", text: "⭐⭐⭐ 3 - Regular", value: "3" },
                { id: "4", text: "⭐⭐⭐⭐ 4 - Bueno", value: "4" },
                { id: "5", text: "⭐⭐⭐⭐⭐ 5 - Excelente", value: "5" },
              ],
              expectsResponse: true,
            };
          } else {
            return {
              text: "Por favor ingresa un teléfono válido (sin código de país, ej: 912345678).",
              type: "input",
              expectsResponse: true,
            };
          }

        default:
          if (step >= 6 && step <= 10) {
            // Manejar evaluaciones express (5 evaluaciones)
            return this.handleExpressEvaluation(step - 6, option?.value);
          } else if (step === 11) {
            // Recomendación final
            const recommend = option?.value;
            if (["si", "no"].includes(recommend)) {
              this.tempExpressData.recomendado = recommend === "si";
              this.currentStep = 12;
              return {
                text: '¿Quieres agregar algún **comentario adicional**? (escribe "no" si no)',
                type: "input",
                expectsResponse: true,
              };
            }
            break;
          } else if (step === 12) {
            // Comentarios adicionales
            this.tempExpressData.comentarios =
              input.trim().toLowerCase() !== "no" && input.trim() !== ""
                ? input.trim()
                : "";
            this.currentStep = 13;

            // Mostrar resumen del reporte express
            const summary = this.formatExpressReportSummary(
              this.tempExpressData
            );

            return {
              text:
                "⚡ **Resumen del reporte express:**\n\n" +
                summary +
                "\n\n¿Está todo correcto?",
              type: "form_summary",
              options: [
                {
                  id: "1",
                  text: "✅ Sí, guardar reporte",
                  value: "save",
                  primary: true,
                },
                { id: "2", text: "✏️ Editar algo", value: "edit" },
                { id: "3", text: "❌ Cancelar", value: "cancel" },
              ],
              expectsResponse: true,
              formData: this.tempExpressData,
            };
          } else if (step === 13) {
            // Confirmación final
            return this.handleFinalExpressConfirmation(option?.value);
          }
      }

      // Fallback en caso de error
      return {
        text: "Algo salió mal. Volvamos al menú principal.",
        type: "menu",
        options: this.getMenuOptions(),
        expectsResponse: true,
      };
    },

    // Obtener opciones del menú
    getMenuOptions() {
      return [
        { id: "1", text: "🔍 Buscar reportes", value: "search" },
        { id: "2", text: "📝 Crear reporte completo", value: "create_report" },
        { id: "3", text: "⚡ Crear reporte express", value: "create_express" },
        { id: "4", text: "🏠 Navegar en la app", value: "navigate_dashboard" },
        { id: "5", text: "❓ Ayuda", value: "help" },
      ];
    },

    // Obtener opciones del menú según permisos del usuario
    getAvailableMenuOptions() {
      const authStore = useAuthStore();

      const allOptions = [
        { id: "1", text: "🔍 Buscar reportes", value: "search" },
        { id: "2", text: "📝 Crear reporte completo", value: "create_report" },
        { id: "3", text: "⚡ Crear reporte express", value: "create_express" },
        { id: "4", text: "🏠 Navegar en la app", value: "navigate_dashboard" },
        { id: "5", text: "❓ Ayuda", value: "help" },
      ];

      // ⚠️ TEMPORAL: Autenticación desactivada para testing
      // ⚠️ REVERTIR: Descomentar las siguientes 7 líneas para reactivar autenticación
      /*
      // Si no está autenticado, solo mostrar ayuda y login
      if (!authStore.isAuthenticated) {
        return [
          { id: '5', text: '❓ Ayuda', value: 'help' },
          { id: '6', text: '🔑 Iniciar sesión', value: 'login' }
        ]
      }
      */

      // Si no puede crear reportes, filtrar esas opciones
      if (!this.canCreateReports) {
        return allOptions.filter(
          (opt) => !["create_report", "create_express"].includes(opt.value)
        );
      }

      return allOptions;
    },

    // Obtener ciudades por región
    getCitiesByRegion(region) {
      const citiesByRegion = {
        region_norte: [
          { id: "1", text: "🌊 Arica", value: "arica" },
          { id: "2", text: "🏖️ Iquique", value: "iquique" },
          { id: "3", text: "⛰️ Antofagasta", value: "antofagasta" },
          { id: "4", text: "🏙️ Calama", value: "calama" },
          { id: "5", text: "🏢 Copiapó", value: "copiapo" },
          { id: "6", text: "🌴 Vallenar", value: "vallenar" },
          { id: "7", text: "📍 Chañaral", value: "chanaral" },
          { id: "8", text: "🏖️ Tocopilla", value: "tocopilla" },
        ],
        region_centro: [
          { id: "1", text: "🌊 La Serena", value: "la_serena" },
          { id: "2", text: "🏖️ Coquimbo", value: "coquimbo" },
          { id: "3", text: "🏙️ Ovalle", value: "ovalle" },
          { id: "4", text: "🏢 Valparaíso", value: "valparaiso" },
          { id: "5", text: "🌴 Viña del Mar", value: "vina_del_mar" },
          { id: "6", text: "🏛️ Santiago", value: "santiago" },
          { id: "7", text: "🏙️ Rancagua", value: "rancagua" },
          { id: "8", text: "🌳 Talca", value: "talca" },
        ],
        region_sur: [
          { id: "1", text: "🏙️ Concepción", value: "concepcion" },
          { id: "2", text: "🌲 Temuco", value: "temuco" },
          { id: "3", text: "🌊 Valdivia", value: "valdivia" },
          { id: "4", text: "🏔️ Puerto Montt", value: "puerto_montt" },
          { id: "5", text: "🏢 Osorno", value: "osorno" },
          { id: "6", text: "❄️ Punta Arenas", value: "punta_arenas" },
          { id: "7", text: "🏞️ Coyhaique", value: "coyhaique" },
          { id: "8", text: "🏝️ Castro", value: "castro" },
        ],
      };
      return citiesByRegion[region] || [];
    },

    // Buscar perfiles según criterios
    async searchProfiles() {
      try {
        const { region, city, category, maxPrice } = this.tempSearchData;

        // Aquí iría la lógica real de búsqueda llamando al repository
        // Por ahora retornamos un mensaje de éxito simulado

        this.addMessage({
          sender: "bot",
          text: `🔍 Buscando perfiles...\n\n📍 Ciudad: ${city}\n🏆 Categoría: ${category}\n💰 Presupuesto máximo: $${maxPrice?.toLocaleString()}`,
          type: "text",
        });

        // Simular resultados (esto se reemplazará con llamada real al API)
        setTimeout(() => {
          this.addMessage({
            sender: "bot",
            text: botPersonalityService.getProfileMessage(
              "resultsFound",
              3,
              city,
              category
            ),
            type: "text",
          });

          // Aquí agregarías los perfiles reales
          this.addMessage({
            sender: "bot",
            text: "🔗 Ver perfiles disponibles en la sección principal",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          });
        }, 1500);

        this.resetToMenu();
        return null;
      } catch (error) {
        console.error("Error searching profiles:", error);
        return {
          text: "❌ Hubo un error al buscar perfiles. Por favor intenta nuevamente.",
          type: "menu",
          options: this.getMenuOptions(),
          expectsResponse: true,
        };
      }
    },

    // Resetear al menú principal
    resetToMenu() {
      this.currentFlow = "menu";
      this.currentStep = 0;
      this.tempReportData = {};
      this.tempExpressData = {};
      this.tempSearchData = {};
    },

    // Ejecutar búsqueda real usando los stores existentes
    async performActualSearch() {
      try {
        const { type, query } = this.tempSearchData;

        // Convertir tipo de búsqueda al formato esperado por las APIs
        let searchType;
        switch (type) {
          case "by_id":
            searchType = "identificacion";
            break;
          case "by_phone":
            searchType = "telefono";
            break;
          case "by_name":
            searchType = "nombre";
            break;
          default:
            searchType = "nombre";
        }

        console.log(
          `🔍 ChatBot: Ejecutando búsqueda ${searchType}: "${query}"`
        );

        // Obtener stores
        const reportsStore = useReportsStore();
        const expressReportsStore = useExpressReportsStore();

        let allResults = [];
        let searchErrors = [];

        // Buscar en reportes estándar
        try {
          console.log("🔍 ChatBot: Buscando en reportes estándar...");
          const standardResponse = await reportsStore.searchReports(
            searchType,
            query
          );

          if (
            standardResponse &&
            standardResponse.success &&
            Array.isArray(reportsStore.searchResults)
          ) {
            const standardResults = reportsStore.searchResults.map(
              (report) => ({
                ...report,
                fromCollection: "reports",
                reportType: "standard",
              })
            );
            allResults.push(...standardResults);
            console.log(
              `✅ ChatBot: ${standardResults.length} reportes estándar encontrados`
            );
          } else {
            console.log("⚠️ ChatBot: No se encontraron reportes estándar");
          }
        } catch (error) {
          console.error("❌ ChatBot: Error en búsqueda estándar:", error);
          searchErrors.push(
            "Reportes estándar: " + (error.message || "Error desconocido")
          );
        }

        // Buscar en reportes express
        try {
          console.log("🔍 ChatBot: Buscando en reportes express...");
          const expressResponse =
            await expressReportsStore.searchExpressReports({
              type: searchType,
              query: query,
            });

          if (
            expressResponse &&
            expressResponse.success &&
            Array.isArray(expressResponse.results)
          ) {
            const expressResults = expressResponse.results.map((report) => ({
              ...report,
              fromCollection: "expressReports",
              reportType: "express",
            }));
            allResults.push(...expressResults);
            console.log(
              `✅ ChatBot: ${expressResults.length} reportes express encontrados`
            );
          } else {
            console.log("⚠️ ChatBot: No se encontraron reportes express");
          }
        } catch (error) {
          console.error("❌ ChatBot: Error en búsqueda express:", error);
          searchErrors.push(
            "Reportes express: " + (error.message || "Error desconocido")
          );
        }

        console.log(`🎯 ChatBot: Total de resultados: ${allResults.length}`);

        // Si hay errores pero también resultados, mostrar advertencia
        if (searchErrors.length > 0 && allResults.length > 0) {
          console.warn(
            "⚠️ ChatBot: Búsqueda parcialmente exitosa con errores:",
            searchErrors
          );
          // Continuamos con los resultados que tenemos
        }

        // Si hay errores y no hay resultados, mostrar error
        if (searchErrors.length > 0 && allResults.length === 0) {
          this.addBotMessage(
            `❌ Ocurrió un error durante la búsqueda:\n\n${searchErrors.join(
              "\n"
            )}\n\n¿Quieres intentar de nuevo?`,
            "options",
            [
              { id: "1", text: "🔄 Intentar de nuevo", value: "search_again" },
              { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            true
          );
          this.resetToMenu();
          return;
        }

        // Generar respuesta según resultados
        await this.handleSearchResults(allResults, query, searchType);
      } catch (error) {
        console.error("❌ ChatBot: Error general en búsqueda:", error);
        this.addBotMessage(
          "❌ Ocurrió un error inesperado durante la búsqueda. Por favor, inténtalo de nuevo más tarde.",
          "options",
          [
            { id: "1", text: "🔄 Intentar de nuevo", value: "search_again" },
            { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
          ],
          true
        );
        this.resetToMenu();
      }
    },

    // Manejar resultados de búsqueda
    async handleSearchResults(results, query, searchType) {
      // Esperar un poco para simular el procesamiento
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (results.length === 0) {
        // Sin resultados
        this.addBotMessage(
          `😞 No se encontraron reportes para "${query}".\n\n¿Te gustaría hacer otra búsqueda o crear un reporte nuevo?`,
          "options",
          [
            { id: "1", text: "🔍 Hacer otra búsqueda", value: "search_again" },
            {
              id: "2",
              text: "📝 Crear reporte completo",
              value: "create_report",
            },
            {
              id: "3",
              text: "⚡ Crear reporte express",
              value: "create_express",
            },
            { id: "4", text: "🏠 Volver al menú", value: "back_to_menu" },
          ],
          true
        );
      } else if (results.length === 1) {
        // Un solo resultado
        const report = results[0];
        const isExpress =
          report.reportType === "express" ||
          report.fromCollection === "expressReports";

        this.addBotMessage(
          `🎯 ¡Encontré **1 reporte** para "${query}"!\n\n**${report.nombre} ${
            report.apellido
          }**\n📋 Tipo: ${isExpress ? "⚡ Express" : "📋 Estándar"}\n🆔 ID: ${
            report.identificacion || "N/A"
          }\n📅 Creado: ${this.formatDateForChat(report.createdAt)}`,
          "options",
          [
            {
              id: "1",
              text: "👁️ Ver detalles completos",
              value: `view_${report.id}_${report.reportType}`,
            },
            { id: "2", text: "🔍 Hacer otra búsqueda", value: "search_again" },
            { id: "3", text: "🏠 Volver al menú", value: "back_to_menu" },
          ],
          true,
          results // Incluir los resultados en el mensaje
        );
      } else {
        // Múltiples resultados
        const standardCount = results.filter(
          (r) => r.reportType === "standard" || r.fromCollection === "reports"
        ).length;
        const expressCount = results.filter(
          (r) =>
            r.reportType === "express" || r.fromCollection === "expressReports"
        ).length;

        let resultText = `🎯 ¡Encontré **${results.length} reportes** para "${query}"!\n\n`;
        resultText += `📊 **Resumen:**\n`;
        if (standardCount > 0)
          resultText += `• ${standardCount} reporte(s) estándar 📋\n`;
        if (expressCount > 0)
          resultText += `• ${expressCount} reporte(s) express ⚡\n\n`;

        resultText += `**📋 Resultados:**\n`;

        // Mostrar hasta 5 resultados
        const limitedResults = results.slice(0, 5);
        limitedResults.forEach((report, index) => {
          const isExpress =
            report.reportType === "express" ||
            report.fromCollection === "expressReports";
          resultText += `\n${index + 1}. **${report.nombre} ${
            report.apellido
          }**\n`;
          resultText += `   ${isExpress ? "⚡ Express" : "📋 Estándar"} • `;
          resultText += `🆔 ${report.identificacion || "N/A"}\n`;
        });

        if (results.length > 5) {
          resultText += `\n... y ${results.length - 5} resultado(s) más`;
        }

        // Crear opciones para ver resultados individuales (máximo 5)
        const viewOptions = limitedResults.map((report, index) => ({
          id: `view_${index}`,
          text: `👁️ Ver ${report.nombre} ${report.apellido}`,
          value: `view_${report.id}_${report.reportType}`,
        }));

        const allOptions = [
          ...viewOptions,
          {
            id: "search_again",
            text: "🔍 Hacer otra búsqueda",
            value: "search_again",
          },
          { id: "back_menu", text: "🏠 Volver al menú", value: "back_to_menu" },
        ];

        this.addBotMessage(resultText, "options", allOptions, true, results);
      }

      // Resetear datos de búsqueda
      this.tempSearchData = {};
      this.currentStep = 4; // Estado post-resultados
    },

    // Formatear fecha para el chat
    formatDateForChat(dateString) {
      if (!dateString) return "Fecha no disponible";

      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "Ayer";
        if (diffDays <= 7) return `Hace ${diffDays} días`;
        if (diffDays <= 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;

        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return "Fecha inválida";
      }
    },

    // Limpiar conversación
    clearConversation() {
      this.messages = [];
      this.resetToMenu();
      this.addWelcomeMessage();
      this.saveToLocalStorage();
    },

    // Mostrar/ocultar bot
    toggleVisibility() {
      this.isVisible = !this.isVisible;
      if (this.isVisible && this.messages.length === 0) {
        this.initializeSession();
      }
      // Ocultar la viñeta de ayuda después de abrir el bot
      if (this.isVisible) {
        this.showHelpBubble = false;
        this.stopPeriodicHelpReminder();
      } else {
        // Si cierra el bot, mostrar mensaje inmediatamente y luego periódicamente
        this.startPeriodicHelpReminder();
      }
    },

    // Iniciar recordatorio periódico de ayuda
    startPeriodicHelpReminder() {
      // Limpiar intervalo anterior si existe
      this.stopPeriodicHelpReminder();

      // Mostrar inmediatamente al cerrar el bot
      if (!this.isVisible) {
        this.showHelpBubble = true;
        // Auto-ocultar después de 15 segundos
        setTimeout(() => {
          this.showHelpBubble = false;
        }, 15000);
      }

      // Luego mostrar periódicamente cada 2 minutos
      this.helpReminderInterval = setInterval(() => {
        if (!this.isVisible) {
          this.showHelpBubble = true;
          // Auto-ocultar después de 15 segundos
          setTimeout(() => {
            this.showHelpBubble = false;
          }, 15000);
        }
      }, this.config.helpReminderInterval);
    },

    // Detener recordatorio periódico
    stopPeriodicHelpReminder() {
      if (this.helpReminderInterval) {
        clearInterval(this.helpReminderInterval);
        this.helpReminderInterval = null;
      }
    },

    // Cerrar manualmente la viñeta de ayuda
    closeHelpBubble() {
      this.showHelpBubble = false;
    },

    // Abrir automáticamente al iniciar sesión (primera vez)
    openOnLogin() {
      if (!this.hasShownWelcome) {
        this.isVisible = true;
        this.hasShownWelcome = true;
        if (this.messages.length === 0) {
          this.initializeSession();
        }
        // Guardar que ya se mostró
        try {
          localStorage.setItem("chatbot_welcomed", "true");
        } catch (error) {
          console.warn("Error saving welcome flag:", error);
        }
      } else {
        // Si ya dio la bienvenida, mostrar la viñeta de ayuda temporalmente
        this.showHelpBubble = true;
        setTimeout(() => {
          this.showHelpBubble = false;
        }, 10000); // Ocultar después de 10 segundos
      }
    },

    // Minimizar/maximizar bot
    toggleMinimized() {
      this.isMinimized = !this.isMinimized;
    },

    // Guardar en localStorage
    saveToLocalStorage() {
      if (!this.config.autoSave) return;

      const dataToSave = {
        messages: this.messages.slice(-20), // Solo últimos 20 mensajes
        currentFlow: this.currentFlow,
        currentStep: this.currentStep,
        tempReportData: this.tempReportData,
        tempExpressData: this.tempExpressData,
        tempSearchData: this.tempSearchData,
        lastInteraction: this.lastInteraction,
        sessionId: this.sessionId,
      };

      try {
        localStorage.setItem("chatbot_session", JSON.stringify(dataToSave));
      } catch (error) {
        console.warn("Error saving chatbot session:", error);
      }
    },

    // Cargar desde localStorage
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem("chatbot_session");
        if (saved) {
          const data = JSON.parse(saved);

          // Solo cargar si la sesión es reciente (< 24 horas)
          const lastInteraction = new Date(data.lastInteraction);
          const hoursSinceLastInteraction =
            (new Date() - lastInteraction) / (1000 * 60 * 60);

          if (hoursSinceLastInteraction < 24) {
            this.messages = data.messages || [];
            this.currentFlow = data.currentFlow || "menu";
            this.currentStep = data.currentStep || 0;
            this.tempReportData = data.tempReportData || {};
            this.tempExpressData = data.tempExpressData || {};
            this.tempSearchData = data.tempSearchData || {};
            this.sessionId = data.sessionId;
          }
        }
      } catch (error) {
        console.warn("Error loading chatbot session:", error);
      }
    },

    // Limpiar localStorage
    clearLocalStorage() {
      try {
        localStorage.removeItem("chatbot_session");
      } catch (error) {
        console.warn("Error clearing chatbot session:", error);
      }
    },

    // ============ FUNCIONES DE VALIDACIÓN Y SOPORTE ============

    // Validar nombre/apellido
    validateName(name) {
      if (!name || typeof name !== "string") return false;
      const trimmed = name.trim();
      return trimmed.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
    },

    // Validar identificación según tipo
    validateIdentification(id, type) {
      if (!id || !type) return false;
      const trimmed = id.trim();

      switch (type) {
        case "rut":
          // Validar formato RUT chileno - solo sin guión (ya que lo guardamos para búsqueda sin guión)
          return /^[0-9]{7,9}[0-9kK]?$/.test(trimmed);

        case "cedula":
          // Validar cédula (números)
          return /^[0-9]{6,12}$/.test(trimmed);

        case "pasaporte":
          // Validar pasaporte (alfanumérico)
          return /^[A-Z0-9]{6,12}$/i.test(trimmed);

        default:
          return trimmed.length >= 6;
      }
    },

    // Validar teléfono
    validatePhone(phone) {
      if (!phone) return false;
      const trimmed = phone.trim();
      // Aceptar formato +código_país + número
      return /^\+[1-9]\d{1,14}$/.test(trimmed.replace(/\s/g, ""));
    },

    // Parsear teléfono
    parsePhone(phone) {
      const cleaned = phone.trim().replace(/\s/g, "");
      const match = cleaned.match(/^\+(\d{1,3})(\d+)$/);

      if (match) {
        return [
          {
            countryCode: `+${match[1]}`,
            number: match[2],
          },
        ];
      }

      return [{ countryCode: "", number: cleaned }];
    },

    // Validar email
    validateEmail(email) {
      if (!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },

    // =====================================================
    // FLUJO DE CREACIÓN DE REPORTE EXPRESS
    // =====================================================

    /**
     * Manejar flujo de creación de reporte express
     * Steps 1-7: Datos personales básicos
     * Steps 8-12: 5 Evaluaciones con estrellas (1-5)
     * Step 13: Recomendación (si/no/maybe)
     * Step 14: Confirmación
     */
    async handleCreateExpressFlow(input, option) {
      const step = this.currentStep;

      // Inicializar flujo si es el primer paso
      if (step === 0) {
        this.currentStep = 1;
        this.tempExpressData = {};
        return {
          text:
            "⚡ ¡Perfecto! Vamos a crear un reporte express. Es más rápido y simple.\n\n" +
            "Empecemos con los datos personales. ¿Cuál es el **nombre** de la persona?",
          type: "input",
          expectsResponse: true,
        };
      }

      switch (step) {
        case 1: // Nombre
          const nameValidation = await this.processInputWithValidation(
            input,
            "nombre"
          );
          if (nameValidation.success) {
            this.tempExpressData.nombre = nameValidation.value;
            this.currentStep = 2;
            return {
              text: `Perfecto, ${nameValidation.value}. ¿Cuál es el **apellido**?`,
              type: "input",
              expectsResponse: true,
            };
          } else {
            this.showValidationFeedback(nameValidation, "nombre");
            return {
              text: "Por favor, intenta nuevamente:",
              type: "input",
              expectsResponse: true,
            };
          }

        case 2: // Apellido
          const surnameValidation = await this.processInputWithValidation(
            input,
            "apellido"
          );
          if (surnameValidation.success) {
            this.tempExpressData.apellido = surnameValidation.value;
            this.currentStep = 3;
            return {
              text: '¿Tiene algún **apodo** o nombre alternativo? (escribe "no" si no tiene)',
              type: "input",
              expectsResponse: true,
            };
          } else {
            this.showValidationFeedback(surnameValidation, "apellido");
            return {
              text: "Por favor, intenta nuevamente:",
              type: "input",
              expectsResponse: true,
            };
          }

        case 3: // Apodos (opcional)
          this.tempExpressData.nickNames =
            input.trim().toLowerCase() !== "no" && input.trim() !== ""
              ? [input.trim()]
              : [];
          this.currentStep = 4;
          return {
            text: "¿Qué tipo de **identificación** tiene?",
            type: "options",
            options: [
              { id: "1", text: "🇨🇱 RUT (Chile)", value: "rut" },
              { id: "2", text: "🆔 Cédula", value: "cedula" },
              { id: "3", text: "✈️ Pasaporte", value: "pasaporte" },
            ],
            expectsResponse: true,
          };

        case 4: // Tipo de identificación
          const idType = option?.value;
          if (["rut", "cedula", "pasaporte"].includes(idType)) {
            this.tempExpressData.idType = idType;
            this.currentStep = 5;

            let example = "";
            if (idType === "rut")
              example = " (sin puntos ni guión, ej: 123456789)";
            else if (idType === "cedula") example = " (ej: 1234567890)";
            else if (idType === "pasaporte") example = " (ej: A12345678)";

            const types = {
              rut: "RUT",
              cedula: "Cédula",
              pasaporte: "Pasaporte",
            };

            return {
              text: `Perfecto. Ahora ingresa el **${types[idType]}**${example}:`,
              type: "input",
              expectsResponse: true,
            };
          }
          break;

        case 5: // Número de identificación
          if (this.validateIdentification(input, this.tempExpressData.idType)) {
            this.tempExpressData.identificacion = input.trim();
            this.currentStep = 6;

            // Crear opciones de código de país desde countries.json
            const countryOptions = [];
            let optionId = 1;

            // Usar el JSON importado de countries.json
            if (countriesData && countriesData.countries) {
              countriesData.countries.forEach((country) => {
                countryOptions.push({
                  id: String(optionId++),
                  text: `${country.code} ${country.name}`,
                  value: country.code,
                });
              });
            }

            // Si no hay datos del JSON, usar fallback
            if (countryOptions.length === 0) {
              const fallbackCountries = [
                { code: "+56", name: "Chile" },
                { code: "+54", name: "Argentina" },
                { code: "+55", name: "Brasil" },
                { code: "+57", name: "Colombia" },
                { code: "+51", name: "Perú" },
              ];

              fallbackCountries.forEach((country) => {
                countryOptions.push({
                  id: String(optionId++),
                  text: `${country.code} ${country.name}`,
                  value: country.code,
                });
              });
            }

            return {
              text: "📱 ¿Cuál es su **código de país** para el teléfono?",
              type: "options",
              options: countryOptions,
              expectsResponse: true,
            };
          } else {
            return {
              text: `❌ El ${this.tempExpressData.idType?.toUpperCase()} ingresado no es válido. Por favor, inténtalo nuevamente:`,
              type: "input",
              expectsResponse: true,
            };
          }

        case 6: // Código de país
          const countryCode = option?.value;
          if (countryCode) {
            this.tempExpressData.countryCode = countryCode;
            this.currentStep = 7;
            return {
              text: `Perfecto. Ahora ingresa el **número de teléfono** (solo números, sin espacios):`,
              type: "input",
              expectsResponse: true,
            };
          }
          break;

        case 7: // Número de teléfono
          // Validar solo el número (sin código de país, ya lo tenemos)
          const phoneNumber = input.trim().replace(/\s+/g, ""); // Remover espacios

          // Validación simple: solo números, entre 8 y 15 dígitos
          if (/^\d{8,15}$/.test(phoneNumber)) {
            this.tempExpressData.telefono = [
              {
                countryCode: this.tempExpressData.countryCode || "+56",
                number: phoneNumber,
              },
            ];
            this.currentStep = 8;

            // Crear opciones de nacionalidad desde nacionalidades.json
            const nacionalidadOptions = [];
            let nacOptionId = 1;

            // Usar el JSON importado de nacionalidades.json
            if (nacionalidadesData && nacionalidadesData.nacionalidades) {
              nacionalidadesData.nacionalidades.forEach((nac) => {
                nacionalidadOptions.push({
                  id: String(nacOptionId++),
                  text: nac,
                  value: nac,
                });
              });
            }

            // Agregar opción para omitir
            nacionalidadOptions.push({
              id: "0",
              text: "❓ Omitir",
              value: "omitir",
            });

            return {
              text: "🌍 ¿Cuál es su **nacionalidad**? (Opcional)",
              type: "options",
              options: nacionalidadOptions,
              expectsResponse: true,
            };
          } else {
            return {
              text:
                `❌ Número de teléfono no válido.\n\n💡 **Sugerencias:**\n` +
                `• Solo ingresa números (sin espacios ni guiones)\n` +
                `• Debe tener entre 8 y 15 dígitos\n` +
                `• Ejemplo: 912345678\n\n` +
                `Por favor, intenta nuevamente:`,
              type: "input",
              expectsResponse: true,
            };
          }

        case 8: // Nacionalidad (opcional)
          const nacionalidad = option?.value;
          this.tempExpressData.nacionalidad =
            nacionalidad !== "omitir" ? nacionalidad : "";
          this.currentStep = 9;
          return {
            text:
              "📊 **¡Excelente!** Ahora vamos a evaluar 5 aspectos con estrellas ⭐\n\n" +
              "Responde del 1 al 5, donde:\n" +
              "⭐ = Muy malo\n" +
              "⭐⭐ = Malo\n" +
              "⭐⭐⭐ = Regular\n" +
              "⭐⭐⭐⭐ = Bueno\n" +
              "⭐⭐⭐⭐⭐ = Excelente\n\n" +
              "**1️⃣ ¿Paga puntualmente y avisa con anticipación?**",
            type: "options",
            options: [
              { id: "1", text: "⭐ (1)", value: "1" },
              { id: "2", text: "⭐⭐ (2)", value: "2" },
              { id: "3", text: "⭐⭐⭐ (3)", value: "3" },
              { id: "4", text: "⭐⭐⭐⭐ (4)", value: "4" },
              { id: "5", text: "⭐⭐⭐⭐⭐ (5)", value: "5" },
            ],
            expectsResponse: true,
          };

        case 9: // Evaluación 1: Paga y avisa
          const pagaYavisa = parseInt(option?.value);
          if (pagaYavisa >= 1 && pagaYavisa <= 5) {
            this.tempExpressData.pagaYavisa = pagaYavisa;
            this.currentStep = 10;
            return {
              text: "**2️⃣ ¿Mantiene orden y limpieza en su espacio?**",
              type: "options",
              options: [
                { id: "1", text: "⭐ (1)", value: "1" },
                { id: "2", text: "⭐⭐ (2)", value: "2" },
                { id: "3", text: "⭐⭐⭐ (3)", value: "3" },
                { id: "4", text: "⭐⭐⭐⭐ (4)", value: "4" },
                { id: "5", text: "⭐⭐⭐⭐⭐ (5)", value: "5" },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 10: // Evaluación 2: Orden y limpieza
          const ordenLimpieza = parseInt(option?.value);
          if (ordenLimpieza >= 1 && ordenLimpieza <= 5) {
            this.tempExpressData.ordenLimpieza = ordenLimpieza;
            this.currentStep = 11;
            return {
              text: "**3️⃣ ¿Trata con respeto al personal y otros huéspedes?**",
              type: "options",
              options: [
                { id: "1", text: "⭐ (1)", value: "1" },
                { id: "2", text: "⭐⭐ (2)", value: "2" },
                { id: "3", text: "⭐⭐⭐ (3)", value: "3" },
                { id: "4", text: "⭐⭐⭐⭐ (4)", value: "4" },
                { id: "5", text: "⭐⭐⭐⭐⭐ (5)", value: "5" },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 11: // Evaluación 3: Respeto
          const respeto = parseInt(option?.value);
          if (respeto >= 1 && respeto <= 5) {
            this.tempExpressData.respeto = respeto;
            this.currentStep = 12;
            return {
              text: "**4️⃣ ¿Su conducta general es adecuada?**",
              type: "options",
              options: [
                { id: "1", text: "⭐ (1)", value: "1" },
                { id: "2", text: "⭐⭐ (2)", value: "2" },
                { id: "3", text: "⭐⭐⭐ (3)", value: "3" },
                { id: "4", text: "⭐⭐⭐⭐ (4)", value: "4" },
                { id: "5", text: "⭐⭐⭐⭐⭐ (5)", value: "5" },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 12: // Evaluación 4: Conducta
          const conducta = parseInt(option?.value);
          if (conducta >= 1 && conducta <= 5) {
            this.tempExpressData.conducta = conducta;
            this.currentStep = 13;
            return {
              text: "**5️⃣ ¿Qué tan profesional es en su trabajo/estadía?**",
              type: "options",
              options: [
                { id: "1", text: "⭐ (1)", value: "1" },
                { id: "2", text: "⭐⭐ (2)", value: "2" },
                { id: "3", text: "⭐⭐⭐ (3)", value: "3" },
                { id: "4", text: "⭐⭐⭐⭐ (4)", value: "4" },
                { id: "5", text: "⭐⭐⭐⭐⭐ (5)", value: "5" },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 13: // Evaluación 5: Profesionalismo
          const profesionalismo = parseInt(option?.value);
          if (profesionalismo >= 1 && profesionalismo <= 5) {
            this.tempExpressData.profesionalismo = profesionalismo;
            this.currentStep = 14;
            return {
              text: "🎯 **Última pregunta:** ¿Recomendarías a esta persona?",
              type: "options",
              options: [
                {
                  id: "1",
                  text: "⭐⭐⭐ Sí, lo recomiendo mucho",
                  value: "si_mucho",
                },
                { id: "2", text: "✅ Sí, lo recomiendo", value: "si" },
                {
                  id: "3",
                  text: "🤔 Queda a criterio de cada uno",
                  value: "a_criterio",
                },
                { id: "4", text: "⚠️ No lo recomiendo", value: "no" },
                {
                  id: "5",
                  text: "❌ Para nada recomendado",
                  value: "no_para_nada",
                },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 14: // Recomendación
          const recomendado = option?.value;
          if (
            ["si_mucho", "si", "a_criterio", "no", "no_para_nada"].includes(
              recomendado
            )
          ) {
            this.tempExpressData.recomendado = recomendado;
            this.currentStep = 15;

            // Mostrar resumen
            const summary = this.formatExpressReportSummary(
              this.tempExpressData
            );

            return {
              text:
                "✅ **¡Perfecto! Hemos completado todas las preguntas.**\n\n" +
                "📋 **Resumen del Reporte Express:**\n\n" +
                summary +
                "\n\n¿Qué deseas hacer?",
              type: "options",
              options: [
                {
                  id: "1",
                  text: "✅ Guardar reporte",
                  value: "save_express",
                  primary: true,
                },
                { id: "2", text: "❌ Cancelar", value: "cancel_express" },
              ],
              expectsResponse: true,
            };
          }
          break;

        case 15: // Confirmación final
          if (option?.value === "save_express") {
            return await this.saveExpressReportFromChat();
          } else if (option?.value === "cancel_express") {
            this.resetToMenu();
            return {
              text: "❌ Reporte express cancelado. Volvamos al menú principal.",
              type: "menu",
              options: this.getMenuOptions(),
              expectsResponse: true,
            };
          }
          break;
      }

      // Si llegamos aquí, hubo un error
      return {
        text: "Ocurrió un error. Por favor, intenta nuevamente.",
        type: "options",
        options: [
          { id: "1", text: "🔄 Reintentar", value: "retry_express" },
          { id: "2", text: "🏠 Volver al menú", value: "menu" },
        ],
        expectsResponse: true,
      };
    },

    /**
     * Formatear resumen del reporte express
     */
    formatExpressReportSummary(data) {
      let summary = "";

      // Datos personales
      summary += `**👤 Datos Personales:**\n`;
      summary += `• Nombre: ${data.nombre} ${data.apellido}\n`;
      if (data.nickNames && data.nickNames.length > 0) {
        summary += `• Apodos: ${data.nickNames.join(", ")}\n`;
      }
      summary += `• Identificación: ${
        data.identificacion
      } (${data.idType?.toUpperCase()})\n`;

      // Nacionalidad (si existe)
      if (data.nacionalidad) {
        summary += `• Nacionalidad: ${data.nacionalidad}\n`;
      }

      // Contacto
      if (data.telefono && data.telefono.length > 0) {
        const phone = data.telefono[0];
        summary += `• Teléfono: ${phone.countryCode || ""}${
          phone.number || ""
        }\n`;
      }

      // Evaluaciones
      summary += `\n**⭐ Evaluaciones:**\n`;
      summary += `• Paga y avisa: ${"⭐".repeat(data.pagaYavisa || 0)} (${
        data.pagaYavisa
      }/5)\n`;
      summary += `• Orden y limpieza: ${"⭐".repeat(
        data.ordenLimpieza || 0
      )} (${data.ordenLimpieza}/5)\n`;
      summary += `• Respeto: ${"⭐".repeat(data.respeto || 0)} (${
        data.respeto
      }/5)\n`;
      summary += `• Conducta: ${"⭐".repeat(data.conducta || 0)} (${
        data.conducta
      }/5)\n`;
      summary += `• Profesionalismo: ${"⭐".repeat(
        data.profesionalismo || 0
      )} (${data.profesionalismo}/5)\n`;

      // Promedio
      const promedio = (
        (data.pagaYavisa +
          data.ordenLimpieza +
          data.respeto +
          data.conducta +
          data.profesionalismo) /
        5
      ).toFixed(1);
      summary += `\n**📊 Promedio: ${promedio}/5** ${"⭐".repeat(
        Math.round(promedio)
      )}\n`;

      // Recomendación
      const recomendacionTexto = {
        si_mucho: "⭐⭐⭐ Sí, lo recomiendo mucho",
        si: "✅ Sí, lo recomiendo",
        a_criterio: "🤔 Queda a criterio de cada uno",
        no: "⚠️ No lo recomiendo",
        no_para_nada: "❌ Para nada recomendado",
      };
      summary += `\n**🎯 Recomendación:** ${
        recomendacionTexto[data.recomendado] || data.recomendado
      }\n`;

      return summary;
    },

    /**
     * Guardar reporte express desde el chat
     */
    async saveExpressReportFromChat() {
      try {
        const authStore = useAuthStore();

        if (!authStore.user) {
          return {
            text: "❌ No tienes sesión iniciada. Por favor, inicia sesión primero.",
            type: "error",
            options: [{ id: "1", text: "🏠 Volver al menú", value: "menu" }],
            expectsResponse: true,
          };
        }

        // Preparar datos del reporte express
        const reportData = {
          ...this.tempExpressData,
          // Si email está vacío, usar valor por defecto
          email:
            this.tempExpressData.email && this.tempExpressData.email.trim()
              ? this.tempExpressData.email
              : "notiene@email.com",
          // Dejar que el backend maneje createdAt con serverTimestamp
          createdAt: null, // El backend lo reemplazará con FieldValue.serverTimestamp()
          creadoPor: "chatbot",
          version: "2.0",
          evaluationCount: 1, // Para identificar como express
          authorInfo: {
            uid: authStore.user?.uid,
            email: authStore.user?.email,
            role: authStore.user?.role,
          },
        };

        console.log("💾 ChatBot: Guardando reporte express:", reportData);

        const expressReportsStore = useExpressReportsStore();
        const result = await expressReportsStore.createExpressReport(
          reportData
        );

        if (result && result.success) {
          // NUEVO: Completar tracking de sesión con ID del reporte
          const createdReportId = result.report?.id;
          if (createdReportId) {
            this.completeBackendTracking(createdReportId);
          }

          // Limpiar datos temporales
          this.tempExpressData = {};
          this.currentFlow = "menu";
          this.currentStep = 0;

          // Mensaje mejorado con nombre del reporte
          const nombreCompleto = `${reportData.nombre || ""} ${
            reportData.apellido || ""
          }`.trim();
          const displayReportId = createdReportId || "generado";

          return {
            text:
              `🎉 ¡Reporte express creado exitosamente!\n\n` +
              `📋 **Reporte Express de ${nombreCompleto}**\n` +
              `🆔 ID: ${displayReportId}\n\n` +
              `El reporte ha sido guardado en la base de datos. ¿Quieres hacer algo más?`,
            type: "options",
            options: [
              { id: "1", text: "🔍 Buscar reportes", value: "search" },
              {
                id: "2",
                text: "⚡ Crear otro reporte express",
                value: "create_express",
              },
              { id: "3", text: "🏠 Volver al menú", value: "menu" },
            ],
            expectsResponse: true,
          };
        } else {
          throw new Error(result?.error || "Error desconocido al guardar");
        }
      } catch (error) {
        console.error("❌ ChatBot: Error al guardar reporte express:", error);

        // Usar ErrorHandler service
        const errorResponse = this.handleErrorWithService(error, {
          operation: "saveExpressReportFromChat",
          reportData: this.tempExpressData,
        });

        return {
          text: errorResponse.message,
          type: "options",
          options: errorResponse.options,
          expectsResponse: true,
        };
      }
    },

    // Manejar evaluación individual
    handleEvaluation(evaluationIndex, value) {
      const evaluationFields = [
        // Sección de pagos y orden
        { key: "paga_puntual", question: "¿Paga puntualmente?" },
        {
          key: "habitacionLimpiaYOrdenada",
          question: "¿Mantiene su habitación limpia y ordenada?",
        },
        {
          key: "tranquilaYOrdenada",
          question: "¿Es una persona tranquila y ordenada?",
        },

        // Sección de relaciones sociales
        {
          key: "buenasRelacionesPasajeros",
          question: "¿Tiene buenas relaciones con otros pasajeros?",
        },
        {
          key: "tratoClientes",
          question: "¿Tiene buen trato con otros clientes/huéspedes?",
        },
        {
          key: "avisaConAnticipacionRetirada",
          question: "¿Avisa con anticipación cuando se retira?",
        },

        // Sección de consumos
        { key: "consumeMarihuana", question: "¿Consume marihuana?" },
        { key: "consumeOtrasDrogas", question: "¿Consume otras drogas?" },
        {
          key: "consumoAlcoholExcesivo",
          question: "¿Consume alcohol en exceso?",
        },

        // Sección de conductas problemáticas
        {
          key: "destrozos",
          question: "¿Ha generado destrozos en la propiedad?",
        },
        { key: "robos", question: "¿Ha tenido problemas de robos o hurtos?" },
        {
          key: "amenazaPolicia",
          question: "¿Ha amenazado con llamar a la policía?",
        },
        {
          key: "amenazaExtranjeros",
          question: "¿Ha amenazado a extranjeros ?",
        },
        {
          key: "gritaEInsultaArrendatario",
          question: "¿Grita o insulta al arrendador/personal?",
        },

        // Sección de comportamiento general
        { key: "independiente", question: "¿Trabaja independiente?" },
        { key: "privado", question: "¿Trabaja en agencia o privado?" },
        { key: "llavero", question: "¿Trabaja para llaveros?" },
        {
          key: "meteGenteAjena",
          question: "¿Trae personas ajenas sin autorización?",
        },
      ];

      if (!value || evaluationIndex >= evaluationFields.length) {
        return {
          text: "Por favor selecciona una opción válida.",
          type: "options",
          options: [
            { id: "1", text: "✅ Sí", value: "si" },
            { id: "2", text: "❌ No", value: "no" },
            { id: "3", text: "🟡 A veces", value: "a_veces" },
            { id: "4", text: "❓ Sin datos", value: "sin_datos" },
          ],
          expectsResponse: true,
        };
      }

      const field = evaluationFields[evaluationIndex];
      this.tempReportData[field.key] = value;

      // Siguiente evaluación
      if (evaluationIndex < evaluationFields.length - 1) {
        this.currentStep = 11 + evaluationIndex + 1; // FIXED: ahora empieza en 11 (antes 10)
        const nextField = evaluationFields[evaluationIndex + 1];
        return {
          text: `**${nextField.question}**`,
          type: "options",
          options: [
            { id: "1", text: "✅ Sí", value: "si" },
            { id: "2", text: "❌ No", value: "no" },
            { id: "3", text: "🟡 A veces", value: "a_veces" },
            { id: "4", text: "❓ Sin datos", value: "sin_datos" },
          ],
          expectsResponse: true,
        };
      } else {
        // Todas las evaluaciones completadas - pasar al paso 29 para comentarios
        this.currentStep = 29;
        return {
          text:
            "¡Excelente! Hemos completado todas las evaluaciones. 🎉\n\n" +
            '¿Quieres agregar algún **comentario adicional** sobre esta persona? (escribe "no" si no)',
          type: "input",
          expectsResponse: true,
        };
      }
    },

    // Formatear resumen del reporte
    formatReportSummary(data) {
      let summary = "";

      // Datos personales
      summary += `**👤 Datos Personales:**\n`;
      summary += `• Nombre: ${data.nombre} ${data.apellido}\n`;
      if (data.nickNames && data.nickNames.length > 0) {
        summary += `• Apodos: ${data.nickNames.join(", ")}\n`;
      }
      summary += `• Identificación: ${
        data.identificacion
      } (${data.idType?.toUpperCase()})\n`;

      // Contacto
      if (data.telefono) {
        let phoneDisplay = "";
        if (Array.isArray(data.telefono) && data.telefono.length > 0) {
          const phone = data.telefono[0];
          phoneDisplay = `${phone.countryCode || ""}${phone.number || ""}`;
        } else if (typeof data.telefono === "string") {
          phoneDisplay = data.telefono;
        }
        if (phoneDisplay) {
          summary += `• Teléfono: ${phoneDisplay}\n`;
        }
      }
      if (data.email) {
        summary += `• Email: ${data.email}\n`;
      }
      if (data.genero) {
        const genders = {
          masculino: "Masculino",
          femenino: "Femenino",
          transgenero: "Transgénero",
          otro: "Otro",
          sin_datos: "No especificado",
        };
        summary += `• Género: ${genders[data.genero] || data.genero}\n`;
      }
      if (data.nacionalidad) {
        summary += `• Nacionalidad: ${data.nacionalidad}\n`;
      }

      // Evaluaciones
      summary += `\n**📊 Evaluaciones:**\n`;
      const evaluationLabels = {
        paga_puntual: "Paga puntualmente",
        habitacionLimpiaYOrdenada: "Habitación limpia",
        tranquilaYOrdenada: "Tranquila y ordenada",
        consumeMarihuana: "Consume marihuana",
        consumeOtrasDrogas: "Consume otras drogas",
        consumoAlcoholExcesivo: "Consumo excesivo de alcohol",
        destrozos: "Genera destrozos",
        robos: "Problemas de robos",
        amenazaPolicia: "Amenaza con policía",
        amenazaExtranjeros: "Amenaza extranjeros",
        gritaEInsultaArrendatario: "Grita o insulta",
        buenasRelacionesPasajeros: "Buenas relaciones",
        avisaConAnticipacionRetirada: "Avisa con anticipación",
        independiente: "Independiente",
        privado: "Privado",
        llavero: "Llavero",
        meteGenteAjena: "Trae gente ajena",
      };

      const valueLabels = {
        si: "✅ Sí",
        no: "❌ No",
        a_veces: "🟡 A veces",
        sin_datos: "❓ Sin datos",
      };

      Object.keys(evaluationLabels).forEach((key) => {
        if (data[key]) {
          summary += `• ${evaluationLabels[key]}: ${
            valueLabels[data[key]] || data[key]
          }\n`;
        }
      });

      // Comentarios
      if (data.comentariosAdicionales) {
        summary += `\n**💬 Comentarios:**\n${data.comentariosAdicionales}`;
      }

      return summary;
    },

    // Manejar confirmación final del reporte
    async handleFinalReportConfirmation(value) {
      switch (value) {
        case "save_now":
          // NUEVO: Guardar directamente sin mostrar confirmación
          const saveResult = await this.saveCompleteReport();

          if (saveResult && saveResult.type === "success") {
            // Limpiar datos después de guardar exitosamente
            this.tempReportData = {};

            return {
              text: saveResult.text,
              type: "success",
              options: saveResult.options || [],
              expectsResponse: true,
            };
          } else {
            return {
              text: saveResult?.text || "❌ Error al guardar el reporte.",
              type: "error",
              options: [
                { id: "1", text: "🔄 Reintentar", value: "save_now" },
                { id: "2", text: "✏️ Revisar datos", value: "save" },
                { id: "3", text: "❌ Cancelar", value: "cancel" },
              ],
              expectsResponse: true,
            };
          }

        case "save":
          // Mostrar pantalla de confirmación visual para revisar/editar
          this.showConfirmationScreen("complete");
          return {
            text: "📋 Revisando datos del reporte completo...",
            type: "info",
            options: [],
            expectsResponse: false,
          };

        case "edit":
          this.currentStep = 1;
          return {
            text: "✏️ ¿Qué campo quieres editar? Por ahora volvamos al inicio para recrear el reporte.",
            type: "input",
            expectsResponse: true,
          };

        case "cancel":
          this.resetToMenu();
          return {
            text: "❌ Reporte cancelado. Volvamos al menú principal.",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };

        default:
          return {
            text: "¿Qué deseas hacer con este reporte?",
            type: "form_summary",
            options: [
              {
                id: "1",
                text: "✅ Guardar ahora",
                value: "save_now",
                primary: true,
              },
              { id: "2", text: "✏️ Revisar antes de guardar", value: "save" },
              { id: "3", text: "❌ Cancelar", value: "cancel" },
            ],
            expectsResponse: true,
          };
      }
    },

    // Guardar reporte completo
    async saveCompleteReport() {
      try {
        // Verificar autenticación antes de guardar
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          return {
            text: "🔒 Necesitas estar autenticado para guardar reportes.\n\nPor favor, inicia sesión y vuelve a intentarlo.",
            type: "options",
            options: [
              { id: "1", text: "🔑 Cómo iniciar sesión", value: "login" },
              { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };
        }

        if (!this.canCreateReports) {
          return {
            text: "⚠️ No tienes permisos para crear reportes.\n\nSolo administradores y owners pueden crear reportes.",
            type: "options",
            options: [
              { id: "1", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };
        }

        const reportsStore = useReportsStore();

        // Preparar datos del reporte
        const reportData = {
          ...this.tempReportData,
          // Si email está vacío, usar valor por defecto
          email:
            this.tempReportData.email && this.tempReportData.email.trim()
              ? this.tempReportData.email
              : "notiene@email.com",
          // Dejar que el backend maneje createdAt con serverTimestamp
          createdAt: null, // El backend lo reemplazará con FieldValue.serverTimestamp()
          creadoPor: "chatbot",
          version: "2.0",
          authorInfo: {
            uid: authStore.user?.uid,
            email: authStore.user?.email,
            role: authStore.user?.role,
          },
        };

        console.log("💾 ChatBot: Guardando reporte:", reportData);

        const result = await reportsStore.createReport(reportData);

        if (result && result.success) {
          // NUEVO: Completar tracking de sesión con ID del reporte
          const createdReportId = result.report?.id;
          if (createdReportId) {
            this.completeBackendTracking(createdReportId);
          }

          // NO limpiar datos aquí - se limpiarán después de cerrar confirmación
          // this.tempReportData = {}
          this.currentFlow = "menu";
          this.currentStep = 0;

          // Mensaje mejorado con nombre del reporte
          const nombreCompleto = `${this.tempReportData.nombre || ""} ${
            this.tempReportData.apellido || ""
          }`.trim();
          const displayReportId = createdReportId || "generado";

          return {
            text:
              `🎉 ¡Reporte creado exitosamente!\n\n` +
              `📋 **Reporte de ${nombreCompleto}**\n` +
              `🆔 ID: ${displayReportId}\n\n` +
              `El reporte ha sido guardado en la base de datos. ¿Quieres hacer algo más?`,
            type: "options", // ✅ Cambio: 'success' → 'options' para mostrar botones
            options: [
              { id: "1", text: "🔍 Buscar reportes", value: "search" },
              {
                id: "2",
                text: "📝 Crear otro reporte",
                value: "create_report",
              },
              { id: "3", text: "🏠 Volver al menú", value: "menu" },
            ],
            expectsResponse: true,
          };
        } else {
          throw new Error(result?.error || "Error desconocido al guardar");
        }
      } catch (error) {
        console.error("❌ ChatBot: Error al guardar reporte:", error);

        // Usar ErrorHandler service
        const errorResponse = this.handleErrorWithService(error, {
          operation: "saveCompleteReport",
          reportData: this.tempReportData,
        });

        return {
          text: errorResponse.message,
          type: "options",
          options: errorResponse.options,
          expectsResponse: true,
        };
      }
    },

    // ============ FUNCIONES PARA REPORTES EXPRESS ============

    // ============ MÉTODOS AUXILIARES PARA BÚSQUEDA ESPECIALIZADA ============

    // Obtener opciones de tipo de búsqueda
    getSearchTypeOptions() {
      return {
        text: "🔍 ¿Cómo quieres buscar los reportes?",
        type: "options",
        options: [
          { id: "1", text: "🆔 Por identificación", value: "by_id" },
          { id: "2", text: "📱 Por teléfono", value: "by_phone" },
          { id: "3", text: "👤 Por nombre", value: "by_name" },
          { id: "4", text: "🔬 Búsqueda avanzada", value: "advanced" },
          { id: "5", text: "🔙 Volver al menú", value: "back_to_menu" },
        ],
        expectsResponse: true,
      };
    },

    // Manejar búsqueda por identificación
    handleIdSearch(input) {
      if (!input || input.trim().length < 3) {
        return {
          text: "⚠️ La identificación debe tener al menos 3 caracteres.",
          type: "input",
          expectsResponse: true,
        };
      }

      const idType = this.tempSearchData.idType;
      const query = input.trim();
      let cleanQuery = query;

      // Validaciones específicas por tipo
      if (idType === "rut") {
        cleanQuery = query.replace(/[.\-\s]/g, "");
        if (!/^\d{7,8}[0-9kK]?$/.test(cleanQuery)) {
          return {
            text: "⚠️ El RUT no tiene un formato válido.\n\nEjemplo sin puntos ni guión: 123456789",
            type: "input",
            expectsResponse: true,
          };
        }
      } else if (idType === "cedula") {
        cleanQuery = query.replace(/[.\-\s]/g, "");
        if (!/^\d{6,12}$/.test(cleanQuery)) {
          return {
            text: "⚠️ La cédula debe tener entre 6 y 12 dígitos.",
            type: "input",
            expectsResponse: true,
          };
        }
      } else if (idType === "pasaporte") {
        if (!/^[A-Z0-9]{6,12}$/i.test(cleanQuery)) {
          return {
            text: "⚠️ El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.",
            type: "input",
            expectsResponse: true,
          };
        }
      }

      // Configurar búsqueda
      this.tempSearchData.query = cleanQuery;
      this.tempSearchData.type = "by_id";

      return this.executeSearch();
    },

    // Manejar búsqueda por teléfono
    handlePhoneSearch(input, option) {
      const phoneType = this.tempSearchData.phoneType;

      if (phoneType === "country_phone" && this.currentStep === 13) {
        // Selección de país
        this.tempSearchData.countryCode = option?.value;
        this.currentStep = 14;

        if (option?.value === "other") {
          return {
            text: "🌍 Ingresa el código de país (ej: +1, +34, +33):",
            type: "input",
            expectsResponse: true,
          };
        } else {
          return {
            text: `📱 Ingresa el número de teléfono ${option?.value}:\n\n*Solo los dígitos después del código de país*`,
            type: "input",
            expectsResponse: true,
          };
        }
      }

      if (!input || input.trim().length < 3) {
        return {
          text: "⚠️ El teléfono debe tener al menos 3 caracteres.",
          type: "input",
          expectsResponse: true,
        };
      }

      const query = input.trim().replace(/[.\-\s()]/g, "");

      // Validaciones específicas por tipo
      if (phoneType === "complete_phone") {
        if (!/^\d{8,15}$/.test(query)) {
          return {
            text: "⚠️ El teléfono completo debe tener entre 8 y 15 dígitos.",
            type: "input",
            expectsResponse: true,
          };
        }
      } else if (phoneType === "partial_phone") {
        if (!/^\d{4,10}$/.test(query)) {
          return {
            text: "⚠️ La parte del teléfono debe tener entre 4 y 10 dígitos.",
            type: "input",
            expectsResponse: true,
          };
        }
      }

      // Configurar búsqueda
      this.tempSearchData.query = query;
      this.tempSearchData.type = "by_phone";

      return this.executeSearch();
    },

    // Manejar búsqueda por nombre
    handleNameSearch(input) {
      if (!input || input.trim().length < 2) {
        return {
          text: "⚠️ El nombre debe tener al menos 2 caracteres.",
          type: "input",
          expectsResponse: true,
        };
      }

      const nameType = this.tempSearchData.nameType;
      const query = input.trim();

      // Validar que contenga solo letras y espacios
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(query)) {
        return {
          text: "⚠️ El nombre solo puede contener letras y espacios.",
          type: "input",
          expectsResponse: true,
        };
      }

      // Configurar búsqueda específica
      this.tempSearchData.query = query;
      this.tempSearchData.type = "by_name";
      this.tempSearchData.specificNameType = nameType;

      return this.executeSearch();
    },

    // Ejecutar búsqueda con loading
    executeSearch() {
      this.currentStep = 100; // Estado final de búsqueda

      // Mostrar mensaje de loading primero
      setTimeout(() => {
        this.performActualSearch();
      }, 100);

      return {
        text: "🔍 Buscando reportes, por favor espera...",
        type: "loading",
      };
    },

    // ============ FUNCIONES PARA REPORTES EXPRESS ============

    // Manejar evaluación express individual
    handleExpressEvaluation(evaluationIndex, value) {
      const evaluationFields = [
        { key: "pagaYavisa", question: "¿Paga y avisa con anticipación?" },
        { key: "limpieza", question: "¿Orden y limpieza?" },
        { key: "puntualidad", question: "¿Puntualidad?" },
        { key: "comportamiento", question: "¿Comportamiento general?" },
        { key: "profesionalismo", question: "¿Profesionalismo?" },
      ];

      if (
        !value ||
        !["1", "2", "3", "4", "5"].includes(value) ||
        evaluationIndex >= evaluationFields.length
      ) {
        return {
          text: "Por favor selecciona una calificación del 1 al 5.",
          type: "options",
          options: [
            { id: "1", text: "⭐ 1 - Muy malo", value: "1" },
            { id: "2", text: "⭐⭐ 2 - Malo", value: "2" },
            { id: "3", text: "⭐⭐⭐ 3 - Regular", value: "3" },
            { id: "4", text: "⭐⭐⭐⭐ 4 - Bueno", value: "4" },
            { id: "5", text: "⭐⭐⭐⭐⭐ 5 - Excelente", value: "5" },
          ],
          expectsResponse: true,
        };
      }

      const field = evaluationFields[evaluationIndex];
      this.tempExpressData[field.key] = parseInt(value);

      // Siguiente evaluación
      if (evaluationIndex < evaluationFields.length - 1) {
        this.currentStep = 6 + evaluationIndex + 1;
        const nextField = evaluationFields[evaluationIndex + 1];
        return {
          text: `**${nextField.question}** (1-5)`,
          type: "options",
          options: [
            { id: "1", text: "⭐ 1 - Muy malo", value: "1" },
            { id: "2", text: "⭐⭐ 2 - Malo", value: "2" },
            { id: "3", text: "⭐⭐⭐ 3 - Regular", value: "3" },
            { id: "4", text: "⭐⭐⭐⭐ 4 - Bueno", value: "4" },
            { id: "5", text: "⭐⭐⭐⭐⭐ 5 - Excelente", value: "5" },
          ],
          expectsResponse: true,
        };
      } else {
        // Todas las evaluaciones completadas, preguntar recomendación
        this.currentStep = 11;
        return {
          text: "¡Perfecto! Una última pregunta:\n\n**¿Recomendarías a esta persona?**",
          type: "options",
          options: [
            { id: "1", text: "✅ Sí, la recomiendo", value: "si" },
            { id: "2", text: "❌ No la recomiendo", value: "no" },
          ],
          expectsResponse: true,
        };
      }
    },

    // Formatear resumen del reporte express
    formatExpressReportSummary(data) {
      let summary = "";

      // Datos personales
      summary += `**👤 Datos Personales:**\n`;
      summary += `• Nombre: ${data.nombre} ${data.apellido}\n`;
      summary += `• Identificación: ${
        data.identificacion
      } (${data.idType?.toUpperCase()})\n`;

      // Contacto
      if (data.telefono && data.telefono.length > 0) {
        const phone = data.telefono[0];
        summary += `• Teléfono: ${phone.countryCode}${phone.number}\n`;
      }

      // Evaluaciones
      summary += `\n**⭐ Evaluaciones Express:**\n`;
      const evaluationLabels = {
        pagaYavisa: "Paga y avisa",
        limpieza: "Orden y limpieza",
        puntualidad: "Puntualidad",
        comportamiento: "Comportamiento",
        profesionalismo: "Profesionalismo",
      };

      const starRating = (value) => "⭐".repeat(value) + "☆".repeat(5 - value);

      Object.keys(evaluationLabels).forEach((key) => {
        if (data[key]) {
          summary += `• ${evaluationLabels[key]}: ${starRating(data[key])} (${
            data[key]
          }/5)\n`;
        }
      });

      // Recomendación
      if (data.recomendado !== undefined) {
        summary += `• Recomendado: ${data.recomendado ? "✅ Sí" : "❌ No"}\n`;
      }

      // Comentarios
      if (data.comentarios) {
        summary += `\n**💬 Comentarios:**\n${data.comentarios}`;
      }

      return summary;
    },

    // Manejar confirmación final del reporte express
    async handleFinalExpressConfirmation(value) {
      switch (value) {
        case "save":
          // Mostrar pantalla de confirmación visual (Fase 6.5)
          this.showConfirmationScreen("express");
          return {
            text: "⚡ Revisando datos del reporte express...",
            type: "info",
            options: [],
            expectsResponse: false,
          };

        case "edit":
          this.currentStep = 1;
          return {
            text: "✏️ ¿Qué campo quieres editar? Por ahora volvamos al inicio para recrear el reporte.",
            type: "input",
            expectsResponse: true,
          };

        case "cancel":
          this.resetToMenu();
          return {
            text: "❌ Reporte cancelado. Volvamos al menú principal.",
            type: "menu",
            options: this.getMenuOptions(),
            expectsResponse: true,
          };

        default:
          return {
            text: "Por favor selecciona una opción válida.",
            type: "form_summary",
            options: [
              {
                id: "1",
                text: "✅ Sí, guardar reporte",
                value: "save",
                primary: true,
              },
              { id: "2", text: "✏️ Editar algo", value: "edit" },
              { id: "3", text: "❌ Cancelar", value: "cancel" },
            ],
            expectsResponse: true,
          };
      }
    },

    // Guardar reporte express
    async saveExpressReport() {
      try {
        // Verificar autenticación antes de guardar
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          return {
            text: "🔒 Necesitas estar autenticado para guardar reportes.\n\nPor favor, inicia sesión y vuelve a intentarlo.",
            type: "options",
            options: [
              { id: "1", text: "🔑 Cómo iniciar sesión", value: "login" },
              { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };
        }

        if (!this.canCreateReports) {
          return {
            text: "⚠️ No tienes permisos para crear reportes.\n\nSolo administradores y owners pueden crear reportes.",
            type: "options",
            options: [
              { id: "1", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            expectsResponse: true,
          };
        }

        const expressReportsStore = useExpressReportsStore();

        // Preparar datos del reporte express
        const reportData = {
          ...this.tempExpressData,
          // Si email está vacío, usar valor por defecto
          email:
            this.tempExpressData.email && this.tempExpressData.email.trim()
              ? this.tempExpressData.email
              : "notiene@email.com",
          // Dejar que el backend maneje createdAt con serverTimestamp
          createdAt: null, // El backend lo reemplazará con FieldValue.serverTimestamp()
          creadoPor: "chatbot",
          version: "2.0",
          evaluationCount: 1, // Para identificar como express
          authorInfo: {
            uid: authStore.user?.uid,
            email: authStore.user?.email,
            role: authStore.user?.role,
          },
        };

        console.log("💾 ChatBot: Guardando reporte express:", reportData);

        const result = await expressReportsStore.createExpressReport(
          reportData
        );

        if (result && result.success) {
          // NO limpiar datos aquí - se limpiarán después de cerrar confirmación
          // this.tempExpressData = {}
          this.currentFlow = "menu";
          this.currentStep = 0;

          return {
            text:
              "🎉 ¡Reporte express creado exitosamente!\n\n" +
              "El reporte ha sido guardado en la base de datos. ¿Quieres hacer algo más?",
            type: "options",
            options: [
              { id: "1", text: "🔍 Buscar reportes", value: "search" },
              {
                id: "2",
                text: "⚡ Crear otro reporte express",
                value: "create_express",
              },
              { id: "3", text: "🏠 Volver al menú", value: "menu" },
            ],
            expectsResponse: true,
          };
        } else {
          throw new Error(result?.error || "Error desconocido al guardar");
        }
      } catch (error) {
        console.error("❌ ChatBot: Error al guardar reporte express:", error);

        // Usar ErrorHandler service
        const errorResponse = this.handleErrorWithService(error, {
          operation: "saveExpressReport",
          reportData: this.tempExpressData,
        });

        return {
          text: errorResponse.message,
          type: "options",
          options: errorResponse.options,
          expectsResponse: true,
        };
      }
    },

    // =====================================================
    // SISTEMA DE VALIDACIÓN EN TIEMPO REAL Y SUGERENCIAS
    // =====================================================

    /**
     * Validar campo en tiempo real
     * @param {string} field - Nombre del campo a validar
     * @param {string} value - Valor a validar
     * @param {string} type - Tipo de validación específica
     * @returns {Promise<Object>} Resultado de validación
     */
    async validateFieldRealTime(field, value, type = null) {
      try {
        console.log(`🔍 ChatBot: Validando ${field} en tiempo real...`);

        if (!value || value.trim() === "") {
          return {
            isValid: false,
            message: "Este campo es requerido",
            suggestions: [],
          };
        }

        // MODIFICADO: Agregar sessionId al contexto para tracking
        const context = {};
        if (this.backendSessionId) {
          context.sessionId = this.backendSessionId;
        }

        const validationResult = await botRepository.validateField(
          field,
          value,
          type,
          context
        );

        if (validationResult.success) {
          const validation = validationResult.validation;

          // Obtener sugerencias si el campo no es válido
          let suggestions = [];
          if (!validation.isValid && validation.suggestions) {
            suggestions = validation.suggestions;
          }

          console.log(
            `${
              validation.isValid ? "✅" : "❌"
            } ChatBot: Validación de ${field} ${
              validation.isValid ? "exitosa" : "falló"
            }`
          );

          return {
            isValid: validation.isValid,
            message: validation.message,
            suggestions: suggestions,
            formatted: validation.formatted || value,
          };
        } else {
          console.error(
            `❌ ChatBot: Error en validación de ${field}:`,
            validationResult.error
          );
          return {
            isValid: false,
            message: "Error al validar el campo",
            suggestions: [],
          };
        }
      } catch (error) {
        console.error(
          `❌ ChatBot: Error en validación en tiempo real de ${field}:`,
          error
        );
        return {
          isValid: false,
          message: "Error al validar el campo",
          suggestions: [],
        };
      }
    },

    /**
     * Obtener sugerencias para autocompletado
     * @param {string} field - Campo para obtener sugerencias
     * @param {string} query - Texto de búsqueda
     * @param {number} limit - Límite de sugerencias
     * @returns {Promise<Array>} Lista de sugerencias
     */
    async getSuggestionsForField(field, query = "", limit = 5) {
      try {
        console.log(`💡 ChatBot: Obteniendo sugerencias para ${field}...`);

        // MODIFICADO: Pasar sessionId para tracking
        const suggestionsResult = await botRepository.getSuggestions(
          field,
          query,
          limit,
          this.backendSessionId // NUEVO: Para tracking
        );

        if (suggestionsResult.success) {
          console.log(
            `✅ ChatBot: ${suggestionsResult.count} sugerencias obtenidas para ${field}`
          );
          return suggestionsResult.suggestions;
        } else {
          console.error(
            `❌ ChatBot: Error obteniendo sugerencias para ${field}:`,
            suggestionsResult.error
          );
          return [];
        }
      } catch (error) {
        console.error(
          `❌ ChatBot: Error obteniendo sugerencias para ${field}:`,
          error
        );
        return [];
      }
    },

    /**
     * Validar entrada de usuario con feedback en tiempo real
     * @param {string} field - Campo que se está validando
     * @param {string} value - Valor ingresado por el usuario
     * @param {string} type - Tipo específico de validación
     * @returns {Promise<Object>} Respuesta del bot con validación
     */
    async validateUserInputWithFeedback(field, value, type = null) {
      const validation = await this.validateFieldRealTime(field, value, type);

      if (validation.isValid) {
        return {
          isValid: true,
          message: `✅ ${validation.message || "Campo válido"}`,
          formatted: validation.formatted,
        };
      } else {
        let feedbackMessage = `❌ ${validation.message}`;

        // Agregar sugerencias si están disponibles
        if (validation.suggestions && validation.suggestions.length > 0) {
          feedbackMessage += "\n\n💡 **Sugerencias:**";
          validation.suggestions.forEach((suggestion, index) => {
            feedbackMessage += `\n${index + 1}. ${suggestion}`;
          });
        }

        return {
          isValid: false,
          message: feedbackMessage,
          suggestions: validation.suggestions || [],
        };
      }
    },

    /**
     * Procesar entrada con validación automática según el contexto
     * @param {string} text - Texto ingresado por el usuario
     * @param {Object} option - Opción seleccionada
     * @returns {Promise} Resultado del procesamiento
     */
    async processUserInputWithValidation(text, option = null) {
      // Determinar si estamos en un flujo que requiere validación
      const needsValidation =
        this.currentFlow === "create_report" ||
        this.currentFlow === "create_express";

      if (!needsValidation) {
        // Procesamiento normal sin validación
        return this.processUserInput(text, option);
      }

      // Determinar qué campo se está validando basado en el paso actual
      const currentField = this.getCurrentFieldName();
      const fieldType = this.getCurrentFieldType();

      if (currentField && text && !option) {
        // Validar entrada de texto en tiempo real
        const validation = await this.validateUserInputWithFeedback(
          currentField,
          text,
          fieldType
        );

        if (!validation.isValid) {
          // Responder inmediatamente con feedback de validación
          this.addBotMessage(
            validation.message +
              "\n\nPor favor, intenta de nuevo con un valor válido.",
            "validation_error",
            null,
            true
          );
          return;
        } else {
          // Si la validación es exitosa, continuar con el procesamiento normal
          // Usar el valor formateado si está disponible
          const formattedText = validation.formatted || text;
          return this.processUserInput(formattedText, option);
        }
      }

      // Para opciones o casos especiales, procesar normalmente
      return this.processUserInput(text, option);
    },

    /**
     * Obtener el nombre del campo actual basado en el flujo y paso
     * @returns {string|null} Nombre del campo actual
     */
    getCurrentFieldName() {
      if (this.currentFlow === "create_report") {
        const reportSteps = [
          "nombre",
          "apellido",
          "identificacion",
          "nacionalidad",
          "telefono",
          "email",
          "fechaNacimiento",
          "genero",
          "tipoHospedaje",
          "agencia",
          "codigoReserva",
          "fechaCheckIn",
          "fechaCheckOut",
          "huespedes",
          "observaciones",
        ];
        return reportSteps[this.currentStep] || null;
      }

      if (this.currentFlow === "create_express") {
        const expressSteps = [
          "nombre",
          "apellido",
          "identificacion",
          "telefono",
          "observaciones",
        ];
        return expressSteps[this.currentStep] || null;
      }

      return null;
    },

    /**
     * Obtener el tipo de validación para el campo actual
     * @returns {string|null} Tipo de validación
     */
    getCurrentFieldType() {
      const currentField = this.getCurrentFieldName();

      if (currentField === "identificacion") {
        // Determinar tipo de identificación basado en datos temporales
        const tempData =
          this.currentFlow === "create_report"
            ? this.tempReportData
            : this.tempExpressData;
        return tempData.idType || "rut"; // Por defecto RUT para Chile
      }

      return null;
    },

    /**
     * Mostrar sugerencias para el campo actual
     * @param {string} query - Consulta para filtrar sugerencias
     * @returns {Promise} Respuesta con sugerencias
     */
    async showSuggestionsForCurrentField(query = "") {
      const currentField = this.getCurrentFieldName();

      if (!currentField) return null;

      const suggestions = await this.getSuggestionsForField(
        currentField,
        query,
        8
      );

      if (suggestions.length === 0) {
        return {
          text: "💡 No se encontraron sugerencias para este campo.",
          type: "text",
          expectsResponse: true,
        };
      }

      // Convertir sugerencias en opciones seleccionables
      const options = suggestions.map((suggestion, index) => ({
        id: `suggestion_${index}`,
        text: suggestion,
        value: suggestion,
      }));

      // Agregar opción para escribir manualmente
      options.push({
        id: "manual_input",
        text: "✏️ Escribir manualmente",
        value: "manual",
      });

      return {
        text: `💡 **Sugerencias para ${currentField}:**\n\nPuedes seleccionar una opción o escribir tu respuesta manualmente.`,
        type: "options",
        options: options,
        expectsResponse: true,
      };
    },

    // ===== HANDLERS DE ESTADOS ESPECÍFICOS - FASE 5 =====

    /**
     * Manejar estado del menú principal
     */
    handleMenuState() {
      // Este estado se maneja en addWelcomeMessage()
    },

    /**
     * Manejar estado de tipo de búsqueda
     * DESHABILITADO - Ahora se usa el flujo simplificado en handleMenuSelection
     */
    handleSearchTypeState() {
      /* CÓDIGO VIEJO COMENTADO - Causaba duplicación de mensajes
      this.addBotMessage(
        '🔍 **¿Cómo quieres buscar?**\n\nSelecciona el tipo de búsqueda:',
        'options',
        [
          { id: '1', text: '🆔 Por identificación (RUT, Cédula, Pasaporte)', value: 'search_id' },
          { id: '2', text: '📱 Por teléfono', value: 'search_phone' },
          { id: '3', text: '👤 Por nombre', value: 'search_name' },
          { id: '4', text: '📧 Por email', value: 'search_email' },
          { id: '5', text: '🏠 Volver al menú', value: 'menu' }
        ],
        true
      )
      */
      console.warn(
        "⚠️ handleSearchTypeState está deshabilitado. Usar handleMenuSelection en su lugar."
      );
    },

    /**
     * Manejar estado de nombre para reporte completo
     */
    handleReportNameState() {
      this.addBotMessage(
        "👤 **Datos Personales - Paso 1/15**\n\n¿Cuál es el **nombre** de la persona?",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de apellido para reporte completo
     */
    handleReportLastnameState() {
      this.addBotMessage(
        "👤 **Datos Personales - Paso 2/15**\n\n¿Cuál es el **apellido** de la persona?",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de identificación para reporte completo
     */
    handleReportIdentificationState() {
      this.addBotMessage(
        "🆔 **Identificación - Paso 3/15**\n\n¿Qué tipo de identificación tiene?",
        "options",
        [
          { id: "1", text: "🇨🇱 RUT (Chile)", value: "rut" },
          { id: "2", text: "🆔 Cédula", value: "cedula" },
          { id: "3", text: "📘 Pasaporte", value: "pasaporte" },
        ],
        true
      );
    },

    /**
     * Manejar estado de nacionalidad para reporte completo
     */
    handleReportNationalityState() {
      this.addBotMessage(
        "🌍 **Nacionalidad - Paso 4/15**\n\n¿Cuál es su nacionalidad? (Opcional)\n\nPuedes escribir o seleccionar de las sugerencias:",
        "input_with_suggestions",
        null,
        true
      );
    },

    /**
     * Manejar estado de teléfono para reporte completo
     */
    handleReportPhoneState() {
      this.addBotMessage(
        "📱 **Teléfono - Paso 5/15**\n\n¿Cuál es su número de teléfono? (Opcional)\n\n**Formato:** Solo números sin código de país (ej: 912345678)",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de email para reporte completo
     */
    handleReportEmailState() {
      this.addBotMessage(
        "📧 **Email - Paso 6/15**\n\n¿Cuál es su email? (Opcional)",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de nombre para reporte express
     */
    handleExpressNameState() {
      this.addBotMessage(
        "⚡ **Reporte Express - Paso 1/5**\n\n¿Cuál es el **nombre** de la persona?",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de apellido para reporte express
     */
    handleExpressLastnameState() {
      this.addBotMessage(
        "⚡ **Reporte Express - Paso 2/5**\n\n¿Cuál es el **apellido** de la persona?",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de identificación para reporte express
     */
    handleExpressIdentificationState() {
      this.addBotMessage(
        "⚡ **Reporte Express - Paso 3/5**\n\n¿Qué tipo de identificación tiene?",
        "options",
        [
          { id: "1", text: "🇨🇱 RUT (Chile)", value: "rut" },
          { id: "2", text: "🆔 Cédula", value: "cedula" },
          { id: "3", text: "📘 Pasaporte", value: "pasaporte" },
        ],
        true
      );
    },

    /**
     * Manejar estado de teléfono para reporte express
     */
    handleExpressPhoneState() {
      this.addBotMessage(
        "⚡ **Reporte Express - Paso 4/5**\n\n¿Cuál es su número de teléfono? (Opcional)\n\n**Formato:** Solo números sin código de país (ej: 912345678)",
        "input",
        null,
        true
      );
    },

    /**
     * Manejar estado de confirmación
     */
    handleConfirmState() {
      const isExpress = this.currentState.includes("EXPRESS");
      const data = isExpress ? this.tempExpressData : this.tempReportData;

      let summary = `📋 **Resumen del ${
        isExpress ? "Reporte Express" : "Reporte Completo"
      }**\n\n`;
      summary += `👤 **Nombre:** ${data.nombre} ${data.apellido}\n`;
      summary += `🆔 **Identificación:** ${data.identificacion}\n`;

      if (data.telefono) {
        summary += `📱 **Teléfono:** ${data.telefono}\n`;
      }

      if (data.email) {
        summary += `📧 **Email:** ${data.email}\n`;
      }

      summary += "\n¿Confirmas que los datos son correctos?";

      this.addBotMessage(
        summary,
        "options",
        [
          { id: "1", text: "✅ Sí, guardar reporte", value: "confirm_save" },
          { id: "2", text: "✏️ Editar datos", value: "edit" },
          { id: "3", text: "❌ Cancelar", value: "cancel" },
        ],
        true
      );
    },

    /**
     * Manejar estado de completado
     */
    handleCompleteState() {
      this.addBotMessage(
        "🎉 **¡Reporte guardado exitosamente!**\n\n¿Qué te gustaría hacer ahora?",
        "options",
        [
          { id: "1", text: "🔍 Buscar reportes", value: "search" },
          { id: "2", text: "📝 Crear otro reporte", value: "create_report" },
          { id: "3", text: "🏠 Volver al menú", value: "menu" },
        ],
        true
      );
    },

    // ===== PROCESADORES DE INPUT POR ESTADO =====

    /**
     * Procesar input del menú principal
     */
    processMenuInput(input) {
      switch (input) {
        case "search_region":
        case "1":
          this.currentFlow = "search_region";
          this.currentStep = 1;
          this.addBotMessage(
            "📍 **¿En qué región buscas?**\n\nSelecciona una región:",
            "options",
            [
              {
                id: "1",
                text: "🏜️ Norte",
                value: "region_norte",
              },
              { id: "2", text: "🏙️ Centro", value: "region_centro" },
              { id: "3", text: "🏔️ Sur", value: "region_sur" },
              { id: "4", text: "🔙 Volver al menú", value: "back_to_menu" },
            ],
            true
          );
          return;

        case "search_category":
        case "2":
          this.currentFlow = "search_category";
          this.currentStep = 1;
          this.addBotMessage(
            "🏷️ **¿Qué categoría prefieres?**\n\nSelecciona una categoría:",
            "options",
            [
              { id: "1", text: "👑 Enterprise", value: "category_enterprise" },
              { id: "2", text: "💎 VIP", value: "category_vip" },
              { id: "3", text: "⭐ Premium", value: "category_premium" },
              { id: "4", text: "🔥 Top", value: "category_top" },
              { id: "5", text: "💃 Normal", value: "category_normal" },
              { id: "6", text: "🔙 Volver al menú", value: "back_to_menu" },
            ],
            true
          );
          return;

        case "search_price":
        case "3":
          this.currentFlow = "search_price";
          this.currentStep = 1;
          this.addBotMessage(
            "💰 **¿Cuál es tu presupuesto?**\n\nEscribe un monto (ej: 30000) o un rango (ej: 20000-50000):",
            "input",
            null,
            true
          );
          return;

        case "featured":
        case "4":
          this.currentFlow = "featured";
          this.addBotMessage(
            "⭐ **Agencias Destacadas (Versión Beta)**\n\nEstas agencias pagan para aparecer como recomendadas:\n\n💎 Agencia Premium 1\n📍 Santiago Centro\n💰 $45.000 - $80.000\n🔗 Ver perfil\n\n💎 Agencia VIP 2\n📍 Providencia\n💰 $50.000 - $100.000\n🔗 Ver perfil\n\n*Nota: Esta es una versión beta. Próximamente más funciones.*",
            "options",
            [
              { id: "1", text: "🔍 Buscar por región", value: "search_region" },
              { id: "2", text: "🏠 Menú principal", value: "back_to_menu" },
            ],
            true
          );
          return;

        case "create_report":
        case "2":
          if (!this.canCreateReports) {
            this.addBotMessage(
              "⚠️ No tienes permisos para crear reportes.\n\nSolo administradores y owners pueden crear reportes.",
              "text",
              null,
              false
            );
            return;
          }
          return this.transitionToState("CREATE_REPORT");

        case "create_express":
        case "3":
          if (!this.canCreateReports) {
            this.addBotMessage(
              "⚠️ No tienes permisos para crear reportes express.\n\nSolo administradores y owners pueden crear reportes.",
              "text",
              null,
              false
            );
            return;
          }
          return this.transitionToState("CREATE_EXPRESS");

        case "navigate_dashboard":
        case "4":
          // Cerrar el bot inmediatamente
          this.isVisible = false;
          // Iniciar recordatorio periódico
          this.startPeriodicHelpReminder();
          // Limpiar completamente y reiniciar al menú
          setTimeout(() => {
            this.messages = []; // Limpiar mensajes
            this.currentState = "MENU";
            this.currentFlow = "menu";
            this.currentStep = 0;
            this.tempReportData = {};
            this.tempExpressData = {};
            this.tempSearchData = {};
            this.validationState.fieldErrors = {};
            this.validationState.fieldSuggestions = {};
            // Limpiar también localStorage para evitar que se recargue data vieja
            this.clearLocalStorage();
            // No agregar mensaje de bienvenida aquí porque el bot está cerrado
          }, 300);
          return; // No continuar procesando

        case "help":
        case "5":
          this.addBotMessage(
            "❓ **Ayuda**\n\nPuedo ayudarte a:\n- 🔍 Buscar reportes existentes\n- 📝 Crear reportes completos\n- ⚡ Crear reportes express\n- 🏠 Navegar en la aplicación\n\nSelecciona una opción del menú para comenzar.",
            "text",
            null,
            false
          );
          break;

        default:
          this.addBotMessage(
            "❓ No entendí tu respuesta. Por favor, selecciona una opción del menú.",
            "text",
            null,
            false
          );
      }
    },

    /**
     * Procesar input de tipo de búsqueda
     * DESHABILITADO - Ahora se usa el flujo simplificado directo
     */
    processSearchTypeInput(input) {
      /* CÓDIGO VIEJO COMENTADO - Causaba mensajes de "Selecciona una opción válida"
      switch (input) {
        case 'search_id':
        case '1':
          this.tempSearchData.type = 'identification'
          this.transitionToState('SEARCH_INPUT')
          this.addBotMessage(
            '🆔 **Búsqueda por Identificación**\n\nIngresa el RUT, Cédula o Pasaporte:',
            'input',
            null,
            true
          )
          break
          
        case 'search_phone':
        case '2':
          this.tempSearchData.type = 'phone'
          this.transitionToState('SEARCH_INPUT')
          this.addBotMessage(
            '📱 **Búsqueda por Teléfono**\n\nIngresa el número de teléfono (con código de país):',
            'input',
            null,
            true
          )
          break
          
        case 'search_name':
        case '3':
          this.tempSearchData.type = 'name'
          this.transitionToState('SEARCH_INPUT')
          this.addBotMessage(
            '👤 **Búsqueda por Nombre**\n\nIngresa el nombre o apellido:',
            'input',
            null,
            true
          )
          break
          
        case 'search_email':
        case '4':
          this.tempSearchData.type = 'email'
          this.transitionToState('SEARCH_INPUT')
          this.addBotMessage(
            '📧 **Búsqueda por Email**\n\nIngresa el email:',
            'input',
            null,
            true
          )
          break
          
        case 'menu':
        case '5':
          return this.resetToMenu()
          
        default:
          this.addBotMessage(
            '❓ Selecciona una opción válida.',
            'text',
            null,
            false
          )
      }
      */
      console.warn(
        "⚠️ processSearchTypeInput está deshabilitado. Usar handleFlowStep en su lugar."
      );
    },

    /**
     * Procesar input de búsqueda
     */
    async processSearchInput(input) {
      if (!input || input.trim() === "") {
        this.addBotMessage(
          "⚠️ Por favor, ingresa un valor para buscar.",
          "text",
          null,
          false
        );
        return;
      }

      this.tempSearchData.query = input.trim();

      // Ejecutar búsqueda usando el store de reportes existente
      try {
        this.addBotMessage("🔍 Buscando...", "text", null, false);

        const reportsStore = useReportsStore();
        const results = await reportsStore.searchReports({
          [this.tempSearchData.type]: this.tempSearchData.query,
        });

        if (results && results.length > 0) {
          this.transitionToState("SEARCH_RESULTS");
          this.displaySearchResults(results);
        } else {
          this.addBotMessage(
            "❌ No se encontraron reportes con esos criterios.\n\n¿Quieres intentar otra búsqueda?",
            "options",
            [
              { id: "1", text: "🔍 Buscar de nuevo", value: "search_again" },
              { id: "2", text: "🏠 Volver al menú", value: "menu" },
            ],
            true
          );
        }
      } catch (error) {
        console.error("Error en búsqueda:", error);
        this.addBotMessage(
          "❌ Error al realizar la búsqueda. ¿Quieres intentar de nuevo?",
          "options",
          [
            { id: "1", text: "🔄 Intentar de nuevo", value: "search_again" },
            { id: "2", text: "🏠 Volver al menú", value: "menu" },
          ],
          true
        );
      }
    },

    /**
     * Procesar input de nombre para reporte
     */
    async processReportNameInput(input) {
      if (!input || input.trim().length < 2) {
        this.addBotMessage(
          "⚠️ El nombre debe tener al menos 2 caracteres.",
          "text",
          null,
          false
        );
        return;
      }

      // Validar con el sistema de validación en tiempo real
      const validation = await this.validateFieldRealTime(
        "nombre",
        input.trim()
      );

      if (!validation.isValid) {
        this.addBotMessage(
          `❌ ${validation.message}\n\nIntenta de nuevo:`,
          "text",
          null,
          false
        );
        return;
      }

      this.tempReportData.nombre = input.trim();
      this.transitionToState("REPORT_LASTNAME");
    },

    /**
     * Procesar input de apellido para reporte
     */
    async processReportLastnameInput(input) {
      if (!input || input.trim().length < 2) {
        this.addBotMessage(
          "⚠️ El apellido debe tener al menos 2 caracteres.",
          "text",
          null,
          false
        );
        return;
      }

      const validation = await this.validateFieldRealTime(
        "apellido",
        input.trim()
      );

      if (!validation.isValid) {
        this.addBotMessage(
          `❌ ${validation.message}\n\nIntenta de nuevo:`,
          "text",
          null,
          false
        );
        return;
      }

      this.tempReportData.apellido = input.trim();
      this.transitionToState("REPORT_IDENTIFICATION");
    },

    /**
     * Procesar confirmación
     */
    async processConfirmInput(input) {
      switch (input) {
        case "confirm_save":
        case "1":
          await this.saveCurrentReport();
          break;

        case "edit":
        case "2":
          // Volver al estado anterior para editar
          this.goToPreviousState();
          break;

        case "cancel":
        case "3":
          this.resetToMenu();
          break;

        default:
          this.addBotMessage(
            "❓ Selecciona una opción válida.",
            "text",
            null,
            false
          );
      }
    },

    /**
     * Guardar reporte actual
     */
    async saveCurrentReport() {
      try {
        const isExpress = this.currentState.includes("EXPRESS");

        this.addBotMessage("💾 Guardando reporte...", "text", null, false);

        if (isExpress) {
          const expressReportsStore = useExpressReportsStore();
          await expressReportsStore.createExpressReport(this.tempExpressData);
        } else {
          const reportsStore = useReportsStore();
          await reportsStore.createReport(this.tempReportData);
        }

        this.transitionToState("COMPLETE");
      } catch (error) {
        console.error("Error guardando reporte:", error);
        this.addBotMessage(
          "❌ Error al guardar el reporte. ¿Quieres intentar de nuevo?",
          "options",
          [
            { id: "1", text: "🔄 Intentar de nuevo", value: "retry_save" },
            { id: "2", text: "🏠 Volver al menú", value: "menu" },
          ],
          true
        );
      }
    },

    /**
     * Mostrar resultados de búsqueda
     */
    displaySearchResults(results) {
      let message = `✅ **Encontré ${results.length} resultado(s):**\n\n`;

      results.slice(0, 5).forEach((report, index) => {
        message += `**${index + 1}.** ${report.nombre} ${report.apellido}\n`;
        message += `   🆔 ${report.identificacion}\n`;
        if (report.telefono) message += `   📱 ${report.telefono}\n`;
        message += "\n";
      });

      if (results.length > 5) {
        message += `... y ${results.length - 5} resultado(s) más.\n\n`;
      }

      message += "¿Qué quieres hacer ahora?";

      this.addBotMessage(
        message,
        "options",
        [
          { id: "1", text: "🔍 Nueva búsqueda", value: "search_again" },
          { id: "2", text: "📝 Crear reporte", value: "create_report" },
          { id: "3", text: "🏠 Volver al menú", value: "menu" },
        ],
        true
      );
    },

    // === MÉTODOS DE VALIDACIÓN EN TIEMPO REAL ===

    /**
     * Validar campo en tiempo real
     * @param {string} field - Nombre del campo
     * @param {string} value - Valor ingresado
     * @param {string} type - Tipo específico de validación
     * @returns {Object} Resultado de validación
     */
    async validateFieldRealTime(field, value, type = null) {
      try {
        console.log(`🔍 Real-time validation for ${field}:`, value);

        // Validación local con el servicio
        const localValidation = realTimeValidator.validateField(
          field,
          value,
          type
        );

        // Si hay error local, retornar inmediatamente
        if (!localValidation.isValid) {
          return {
            ...localValidation,
            source: "local",
          };
        }

        // Validación remota opcional para casos específicos
        if (["rut", "identificacion", "email"].includes(field)) {
          try {
            const remoteValidation = await botRepository.validateField(
              field,
              value
            );
            if (remoteValidation && !remoteValidation.isValid) {
              return {
                ...remoteValidation,
                source: "remote",
              };
            }
          } catch (error) {
            console.warn(
              "Remote validation failed, using local result:",
              error
            );
          }
        }

        return {
          ...localValidation,
          source: "local",
        };
      } catch (error) {
        console.error("Error in real-time validation:", error);
        return {
          isValid: false,
          message: "Error al validar el campo",
          suggestions: ["Intenta nuevamente", "Verifica el formato"],
          source: "error",
        };
      }
    },

    /**
     * Obtener sugerencias para autocompletado
     * @param {string} field - Campo para sugerencias
     * @param {string} query - Consulta de búsqueda
     * @returns {Array} Lista de sugerencias
     */
    async getSuggestionsRealTime(field, query = "") {
      try {
        console.log(`💡 Getting suggestions for ${field}:`, query);

        // Sugerencias locales
        const localSuggestions = realTimeValidator.getSuggestions(field, query);

        // Sugerencias remotas para campos específicos
        if (["nacionalidad", "agencia", "tipoHospedaje"].includes(field)) {
          try {
            const remoteSuggestions = await botRepository.getSuggestions(
              field,
              query
            );
            if (remoteSuggestions && remoteSuggestions.length > 0) {
              // Combinar sugerencias locales y remotas
              const combined = [...remoteSuggestions, ...localSuggestions];
              return [...new Set(combined)].slice(0, 8); // Remover duplicados y limitar
            }
          } catch (error) {
            console.warn("Remote suggestions failed, using local:", error);
          }
        }

        return localSuggestions;
      } catch (error) {
        console.error("Error getting suggestions:", error);
        return [];
      }
    },

    /**
     * Procesar entrada con validación inmediata
     * @param {string} input - Entrada del usuario
     * @param {string} expectedField - Campo esperado
     * @returns {Object} Resultado del procesamiento
     */
    async processInputWithValidation(input, expectedField) {
      try {
        const validation = await this.validateFieldRealTime(
          expectedField,
          input
        );

        if (validation.isValid) {
          // Solo retornar el valor validado, NO guardarlo aquí
          // El método que llama a esta función debe guardarlo en el objeto apropiado
          const finalValue = validation.formatted || input;

          return {
            success: true,
            value: finalValue,
            message: validation.message || "Campo válido",
            formatted: validation.formatted,
          };
        } else {
          return {
            success: false,
            message: validation.message,
            suggestions: validation.suggestions || [],
          };
        }
      } catch (error) {
        console.error("Error processing input with validation:", error);
        return {
          success: false,
          message: "Error al procesar la entrada",
          suggestions: ["Intenta nuevamente"],
        };
      }
    },

    /**
     * Mostrar feedback de validación al usuario
     * @param {Object} validation - Resultado de validación
     * @param {string} field - Campo validado
     */
    showValidationFeedback(validation, field) {
      if (validation.isValid) {
        // Feedback positivo discreto
        this.addBotMessage(`✅ ${validation.message}`, "validation-success");
      } else {
        // Feedback de error con sugerencias
        let message = `❌ ${validation.message}`;

        if (validation.suggestions && validation.suggestions.length > 0) {
          message += "\n\n💡 **Sugerencias:**\n";
          validation.suggestions.forEach((suggestion, index) => {
            message += `   ${index + 1}. ${suggestion}\n`;
          });
        }

        this.addBotMessage(
          message,
          "validation-error",
          null,
          true // Espera respuesta del usuario
        );
      }
    },

    /**
     * Formatear valor según el tipo de campo
     * @param {string} field - Tipo de campo
     * @param {string} value - Valor a formatear
     * @returns {string} Valor formateado
     */
    formatFieldValue(field, value) {
      try {
        const validation = realTimeValidator.validateField(field, value);
        return validation.formatted || value;
      } catch (error) {
        console.error("Error formatting field value:", error);
        return value;
      }
    },

    // === MÉTODOS DE NAVEGACIÓN ===

    /**
     * Guardar estado actual en el historial de navegación
     */
    saveNavigationState() {
      const state = {
        currentState: this.currentState,
        currentFlow: this.currentFlow,
        currentStep: this.currentStep,
        tempData: {
          ...this.tempReportData,
          ...this.tempExpressData,
          ...this.tempSearchData,
        },
        timestamp: Date.now(),
      };

      this.navigationHistory.push(state);
      this.canGoBack = this.navigationHistory.length > 0;

      // Limitar el historial a 20 estados
      if (this.navigationHistory.length > 20) {
        this.navigationHistory.shift();
      }

      console.log("📍 Estado guardado:", state);
    },

    /**
     * Volver al estado anterior
     */
    async goBack() {
      if (this.navigationHistory.length === 0) {
        console.warn("⚠️ No hay estados anteriores");
        return false;
      }

      // Obtener último estado
      const previousState = this.navigationHistory.pop();

      if (!previousState) return false;

      // Restaurar estado
      this.currentState = previousState.currentState;
      this.currentFlow = previousState.currentFlow;
      this.currentStep = previousState.currentStep;

      // Restaurar datos temporales
      if (this.currentFlow === "create_report") {
        this.tempReportData = { ...previousState.tempData };
      } else if (this.currentFlow === "create_express") {
        this.tempExpressData = { ...previousState.tempData };
      } else if (this.currentFlow === "search") {
        this.tempSearchData = { ...previousState.tempData };
      }

      // Actualizar breadcrumbs
      this.updateBreadcrumbs();

      // Actualizar flag de navegación
      this.canGoBack = this.navigationHistory.length > 0;

      // Mostrar mensaje de navegación
      await this.addBotMessage(
        "⬅️ Has vuelto al paso anterior.",
        "text",
        null,
        false
      );

      // Re-enviar la pregunta del estado actual
      await this.resendCurrentStateQuestion();

      console.log("⬅️ Navegación hacia atrás exitosa");
      return true;
    },

    /**
     * Reenviar la pregunta del estado actual
     */
    async resendCurrentStateQuestion() {
      // Obtener el mensaje apropiado según el estado actual
      const response = await this.getStateMessage(this.currentState);

      if (response) {
        await this.addBotMessage(
          response.text,
          response.type || "text",
          response.options || null,
          response.expectsResponse !== false
        );
      }
    },

    /**
     * Obtener el mensaje de un estado específico
     */
    async getStateMessage(state) {
      // Mapeo de estados a mensajes
      const stateMessages = {
        MENU: {
          text: "¿Qué te gustaría hacer?",
          type: "options",
          options: this.getMenuOptions(),
          expectsResponse: true,
        },
        SEARCH_TYPE: {
          text: "¿Cómo quieres buscar el reporte?",
          type: "options",
          options: [
            { id: "1", text: "🔍 Por identificación", value: "id" },
            { id: "2", text: "📱 Por teléfono", value: "phone" },
            { id: "3", text: "👤 Por nombre", value: "name" },
          ],
          expectsResponse: true,
        },
        // Agregar más estados según sea necesario
      };

      return stateMessages[state] || null;
    },

    /**
     * Actualizar breadcrumbs basado en el estado actual
     */
    updateBreadcrumbs() {
      const breadcrumbMap = {
        MENU: { label: "Menú Principal", icon: "🏠" },
        SEARCH_TYPE: { label: "Tipo de Búsqueda", icon: "🔍" },
        SEARCH_QUERY: { label: "Buscando...", icon: "⌛" },
        SEARCH_RESULTS: { label: "Resultados", icon: "✅" },
        CREATE_REPORT: { label: "Crear Reporte", icon: "📝" },
        CREATE_EXPRESS: { label: "Reporte Express", icon: "⚡" },
        REPORT_NAME: { label: "Nombre", icon: "👤" },
        REPORT_LASTNAME: { label: "Apellido", icon: "👤" },
        REPORT_IDENTIFICATION: { label: "Identificación", icon: "🆔" },
        REPORT_PHONE: { label: "Teléfono", icon: "📱" },
        REPORT_EMAIL: { label: "Email", icon: "📧" },
        CONFIRM: { label: "Confirmar", icon: "✅" },
        COMPLETE: { label: "Completado", icon: "🎉" },
      };

      const crumb = breadcrumbMap[this.currentState];
      if (crumb) {
        // Evitar duplicados consecutivos
        const lastCrumb = this.breadcrumbs[this.breadcrumbs.length - 1];
        if (!lastCrumb || lastCrumb.state !== this.currentState) {
          this.breadcrumbs.push({
            state: this.currentState,
            label: crumb.label,
            icon: crumb.icon,
            timestamp: Date.now(),
          });
        }
      }

      // Limitar breadcrumbs a 10 elementos
      if (this.breadcrumbs.length > 10) {
        this.breadcrumbs = this.breadcrumbs.slice(-10);
      }
    },

    /**
     * Resetear navegación y breadcrumbs
     */
    resetNavigation() {
      this.navigationHistory = [];
      this.breadcrumbs = [];
      this.canGoBack = false;
      this.previousState = null;
      console.log("🔄 Navegación reseteada");
    },

    /**
     * Ir directamente a un estado específico (para breadcrumb navigation)
     */
    async navigateToState(targetState) {
      console.log(`🎯 Navegando a estado: ${targetState}`);

      // Guardar estado actual antes de navegar
      this.saveNavigationState();

      // Cambiar al estado objetivo
      this.currentState = targetState;

      // Actualizar breadcrumbs
      this.updateBreadcrumbs();

      // Mostrar mensaje del nuevo estado
      await this.resendCurrentStateQuestion();
    },

    // === MÉTODOS DE CONFIRMACIÓN - FASE 6.5 ===

    /**
     * Mostrar pantalla de confirmación
     */
    showConfirmationScreen(reportType = "complete") {
      console.log("📋 Mostrando pantalla de confirmación:", reportType);

      this.confirmationType = reportType;
      this.showConfirmation = true;
      this.currentState = "CONFIRM";

      this.saveNavigationState();
      this.updateBreadcrumbs();
    },

    /**
     * Ocultar pantalla de confirmación
     */
    hideConfirmationScreen() {
      console.log("❌ Ocultando pantalla de confirmación");

      this.showConfirmation = false;
      this.confirmationType = null;
    },

    /**
     * Manejar edición de un campo desde la confirmación
     */
    async handleFieldEditFromConfirmation(editData) {
      console.log("✏️ Editando campo desde confirmación:", editData);

      const { field, newValue, label } = editData;

      // Actualizar el valor en tempReportData o tempExpressData
      const dataSource =
        this.confirmationType === "complete"
          ? "tempReportData"
          : "tempExpressData";

      // Validar el nuevo valor antes de actualizar
      try {
        let validationResult = null;

        // Aplicar validación según el tipo de campo
        switch (field) {
          case "identificacion":
            validationResult = await realTimeValidator.validateField(
              "identificacion",
              newValue,
              { idType: this[dataSource].idType || "rut" }
            );
            break;

          case "telefono":
            validationResult = await realTimeValidator.validateField(
              "telefono",
              newValue
            );
            break;

          case "email":
            validationResult = await realTimeValidator.validateField(
              "email",
              newValue
            );
            break;

          case "nombre":
          case "apellido":
            validationResult = await realTimeValidator.validateField(
              "nombre",
              newValue
            );
            break;

          default:
            // Para otros campos, aceptar directamente
            validationResult = { isValid: true, formatted: newValue };
        }

        if (validationResult && validationResult.isValid) {
          // Actualizar con el valor formateado si está disponible
          this[dataSource][field] = validationResult.formatted || newValue;

          this.addBotMessage(
            `✅ ${label} actualizado correctamente a: ${
              validationResult.formatted || newValue
            }`,
            "info",
            [],
            false
          );

          return {
            success: true,
            value: validationResult.formatted || newValue,
          };
        } else {
          this.addBotMessage(
            `❌ Error al actualizar ${label}: ${
              validationResult?.message || "Valor inválido"
            }`,
            "error",
            [],
            false
          );

          return {
            success: false,
            error: validationResult?.message || "Valor inválido",
          };
        }
      } catch (error) {
        console.error("Error al validar campo editado:", error);

        this.addBotMessage(
          `❌ Error al validar ${label}. Por favor, intenta nuevamente.`,
          "error",
          [],
          false
        );

        return { success: false, error: error.message };
      }
    },

    /**
     * Confirmar y guardar el reporte
     */
    async confirmAndSaveReport(confirmData) {
      console.log("💾 Confirmando y guardando reporte:", confirmData);

      this.isSubmitting = true;

      try {
        const { reportType, data } = confirmData;

        let result;
        if (reportType === "complete") {
          result = await this.saveCompleteReport();
        } else {
          result = await this.saveExpressReport();
        }

        // ✅ Aceptar tanto 'success' como 'options' (ambos indican guardado exitoso)
        if (
          result &&
          (result.type === "success" || result.type === "options")
        ) {
          // Ocultar confirmación
          this.hideConfirmationScreen();

          // Limpiar datos temporales DESPUÉS de cerrar confirmación
          if (reportType === "complete") {
            this.tempReportData = {};
          } else {
            this.tempExpressData = {};
          }

          // Mostrar mensaje de éxito
          this.addBotMessage(
            result.text,
            result.type, // Usar el type original ('success' o 'options')
            result.options || [],
            true
          );

          // Cambiar estado a COMPLETE
          this.currentState = "COMPLETE";
          this.updateBreadcrumbs();

          return { success: true, result };
        } else {
          // Mostrar error pero mantener la confirmación abierta
          this.addBotMessage(
            result?.text ||
              "❌ Error al guardar el reporte. Por favor, intenta nuevamente.",
            "error",
            result?.options || [],
            true
          );

          return { success: false, error: result?.text };
        }
      } catch (error) {
        console.error("Error al confirmar y guardar reporte:", error);

        this.addBotMessage(
          "❌ Error inesperado al guardar el reporte. Por favor, intenta nuevamente.",
          "error",
          [
            { id: "1", text: "🔄 Reintentar", value: "retry_save" },
            { id: "2", text: "✏️ Volver a editar", value: "back_to_edit" },
            {
              id: "3",
              text: "🏠 Cancelar y volver al menú",
              value: "cancel_and_menu",
            },
          ],
          true
        );

        return { success: false, error: error.message };
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * Cancelar confirmación y volver al menú
     */
    cancelConfirmation() {
      console.log("❌ Cancelando confirmación");

      if (
        confirm(
          "¿Confirmas que deseas cancelar? Se perderán todos los datos ingresados."
        )
      ) {
        // Limpiar datos temporales
        this.tempReportData = {};
        this.tempExpressData = {};

        // Ocultar confirmación
        this.hideConfirmationScreen();

        // Volver al menú
        this.resetToMenu();

        this.addBotMessage(
          "🏠 Has regresado al menú principal. Los datos del reporte fueron descartados.",
          "menu",
          this.getMenuOptions(),
          true
        );
      }
    },

    /**
     * Volver a editar desde la confirmación
     */
    backFromConfirmation() {
      console.log("⬅️ Volviendo a editar desde confirmación");

      // Ocultar confirmación
      this.hideConfirmationScreen();

      // Volver al estado anterior usando navegación
      this.goBack();

      this.addBotMessage(
        "✏️ Puedes continuar editando los campos del reporte.",
        "info",
        [],
        false
      );
    },

    // === MANEJO DE ERRORES MEJORADO - FASE 6.6 ===

    /**
     * Manejar error con el ErrorHandler service
     */
    handleErrorWithService(error, context = {}) {
      console.error("🚨 Error capturado:", error);

      // Usar el ErrorHandler service
      const errorResponse = errorHandler.handleError(error, {
        ...context,
        currentState: this.currentState,
        currentFlow: this.currentFlow,
        sessionId: this.sessionId,
      });

      // Mostrar mensaje de error al usuario
      this.addBotMessage(
        `${errorResponse.title}\n\n${errorResponse.message}`,
        "error",
        errorResponse.options,
        true
      );

      // Si hay sugerencias, mostrarlas
      if (errorResponse.suggestions && errorResponse.suggestions.length > 0) {
        const suggestionsText =
          "\n\n**Sugerencias:**\n" +
          errorResponse.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n");

        this.addBotMessage(suggestionsText, "info", [], false);
      }

      return errorResponse;
    },

    /**
     * Intentar operación con retry automático
     */
    async tryWithRetry(operation, fn, context = {}) {
      try {
        return await errorHandler.withRetry(operation, fn);
      } catch (error) {
        return this.handleErrorWithService(error, {
          ...context,
          operation,
          retriesExhausted: true,
        });
      }
    },

    /**
     * Manejar acción de recuperación de error
     */
    async handleErrorRecovery(action, errorContext = {}) {
      console.log("🔧 Manejando recuperación de error:", action);

      switch (action) {
        case "retry":
          // Reintentar la operación que falló
          if (errorContext.operation) {
            errorHandler.resetRetry(errorContext.operation);
            this.addBotMessage(
              "🔄 Reintentando operación...",
              "info",
              [],
              false
            );
            // Aquí se debería llamar a la función original
          }
          break;

        case "save_draft":
        case "save_progress":
          // Guardar progreso local
          this.saveToLocalStorage();
          this.addBotMessage(
            "💾 Progreso guardado localmente. Puedes continuar más tarde.",
            "success",
            this.getMenuOptions(),
            true
          );
          break;

        case "login":
          // Redirigir a login
          this.addBotMessage(
            "🔑 Por favor, inicia sesión para continuar.",
            "info",
            [{ id: "1", text: "🏠 Volver al menú", value: "back_to_menu" }],
            true
          );
          break;

        case "contact_admin":
          // Mostrar información de contacto
          this.addBotMessage(
            "📧 Contacta a un administrador:\n\n" +
              "Email: admin@example.com\n" +
              "O usa el formulario de contacto en la página principal.",
            "info",
            [{ id: "1", text: "🏠 Volver al menú", value: "back_to_menu" }],
            true
          );
          break;

        case "search_again":
          // Volver a búsqueda
          this.currentState = "SEARCH_TYPE";
          this.currentFlow = "search";
          this.addBotMessage(
            "🔍 Intentemos buscar de nuevo.",
            "search",
            [
              { id: "1", text: "👤 Por nombre", value: "name" },
              { id: "2", text: "🆔 Por identificación", value: "id" },
              { id: "3", text: "📧 Por email", value: "email" },
              { id: "4", text: "🏠 Volver al menú", value: "back_to_menu" },
            ],
            true
          );
          break;

        case "later":
          // Guardar y cerrar
          this.saveToLocalStorage();
          this.addBotMessage(
            "⏸️ Datos guardados. Puedes continuar cuando estés listo.",
            "info",
            this.getMenuOptions(),
            true
          );
          break;

        case "edit":
          // Volver a editar
          this.goBack();
          break;

        case "show_examples":
          // Mostrar ejemplos de formato
          this.showFormatExamples();
          break;

        case "cancel":
          // Cancelar operación
          this.resetToMenu();
          this.addBotMessage(
            "❌ Operación cancelada.",
            "menu",
            this.getMenuOptions(),
            true
          );
          break;

        case "report_error":
          // Reportar error al equipo
          this.reportErrorToTeam(errorContext);
          break;

        case "back_to_menu":
        default:
          // Volver al menú
          this.resetToMenu();
          this.addBotMessage(
            "🏠 Has vuelto al menú principal. ¿Qué te gustaría hacer?",
            "menu",
            this.getMenuOptions(),
            true
          );
          break;
      }
    },

    /**
     * Mostrar ejemplos de formato
     */
    showFormatExamples() {
      const examples = `
📝 **Ejemplos de Formato Correcto:**

**RUT Chileno:**
Sin puntos ni guión: 123456789

**Teléfono:**
Sin código de país: 912345678

**Email:**
usuario@ejemplo.com

**Fecha:**
2025-10-21 o 21/10/2025

**Nombre/Apellido:**
Juan Pablo (primera letra mayúscula)
      `.trim();

      this.addBotMessage(
        examples,
        "info",
        [
          { id: "1", text: "✅ Entendido, continuar", value: "continue" },
          { id: "2", text: "🏠 Volver al menú", value: "back_to_menu" },
        ],
        true
      );
    },

    /**
     * Reportar error al equipo de soporte
     */
    reportErrorToTeam(errorContext) {
      const errorLog = errorHandler.getErrorLog();
      const lastErrors = errorLog.slice(-5); // Últimos 5 errores

      console.log("📧 Reportando error al equipo:", {
        context: errorContext,
        recentErrors: lastErrors,
      });

      // En producción, enviar a sistema de tickets o email
      this.addBotMessage(
        "📧 Error reportado al equipo de soporte.\n\n" +
          "Nos pondremos en contacto contigo pronto.\n\n" +
          `**ID del reporte:** ${errorContext.errorId || "N/A"}`,
        "success",
        [{ id: "1", text: "🏠 Volver al menú", value: "back_to_menu" }],
        true
      );
    },

    /**
     * Obtener log de errores para debugging
     */
    getErrorLog() {
      return errorHandler.getErrorLog();
    },

    /**
     * Limpiar log de errores
     */
    clearErrorLog() {
      errorHandler.clearErrorLog();
      console.log("🧹 Log de errores limpiado");
    },
  },
});
