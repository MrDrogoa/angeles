<template>
  <div class="quick-reply-container" :class="`layout-${layout}`">
    <div v-if="showHeader" class="quick-reply-header">
      <span class="quick-reply-title">
        <i class="fas fa-bolt"></i>
        Respuestas rápidas:
      </span>
      <span v-if="showCount" class="quick-reply-count">{{ visibleOptions.length }}</span>
    </div>
    
    <div class="quick-reply-options" :class="{ 'is-loading': isLoading }">
      <transition-group name="slide-fade" tag="div" class="options-list">
        <button
          v-for="option in visibleOptions"
          :key="option.id"
          @click="selectOption(option)"
          @mouseenter="onHoverOption(option)"
          class="quick-reply-button"
          :class="getButtonClass(option)"
          :title="option.title || option.description || option.text"
          :disabled="option.disabled || isLoading"
        >
          <!-- Icon -->
          <span v-if="option.icon" class="option-icon-wrapper">
            <i :class="option.icon" class="option-icon"></i>
          </span>
          
          <!-- Content -->
          <span class="option-content">
            <span class="option-text">{{ option.text }}</span>
            <span v-if="option.description" class="option-description">
              {{ option.description }}
            </span>
          </span>
          
          <!-- Badge/Indicator -->
          <span v-if="option.badge" class="option-badge">{{ option.badge }}</span>
          
          <!-- Arrow -->
          <i v-if="option.arrow !== false" class="fas fa-chevron-right option-arrow"></i>
        </button>
      </transition-group>
      
      <!-- Ver más opciones -->
      <button
        v-if="hasMoreOptions"
        @click="toggleShowAll"
        class="quick-reply-button show-more-button"
      >
        <i :class="showAll ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        <span>{{ showAll ? 'Ver menos' : `Ver más (${hiddenOptionsCount})` }}</span>
      </button>
    </div>
    
    <!-- Indicador de que se puede escribir libremente -->
    <div v-if="showFooter" class="quick-reply-footer">
      <small class="text-muted">
        <i class="fas fa-keyboard"></i>
        También puedes escribir tu respuesta
      </small>
    </div>
    
    <!-- Shortcuts hints -->
    <div v-if="showKeyboardShortcuts && visibleOptions.length <= 9" class="keyboard-hints">
      <small class="text-muted">
        <i class="fas fa-info-circle"></i>
        Tip: Presiona 1-{{ visibleOptions.length }} para seleccionar rápidamente
      </small>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  maxVisible: {
    type: Number,
    default: 5
  },
  layout: {
    type: String,
    default: 'vertical', // 'vertical', 'horizontal', 'grid'
    validator: (value) => ['vertical', 'horizontal', 'grid'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCount: {
    type: Boolean,
    default: false
  },
  showKeyboardShortcuts: {
    type: Boolean,
    default: true
  },
  enableKeyboardNavigation: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['option-selected', 'hover-option'])

// State
const showAll = ref(false)

// Computed
const visibleOptions = computed(() => {
  if (showAll.value) {
    return props.options
  }
  return props.options.slice(0, props.maxVisible)
})

const hasMoreOptions = computed(() => {
  return props.options.length > props.maxVisible
})

const hiddenOptionsCount = computed(() => {
  return Math.max(0, props.options.length - props.maxVisible)
})

const containerClass = computed(() => ({
  'layout-vertical': props.layout === 'vertical',
  'layout-horizontal': props.layout === 'horizontal',
  'layout-grid': props.layout === 'grid'
}))

// Methods
const selectOption = (option) => {
  if (option.disabled) return
  
  // Agregar efecto visual al botón seleccionado
  const button = event.target.closest('.quick-reply-button')
  if (button) {
    button.classList.add('selected')
    setTimeout(() => {
      button.classList.remove('selected')
    }, 200)
  }
  
  emit('option-selected', option)
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const onHoverOption = (option) => {
  emit('hover-option', option)
}

const getButtonClass = (option) => {
  const classes = []
  
  // Clase basada en el tipo de opción
  if (option.type) {
    classes.push(`type-${option.type}`)
  }
  
  // Clase basada en el valor para estilos específicos
  if (option.value) {
    if (option.value.includes('back') || option.value === 'menu') {
      classes.push('back-option')
    } else if (option.value.includes('cancel') || option.value.includes('delete')) {
      classes.push('danger-option')
    } else if (option.value === '1' || option.primary) {
      classes.push('primary-option')
    } else if (option.value.includes('help') || option.value.includes('info')) {
      classes.push('info-option')
    } else if (option.value.includes('success') || option.value.includes('confirm')) {
      classes.push('success-option')
    }
  }
  
  // Clase para opciones deshabilitadas
  if (option.disabled) {
    classes.push('disabled')
  }
  
  // Clase para opciones destacadas
  if (option.highlighted) {
    classes.push('highlighted')
  }
  
  return classes
}

// Keyboard navigation
const handleKeyPress = (event) => {
  if (!props.enableKeyboardNavigation) return
  
  const key = event.key
  
  // Números 1-9 para seleccionar opciones
  if (key >= '1' && key <= '9') {
    const index = parseInt(key) - 1
    if (index < visibleOptions.value.length) {
      event.preventDefault()
      selectOption(visibleOptions.value[index])
    }
  }
}

// Lifecycle
onMounted(() => {
  if (props.enableKeyboardNavigation) {
    window.addEventListener('keypress', handleKeyPress)
  }
})

onUnmounted(() => {
  if (props.enableKeyboardNavigation) {
    window.removeEventListener('keypress', handleKeyPress)
  }
})
</script>

<style scoped>
.quick-reply-container {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.quick-reply-container.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.quick-reply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.quick-reply-title {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-reply-count {
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

/* Layouts */
.quick-reply-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.layout-horizontal .quick-reply-options {
  flex-direction: row;
  flex-wrap: wrap;
}

.layout-horizontal .options-list {
  flex-direction: row;
  flex-wrap: wrap;
}

.layout-grid .options-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

/* Botones de respuesta rápida */
.quick-reply-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  color: #495057;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.quick-reply-button:hover:not(.disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-reply-button:active:not(.disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.quick-reply-button.selected {
  transform: scale(0.98);
  background: #dee2e6;
}

/* Iconos y texto */
.option-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  line-height: 1.3;
}

.option-arrow {
  font-size: 10px;
  opacity: 0.6;
  transition: transform 0.2s ease;
}

.quick-reply-button:hover .option-arrow {
  transform: translateX(2px);
}

/* Tipos de botones */
.primary-option {
  background: linear-gradient(135deg, #ffc107, #ff9800);
  border-color: #ffc107;
  color: #212529;
  font-weight: 600;
}

.primary-option:hover {
  background: linear-gradient(135deg, #ffca2c, #ffa726);
  color: #212529;
}

.back-option {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
}

.back-option:hover {
  background: #5a6268;
  color: white;
}

.danger-option {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.danger-option:hover {
  background: #c82333;
  color: white;
}

.info-option {
  background: #17a2b8;
  border-color: #17a2b8;
  color: white;
}

.info-option:hover {
  background: #138496;
  color: white;
}

.success-option {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.success-option:hover {
  background: #218838;
  color: white;
}

.highlighted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.highlighted:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Opciones con descripción */
.option-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.option-description {
  font-size: 11px;
  opacity: 0.8;
  font-weight: 400;
}

.option-badge {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}

.option-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  flex-shrink: 0;
}

.primary-option .option-icon-wrapper,
.highlighted .option-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

/* Botón disabled */
.quick-reply-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Botón "ver más" */
.show-more-button {
  background: transparent;
  border: 1px dashed #adb5bd;
  color: #6c757d;
  justify-content: center;
  font-weight: 500;
}

.show-more-button:hover {
  background: #f8f9fa;
  border-color: #6c757d;
}

/* Footer */
.quick-reply-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.keyboard-hints {
  margin-top: 8px;
  text-align: center;
}

.text-muted {
  color: #6c757d;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Animaciones */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .quick-reply-button {
    padding: 10px 14px;
    font-size: 12px;
  }
  
  .layout-grid .options-list {
    grid-template-columns: 1fr;
  }
  
  .option-icon-wrapper {
    width: 28px;
    height: 28px;
  }
}
</style>
