# 📝 SISTEMA DE CALIFICACIÓN CON MODAL - GUÍA COMPLETA

## 🎯 ¿Qué se implementó?

Se creó un sistema completo de calificación con modal para que los usuarios puedan:
1. ✅ Calificar en 3 categorías (Lugar y Presencia, Físico, Servicio) del 1-7 con estrellas
2. ✅ Ver el promedio automático (Nota Final) de las 3 categorías
3. ✅ Escribir un comentario obligatorio (15-500 caracteres)
4. ✅ Enviar la calificación que se guarda y muestra en pantalla
5. ✅ Conversión automática de nota 1-7 a corazones 1-5 para ProfileAssessment

---

## 📁 Archivos Creados/Modificados

### ✨ NUEVO: `src/components/main/profile/RatingModal.vue`
Modal completo de calificación con:
- **3 categorías de estrellas** (📍 Lugar y Presencia, 💪 Físico, 🛎️ Servicio)
- **Escala 1-7** con estrellas interactivas (hover + click)
- **Nota Final automática** (promedio de las 3 categorías)
- **Comentario obligatorio** con validación (15-500 chars)
- **Contador de caracteres** con feedback visual
- **Validación completa** antes de enviar
- **Usuario de prueba** (TODO: integrar con authStore)
- **Fecha automática** en formato español
- **Responsive** con Flexbox y Tailwind
- **Tema oscuro** con borde dorado (#FFD700)
- **Conversión automática** de nota 1-7 a corazones 1-5

### 📝 MODIFICADO: `src/components/main/profile/ProfileQualifications.vue`
- ✅ Agregado estado `showRatingModal`
- ✅ Función `openRatingModal()` al hacer click en botón "Calificar"
- ✅ Función `closeRatingModal()` para cerrar modal
- ✅ Función `handleRatingSubmit()` para procesar calificación enviada
- ✅ Importación y uso del componente `RatingModal`

### 📝 MODIFICADO: `src/composables/useProfileStore.js`
- ✅ Agregado método `addComment(comment)` para agregar nuevos comentarios
- ✅ Método se exporta en el return del composable

### 📝 MODIFICADO: `src/icons/icon.js`
- ✅ Importado `faStar` (solid) para estrellas llenas
- ✅ Importado `farStar` (regular) para estrellas vacías
- ✅ Agregados ambos a la librería de Font Awesome

---

## 🎨 Características del Modal

### 1. **Header Fijo**
```vue
<div class="sticky top-0 bg-gray-900 border-b-2 border-[#FFD700]">
  <h2>⭐ Calificar Perfil</h2>
  <button>✕</button> <!-- Botón cerrar -->
</div>
```

### 2. **Usuario de Prueba**
```javascript
const currentUser = ref('Usuario Prueba')
// TODO: Reemplazar con authStore.user.nombre cuando esté listo
```

### 3. **Calificación por Categorías** (3 secciones)
Cada categoría muestra:
- Título con emoji (📍, 💪, 🛎️)
- Puntaje actual (X/7)
- 7 estrellas interactivas
- Hover effect (preview antes de seleccionar)
- Color dorado (#FFD700) para estrellas activas
- Color gris (#4B5563) para estrellas inactivas

### 4. **Nota Final (Promedio Automático)**
```javascript
const notaFinal = computed(() => {
  const avg = (lugar + fisico + servicio) / 3
  return Math.min(avg, 7.0).toFixed(1) // Máximo 7.0
})
```
- Se muestra en tarjeta destacada con borde dorado
- Actualización en tiempo real al cambiar calificaciones
- Formato: X.X/7

### 5. **Comentario con Validación**
```javascript
const isCommentValid = computed(() => {
  return commentLength >= 15 && commentLength <= 500
})
```
- Textarea responsive
- Placeholder descriptivo
- Borde rojo si inválido
- Borde dorado (#FFD700) al hacer focus
- Contador de caracteres dinámico:
  - Rojo si < 15 caracteres
  - Verde si ≥ 15 caracteres
  - Mensaje "✓ Válido" cuando cumple requisitos
- Máximo 500 caracteres

### 6. **Validación del Formulario**
```javascript
const isFormValid = computed(() => {
  return lugar > 0 && fisico > 0 && servicio > 0 && isCommentValid
})
```
El botón "Enviar Calificación" se:
- ✅ Habilita (dorado) cuando todo está completo
- ❌ Deshabilita (gris) si falta algo

### 7. **Conversión Automática a Corazones**
```javascript
// Convertir de escala 1-7 a 1-5
const heartsRating = Math.round((notaFinal / 7) * 5)
profileStore.addAssessment(heartsRating)
```

Ejemplo de conversión:
- Nota 7.0/7 → 5 corazones ❤️❤️❤️❤️❤️
- Nota 5.6/7 → 4 corazones ❤️❤️❤️❤️
- Nota 3.5/7 → 3 corazones ❤️❤️❤️

---

## 🔄 Flujo de Datos

```
Usuario hace click en "Calificar"
  └→ ProfileQualifications.vue abre modal (showRatingModal = true)
     └→ RatingModal.vue se muestra
        ├→ Usuario califica 3 categorías (1-7 estrellas)
        ├→ Nota Final se calcula automáticamente
        ├→ Usuario escribe comentario (15-500 chars)
        └→ Usuario hace click en "Enviar Calificación"
           ├→ Validación: ¿Todo completo?
           │  ├→ NO: Muestra alert
           │  └→ SÍ: Continúa
           ├→ Crea objeto newRating con:
           │  ├→ user: "Usuario Prueba"
           │  ├→ date: new Date().toLocaleDateString('es-ES')
           │  ├→ rating: notaFinal (1-7)
           │  ├→ category: 'general'
           │  ├→ comment: texto del comentario
           │  └→ ratings: { lugar, fisico, servicio }
           ├→ profileStore.addComment(newRating)
           ├→ Convierte nota a corazones (1-7 → 1-5)
           ├→ profileStore.addAssessment(heartsRating)
           ├→ Muestra alert de confirmación
           ├→ Cierra modal
           └→ ProfileComents.vue muestra nuevo comentario
              ProfileQualifications.vue muestra nuevos promedios
              ProfileAssessment.vue muestra nuevo promedio de corazones
```

---

## 📊 Estructura de Datos Guardada

### Comentario (va a profileComments)
```javascript
{
  user: "Usuario Prueba",
  date: "18/11/2025",
  rating: 6.2,
  category: "general",
  comment: "Excelente servicio, muy recomendado...",
  ratings: {
    lugar: 7,
    fisico: 6,
    servicio: 6
  }
}
```

### Valoración (va a profileAssessments)
```javascript
{
  hearts: 4, // Convertido de 6.2/7 a escala 1-5
  timestamp: "2025-11-18T12:34:56.789Z"
}
```

---

## 🎨 Estilos y Responsive

### Breakpoints de Tailwind
```css
/* Mobile (< 768px) */
text-xl, gap-1, p-4

/* Tablet (≥ 768px) */
md:text-2xl, md:gap-2, md:p-6

/* Desktop (≥ 1024px) */
lg:text-3xl

/* Extra Large (≥ 1280px) */
xl:text-5xl
```

### Colores del Proyecto
```css
--color-dorado: #FFD700;
--color-gris-oscuro: #1F2937;
--color-gris-medio: #374151;
--color-gris-claro: #9CA3AF;
--color-rojo: #EF4444;
--color-verde: #10B981;
```

### Scrollbar Personalizado
```css
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
  background: #1f2937;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #FFD700;
  border-radius: 4px;
}
```

---

## ✅ Checklist de Funcionalidad

- [x] Modal se abre al hacer click en "Calificar"
- [x] Modal se cierra al hacer click en X o fuera del modal
- [x] 3 categorías con 7 estrellas cada una
- [x] Hover preview en estrellas
- [x] Click para seleccionar estrellas
- [x] Nota final se calcula automáticamente
- [x] Comentario con validación 15-500 caracteres
- [x] Contador de caracteres dinámico
- [x] Botón "Enviar" habilitado solo si todo es válido
- [x] Fecha automática en formato español
- [x] Conversión de nota 1-7 a corazones 1-5
- [x] Guardado en profileStore (comments + assessments)
- [x] Alert de confirmación al enviar
- [x] Reset del formulario al cerrar
- [x] Responsive en mobile/tablet/desktop
- [x] Tema oscuro con bordes dorados
- [x] Accesibilidad (aria-labels)

---

## 🔧 TODOs para Producción

### 1. Integrar Usuario Real
```javascript
// En RatingModal.vue línea 15
import { useAuthStore } from '@/composables/useAuthStore'
const authStore = useAuthStore()
const currentUser = computed(() => authStore.user?.nombre || 'Anónimo')
```

### 2. Conectar con Backend
```javascript
// Agregar después de línea 101 en RatingModal.vue
const submitRating = async () => {
  // ... validaciones
  
  try {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRating)
    })
    
    if (!response.ok) throw new Error('Error al enviar')
    
    // Guardar en store local
    profileStore.addComment(newRating)
    // ... resto del código
  } catch (error) {
    alert('Error al enviar calificación: ' + error.message)
  }
}
```

### 3. Restringir a Una Calificación por Usuario
```javascript
// Agregar en useProfileStore.js
const hasUserRated = (userId) => {
  return profileComments.value.some(comment => comment.userId === userId)
}

// Usar en RatingModal antes de mostrar
if (profileStore.hasUserRated(authStore.user.id)) {
  alert('Ya has calificado este perfil')
  closeModal()
}
```

### 4. Persistencia en LocalStorage (opcional)
```javascript
// Agregar en useProfileStore.js
watch(profileComments, (newComments) => {
  localStorage.setItem('profileComments', JSON.stringify(newComments))
}, { deep: true })

// Al cargar
onMounted(() => {
  const saved = localStorage.getItem('profileComments')
  if (saved) profileComments.value = JSON.parse(saved)
})
```

---

## 🐛 Troubleshooting

### El modal no se abre
- ✅ Verificar que RatingModal esté importado en ProfileQualifications
- ✅ Verificar que showRatingModal cambie a true
- ✅ Ver consola del navegador por errores

### Las estrellas no se ven
- ✅ Verificar que icon.js tenga faStar y farStar
- ✅ Verificar import en main.js: `app.component('font-awesome-icon', FontAwesomeIcon)`
- ✅ Limpiar caché del navegador

### El comentario no se guarda
- ✅ Verificar que addComment esté en useProfileStore.js
- ✅ Verificar que ProfileComents reciba props.qualifications actualizado
- ✅ Ver consola: `console.log(profileStore.getComments())`

### La nota final no se calcula
- ✅ Verificar que las 3 categorías tengan valor > 0
- ✅ Ver computed notaFinal en DevTools de Vue
- ✅ Verificar Math.min(avg, 7.0)

---

## 📱 Capturas de Funcionalidad

### Estado Inicial
- Modal cerrado
- Botón "Calificar" visible

### Modal Abierto (Sin Calificar)
- Header con título y X
- Usuario de prueba
- 3 categorías con estrellas vacías (gris)
- Nota Final: 0.0/7
- Comentario vacío
- Botón "Enviar" deshabilitado (gris)

### Modal con Hover
- Estrellas cambian a dorado al pasar mouse
- Preview de calificación

### Modal Completo (Listo para Enviar)
- 3 categorías calificadas (estrellas doradas)
- Nota Final calculada (ej: 6.3/7)
- Comentario con 15+ caracteres
- Contador verde "✓ Válido"
- Botón "Enviar" habilitado (dorado)

### Después de Enviar
- Alert de confirmación
- Modal cerrado
- Comentario visible en ProfileComents
- Promedios actualizados en ProfileQualifications
- Corazones actualizados en ProfileAssessment

---

## 🎓 Cómo Usar

1. **Abrir Modal**
   ```vue
   <button @click="openRatingModal">Calificar</button>
   ```

2. **Calificar Categorías**
   - Click en estrellas (1-7)
   - Cada categoría independiente

3. **Escribir Comentario**
   - Mínimo 15 caracteres
   - Máximo 500 caracteres
   - Feedback visual del contador

4. **Enviar**
   - Botón se habilita automáticamente
   - Click en "Enviar Calificación"
   - Confirmación con alert

5. **Ver Resultados**
   - Comentario en ProfileComents (primeros 3)
   - Promedios en ProfileQualifications
   - Corazones en ProfileAssessment

---

**Fecha de implementación:** 18 de noviembre de 2025  
**Versión:** 1.0  
**Estado:** ✅ Funcional (modo prueba)  
**Próximo paso:** Integrar con authStore y backend
