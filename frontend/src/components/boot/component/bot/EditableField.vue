<!--
  Componente de Campo Editable Inline
  
  Permite editar un campo directamente desde el resumen de confirmación
-->

<template>
  <div 
    class="editable-field"
    :class="{
      'is-required': required,
      'is-empty': isEmpty,
      'is-editing': isEditing
    }"
  >
    <div class="field-label">
      <i v-if="icon" :class="icon" class="field-icon"></i>
      <span>{{ label }}</span>
      <span v-if="required" class="required-mark">*</span>
      <span v-if="badge" class="field-badge">{{ badge }}</span>
    </div>
    
    <div v-if="!isEditing" class="field-value" @click="startEditing">
      <span v-if="!isEmpty" class="value-text">{{ displayValue }}</span>
      <span v-else class="value-empty">Sin datos</span>
      <button class="btn-edit" :title="`Editar ${label}`">
        <i class="fas fa-pencil-alt"></i>
      </button>
    </div>
    
    <div v-else class="field-edit">
      <input
        ref="inputRef"
        v-model="editValue"
        :type="inputType"
        :placeholder="`Ingresa ${label.toLowerCase()}`"
        class="edit-input"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        @blur="handleBlur"
      />
      <div class="edit-actions">
        <button @click="saveEdit" class="btn-save" title="Guardar">
          <i class="fas fa-check"></i>
        </button>
        <button @click="cancelEdit" class="btn-cancel" title="Cancelar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <div v-if="showHint" class="field-hint">
      <i class="fas fa-info-circle"></i>
      <span>{{ hint }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: ''
  },
  field: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'tel', 'date', 'number'].includes(value)
  }
})

// Emits
const emit = defineEmits(['edit'])

// Refs
const inputRef = ref(null)

// State
const isEditing = ref(false)
const editValue = ref('')

// Computed
const displayValue = computed(() => {
  return props.value || '-'
})

const isEmpty = computed(() => {
  return !props.value || props.value.toString().trim().length === 0
})

const showHint = computed(() => {
  return props.hint && (isEditing.value || isEmpty.value)
})

// Methods
const startEditing = () => {
  editValue.value = props.value || ''
  isEditing.value = true
  
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      inputRef.value.select()
    }
  })
}

const saveEdit = () => {
  const newValue = editValue.value.trim()
  
  // Validar si es campo requerido
  if (props.required && !newValue) {
    alert(`${props.label} es un campo requerido`)
    return
  }
  
  // Emitir evento de edición
  emit('edit', {
    field: props.field,
    oldValue: props.value,
    newValue: newValue,
    label: props.label
  })
  
  isEditing.value = false
}

const cancelEdit = () => {
  editValue.value = props.value || ''
  isEditing.value = false
}

const handleBlur = () => {
  // Delay para permitir que los botones sean clickeables
  setTimeout(() => {
    if (isEditing.value) {
      cancelEdit()
    }
  }, 200)
}

// Watchers
watch(() => props.value, (newValue) => {
  if (!isEditing.value) {
    editValue.value = newValue || ''
  }
})
</script>

<style scoped>
.editable-field {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s ease;
}

.editable-field:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.editable-field.is-editing {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editable-field.is-empty {
  border-color: #fbbf24;
  background: #fefce8;
}

.editable-field.is-required.is-empty {
  border-color: #ef4444;
  background: #fef2f2;
}

/* Label */
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.field-icon {
  color: #3b82f6;
  font-size: 13px;
}

.required-mark {
  color: #ef4444;
  font-weight: 700;
}

.field-badge {
  font-size: 10px;
  font-weight: 500;
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: auto;
}

/* Value (modo lectura) */
.field-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.field-value:hover {
  background: #f1f5f9;
}

.value-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
}

.value-empty {
  flex: 1;
  font-size: 13px;
  font-style: italic;
  color: #94a3b8;
}

.btn-edit {
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.field-value:hover .btn-edit {
  opacity: 1;
}

.btn-edit:hover {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Edit mode */
.field-edit {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;
}

.edit-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.edit-actions {
  display: flex;
  gap: 6px;
}

.btn-save,
.btn-cancel {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.2s ease;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
  transform: scale(1.05);
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background: #dc2626;
  transform: scale(1.05);
}

/* Hint */
.field-hint {
  margin-top: 6px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

.field-hint i {
  color: #3b82f6;
  font-size: 12px;
  margin-top: 1px;
}

/* Responsive */
@media (max-width: 640px) {
  .editable-field {
    padding: 10px;
  }
  
  .field-label {
    font-size: 11px;
  }
  
  .value-text {
    font-size: 13px;
  }
  
  .edit-input {
    font-size: 13px;
    padding: 7px 10px;
  }
}
</style>