<template>
  <!-- Solo mostrar el bot si el usuario está autenticado -->
  <!-- TEMPORAL: Comentado para testing - descomentar en producción -->
  <!-- <div v-if="isUserAuthenticated"> -->
  <div>
    <div v-if="isVisible" class="chatbot-container">
      <!-- Header del chat -->
      <div class="chatbot-header">
        <div class="header-content">
          <div class="bot-info">
            <div class="bot-avatar">
              <img :src="Amin" alt="AMIN" class="bot-avatar-img" />
            </div>
            <div class="bot-details">
              <h6 class="bot-name">AMIN</h6>
              <span class="bot-subtitle">Agente Mundo Informativo</span>
              <span class="bot-status" :class="{ typing: isTyping }">
                {{ isTyping ? "Escribiendo..." : "En línea" }}
              </span>
            </div>
          </div>

          <div class="header-actions">
            <button
              @click="closeChatBot"
              class="btn btn-sm btn-ghost"
              title="Cerrar"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Barra de progreso compacta (solo durante formularios) -->
        <div v-if="currentProgress > 0" class="progress-bar-compact">
          <div
            class="progress-fill"
            :style="{ width: currentProgress + '%' }"
          ></div>
          <span class="progress-text">{{ currentProgress }}%</span>
        </div>
      </div>

      <!-- Navegación y Progress movidos FUERA del header para reducir altura -->
      <div class="chatbot-navigation-area">
        <!-- Navegación y Breadcrumbs -->
        <ChatBotNavigation
          :maxBreadcrumbs="3"
          :showActions="false"
          @navigation-change="handleNavigationChange"
        />

        <!-- Indicador de Progreso compacto -->
        <ProgressIndicator mode="compact" :autoHide="true" />
      </div>

      <!-- Cuerpo del chat -->
      <div class="chatbot-body">
        <!-- Área de mensajes -->
        <div class="messages-container" ref="messagesContainer">
          <div class="messages-list">
            <!-- Mensaje de cada conversación -->
            <ChatMessage
              v-for="message in visibleMessages"
              :key="message.id"
              :message="message"
              @option-selected="handleOptionSelected"
              @quick-reply="handleQuickReply"
              @view-selected-reports="handleViewSelectedReports"
            />

            <!-- Indicador de escritura -->
            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-avatar">
                <img
                  src="@/assets/amin-transparente.webp"
                  alt="AMIN"
                  class="typing-avatar-img"
                />
              </div>
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de input -->
        <div class="input-area">
          <!-- Botones de respuesta rápida - DESHABILITADO: Causa duplicación con los botones en ChatMessage -->
          <!-- 
        <QuickReply 
          v-if="lastMessage && lastMessage.options && !isTyping"
          :options="lastMessage.options"
          @option-selected="handleOptionSelected"
        />
        -->

          <!-- Input de texto con validación en tiempo real -->
          <div class="input-container">
            <!-- Usar componente de validación en tiempo real para formularios -->
            <ChatBotRealTimeInput
              v-if="requiresValidation"
              :field="currentField"
              :field-type="currentFieldType"
              :placeholder="getInputPlaceholder()"
              :disabled="isTyping || !canType"
              :support-suggestions="supportsSuggestionsForField"
              @submit="handleValidatedSubmit"
              @validation-change="handleValidationChange"
              @suggestion-selected="handleSuggestionSelected"
            />

            <!-- Input normal para el resto de interacciones -->
            <div v-else class="input-group">
              <input
                ref="normalInputRef"
                v-model="currentInput"
                @keyup.enter="sendMessage"
                @keyup.escape="clearInput"
                :placeholder="getInputPlaceholder()"
                :disabled="isTyping || !canType"
                class="form-control chat-input"
                type="text"
                maxlength="500"
              />

              <button
                @click="sendMessage"
                :disabled="!canSendMessage"
                class="btn btn-primary send-button"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>

            <!-- Acciones adicionales -->
            <div class="input-actions">
              <button
                @click="goBackToMenu"
                class="btn btn-sm btn-outline-secondary"
                title="Volver al menú"
              >
                <i class="fas fa-home"></i> Menú
              </button>

              <button
                @click="clearConversation"
                class="btn btn-sm btn-outline-warning"
                title="Limpiar conversación"
              >
                <i class="fas fa-broom"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación de reporte - MOVIDO DENTRO DEL CHATBOT -->
      <div v-if="showConfirmation" class="confirmation-overlay">
        <ReportConfirmation
          :visible="showConfirmation"
          :reportType="confirmationType"
          @confirm="handleConfirmReport"
          @cancel="handleCancelConfirmation"
          @edit-field="handleEditFieldFromConfirmation"
          @back="handleBackFromConfirmation"
        />
      </div>
    </div>

    <!-- Botón flotante para abrir el chat -->
    <div v-if="!isVisible" class="chatbot-trigger">
      <button
        @click="openChatBot"
        class="btn btn-primary btn-floating"
        title="Abrir Asistente de Reportes"
      >
        <img
          src="@/assets/amin-transparente.webp"
          alt="AMIN"
          class="bot-floating-img"
        />
        <span v-if="hasNotifications" class="notification-badge">!</span>
      </button>

      <!-- Viñeta de ayuda estilo cómic -->
      <div v-if="showHelpBubble" class="help-bubble">
        <button @click="closeHelpBubble" class="bubble-close" title="Cerrar">
          <i class="fas fa-times"></i>
        </button>
        <div class="bubble-content">¡Estoy aquí para ayudarte! 👋</div>
        <div class="bubble-tail"></div>
      </div>
    </div>
    <!-- TEMPORAL: Cerrado anticipadamente para testing -->
  </div>

  <!-- Modal de visualización de reporte -->
  <ReportViewModal
    :show="showReportModal"
    :report="selectedReport"
    @close="closeReportModal"
  />
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useChatBotStore } from "@/store/chatBotStore.js";
import { useAuthStore } from "@/store/authStore.js";
import ChatMessage from "./ChatMessage.vue";
import QuickReply from "./QuickReply.vue";
import ChatBotNavigation from "./ChatBotNavigation.vue";
import ProgressIndicator from "./ProgressIndicator.vue";
import ReportViewModal from "./ReportViewModal.vue";
import ReportConfirmation from "./ReportConfirmation.vue";
import ChatBotRealTimeInput from "./ChatBotRealTimeInput.vue";
import Amin from "@/assets/amin-transparente.webp";

// Stores
const chatBotStore = useChatBotStore();
const authStore = useAuthStore();

// Referencias
const messagesContainer = ref(null);
const currentInput = ref("");
const normalInputRef = ref(null); // Referencia al input normal

// Estado local
const hasNotifications = ref(false);
const showReportModal = ref(false);
const selectedReport = ref(null);

// Computed properties del store
const isVisible = computed(() => chatBotStore.isVisible);
const isTyping = computed(() => chatBotStore.isTyping);
const visibleMessages = computed(() => chatBotStore.visibleMessages);
const lastMessage = computed(() => chatBotStore.lastMessage);
const currentProgress = computed(() => chatBotStore.currentProgress);
const isWaitingForResponse = computed(() => chatBotStore.isWaitingForResponse);

// Computed properties de confirmación
const showConfirmation = computed(() => chatBotStore.showConfirmation);
const confirmationType = computed(() => chatBotStore.confirmationType);

// Computed properties de autenticación
const isUserAuthenticated = computed(() => authStore.isAuthenticated);

// Computed property para la viñeta de ayuda
const showHelpBubble = computed(() => chatBotStore.showHelpBubble);

// === VALIDACIÓN EN TIEMPO REAL ===

// Determinar si necesita validación basado en el estado actual
const requiresValidation = computed(() => {
  const state = chatBotStore.currentState;
  const formStates = [
    "REPORT_NAME",
    "REPORT_SURNAME",
    "REPORT_IDENTIFICATION",
    "REPORT_PHONE",
    "REPORT_EMAIL",
    "SEARCH_QUERY",
  ];
  return formStates.includes(state) && lastMessage.value?.expectsResponse;
});

// Campo actual para validación
const currentField = computed(() => {
  const state = chatBotStore.currentState;
  const fieldMap = {
    REPORT_NAME: "nombre",
    REPORT_SURNAME: "apellido",
    REPORT_IDENTIFICATION: "identificacion",
    REPORT_PHONE: "telefono",
    REPORT_EMAIL: "email",
    SEARCH_QUERY: "busqueda",
  };
  return fieldMap[state] || "general";
});

// Tipo específico del campo
const currentFieldType = computed(() => {
  if (currentField.value === "identificacion") {
    return chatBotStore.tempReportData?.idType || "rut";
  }
  return null;
});

// Si el campo actual soporta sugerencias
const supportsSuggestionsForField = computed(() => {
  const supportedFields = [
    "nacionalidad",
    "agencia",
    "tipoHospedaje",
    "telefono",
  ];
  return supportedFields.includes(currentField.value);
});

// Si puede escribir (no está escribiendo el bot y espera respuesta)
const canType = computed(() => {
  return !isTyping.value && isWaitingForResponse.value;
});

const canSendMessage = computed(() => {
  return (
    currentInput.value.trim().length > 0 && !isTyping.value && canType.value
  );
});

// Methods
const openChatBot = () => {
  chatBotStore.toggleVisibility();
  hasNotifications.value = false;
};

const closeChatBot = () => {
  chatBotStore.toggleVisibility();
};

const closeHelpBubble = () => {
  chatBotStore.closeHelpBubble();
};

const sendMessage = () => {
  if (!canSendMessage.value) return;

  const message = currentInput.value.trim();
  currentInput.value = "";

  // Agregar mensaje del usuario (esto ya procesa la entrada automáticamente)
  chatBotStore.addUserMessage(message);

  // REMOVIDO - processUserInputByState causa duplicación con el sistema nuevo
  // chatBotStore.processUserInputByState(message)
};

const clearInput = () => {
  currentInput.value = "";
};

const handleOptionSelected = (option) => {
  // Manejar visualización de reportes
  if (option.value && option.value.startsWith("view_")) {
    const parts = option.value.split("_");
    if (parts.length >= 3) {
      const reportId = parts[1];
      const reportType = parts[2];

      // Buscar el reporte en los resultados de búsqueda más recientes
      const recentMessages = chatBotStore.visibleMessages.slice(-10);
      let foundReport = null;

      for (const message of recentMessages) {
        if (message.searchResults && Array.isArray(message.searchResults)) {
          foundReport = message.searchResults.find((r) => r.id === reportId);
          if (foundReport) break;
        }
      }

      if (foundReport) {
        // Asegurar que el reporte tenga la información de tipo correcta
        if (!foundReport.reportType) {
          foundReport.reportType =
            foundReport.fromCollection === "expressReports"
              ? "express"
              : "standard";
        }

        selectedReport.value = foundReport;
        showReportModal.value = true;
        return; // No procesar como opción normal
      }
    }
  }

  // Agregar mensaje del usuario y procesar (addUserMessage ya llama a processUserInput internamente)
  chatBotStore.addUserMessage(option.text, option);

  // REMOVIDO - processUserInputByState causa duplicación con el sistema nuevo
  // chatBotStore.processUserInputByState(option.text, option)
};

const closeReportModal = () => {
  showReportModal.value = false;
  selectedReport.value = null;
};

// Métodos para validación en tiempo real
const handleValidatedSubmit = (data) => {
  console.log("📝 ChatBot: Campo validado enviado:", data);

  // Verificar que data es un objeto con las propiedades esperadas
  if (!data || typeof data !== "object") {
    console.error("❌ ChatBot: Dato inválido recibido:", data);
    return;
  }

  // Usar el valor formateado si está disponible, sino el valor original
  const messageText = data.formatted || data.value;

  if (!messageText || messageText === "undefined") {
    console.error("❌ ChatBot: Mensaje vacío o undefined:", messageText);
    return;
  }

  console.log("✅ ChatBot: Procesando mensaje:", messageText);

  // Procesar a través del store con validación
  chatBotStore.processUserInputWithValidation(messageText);
};

const handleValidationChange = (validationData) => {
  console.log("🔍 ChatBot: Estado de validación cambiado:", validationData);

  // Aquí se puede mostrar feedback visual adicional si es necesario
  // Por ejemplo, cambiar el color del header según la validación
  if (validationData.isValid) {
    console.log("✅ Campo válido:", validationData.field);
  } else {
    console.log(
      "❌ Campo inválido:",
      validationData.field,
      validationData.message
    );
  }
};

const handleSuggestionSelected = (suggestionData) => {
  console.log("💡 ChatBot: Sugerencia seleccionada:", suggestionData);

  // Agregar mensaje de confirmación visual opcional
  // o manejar lógica especial para ciertas sugerencias
};

const handleViewSelectedReports = (selectedReports) => {
  if (selectedReports.length === 1) {
    // Si solo hay uno seleccionado, abrir el modal normalmente
    selectedReport.value = selectedReports[0];
    showReportModal.value = true;
  } else if (selectedReports.length > 1) {
    // Para múltiples reportes, podríamos crear un modal especial o mostrar en lista
    // Por ahora, mostraremos el primero y informaremos al usuario
    selectedReport.value = selectedReports[0];
    showReportModal.value = true;

    // TODO: Implementar modal para múltiples reportes
    console.log("Múltiples reportes seleccionados:", selectedReports);
  }
};

const handleQuickReply = (reply) => {
  chatBotStore.addUserMessage(reply.text, reply);
};

// Handlers para confirmación de reportes
const handleConfirmReport = async (confirmData) => {
  console.log("✅ Confirmando reporte:", confirmData);

  const result = await chatBotStore.confirmAndSaveReport(confirmData);

  if (result.success) {
    console.log("✅ Reporte guardado exitosamente");
  } else {
    console.error("❌ Error al guardar reporte:", result.error);
  }
};

const handleCancelConfirmation = () => {
  console.log("❌ Cancelando confirmación");
  chatBotStore.cancelConfirmation();
};

const handleEditFieldFromConfirmation = async (editData) => {
  console.log("✏️ Editando campo desde confirmación:", editData);

  const result = await chatBotStore.handleFieldEditFromConfirmation(editData);

  if (result.success) {
    console.log("✅ Campo actualizado:", editData.field, "→", result.value);
  } else {
    console.error("❌ Error al actualizar campo:", result.error);
  }
};

const handleBackFromConfirmation = () => {
  console.log("⬅️ Volviendo desde confirmación");
  chatBotStore.backFromConfirmation();
};

const goBackToMenu = () => {
  chatBotStore.resetToMenu();
  chatBotStore.addBotMessage(
    "🏠 Volvamos al menú principal. ¿Qué te gustaría hacer?",
    "menu",
    chatBotStore.getMenuOptions(),
    true
  );
};

const clearConversation = () => {
  if (confirm("¿Estás seguro de que quieres limpiar toda la conversación?")) {
    chatBotStore.clearConversation();
  }
};

const getInputPlaceholder = () => {
  if (isTyping.value) return "El bot está escribiendo...";
  if (!canType.value) return "Selecciona una opción arriba...";

  // Placeholders específicos para validación en tiempo real
  if (requiresValidation.value) {
    const placeholders = {
      nombre: "Escribe el nombre...",
      apellido: "Escribe el apellido...",
      identificacion: "Ej: 12345678-9",
      telefono: "Ej: +56912345678",
      email: "Ej: usuario@correo.com",
      busqueda: "Nombre, apellido o identificación...",
    };
    return placeholders[currentField.value] || "Escribe tu respuesta...";
  }

  const currentFlow = chatBotStore.currentFlow;
  if (currentFlow === "search") return "Escribe tu búsqueda...";
  if (currentFlow === "create_report") return "Escribe tu respuesta...";
  if (currentFlow === "create_express") return "Escribe tu respuesta...";

  return "Escribe tu mensaje...";
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

/**
 * Enfocar el input apropiado según el contexto
 */
const focusInput = () => {
  nextTick(() => {
    if (normalInputRef.value) {
      normalInputRef.value.focus();

      // En móviles, hacer scroll al input para asegurar visibilidad
      if (isMobileDevice()) {
        setTimeout(() => {
          normalInputRef.value.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  });
};

/**
 * Desenfocar el input (cerrar teclado en móviles)
 */
const blurInput = () => {
  nextTick(() => {
    if (normalInputRef.value) {
      normalInputRef.value.blur();
    }
  });
};

/**
 * Detectar si es dispositivo móvil
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Handler para cambios de navegación
const handleNavigationChange = (event) => {
  console.log("🧭 Navegación cambiada:", event);

  if (event.success) {
    // Scroll al fondo después de la navegación
    scrollToBottom();
  } else if (event.error) {
    console.error("Error en navegación:", event.error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};

// Watchers
watch(
  visibleMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

watch(isVisible, (newValue) => {
  if (newValue) {
    scrollToBottom();
    // NO hacer auto-focus al abrir - dejar que el usuario vea el menú primero
  }
});

// Watcher para auto-focus cuando cambia el contexto
watch(
  [requiresValidation, isWaitingForResponse, lastMessage],
  ([isValidating, isWaiting, message]) => {
    // Solo hacer focus si:
    // 1. No requiere validación
    // 2. Está esperando respuesta
    // 3. El mensaje espera respuesta (expectsResponse)
    // 4. NO hay opciones (no es un menú)
    // 5. El mensaje no es el inicial del bot
    if (!isValidating && isWaiting && message?.expectsResponse) {
      const hasOptions = message.options && message.options.length > 0;
      const isMenu = message.type === "menu" || message.type === "options";

      // Solo hacer focus si NO tiene opciones Y NO es un menú
      if (!hasOptions && !isMenu) {
        setTimeout(() => {
          focusInput();
        }, 100);
      } else {
        // Si tiene opciones o es menú, hacer blur para cerrar el teclado en móviles
        blurInput();
      }
    } else if (message?.options && message.options.length > 0) {
      // Cuando aparecen opciones, cerrar el teclado
      blurInput();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  // Auto-inicializar si no hay sesión
  if (isVisible.value) {
    chatBotStore.initializeSession();
  }
});

onUnmounted(() => {
  // Guardar estado antes de cerrar
  chatBotStore.saveToLocalStorage();
});

// Atajos de teclado
const handleKeydown = (event) => {
  // Ctrl + K para abrir/cerrar chat
  if (event.ctrlKey && event.key === "k") {
    event.preventDefault();
    chatBotStore.toggleVisibility();
  }

  // Escape para cerrar si está abierto
  if (event.key === "Escape" && isVisible.value) {
    chatBotStore.toggleVisibility();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* Contenedor principal del chatbot */
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-height: 600px; /* Altura máxima fija para desktop */
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden; /* Importante para evitar desbordamiento */
}

/* Header del chat - STICKY para que siempre sea visible */
.chatbot-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: #212529;
  padding: 12px 16px; /* Reducido de 16px */
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0; /* No permitir compresión */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 36px; /* Reducido de 40px */
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px; /* Reducido de 20px */
  overflow: hidden;
}

.bot-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bot-name {
  margin: 0;
  font-size: 15px; /* Reducido de 16px */
  font-weight: 600;
  line-height: 1.2;
}

.bot-subtitle {
  font-size: 10px;
  opacity: 0.7;
  font-weight: 400;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
}

.bot-status {
  font-size: 11px; /* Reducido de 12px */
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.bot-status.typing {
  opacity: 1;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 6px; /* Reducido de 8px */
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #212529;
  padding: 4px 6px; /* Reducido */
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #212529;
}

/* Barra de progreso compacta */
.progress-bar-compact {
  position: relative;
  height: 3px; /* Reducido de 4px */
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-top: 8px; /* Reducido de 12px */
  overflow: hidden;
}

.progress-bar-compact .progress-fill {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-bar-compact .progress-text {
  position: absolute;
  top: -16px; /* Ajustado */
  right: 0;
  font-size: 9px; /* Reducido de 10px */
  font-weight: 500;
}

/* Área de navegación compacta (fuera del header) */
.chatbot-navigation-area {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 12px; /* Compacto */
  flex-shrink: 0; /* No permitir compresión */
  max-height: 80px; /* Limitar altura máxima */
  overflow-y: auto; /* Scroll si es necesario */
}

/* Cuerpo del chat */
.chatbot-body {
  display: flex;
  flex-direction: column;
  flex: 1; /* Cambio: usar flex para ocupar espacio disponible */
  min-height: 0; /* Importante para permitir que el scroll funcione */
  overflow: hidden; /* Evitar desbordamiento del contenedor */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; /* Nuevo: evitar scroll horizontal */
  padding: 16px;
  background: #f8f9fa;
  min-height: 200px; /* Nuevo: altura mínima para el área de mensajes */
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Indicador de escritura */
.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  background: #ffc107;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  overflow: hidden;
}

.typing-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.typing-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Área de input */
.input-area {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 16px;
  flex-shrink: 0; /* NUEVO: Evitar compresión */
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #ffc107;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
}

.chat-input:disabled {
  background: #e9ecef;
  opacity: 0.6;
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border: none;
  color: #212529;
  font-size: 16px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  transform: none;
}

.input-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.input-actions .btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* Botón flotante */
.chatbot-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1040;
}

.btn-floating {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border: none;
  color: #212529;
  font-size: 24px;
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
}

.bot-floating-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.btn-floating:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.6);
  color: #212529;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* Viñeta de ayuda estilo cómic */
.help-bubble {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: white;
  border: 3px solid #333;
  border-radius: 12px;
  padding: 12px 32px 12px 16px; /* Espacio extra a la derecha para el botón X */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: bubbleAppear 0.3s ease-out,
    bubbleBounce 2s ease-in-out 0.3s infinite;
  max-width: 200px;
  z-index: 9999;
}

.bubble-close {
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  padding: 0;
}

.bubble-close:hover {
  background: #f0f0f0;
  color: #333;
}

.bubble-content {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  text-align: center;
  padding-right: 8px;
}

.bubble-tail {
  position: absolute;
  bottom: -12px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid white;
}

.bubble-tail::before {
  content: "";
  position: absolute;
  bottom: 3px;
  left: -15px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid #333;
}

@keyframes bubbleAppear {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bubbleBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Auto-ocultar la viñeta después de 10 segundos */
.help-bubble {
  animation: bubbleAppear 0.3s ease-out, bubbleBounce 2s ease-in-out 0.3s 3,
    bubbleFadeOut 1s ease-out 9s forwards;
}

@keyframes bubbleFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}

/* Scrollbar personalizada */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Responsive */
@media (max-width: 768px) {
  .chatbot-container {
    width: calc(100vw - 20px);
    max-height: calc(100vh - 40px); /* Altura máxima respetando viewport */
    height: auto;
    bottom: 10px;
    right: 10px;
    border-radius: 12px;
  }

  .chatbot-header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .chatbot-body {
    flex: 1;
    min-height: 0;
    max-height: calc(100vh - 200px); /* Asegurar que no se pase */
  }

  .messages-container {
    flex: 1;
    min-height: 200px;
    max-height: calc(100vh - 280px);
  }

  .btn-floating {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .help-bubble {
    bottom: 65px;
    right: -10px;
    max-width: 160px;
    padding: 10px 12px;
  }

  .bubble-content {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .chatbot-container {
    width: 100vw;
    height: 100vh;
    max-height: 100vh; /* Ocupar toda la pantalla pero con límite */
    bottom: 0;
    right: 0;
    border-radius: 0;
    display: flex;
    flex-direction: column;
  }

  .chatbot-header {
    border-radius: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    flex-shrink: 0;
  }

  .chatbot-navigation-area {
    flex-shrink: 0;
  }

  .chatbot-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .messages-container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .input-area {
    flex-shrink: 0;
  }

  .help-bubble {
    bottom: 60px;
    right: -5px;
    max-width: 140px;
    padding: 8px 10px;
  }

  .bubble-content {
    font-size: 11px;
  }

  .bubble-tail {
    right: 15px;
  }
}

/* ========== ESTILOS PARA MODAL DE CONFIRMACIÓN ========== */
.confirmation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* El ReportConfirmation dentro del overlay ocupará el espacio adecuado */
.confirmation-overlay > * {
  max-width: 95%;
  max-height: 95%;
  overflow-y: auto;
}
</style>
