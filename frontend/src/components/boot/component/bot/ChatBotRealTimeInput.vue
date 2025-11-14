<!--
  Componente de entrada con validación en tiempo real para el chatbot
  
  Este componente proporciona:
  - Validación inmediata mientras el usuario escribe
  - Sugerencias de autocompletado
  - Feedback visual de validación
  - Formateo automático de valores
-->

<template>
  <div class="realtime-input-container">
    <!-- Campo de entrada principal -->
    <div
      class="input-group"
      :class="{
        'has-error': validation && !validation.isValid,
        'has-success': validation && validation.isValid && hasUserInput,
        'is-loading': isValidating,
      }"
    >
      <input
        ref="inputField"
        v-model="inputValue"
        :type="getInputType()"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="getMaxLength()"
        class="form-input"
        @input="onInput"
        @keydown.enter="onSubmit"
        @keydown.arrow-down="selectNextSuggestion"
        @keydown.arrow-up="selectPrevSuggestion"
        @keydown.escape="clearSuggestions"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Indicador de estado -->
      <div class="input-status">
        <div v-if="isValidating" class="loading-spinner"></div>
        <i
          v-else-if="validation && validation.isValid && hasUserInput"
          class="fas fa-check success-icon"
        ></i>
        <i
          v-else-if="validation && !validation.isValid && hasUserInput"
          class="fas fa-exclamation-triangle error-icon"
        ></i>
      </div>

      <!-- Botón de envío -->
      <button
        type="button"
        :disabled="!canSubmit"
        class="submit-btn"
        @click="onSubmit"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>

    <!-- Sugerencias de autocompletado -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="suggestions-dropdown"
    >
      <div class="suggestions-header">
        <i class="fas fa-lightbulb"></i>
        <span>Sugerencias</span>
      </div>
      <div class="suggestions-list">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-item"
          :class="{ selected: selectedSuggestionIndex === index }"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedSuggestionIndex = index"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>

    <!-- Mensaje de validación -->
    <div
      v-if="validation && hasUserInput"
      class="validation-message"
      :class="validation.isValid ? 'success' : 'error'"
    >
      <i
        :class="
          validation.isValid
            ? 'fas fa-check-circle'
            : 'fas fa-exclamation-circle'
        "
      ></i>
      <span>{{ validation.message }}</span>
    </div>

    <!-- Sugerencias de error específicas -->
    <div
      v-if="validation && !validation.isValid && validation.suggestions"
      class="error-suggestions"
    >
      <div class="error-suggestions-header">💡 Intenta con:</div>
      <ul class="error-suggestions-list">
        <li
          v-for="(suggestion, index) in validation.suggestions.slice(0, 3)"
          :key="index"
          class="error-suggestion-item"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useChatBotStore } from "@/store/chatBotStore.js";

// Función debounce simple
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  name: "ChatBotRealTimeInput",
  props: {
    field: {
      type: String,
      required: true,
    },
    fieldType: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: "Escribe tu respuesta...",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    supportSuggestions: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["submit", "validation-change", "suggestion-selected"],
  data() {
    return {
      inputValue: "",
      validation: null,
      suggestions: [],
      isValidating: false,
      showSuggestions: false,
      selectedSuggestionIndex: -1,
      hasUserInput: false,
      isFocused: false,
    };
  },
  computed: {
    chatBotStore() {
      return useChatBotStore();
    },
    canSubmit() {
      return (
        !this.disabled &&
        this.inputValue.trim() !== "" &&
        !this.isValidating &&
        (!this.validation || this.validation.isValid)
      );
    },
  },
  watch: {
    field: {
      immediate: true,
      handler() {
        this.resetInput();
        // Auto-focus cuando cambia el campo esperado
        this.$nextTick(() => {
          this.focusInput();
        });
      },
    },
  },
  mounted() {
    // Auto-focus al montar el componente
    this.$nextTick(() => {
      this.focusInput();
    });
  },
  methods: {
    /**
     * Obtener tipo de input según el campo
     */
    getInputType() {
      switch (this.field) {
        case "email":
          return "email";
        case "telefono":
          return "tel";
        default:
          return "text";
      }
    },

    /**
     * Obtener longitud máxima según el campo
     */
    getMaxLength() {
      switch (this.field) {
        case "nombre":
        case "apellido":
          return 50;
        case "telefono":
          return 20;
        case "email":
          return 100;
        case "rut":
          return 12;
        case "identificacion":
          return 20;
        default:
          return 100;
      }
    },

    /**
     * Manejar entrada del usuario
     */
    onInput() {
      this.hasUserInput = this.inputValue.trim() !== "";

      if (this.hasUserInput) {
        this.validateInputDebounced();
        if (this.supportSuggestions) {
          this.getSuggestionsDebounced();
        }
      } else {
        this.resetValidation();
        this.clearSuggestions();
      }
    },

    /**
     * Validar entrada con debounce
     */
    validateInputDebounced: debounce(async function () {
      if (!this.inputValue.trim()) return;

      this.isValidating = true;
      try {
        this.validation = await this.chatBotStore.validateFieldRealTime(
          this.field,
          this.inputValue,
          this.fieldType
        );
        this.$emit("validation-change", this.validation);
      } catch (error) {
        console.error("Error validating input:", error);
        this.validation = {
          isValid: false,
          message: "Error al validar",
          suggestions: ["Intenta nuevamente"],
        };
      } finally {
        this.isValidating = false;
      }
    }, 300),

    /**
     * Obtener sugerencias con debounce
     */
    getSuggestionsDebounced: debounce(async function () {
      if (!this.inputValue.trim() || this.inputValue.length < 2) {
        this.suggestions = [];
        this.showSuggestions = false;
        return;
      }

      try {
        this.suggestions = await this.chatBotStore.getSuggestionsRealTime(
          this.field,
          this.inputValue
        );
        this.showSuggestions = this.suggestions.length > 0 && this.isFocused;
        this.selectedSuggestionIndex = -1;
      } catch (error) {
        console.error("Error getting suggestions:", error);
        this.suggestions = [];
        this.showSuggestions = false;
      }
    }, 500),

    /**
     * Enviar valor validado
     */
    onSubmit() {
      if (!this.canSubmit) return;

      // Preparar datos completos para enviar
      const submitData = {
        value: this.inputValue.trim(),
        formatted: this.validation?.formatted || this.inputValue.trim(),
        isValid: this.validation?.isValid || false,
      };

      console.log(
        "📤 ChatBotRealTimeInput: Enviando dato validado:",
        submitData
      );

      // Emitir el evento con los datos completos
      this.$emit("submit", submitData);

      // Limpiar DESPUÉS de un pequeño delay para asegurar que se procesa
      this.$nextTick(() => {
        this.resetInput();
      });
    },

    /**
     * Manejar focus
     */
    onFocus() {
      this.isFocused = true;
      if (this.suggestions.length > 0) {
        this.showSuggestions = true;
      }
    },

    /**
     * Manejar blur
     */
    onBlur() {
      this.isFocused = false;
      // Delay para permitir clicks en sugerencias
      setTimeout(() => {
        if (!this.isFocused) {
          this.showSuggestions = false;
        }
      }, 200);
    },

    /**
     * Seleccionar sugerencia
     */
    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.showSuggestions = false;
      this.selectedSuggestionIndex = -1;
      this.$emit("suggestion-selected", suggestion);
      this.validateInputDebounced();
      this.$nextTick(() => {
        this.focusInput();
      });
    },

    /**
     * Aplicar sugerencia de error
     */
    applySuggestion(suggestion) {
      // Si la sugerencia parece ser un ejemplo, extraer el valor
      if (suggestion.includes(":")) {
        const parts = suggestion.split(":");
        if (parts.length > 1) {
          this.inputValue = parts[1].trim();
        }
      } else {
        this.inputValue = suggestion;
      }
      this.validateInputDebounced();
      this.focusInput();
    },

    /**
     * Navegación con teclado en sugerencias
     */
    selectNextSuggestion() {
      if (!this.showSuggestions || this.suggestions.length === 0) return;

      this.selectedSuggestionIndex = Math.min(
        this.selectedSuggestionIndex + 1,
        this.suggestions.length - 1
      );
    },

    selectPrevSuggestion() {
      if (!this.showSuggestions || this.suggestions.length === 0) return;

      this.selectedSuggestionIndex = Math.max(
        this.selectedSuggestionIndex - 1,
        -1
      );
    },

    /**
     * Limpiar sugerencias
     */
    clearSuggestions() {
      this.showSuggestions = false;
      this.selectedSuggestionIndex = -1;
    },

    /**
     * Resetear input
     */
    resetInput() {
      this.inputValue = "";
      this.hasUserInput = false;
      this.resetValidation();
      this.clearSuggestions();
    },

    /**
     * Resetear validación
     */
    resetValidation() {
      this.validation = null;
      this.isValidating = false;
    },

    /**
     * Enfocar input
     */
    focusInput() {
      this.$nextTick(() => {
        const input = this.$refs.inputField;
        if (input) {
          input.focus();

          // En dispositivos móviles, asegurarse de que el teclado se abra
          // haciendo un pequeño scroll al elemento
          if (this.isMobileDevice()) {
            // Usar un timeout para asegurar que el navegador procese el focus
            setTimeout(() => {
              input.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }
        }
      });
    },

    /**
     * Detectar si es dispositivo móvil
     */
    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
};
</script>

<style scoped>
.realtime-input-container {
  position: relative;
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.input-group.has-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-group.has-success {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-group.is-loading {
  border-color: #3b82f6;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 8px;
  background: transparent;
}

.form-input::placeholder {
  color: #9ca3af;
}

.input-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-right: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-icon {
  color: #10b981;
  font-size: 14px;
}

.error-icon {
  color: #ef4444;
  font-size: 14px;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  margin-top: 4px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.suggestions-list {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 14px;
}

.suggestion-item:hover,
.suggestion-item.selected {
  background: #f3f4f6;
}

.validation-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  padding: 4px 0;
}

.validation-message.success {
  color: #10b981;
}

.validation-message.error {
  color: #ef4444;
}

.error-suggestions {
  margin-top: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 8px;
}

.error-suggestions-header {
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
  margin-bottom: 4px;
}

.error-suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-suggestion-item {
  padding: 4px 8px;
  font-size: 12px;
  color: #7f1d1d;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.error-suggestion-item:hover {
  background: #fee2e2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .form-input {
    padding: 10px 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .suggestions-dropdown {
    max-height: 150px;
  }
}
</style>
