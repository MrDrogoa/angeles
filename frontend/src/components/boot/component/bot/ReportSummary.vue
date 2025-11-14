<template>
  <div class="report-summary">
    <!-- Header del resumen -->
    <div class="summary-header">
      <div class="summary-icon">
        <i :class="isExpressReport ? 'fas fa-bolt' : 'fas fa-clipboard-list'"></i>
      </div>
      <div class="summary-title">
        <h4>{{ isExpressReport ? 'Resumen Reporte Express' : 'Resumen Reporte Completo' }}</h4>
        <p class="summary-subtitle">Verifica la información antes de guardar</p>
      </div>
    </div>

    <!-- Datos personales -->
    <div class="summary-section">
      <h5 class="section-title">
        <i class="fas fa-user"></i>
        Datos Personales
      </h5>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="item-label">Nombre completo:</span>
          <span class="item-value">{{ reportData.nombre }} {{ reportData.apellido }}</span>
        </div>
        
        <div v-if="reportData.nickNames && reportData.nickNames.length > 0" class="summary-item">
          <span class="item-label">Apodos:</span>
          <span class="item-value">{{ reportData.nickNames.join(', ') }}</span>
        </div>
        
        <div class="summary-item">
          <span class="item-label">Identificación:</span>
          <span class="item-value">
            {{ reportData.identificacion }} 
            <span class="id-type">({{ getIdTypeLabel(reportData.idType) }})</span>
          </span>
        </div>
        
        <div v-if="reportData.genero" class="summary-item">
          <span class="item-label">Género:</span>
          <span class="item-value">{{ getGenderLabel(reportData.genero) }}</span>
        </div>
        
        <div v-if="reportData.nacionalidad" class="summary-item">
          <span class="item-label">Nacionalidad:</span>
          <span class="item-value">{{ reportData.nacionalidad }}</span>
        </div>
      </div>
    </div>

    <!-- Información de contacto -->
    <div class="summary-section">
      <h5 class="section-title">
        <i class="fas fa-phone"></i>
        Contacto
      </h5>
      <div class="summary-grid">
        <div v-if="reportData.telefono && reportData.telefono.length > 0" class="summary-item">
          <span class="item-label">Teléfono:</span>
          <span class="item-value">{{ formatPhone(reportData.telefono[0]) }}</span>
        </div>
        
        <div v-if="reportData.email" class="summary-item">
          <span class="item-label">Email:</span>
          <span class="item-value">{{ reportData.email }}</span>
        </div>
      </div>
    </div>

    <!-- Evaluaciones para reporte completo -->
    <div v-if="!isExpressReport" class="summary-section">
      <h5 class="section-title">
        <i class="fas fa-chart-bar"></i>
        Evaluaciones Completas
      </h5>
      <div class="evaluations-grid">
        <div 
          v-for="(evaluation, key) in standardEvaluations" 
          :key="key"
          class="evaluation-item"
        >
          <span class="evaluation-label">{{ getEvaluationLabel(key) }}</span>
          <span class="evaluation-value" :class="getEvaluationClass(evaluation)">
            {{ getEvaluationText(evaluation) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Evaluaciones para reporte express -->
    <div v-if="isExpressReport" class="summary-section">
      <h5 class="section-title">
        <i class="fas fa-star"></i>
        Evaluaciones Express
      </h5>
      <div class="express-evaluations">
        <div 
          v-for="(rating, key) in expressEvaluations" 
          :key="key"
          class="express-evaluation-item"
        >
          <span class="evaluation-label">{{ getExpressEvaluationLabel(key) }}</span>
          <div class="star-rating">
            <span class="stars">{{ getStarRating(rating) }}</span>
            <span class="rating-text">({{ rating }}/5)</span>
          </div>
        </div>
        
        <!-- Recomendación -->
        <div v-if="reportData.recomendado !== undefined" class="recommendation-item">
          <span class="evaluation-label">Recomendado:</span>
          <span class="recommendation-value" :class="reportData.recomendado ? 'positive' : 'negative'">
            {{ reportData.recomendado ? '✅ Sí' : '❌ No' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Comentarios adicionales -->
    <div v-if="hasComments" class="summary-section">
      <h5 class="section-title">
        <i class="fas fa-comment"></i>
        Comentarios Adicionales
      </h5>
      <div class="comments-content">
        <p>{{ getComments() }}</p>
      </div>
    </div>

    <!-- Acciones -->
    <div class="summary-actions">
      <button 
        @click="$emit('edit')"
        class="btn btn-outline-secondary edit-btn"
      >
        <i class="fas fa-edit"></i>
        Editar
      </button>
      
      <button 
        @click="$emit('save')"
        class="btn btn-success save-btn"
      >
        <i class="fas fa-save"></i>
        Guardar Reporte
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  reportData: {
    type: Object,
    required: true
  },
  reportType: {
    type: String,
    default: 'standard' // 'standard' o 'express'
  }
})

// Emits
const emit = defineEmits(['save', 'edit', 'cancel'])

// Computed
const isExpressReport = computed(() => {
  return props.reportType === 'express' || 
         props.reportData.evaluationCount !== undefined ||
         props.reportData.pagaYavisa !== undefined
})

const standardEvaluations = computed(() => {
  if (isExpressReport.value) return {}
  
  const standardFields = [
    'paga_puntual', 'HabitacionLimpiaYOrdenada', 'ConsumeAlcohol', 'ConsumeMarihuana',
    'ConsumeOtrasDrogas', 'Robos', 'BuenasRelacionesPasajeros', 'AvisaConAntisipaciínRetirada',
    'Independiante', 'privado', 'llavero', 'MeteGenteAgena'
  ]
  
  const evaluations = {}
  standardFields.forEach(field => {
    if (props.reportData[field] !== undefined && props.reportData[field] !== null && props.reportData[field] !== '') {
      evaluations[field] = props.reportData[field]
    }
  })
  
  return evaluations
})

const expressEvaluations = computed(() => {
  if (!isExpressReport.value) return {}
  
  const expressFields = ['pagaYavisa', 'limpieza', 'puntualidad', 'comportamiento', 'profesionalismo']
  
  const evaluations = {}
  expressFields.forEach(field => {
    if (props.reportData[field] !== undefined && props.reportData[field] !== null && props.reportData[field] !== '') {
      evaluations[field] = props.reportData[field]
    }
  })
  
  return evaluations
})

const hasComments = computed(() => {
  return props.reportData.comentariosAdicionales || 
         props.reportData.comentarios ||
         props.reportData.observaciones
})

// Methods
const getIdTypeLabel = (type) => {
  const types = {
    'rut': 'RUT',
    'cedula': 'Cédula',
    'pasaporte': 'Pasaporte'
  }
  return types[type] || type?.toUpperCase()
}

const getGenderLabel = (gender) => {
  const genders = {
    'masculino': 'Masculino',
    'femenino': 'Femenino',
    'otro': 'Otro',
    'sin_datos': 'No especificado'
  }
  return genders[gender] || gender
}

const formatPhone = (phone) => {
  if (typeof phone === 'object' && phone.countryCode && phone.number) {
    return `${phone.countryCode} ${phone.number}`
  }
  return phone.toString()
}

const getEvaluationLabel = (key) => {
  const labels = {
    'paga_puntual': 'Paga puntualmente',
    'HabitacionLimpiaYOrdenada': 'Habitación limpia y ordenada',
    'ConsumeAlcohol': 'Consume alcohol en exceso',
    'ConsumeMarihuana': 'Consume marihuana',
    'ConsumeOtrasDrogas': 'Consume otras drogas',
    'Robos': 'Problemas de robos/hurtos',
    'BuenasRelacionesPasajeros': 'Buenas relaciones con pasajeros',
    'AvisaConAntisipaciínRetirada': 'Avisa con anticipación la retirada',
    'Independiante': 'Es independiente',
    'privado': 'Respeta la privacidad',
    'llavero': 'Cuida llaves y accesos',
    'MeteGenteAgena': 'Trae personas ajenas'
  }
  return labels[key] || key
}

const getExpressEvaluationLabel = (key) => {
  const labels = {
    'pagaYavisa': 'Paga y avisa',
    'limpieza': 'Orden y limpieza',
    'puntualidad': 'Puntualidad',
    'comportamiento': 'Comportamiento',
    'profesionalismo': 'Profesionalismo'
  }
  return labels[key] || key
}

const getEvaluationText = (value) => {
  const texts = {
    'si': 'Sí',
    'no': 'No',
    'sipoco': 'A veces',
    'simucho': 'Sí, mucho',
    'sin': 'Sin datos',
    'nose': 'No observado',
    'only': 'Solo por consulta'
  }
  return texts[value] || value
}

const getEvaluationClass = (value) => {
  if (!value) return 'neutral'
  
  const positiveValues = ['si', 'no'] // 'no' es positivo para cosas como robos, drogas
  const negativeValues = ['simucho', 'sipoco']
  const neutralValues = ['sin', 'nose', 'only']
  
  if (positiveValues.includes(value)) return 'positive'
  if (negativeValues.includes(value)) return 'negative'
  if (neutralValues.includes(value)) return 'neutral'
  
  return 'neutral'
}

const getStarRating = (rating) => {
  const fullStars = '⭐'.repeat(rating)
  const emptyStars = '☆'.repeat(5 - rating)
  return fullStars + emptyStars
}

const getComments = () => {
  return props.reportData.comentariosAdicionales || 
         props.reportData.comentarios ||
         props.reportData.observaciones ||
         ''
}
</script>

<style scoped>
.report-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.summary-header {
  background: linear-gradient(135deg, #ffc107, #ff9800);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #212529;
}

.summary-icon {
  font-size: 24px;
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-title h4 {
  margin: 0;
  font-weight: 600;
  font-size: 18px;
}

.summary-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

/* Secciones */
.summary-section {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.summary-section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 16px;
}

.section-title i {
  color: #ffc107;
}

/* Grid de elementos */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-label {
  font-weight: 500;
  color: #6c757d;
  min-width: 120px;
  font-size: 14px;
}

.item-value {
  font-weight: 500;
  color: #212529;
  text-align: right;
  font-size: 14px;
  flex: 1;
}

.id-type {
  font-size: 12px;
  color: #6c757d;
  font-weight: normal;
}

/* Evaluaciones estándar */
.evaluations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.evaluation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #dee2e6;
}

.evaluation-label {
  font-weight: 500;
  color: #495057;
  font-size: 13px;
}

.evaluation-value {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.evaluation-value.positive {
  background: #d4edda;
  color: #155724;
}

.evaluation-value.negative {
  background: #f8d7da;
  color: #721c24;
}

.evaluation-value.neutral {
  background: #e2e3e5;
  color: #383d41;
}

/* Evaluaciones express */
.express-evaluations {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.express-evaluation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  font-size: 16px;
}

.rating-text {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.recommendation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #17a2b8;
}

.recommendation-value {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

.recommendation-value.positive {
  background: #d4edda;
  color: #155724;
}

.recommendation-value.negative {
  background: #f8d7da;
  color: #721c24;
}

/* Comentarios */
.comments-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #6c757d;
}

.comments-content p {
  margin: 0;
  color: #495057;
  line-height: 1.5;
  font-style: italic;
}

/* Acciones */
.summary-actions {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.edit-btn,
.save-btn {
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .evaluations-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .summary-header {
    padding: 16px;
  }
  
  .summary-section {
    padding: 16px;
  }
}
</style>