<template>
  <div class="chat-message" :class="messageClass">
    <!-- Mensaje del bot -->
    <div v-if="message.sender === 'bot'" class="bot-message">
      <div class="message-avatar">
        <div class="bot-avatar">
          <img
            src="@/assets/amin-transparente.webp"
            alt="Ayda"
            class="bot-avatar-img"
          />
        </div>
      </div>

      <div class="message-content">
        <div class="message-bubble bot-bubble">
          <!-- Texto del mensaje -->
          <div class="message-text" v-html="formattedText"></div>

          <!-- Indicador de carga (si es tipo 'loading') -->
          <div v-if="message.type === 'loading'" class="loading-indicator">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="loading-text">Buscando en la base de datos...</span>
          </div>

          <!-- Opciones como botones (si es tipo 'options' o 'menu') -->
          <div
            v-if="
              message.options &&
              (message.type === 'options' || message.type === 'menu')
            "
            class="message-options"
          >
            <!-- Botón para seleccionar todos (solo si hay múltiples resultados) -->
            <div v-if="hasMultipleResults" class="selection-controls">
              <button
                @click="toggleSelectAll"
                class="btn btn-sm btn-outline-primary select-all-btn"
              >
                <i
                  :class="allSelected ? 'fas fa-check-square' : 'fas fa-square'"
                ></i>
                {{ allSelected ? "Deseleccionar todos" : "Seleccionar todos" }}
              </button>

              <button
                v-if="selectedReports.length > 0"
                @click="viewSelectedReports"
                class="btn btn-sm btn-success view-selected-btn"
              >
                <i class="fas fa-eye"></i>
                Ver seleccionados ({{ selectedReports.length }})
              </button>
            </div>

            <button
              v-for="option in message.options"
              :key="option.id"
              @click="selectOption(option)"
              class="option-button"
              :class="getOptionClass(option)"
            >
              <!-- Checkbox para opciones de visualización de reportes múltiples -->
              <input
                v-if="isViewReportOption(option)"
                type="checkbox"
                :checked="isReportSelected(option.value)"
                @click.stop="toggleReportSelection(option.value)"
                class="report-checkbox"
              />
              {{ option.text }}
            </button>
          </div>

          <!-- Resultados de búsqueda (si es tipo 'results') -->
          <div
            v-if="message.type === 'results' && message.results"
            class="search-results"
          >
            <div v-if="message.results.length === 0" class="no-results">
              <i class="fas fa-search"></i>
              <span>No se encontraron resultados</span>
            </div>

            <div v-else class="results-list">
              <div
                v-for="result in message.results.slice(0, 5)"
                :key="result.id"
                class="result-item"
                @click="viewResult(result)"
              >
                <div class="result-header">
                  <strong>{{ result.nombre }} {{ result.apellido }}</strong>
                  <span class="result-type">{{ getResultType(result) }}</span>
                </div>
                <div class="result-details">
                  <span v-if="result.identificacion">{{
                    result.identificacion
                  }}</span>
                  <span v-if="result.telefono">{{
                    formatPhone(result.telefono)
                  }}</span>
                </div>
              </div>

              <div v-if="message.results.length > 5" class="more-results">
                <small
                  >{{ message.results.length - 5 }} resultados más...</small
                >
              </div>
            </div>
          </div>

          <!-- Formulario en progreso (si es tipo 'form_summary') -->
          <div
            v-if="message.type === 'form_summary' && message.formData"
            class="form-summary"
          >
            <ReportSummary
              :reportData="message.formData"
              :reportType="getReportType(message.formData)"
              @save="handleSummaryAction('save')"
              @edit="handleSummaryAction('edit')"
            />
          </div>

          <!-- Opciones de confirmación para form_summary -->
          <div
            v-if="message.type === 'form_summary' && message.options"
            class="message-options"
          >
            <button
              v-for="option in message.options"
              :key="option.id"
              @click="selectOption(option)"
              class="option-button"
              :class="getOptionClass(option)"
            >
              {{ option.text }}
            </button>
          </div>
        </div>

        <div class="message-meta">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- Mensaje del usuario -->
    <div v-else class="user-message">
      <div class="message-content">
        <div class="message-bubble user-bubble">
          <div class="message-text">{{ message.text }}</div>
        </div>

        <div class="message-meta">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>

      <div class="message-avatar">
        <div class="user-avatar">
          <font-awesome-icon icon="user" class="text-base text-white" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ReportSummary from "./ReportSummary.vue";

// Props
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits([
  "option-selected",
  "result-selected",
  "quick-reply",
  "view-selected-reports",
]);

// State para selección múltiple
const selectedReports = ref([]);

// Computed para selección múltiple
const hasMultipleResults = computed(() => {
  return props.message.searchResults && props.message.searchResults.length > 1;
});

const viewReportOptions = computed(() => {
  if (!props.message.options) return [];
  return props.message.options.filter(
    (option) => option.value && option.value.startsWith("view_")
  );
});

const allSelected = computed(() => {
  return (
    viewReportOptions.value.length > 0 &&
    selectedReports.value.length === viewReportOptions.value.length
  );
});

// Computed
const messageClass = computed(() => ({
  "bot-message-container": props.message.sender === "bot",
  "user-message-container": props.message.sender === "user",
  "has-options": props.message.options && props.message.options.length > 0,
}));

const formattedText = computed(() => {
  if (!props.message.text) return "";

  // Convertir markdown básico a HTML
  let text = props.message.text;

  // Negrita **texto**
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Cursiva *texto*
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Saltos de línea
  text = text.replace(/\n/g, "<br>");

  return text;
});

// Methods
const selectOption = (option) => {
  emit("option-selected", option);
};

const viewResult = (result) => {
  emit("result-selected", result);
};

const getOptionClass = (option) => {
  return {
    primary: option.value === "1" || option.primary,
    secondary: !option.primary && option.value !== "1",
    back: option.value === "back_to_menu" || option.value?.includes("back"),
    danger: option.value === "cancel" || option.value === "delete",
  };
};

const getResultType = (result) => {
  // Determinar si es reporte express o completo basado en campos específicos
  if (
    result.reportType === "express" ||
    result.evaluationCount ||
    result.pagaYavisa ||
    result.fromCollection === "expressReports"
  ) {
    return "Express";
  }
  return "Completo";
};

const formatPhone = (telefono) => {
  if (!telefono) return "N/A";

  if (Array.isArray(telefono) && telefono.length > 0) {
    const phone = telefono[0];
    if (typeof phone === "object" && phone.countryCode && phone.number) {
      return `${phone.countryCode}${phone.number}`;
    }
    return telefono[0];
  }

  if (typeof telefono === "string") {
    return telefono;
  }

  return "N/A";
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Funciones para selección múltiple
const isViewReportOption = (option) => {
  return option.value && option.value.startsWith("view_");
};

const isReportSelected = (optionValue) => {
  return selectedReports.value.includes(optionValue);
};

const toggleReportSelection = (optionValue) => {
  const index = selectedReports.value.indexOf(optionValue);
  if (index > -1) {
    selectedReports.value.splice(index, 1);
  } else {
    selectedReports.value.push(optionValue);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Deseleccionar todos
    selectedReports.value = [];
  } else {
    // Seleccionar todos
    selectedReports.value = viewReportOptions.value.map(
      (option) => option.value
    );
  }
};

const viewSelectedReports = () => {
  if (selectedReports.value.length === 0) return;

  const selectedReportData = [];
  const searchResults = props.message.searchResults || [];

  selectedReports.value.forEach((optionValue) => {
    const parts = optionValue.split("_");
    if (parts.length >= 3) {
      const reportId = parts[1];
      const report = searchResults.find((r) => r.id === reportId);
      if (report) {
        selectedReportData.push(report);
      }
    }
  });

  emit("view-selected-reports", selectedReportData);
};

const formatFieldLabel = (key) => {
  const labels = {
    nombre: "Nombre",
    apellido: "Apellido",
    nickNames: "Apodos",
    nacionalidad: "Nacionalidad",
    idType: "Tipo ID",
    identificacion: "Identificación",
    genero: "Género",
    telefono: "Teléfono",
    email: "Email",
    pagaYavisa: "Paga y avisa",
    ordenLimpieza: "Orden y limpieza",
    respeto: "Respeto",
    conducta: "Conducta",
    profesionalismo: "Profesionalismo",
    recomendado: "Recomendado",
  };

  return labels[key] || key;
};

const formatFieldValue = (key, value) => {
  if (!value) return "No especificado";

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (key === "telefono" && typeof value === "object") {
    return `${value.countryCode}${value.number}`;
  }

  if (key === "idType") {
    const types = { rut: "RUT", cedula: "Cédula", pasaporte: "Pasaporte" };
    return types[value] || value;
  }

  if (key === "genero") {
    const generos = {
      masculino: "Masculino",
      femenino: "Femenino",
      otro: "Otro",
      sin_datos: "No especificado",
    };
    return generos[value] || value;
  }

  return value;
};

// Determinar tipo de reporte
const getReportType = (formData) => {
  if (
    formData.evaluationCount !== undefined ||
    formData.pagaYavisa !== undefined ||
    formData.limpieza !== undefined
  ) {
    return "express";
  }
  return "standard";
};

// Manejar acciones del resumen
const handleSummaryAction = (action) => {
  emit("option-selected", { value: action });
};
</script>

<style scoped>
.chat-message {
  margin-bottom: 16px;
}

/* Contenedores de mensajes */
.bot-message,
.user-message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
}

.bot-message {
  align-self: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

/* Avatares */
.message-avatar {
  flex-shrink: 0;
}

.bot-avatar,
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
}

.bot-avatar {
  border: 2px solid #ffd700;
  color: #212529;
}

.bot-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar {
  background: #daa520;
  color: white;
  font-size: 14px;
}

/* Contenido del mensaje */
.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-message .message-content {
  align-items: flex-end;
}

/* Burbujas de mensaje */
.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  line-height: 1.4;
}

.bot-bubble {
  background: #1a1a1a;
  border: 2px solid #ffd700;
  color: #fff;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-bubble {
  background: #daa520;
  color: white;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 8px rgba(218, 165, 32, 0.3);
}

/* Texto del mensaje */
.message-text {
  font-size: 14px;
}

.message-text :deep(strong) {
  font-weight: 600;
}

.message-text :deep(em) {
  font-style: italic;
}

/* Indicador de carga */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #ffc107;
  border-radius: 50%;
  animation: loadingPulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes loadingPulse {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.loading-text {
  font-size: 13px;
  color: #6c757d;
  font-style: italic;
}

/* Opciones como botones */
.message-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

/* Scrollbar personalizado */
.message-options::-webkit-scrollbar {
  width: 6px;
}

.message-options::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.message-options::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.message-options::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.selection-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.select-all-btn,
.view-selected-btn {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
}

.option-button {
  padding: 10px 16px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background: #f8f9fa;
  color: #495057;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.option-button.primary {
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border-color: #ffc107;
  color: #212529;
  font-weight: 600;
}

.option-button.primary:hover {
  background: linear-gradient(135deg, #ffca2c, #ffa726);
}

.option-button.back {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
}

.option-button.back:hover {
  background: #5a6268;
}

.option-button.danger {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.option-button.danger:hover {
  background: #c82333;
}

.report-checkbox {
  margin-right: 8px;
}

/* Resultados de búsqueda */
.search-results {
  margin-top: 12px;
}

.no-results {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
  font-style: italic;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.result-type {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.result-details {
  font-size: 12px;
  color: #6c757d;
  display: flex;
  gap: 12px;
}

.more-results {
  text-align: center;
  padding: 8px;
  color: #6c757d;
  font-style: italic;
}

/* Resumen de formulario */
.form-summary {
  margin-top: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.summary-header {
  background: #e9ecef;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #495057;
}

.summary-content {
  padding: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
}

.field-label {
  font-weight: 500;
  color: #6c757d;
  font-size: 13px;
}

.field-value {
  font-weight: 500;
  color: #212529;
  font-size: 13px;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

/* Meta información */
.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-time {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
}

.user-message .message-time {
  color: #495057;
}

/* Animaciones */
.chat-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .bot-message,
  .user-message {
    max-width: 95%;
  }

  .message-bubble {
    padding: 10px 14px;
    font-size: 13px;
  }

  .option-button {
    padding: 8px 14px;
    font-size: 12px;
  }

  .bot-avatar,
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>
