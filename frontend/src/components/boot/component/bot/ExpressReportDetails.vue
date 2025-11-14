<template>
  <div class="express-report-details">
    <div class="alert alert-warning">
      <i class="bi bi-lightning-fill me-2"></i>
      <strong>Reporte Express</strong>
    </div>

    <div class="row g-3">
      <!-- Información del reporte -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-info-circle me-2"></i>
              Información General
            </h6>
            <div class="report-field">
              <label>Tipo de Reporte:</label>
              <span>{{ report.tipo || "No especificado" }}</span>
            </div>
            <div class="report-field">
              <label>Descripción:</label>
              <p>{{ report.descripcion || "Sin descripción" }}</p>
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

      <!-- Datos del usuario -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-person me-2"></i>
              Información del Usuario
            </h6>
            <div class="report-field" v-if="report.usuario">
              <label>Nombre:</label>
              <span>{{ report.usuario.nombre || "Anónimo" }}</span>
            </div>
            <div class="report-field" v-if="report.email">
              <label>Email:</label>
              <span>{{ report.email }}</span>
            </div>
            <div class="report-field" v-if="report.telefono">
              <label>Teléfono:</label>
              <span>{{ report.telefono }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fechas -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title mb-3">
              <i class="bi bi-calendar me-2"></i>
              Fechas
            </h6>
            <div class="row">
              <div class="col-md-6">
                <div class="report-field">
                  <label>Fecha de Creación:</label>
                  <span>{{ formatDate(report.createdAt) }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="report-field">
                  <label>Última Actualización:</label>
                  <span>{{ formatDate(report.updatedAt) }}</span>
                </div>
              </div>
            </div>
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
    Completado: "bg-success",
    Rechazado: "bg-danger",
  };
  return statusClasses[estado] || "bg-secondary";
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
.express-report-details {
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

.report-field span,
.report-field p {
  color: #333;
  margin: 0;
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
</style>
