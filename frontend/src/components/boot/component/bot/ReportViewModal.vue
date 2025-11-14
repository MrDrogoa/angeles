<template>
  <!-- Modal de visualización de reporte -->
  <div
    v-if="show"
    class="modal d-block"
    tabindex="-1"
    role="dialog"
    @click.self="$emit('close')"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-eye-fill text-primary me-2"></i>
            Detalles del Reporte
            <span
              v-if="report"
              class="ms-2 badge"
              :class="isExpressReport ? 'bg-warning text-dark' : 'bg-info'"
            >
              {{ isExpressReport ? "⚡ Express" : "📋 Estándar" }}
            </span>
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" v-if="report">
          <!-- Componente específico según el tipo de reporte -->
          <ExpressReportDetails v-if="isExpressReport" :report="report" />
          <ReportDetails v-else :report="report" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            <i class="bi bi-x-lg me-1"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ExpressReportDetails from "./ExpressReportDetails.vue";
import ReportDetails from "./ReportDetails.vue";

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  report: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["close"]);

// Computed
const isExpressReport = computed(() => {
  if (!props.report) return false;

  // Múltiples formas de detectar un reporte express
  return (
    props.report.reportType === "express" ||
    props.report.fromCollection === "expressReports" ||
    // Verificar si tiene campos específicos de express
    props.report.limpieza !== undefined ||
    props.report.puntualidad !== undefined ||
    props.report.comportamiento !== undefined ||
    props.report.evaluationCount !== undefined ||
    props.report.pagaYavisa !== undefined
  );
});
</script>

<style scoped>
.modal {
  z-index: 1055;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 90vw;
}

.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
}

.modal-header .badge {
  font-size: 0.8em;
  padding: 0.4rem 0.6rem;
}

.modal-title {
  font-weight: 600;
}

.btn-close {
  filter: invert(1);
}

.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  border-radius: 8px 8px 0 0;
}

.card-header h6 {
  color: #495057;
  font-weight: 600;
}

.card-header .bi-lightning-fill {
  color: #ffc107;
}

.card-header .bi-clipboard-check-fill {
  color: #17a2b8;
}

.evaluation-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.evaluation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.badge {
  font-weight: 500;
  padding: 0.4rem 0.8rem;
}

.alert-light {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }

  .evaluation-grid {
    grid-template-columns: 1fr;
  }

  .evaluation-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
