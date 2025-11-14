<!--
  Componente de Confirmación de Reporte
  
  Muestra un resumen completo de los datos ingresados antes de guardar
  Permite editar campos inline antes de confirmar
-->

<template>
  <div v-if="showConfirmation" class="report-confirmation">
    <div class="confirmation-header">
      <div class="header-icon">
        <i :class="reportTypeIcon"></i>
      </div>
      <div class="header-content">
        <h3 class="confirmation-title">{{ confirmationTitle }}</h3>
        <p class="confirmation-subtitle">
          Revisa los datos antes de guardar. Puedes editar cualquier campo
          haciendo clic en él.
        </p>
      </div>
    </div>

    <!-- Resumen de datos -->
    <div class="confirmation-body">
      <!-- Sección: Datos Personales -->
      <div class="data-section">
        <div class="section-header">
          <i class="fas fa-user"></i>
          <h4 class="section-title">Datos Personales</h4>
          <span class="section-badge">{{ personalFieldsCount }} campos</span>
        </div>

        <div class="fields-grid">
          <EditableField
            label="Nombre"
            :value="reportData.nombre"
            field="nombre"
            icon="fas fa-user"
            :required="true"
            @edit="handleEditField"
          />

          <EditableField
            label="Apellido"
            :value="reportData.apellido"
            field="apellido"
            icon="fas fa-user"
            :required="true"
            @edit="handleEditField"
          />

          <EditableField
            label="Identificación"
            :value="
              formatIdentification(reportData.identificacion, reportData.idType)
            "
            field="identificacion"
            icon="fas fa-id-card"
            :required="true"
            :badge="idTypeBadge"
            @edit="handleEditField"
          />

          <EditableField
            label="Teléfono"
            :value="reportData.telefono"
            field="telefono"
            icon="fas fa-phone"
            :required="true"
            @edit="handleEditField"
          />

          <EditableField
            label="Email"
            :value="reportData.email || 'notiene@email.com'"
            field="email"
            icon="fas fa-envelope"
            :required="false"
            @edit="handleEditField"
          />
        </div>
      </div>

      <!-- Sección: Datos Demográficos (solo reporte completo) -->
      <div v-if="isCompleteReport" class="data-section">
        <div class="section-header">
          <i class="fas fa-globe"></i>
          <h4 class="section-title">Datos Demográficos</h4>
          <span class="section-badge">{{ demographicFieldsCount }} campos</span>
        </div>

        <div class="fields-grid">
          <EditableField
            label="Género"
            :value="formatGender(reportData.genero)"
            field="genero"
            icon="fas fa-venus-mars"
            @edit="handleEditField"
          />

          <EditableField
            label="Fecha de Nacimiento"
            :value="formatDate(reportData.fechaNacimiento)"
            field="fechaNacimiento"
            icon="fas fa-birthday-cake"
            @edit="handleEditField"
          />

          <EditableField
            label="Nacionalidad"
            :value="reportData.nacionalidad"
            field="nacionalidad"
            icon="fas fa-flag"
            @edit="handleEditField"
          />
        </div>
      </div>

      <!-- Sección: Datos de Hospedaje - OCULTA: Campos no existen en reportModel.js -->
      <div v-if="false" class="data-section">
        <div class="section-header">
          <i class="fas fa-hotel"></i>
          <h4 class="section-title">Datos de Hospedaje</h4>
          <span class="section-badge"
            >{{ accommodationFieldsCount }} campos</span
          >
        </div>

        <div class="fields-grid">
          <EditableField
            label="Tipo de Hospedaje"
            :value="formatTipoHospedaje(reportData.tipoHospedaje)"
            field="tipoHospedaje"
            icon="fas fa-building"
            :required="false"
            @edit="handleEditField"
          />

          <EditableField
            v-if="isCompleteReport"
            label="Agencia"
            :value="reportData.agencia || 'Sin agencia'"
            field="agencia"
            icon="fas fa-suitcase"
            @edit="handleEditField"
          />

          <EditableField
            label="Fecha de Ingreso"
            :value="formatDate(reportData.fechaIngreso)"
            field="fechaIngreso"
            icon="fas fa-calendar-check"
            :required="false"
            @edit="handleEditField"
          />
        </div>
      </div>

      <!-- Sección: Evaluaciones de Comportamiento (solo reporte completo) -->
      <div v-if="isCompleteReport && hasEvaluations" class="data-section">
        <div class="section-header">
          <i class="fas fa-star"></i>
          <h4 class="section-title">Evaluaciones de Comportamiento</h4>
          <span class="section-badge">{{ evaluationsCount }} evaluaciones</span>
        </div>

        <div class="evaluations-grid">
          <!-- Pagos y Orden -->
          <div v-if="reportData.paga_puntual" class="evaluation-item">
            <span class="eval-label">Paga puntualmente</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.paga_puntual)"
            >
              {{ formatEvaluation(reportData.paga_puntual) }}
            </span>
          </div>

          <div
            v-if="reportData.habitacionLimpiaYOrdenada"
            class="evaluation-item"
          >
            <span class="eval-label">Habitación limpia y ordenada</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.habitacionLimpiaYOrdenada)"
            >
              {{ formatEvaluation(reportData.habitacionLimpiaYOrdenada) }}
            </span>
          </div>

          <div v-if="reportData.tranquilaYOrdenada" class="evaluation-item">
            <span class="eval-label">Tranquila y ordenada</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.tranquilaYOrdenada)"
            >
              {{ formatEvaluation(reportData.tranquilaYOrdenada) }}
            </span>
          </div>

          <!-- Relaciones Sociales -->
          <div
            v-if="reportData.buenasRelacionesPasajeros"
            class="evaluation-item"
          >
            <span class="eval-label">Buenas relaciones con pasajeros</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.buenasRelacionesPasajeros)"
            >
              {{ formatEvaluation(reportData.buenasRelacionesPasajeros) }}
            </span>
          </div>

          <div v-if="reportData.tratoClientes" class="evaluation-item">
            <span class="eval-label">Trato con clientes</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.tratoClientes)"
            >
              {{ formatEvaluation(reportData.tratoClientes) }}
            </span>
          </div>

          <div
            v-if="reportData.avisaConAnticipacionRetirada"
            class="evaluation-item"
          >
            <span class="eval-label">Avisa con anticipación</span>
            <span
              class="eval-value"
              :class="
                getEvaluationClass(reportData.avisaConAnticipacionRetirada)
              "
            >
              {{ formatEvaluation(reportData.avisaConAnticipacionRetirada) }}
            </span>
          </div>

          <!-- Consumos -->
          <div v-if="reportData.consumeMarihuana" class="evaluation-item">
            <span class="eval-label">Consume marihuana</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.consumeMarihuana)"
            >
              {{ formatEvaluation(reportData.consumeMarihuana) }}
            </span>
          </div>

          <div v-if="reportData.consumeOtrasDrogas" class="evaluation-item">
            <span class="eval-label">Consume otras drogas</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.consumeOtrasDrogas)"
            >
              {{ formatEvaluation(reportData.consumeOtrasDrogas) }}
            </span>
          </div>

          <div v-if="reportData.consumoAlcoholExcesivo" class="evaluation-item">
            <span class="eval-label">Consumo excesivo de alcohol</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.consumoAlcoholExcesivo)"
            >
              {{ formatEvaluation(reportData.consumoAlcoholExcesivo) }}
            </span>
          </div>

          <!-- Conductas Problemáticas -->
          <div v-if="reportData.destrozos" class="evaluation-item">
            <span class="eval-label">Destrozos</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.destrozos)"
            >
              {{ formatEvaluation(reportData.destrozos) }}
            </span>
          </div>

          <div v-if="reportData.robos" class="evaluation-item">
            <span class="eval-label">Robos</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.robos)"
            >
              {{ formatEvaluation(reportData.robos) }}
            </span>
          </div>

          <div v-if="reportData.amenazaPolicia" class="evaluation-item">
            <span class="eval-label">Amenaza con policía</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.amenazaPolicia)"
            >
              {{ formatEvaluation(reportData.amenazaPolicia) }}
            </span>
          </div>

          <div v-if="reportData.amenazaExtranjeros" class="evaluation-item">
            <span class="eval-label">Amenaza a extranjeros</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.amenazaExtranjeros)"
            >
              {{ formatEvaluation(reportData.amenazaExtranjeros) }}
            </span>
          </div>

          <div
            v-if="reportData.gritaEInsultaArrendatario"
            class="evaluation-item"
          >
            <span class="eval-label">Grita e insulta al arrendatario</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.gritaEInsultaArrendatario)"
            >
              {{ formatEvaluation(reportData.gritaEInsultaArrendatario) }}
            </span>
          </div>

          <!-- Comportamiento General -->
          <div v-if="reportData.independiente" class="evaluation-item">
            <span class="eval-label">Independiente</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.independiente)"
            >
              {{ formatEvaluation(reportData.independiente) }}
            </span>
          </div>

          <div v-if="reportData.privado" class="evaluation-item">
            <span class="eval-label">Privado</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.privado)"
            >
              {{ formatEvaluation(reportData.privado) }}
            </span>
          </div>

          <div v-if="reportData.llavero" class="evaluation-item">
            <span class="eval-label">Llavero</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.llavero)"
            >
              {{ formatEvaluation(reportData.llavero) }}
            </span>
          </div>

          <div v-if="reportData.meteGenteAjena" class="evaluation-item">
            <span class="eval-label">Mete gente ajena</span>
            <span
              class="eval-value"
              :class="getEvaluationClass(reportData.meteGenteAjena)"
            >
              {{ formatEvaluation(reportData.meteGenteAjena) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Sección: Comentarios -->
      <div
        v-if="reportData.comentario || reportData.comentariosAdicionales"
        class="data-section"
      >
        <div class="section-header">
          <i class="fas fa-comment"></i>
          <h4 class="section-title">Comentarios Adicionales</h4>
        </div>

        <div class="comment-box">
          {{ reportData.comentario || reportData.comentariosAdicionales }}
        </div>
      </div>

      <!-- Resumen de validación -->
      <div class="validation-summary">
        <div class="validation-item" :class="{ 'is-valid': allFieldsValid }">
          <i
            :class="
              allFieldsValid
                ? 'fas fa-check-circle'
                : 'fas fa-exclamation-circle'
            "
          ></i>
          <span>{{ validationMessage }}</span>
        </div>

        <div v-if="!allFieldsValid" class="validation-warnings">
          <div
            v-for="warning in validationWarnings"
            :key="warning.field"
            class="warning-item"
          >
            <i class="fas fa-exclamation-triangle"></i>
            <span>{{ warning.message }}</span>
            <button @click="handleEditField(warning.field)" class="btn-fix">
              Corregir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div class="confirmation-footer">
      <button
        @click="handleCancel"
        class="btn btn-cancel"
        :disabled="isSubmitting"
      >
        <i class="fas fa-times"></i>
        Cancelar
      </button>

      <button @click="handleBack" class="btn btn-back" :disabled="isSubmitting">
        <i class="fas fa-arrow-left"></i>
        Volver a editar
      </button>

      <button
        @click="handleConfirm"
        class="btn btn-confirm"
        :disabled="!allFieldsValid || isSubmitting"
        :class="{ 'is-loading': isSubmitting }"
      >
        <i v-if="!isSubmitting" class="fas fa-check"></i>
        <i v-else class="fas fa-spinner fa-spin"></i>
        {{ isSubmitting ? "Guardando..." : "Confirmar y Guardar" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useChatBotStore } from "@/store/chatBotStore.js";
import EditableField from "./EditableField.vue";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  reportType: {
    type: String,
    default: "complete", // 'complete' o 'express'
    validator: (value) => ["complete", "express"].includes(value),
  },
});

// Emits
const emit = defineEmits(["confirm", "cancel", "edit-field", "back"]);

// Store
const chatBotStore = useChatBotStore();

// State
const isSubmitting = ref(false);

// Computed
const showConfirmation = computed(() => props.visible);

const isCompleteReport = computed(() => props.reportType === "complete");

const reportData = computed(() => {
  return isCompleteReport.value
    ? chatBotStore.tempReportData
    : chatBotStore.tempExpressData;
});

const reportTypeIcon = computed(() => {
  return isCompleteReport.value ? "fas fa-file-alt" : "fas fa-bolt";
});

const confirmationTitle = computed(() => {
  return isCompleteReport.value
    ? "📋 Confirmar Reporte Completo"
    : "⚡ Confirmar Reporte Express";
});

const idTypeBadge = computed(() => {
  const types = {
    rut: "RUT",
    passport: "Pasaporte",
    dni: "DNI",
    other: "Otro",
  };
  return types[reportData.value.idType] || "ID";
});

// Contadores de campos
const personalFieldsCount = computed(() => {
  const fields = ["nombre", "apellido", "identificacion", "telefono", "email"];
  return fields.filter((field) => reportData.value[field]).length;
});

const demographicFieldsCount = computed(() => {
  if (!isCompleteReport.value) return 0;
  const fields = ["genero", "fechaNacimiento", "nacionalidad"];
  return fields.filter((field) => reportData.value[field]).length;
});

const accommodationFieldsCount = computed(() => {
  const baseFields = ["tipoHospedaje", "fechaIngreso"];
  const fields = isCompleteReport.value
    ? [...baseFields, "agencia"]
    : baseFields;
  return fields.filter((field) => reportData.value[field]).length;
});

// Contador de evaluaciones
const hasEvaluations = computed(() => {
  const evaluationFields = [
    "paga_puntual",
    "habitacionLimpiaYOrdenada",
    "tranquilaYOrdenada",
    "buenasRelacionesPasajeros",
    "tratoClientes",
    "avisaConAnticipacionRetirada",
    "consumeMarihuana",
    "consumeOtrasDrogas",
    "consumoAlcoholExcesivo",
    "destrozos",
    "robos",
    "amenazaPolicia",
    "amenazaExtranjeros",
    "gritaEInsultaArrendatario",
    "independiente",
    "privado",
    "llavero",
    "meteGenteAjena",
  ];
  return evaluationFields.some((field) => reportData.value[field]);
});

const evaluationsCount = computed(() => {
  const evaluationFields = [
    "paga_puntual",
    "habitacionLimpiaYOrdenada",
    "tranquilaYOrdenada",
    "buenasRelacionesPasajeros",
    "tratoClientes",
    "avisaConAnticipacionRetirada",
    "consumeMarihuana",
    "consumeOtrasDrogas",
    "consumoAlcoholExcesivo",
    "destrozos",
    "robos",
    "amenazaPolicia",
    "amenazaExtranjeros",
    "gritaEInsultaArrendatario",
    "independiente",
    "privado",
    "llavero",
    "meteGenteAjena",
  ];
  return evaluationFields.filter((field) => reportData.value[field]).length;
});

// Validación
const allFieldsValid = computed(() => {
  // Solo los campos realmente requeridos según reportModel.js
  const requiredFields = ["nombre", "apellido", "identificacion", "telefono"];

  return requiredFields.every((field) => {
    const value = reportData.value[field];
    return value && value.toString().trim().length > 0;
  });
});

const validationWarnings = computed(() => {
  const warnings = [];

  // Validar solo campos requeridos según reportModel.js
  const requiredFields = {
    nombre: "El nombre es requerido",
    apellido: "El apellido es requerido",
    identificacion: "La identificación es requerida",
    telefono: "El teléfono es requerido",
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    const value = reportData.value[field];
    if (!value || value.toString().trim().length === 0) {
      warnings.push({ field, message });
    }
  }

  return warnings;
});

const validationMessage = computed(() => {
  if (allFieldsValid.value) {
    return "✅ Todos los campos requeridos están completos";
  }
  const count = validationWarnings.value.length;
  return `⚠️ ${count} campo${count > 1 ? "s" : ""} requerido${
    count > 1 ? "s" : ""
  } pendiente${count > 1 ? "s" : ""}`;
});

// Methods - Formateo
const formatIdentification = (id, type) => {
  if (!id) return "-";

  if (type === "rut") {
    // Formatear RUT chileno: 12.345.678-9
    const clean = id.replace(/[^0-9kK]/g, "");
    if (clean.length < 2) return id;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
  }

  return id;
};

const formatGender = (gender) => {
  if (!gender) return "-";

  const genders = {
    M: "Masculino",
    F: "Femenino",
    O: "Otro",
    N: "Prefiero no decir",
  };

  return genders[gender] || gender;
};

const formatDate = (date) => {
  if (!date) return "-";

  try {
    const d = new Date(date);
    return d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return date;
  }
};

const formatTipoHospedaje = (tipo) => {
  if (!tipo) return "-";

  const tipos = {
    hotel: "Hotel",
    hostal: "Hostal",
    camping: "Camping",
    cabana: "Cabaña",
    apartamento: "Apartamento",
    residencial: "Residencial",
    otro: "Otro",
  };

  return tipos[tipo] || tipo;
};

// Formatear evaluaciones
const formatEvaluation = (value) => {
  if (!value) return "-";

  const evaluations = {
    si: "✅ Sí",
    no: "❌ No",
    a_veces: "🟡 A veces",
    sin_datos: "❓ Sin datos",
    excelente: "⭐ Excelente",
    bueno: "👍 Bueno",
    regular: "🤷 Regular",
    malo: "👎 Malo",
  };

  return evaluations[value] || value;
};

// Obtener clase CSS según valor de evaluación
const getEvaluationClass = (value) => {
  if (!value) return "";

  const classes = {
    si: "eval-positive",
    no: "eval-negative",
    a_veces: "eval-neutral",
    sin_datos: "eval-unknown",
    excelente: "eval-positive",
    bueno: "eval-positive",
    regular: "eval-neutral",
    malo: "eval-negative",
  };

  return classes[value] || "";
};

// Methods - Acciones
const handleEditField = (field) => {
  console.log("✏️ Editar campo:", field);
  emit("edit-field", field);
};

const handleCancel = () => {
  if (isSubmitting.value) return;

  if (
    confirm(
      "¿Estás seguro de que quieres cancelar? Se perderán los datos ingresados."
    )
  ) {
    emit("cancel");
  }
};

const handleBack = () => {
  if (isSubmitting.value) return;
  emit("back");
};

const handleConfirm = async () => {
  if (!allFieldsValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // Emitir evento de confirmación
    emit("confirm", {
      reportType: props.reportType,
      data: { ...reportData.value },
    });
  } catch (error) {
    console.error("Error al confirmar:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.report-confirmation {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.confirmation-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
}

.confirmation-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
}

.confirmation-subtitle {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
}

/* Body */
.confirmation-body {
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
}

.data-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.data-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header i {
  color: #3b82f6;
  font-size: 16px;
}

.section-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}

.section-badge {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 12px;
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

/* Validation Summary */
.validation-summary {
  margin-top: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.validation-item.is-valid {
  color: #10b981;
}

.validation-item i {
  font-size: 18px;
}

.validation-warnings {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
  font-size: 12px;
  color: #92400e;
}

.warning-item i {
  color: #f59e0b;
  font-size: 14px;
}

.warning-item span {
  flex: 1;
}

.btn-fix {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-fix:hover {
  background: #d97706;
}

/* Footer */
.confirmation-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e0;
}

.btn-cancel:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-back {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-back:hover:not(:disabled) {
  background: #eff6ff;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-confirm.is-loading {
  background: #94a3b8;
}

/* Evaluations Grid */
.evaluations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.evaluation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.evaluation-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.eval-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.eval-value {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.eval-positive {
  background: #d1fae5;
  color: #065f46;
}

.eval-negative {
  background: #fee2e2;
  color: #991b1b;
}

.eval-neutral {
  background: #fef3c7;
  color: #92400e;
}

.eval-unknown {
  background: #e2e8f0;
  color: #475569;
}

/* Comment Box */
.comment-box {
  padding: 14px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  white-space: pre-wrap;
}

/* Responsive */
@media (max-width: 640px) {
  .confirmation-header {
    padding: 16px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .confirmation-title {
    font-size: 18px;
  }

  .confirmation-subtitle {
    font-size: 12px;
  }

  .confirmation-body {
    padding: 16px;
    max-height: 400px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .evaluations-grid {
    grid-template-columns: 1fr;
  }

  .confirmation-footer {
    padding: 12px 16px;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
