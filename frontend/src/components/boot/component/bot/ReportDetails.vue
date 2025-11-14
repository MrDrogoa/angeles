<template>
  <div class="report-details">
    <div class="alert alert-info">
      <i class="bi bi-file-text-fill me-2"></i>
      <strong>Reporte Estándar</strong>
    </div>

    <div class="row g-3">
      <!-- Información principal -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-info-circle me-2"></i>
              Información del Reporte
            </h6>
            <div class="report-field">
              <label>ID del Reporte:</label>
              <span class="font-monospace">{{ report.id || report._id }}</span>
            </div>
            <div class="report-field">
              <label>Tipo:</label>
              <span class="badge bg-primary">{{
                report.tipo || "General"
              }}</span>
            </div>
            <div class="report-field">
              <label>Categoría:</label>
              <span>{{ report.categoria || "Sin categoría" }}</span>
            </div>
            <div class="report-field">
              <label>Prioridad:</label>
              <span class="badge" :class="getPriorityClass(report.prioridad)">
                {{ report.prioridad || "Normal" }}
              </span>
            </div>
            <div class="report-field">
              <label>Estado:</label>
              <span class="badge" :class="getStatusClass(report.estado)">
                {{ report.estado || "Pendiente" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-text-paragraph me-2"></i>
              Descripción
            </h6>
            <p class="report-description">
              {{ report.descripcion || "Sin descripción proporcionada" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Información del reportante -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-person-fill me-2"></i>
              Datos del Reportante
            </h6>
            <div class="report-field">
              <label>Nombre:</label>
              <span>{{ report.nombre || "No especificado" }}</span>
            </div>
            <div class="report-field" v-if="report.apellido">
              <label>Apellido:</label>
              <span>{{ report.apellido }}</span>
            </div>
            <div class="report-field" v-if="report.email">
              <label>Email:</label>
              <span>{{ report.email }}</span>
            </div>
            <div class="report-field" v-if="report.telefono">
              <label>Teléfono:</label>
              <span>{{ report.telefono }}</span>
            </div>
            <div class="report-field" v-if="report.direccion">
              <label>Dirección:</label>
              <span>{{ report.direccion }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-clock-history me-2"></i>
              Información Temporal
            </h6>
            <div class="report-field">
              <label>Creado:</label>
              <span>{{ formatDate(report.createdAt) }}</span>
            </div>
            <div class="report-field">
              <label>Actualizado:</label>
              <span>{{ formatDate(report.updatedAt) }}</span>
            </div>
            <div class="report-field" v-if="report.fechaResolucion">
              <label>Fecha de Resolución:</label>
              <span>{{ formatDate(report.fechaResolucion) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Adjuntos si existen -->
      <div class="col-12" v-if="report.adjuntos && report.adjuntos.length > 0">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-paperclip me-2"></i>
              Archivos Adjuntos
            </h6>
            <div class="attachments-list">
              <div
                v-for="(adjunto, index) in report.adjuntos"
                :key="index"
                class="attachment-item"
              >
                <i class="bi bi-file-earmark me-2"></i>
                <span>{{ adjunto.nombre || `Adjunto ${index + 1}` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notas o comentarios -->
      <div class="col-12" v-if="report.notas">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-journal-text me-2"></i>
              Notas Adicionales
            </h6>
            <p class="report-notes">{{ report.notas }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  report: {
    type: Object,
    required: true,
  },
});

const getStatusClass = (estado) => {
  const statusClasses = {
    Pendiente: "bg-warning text-dark",
    "En Proceso": "bg-info",
    "En Revisión": "bg-primary",
    Completado: "bg-success",
    Rechazado: "bg-danger",
    Cancelado: "bg-secondary",
  };
  return statusClasses[estado] || "bg-secondary";
};

const getPriorityClass = (prioridad) => {
  const priorityClasses = {
    Baja: "bg-success",
    Normal: "bg-info",
    Alta: "bg-warning text-dark",
    Urgente: "bg-danger",
  };
  return priorityClasses[prioridad] || "bg-info";
};

const formatDate = (date) => {
  if (!date) return "No disponible";
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.report-details {
  padding: 1rem;
}

.report-field {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.report-field:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.report-field label {
  display: block;
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.report-field span {
  color: #333;
}

.report-description,
.report-notes {
  color: #555;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attachment-item {
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
}

.attachment-item:hover {
  background-color: #e9ecef;
  cursor: pointer;
}
</style>
