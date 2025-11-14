<!--
  Componente de Indicador de Progreso para Formularios del ChatBot
  
  Muestra el progreso visual del formulario en curso con steps
-->

<template>
  <div v-if="showProgress" class="progress-indicator">
    <!-- Barra de progreso principal -->
    <div class="progress-bar-container">
      <div class="progress-header">
        <span class="progress-label">
          <i :class="flowIcon" class="flow-icon"></i>
          {{ flowLabel }}
        </span>
        <span class="progress-percentage">{{ percentage }}%</span>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: percentage + '%' }"
          :class="progressClass"
        >
          <div class="progress-shine"></div>
        </div>
      </div>

      <div class="progress-footer">
        <span class="progress-steps-info">
          <i class="fas fa-check-circle"></i>
          {{ completedSteps }} de {{ totalSteps }} pasos completados
        </span>
        <span v-if="remainingSteps > 0" class="progress-remaining">
          {{ remainingSteps }} restantes
        </span>
      </div>
    </div>

    <!-- Steps visuales (modo detallado) -->
    <div v-if="showDetailedSteps" class="steps-container">
      <div class="steps-list">
        <div
          v-for="(step, index) in steps"
          :key="step.step"
          class="step-item"
          :class="{
            'is-completed': step.completed,
            'is-current': step.step === currentStep,
            'is-pending': step.step > currentStep,
          }"
          :title="`${step.label} - ${
            step.completed ? 'Completado' : 'Pendiente'
          }`"
        >
          <div class="step-circle">
            <i v-if="step.completed" class="fas fa-check"></i>
            <i v-else-if="step.step === currentStep" class="fas fa-edit"></i>
            <span v-else class="step-number">{{ step.step }}</span>
          </div>
          <div class="step-label">
            <span class="step-icon">{{ step.icon }}</span>
            <span class="step-text">{{ step.label }}</span>
          </div>
          <div v-if="index < steps.length - 1" class="step-connector"></div>
        </div>
      </div>
    </div>

    <!-- Vista compacta de campos -->
    <div v-if="showCompactView" class="compact-view">
      <div class="completed-fields">
        <span class="fields-label">✅ Completados:</span>
        <div class="fields-list">
          <span
            v-for="field in completedFields"
            :key="field"
            class="field-badge completed"
          >
            {{ formatFieldName(field) }}
          </span>
        </div>
      </div>
      <div v-if="pendingFields.length > 0" class="pending-fields">
        <span class="fields-label">⏳ Pendientes:</span>
        <div class="fields-list">
          <span
            v-for="field in pendingFields.slice(0, 3)"
            :key="field"
            class="field-badge pending"
          >
            {{ formatFieldName(field) }}
          </span>
          <span v-if="pendingFields.length > 3" class="field-badge more">
            +{{ pendingFields.length - 3 }} más
          </span>
        </div>
      </div>
    </div>

    <!-- Botón para toggle detalles -->
    <div v-if="canToggleDetails" class="progress-actions">
      <button
        @click="toggleDetails"
        class="btn-toggle-details"
        :title="showDetailedSteps ? 'Ver menos' : 'Ver detalles'"
      >
        <i
          :class="
            showDetailedSteps ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
          "
        ></i>
        <span>{{
          showDetailedSteps ? "Ocultar detalles" : "Ver detalles"
        }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChatBotStore } from "@/store/chatBotStore.js";

// Props
const props = defineProps({
  mode: {
    type: String,
    default: "auto", // 'auto', 'compact', 'detailed', 'minimal'
    validator: (value) =>
      ["auto", "compact", "detailed", "minimal"].includes(value),
  },
  autoHide: {
    type: Boolean,
    default: false,
  },
});

// Store
const chatBotStore = useChatBotStore();

// State
const showDetailedSteps = ref(false);

// Computed
const progressInfo = computed(() => chatBotStore.progressInfo);

const showProgress = computed(() => {
  if (props.autoHide && progressInfo.value.percentage === 0) {
    return false;
  }
  return (
    progressInfo.value.flowType === "create_report" ||
    progressInfo.value.flowType === "create_express"
  );
});

const percentage = computed(() => progressInfo.value.percentage);
const currentStep = computed(() => progressInfo.value.currentStep);
const totalSteps = computed(() => progressInfo.value.totalSteps);
const completedSteps = computed(() => progressInfo.value.completedSteps);
const remainingSteps = computed(() => progressInfo.value.remainingSteps);
const completedFields = computed(() => progressInfo.value.completedFields);
const pendingFields = computed(() => progressInfo.value.pendingFields);

const steps = computed(() => chatBotStore.formSteps);

const flowLabel = computed(() => {
  if (progressInfo.value.flowType === "create_report") {
    return "Reporte Completo";
  } else if (progressInfo.value.flowType === "create_express") {
    return "Reporte Express";
  }
  return "Formulario";
});

const flowIcon = computed(() => {
  if (progressInfo.value.flowType === "create_report") {
    return "fas fa-file-alt";
  } else if (progressInfo.value.flowType === "create_express") {
    return "fas fa-bolt";
  }
  return "fas fa-clipboard";
});

const progressClass = computed(() => {
  if (percentage.value >= 75) return "high-progress";
  if (percentage.value >= 50) return "medium-progress";
  if (percentage.value >= 25) return "low-progress";
  return "start-progress";
});

const showDetailedStepsComputed = computed(() => {
  if (props.mode === "detailed") return true;
  if (props.mode === "compact" || props.mode === "minimal") return false;
  return showDetailedSteps.value;
});

const showCompactView = computed(() => {
  return (
    props.mode === "compact" ||
    (props.mode === "auto" && !showDetailedSteps.value)
  );
});

const canToggleDetails = computed(() => {
  return props.mode === "auto" && steps.value.length > 0;
});

// Methods
const toggleDetails = () => {
  showDetailedSteps.value = !showDetailedSteps.value;
};

const formatFieldName = (field) => {
  const names = {
    nombre: "Nombre",
    apellido: "Apellido",
    identificacion: "ID",
    telefono: "Teléfono",
    email: "Email",
    genero: "Género",
    fechaNacimiento: "F. Nacimiento",
    nacionalidad: "Nacionalidad",
    tipoHospedaje: "Hospedaje",
    agencia: "Agencia",
    fechaIngreso: "Check-in",
  };
  return names[field] || field;
};
</script>

<style scoped>
.progress-indicator {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px;
}

/* Barra de progreso principal */
.progress-bar-container {
  margin-bottom: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.flow-icon {
  color: #3b82f6;
  font-size: 14px;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill.low-progress {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.progress-fill.medium-progress {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.progress-fill.high-progress {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
    left: 100%;
  }
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
}

.progress-steps-info {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.progress-steps-info i {
  color: #10b981;
  font-size: 12px;
}

.progress-remaining {
  color: #94a3b8;
}

/* Steps visuales detallados */
.steps-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.steps-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.step-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-item.is-completed .step-circle {
  background: #10b981;
  color: white;
}

.step-item.is-current .step-circle {
  background: #3b82f6;
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  animation: pulse 2s infinite;
}

.step-item.is-pending .step-circle {
  background: #e2e8f0;
  color: #94a3b8;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
  }
}

.step-label {
  text-align: center;
  font-size: 11px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.step-item.is-completed .step-label {
  color: #10b981;
}

.step-item.is-current .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step-icon {
  font-size: 16px;
}

.step-text {
  font-size: 10px;
}

/* Vista compacta */
.compact-view {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.completed-fields,
.pending-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.fields-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-right: 6px;
}

.fields-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.field-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.field-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.field-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.field-badge.more {
  background: #e2e8f0;
  color: #64748b;
}

/* Acciones */
.progress-actions {
  margin-top: 12px;
  text-align: center;
}

.btn-toggle-details {
  background: transparent;
  border: 1px dashed #cbd5e0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11px;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-toggle-details:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #475569;
}

/* Responsive */
@media (max-width: 640px) {
  .progress-indicator {
    padding: 12px;
  }

  .steps-list {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 8px;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .step-icon {
    font-size: 14px;
  }

  .step-text {
    font-size: 9px;
  }
}
</style>
