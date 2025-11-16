# 🔐 Instrucciones para Activar/Desactivar Autenticación del Chatbot AMIN

## 📍 Ubicación del Archivo
**Archivo:** `frontend/src/components/boot/component/bot/ChatBot.vue`

---

## ✅ Estado Actual: AUTENTICACIÓN DESACTIVADA (Para Testing)

El chatbot está visible para todos sin necesidad de iniciar sesión.

---

## 🔄 Cómo REVERTIR (Activar autenticación en producción)

### Paso 1: Abrir el archivo
```
frontend/src/components/boot/component/bot/ChatBot.vue
```

### Paso 2: Ir a la línea 2-5 del template
**Busca estas líneas:**
```vue
<!-- Solo mostrar el bot si el usuario está autenticado -->
<!-- TEMPORAL: Comentado para testing - descomentar en producción -->
<!-- <div v-if="isUserAuthenticated"> -->
<div>
```

**Cámbialas por:**
```vue
<!-- Solo mostrar el bot si el usuario está autenticado -->
<div v-if="isUserAuthenticated">
```

### Paso 3: Ir a la línea 203-204 (casi al final del template)
**Busca estas líneas:**
```vue
    </div>
    <!-- TEMPORAL: Cerrado anticipadamente para testing -->
  </div>
```

**Cámbialas por:**
```vue
    </div>
  </div>
```

### Paso 4: Guardar y reiniciar el servidor
```bash
# Detener el servidor (Ctrl+C)
# Volver a iniciar
pnpm run dev
```

---

## ⚙️ Explicación Técnica

### Variables involucradas:
- **Línea 254**: `const isUserAuthenticated = computed(() => authStore.isAuthenticated);`
  - Esta línea verifica si hay un usuario autenticado
  - NO la modifiques, solo se usa cuando activas la autenticación

### Lógica:
- Cuando `<div v-if="isUserAuthenticated">` está activo:
  - El chatbot solo se muestra si `authStore.isAuthenticated` es `true`
  - Requiere login exitoso
  
- Cuando `<div>` está sin condición (actual):
  - El chatbot se muestra siempre
  - No requiere autenticación

---

## 📝 Resumen Rápido

### Para DESACTIVAR autenticación (testing):
1. Línea 4: `<!-- <div v-if="isUserAuthenticated"> -->`
2. Línea 5: `<div>`
3. Línea 204: `<!-- TEMPORAL: Cerrado anticipadamente para testing -->`

### Para ACTIVAR autenticación (producción):
1. Línea 3: `<div v-if="isUserAuthenticated">`
2. Eliminar línea extra del div
3. Eliminar comentario temporal

---

## 🚀 Estado Actual del Sistema

✅ Chatbot visible sin autenticación
✅ Puedes hacer preguntas sobre hospedajes
✅ Sistema de búsqueda funcional
✅ Recomendaciones activas

⚠️ Para producción: Reactivar autenticación siguiendo los pasos de arriba

---

## 🔍 Otros Archivos del Chatbot (No requieren cambios)

Estos archivos están listos y funcionando:

- `ChatMessage.vue` — Muestra mensajes del bot y usuario
- `QuickReply.vue` — Botones de respuesta rápida
- `ChatBotNavigation.vue` — Navegación breadcrumbs
- `ProgressIndicator.vue` — Barra de progreso
- `EditableField.vue` — Campos editables
- `ReportConfirmation.vue` — Confirmación de reportes
- `ReportSummary.vue` — Resumen de reportes
- `ReportViewModal.vue` — Modal de visualización
- `ExpressReportDetails.vue` — Detalles de reportes express
- `ReportDetails.vue` — Detalles de reportes estándar
- `ChatBotRealTimeInput.vue` — Input con validación en tiempo real

**Ninguno de estos archivos requiere modificaciones para activar/desactivar autenticación.**

---

## 💡 Tip: Verificar que funciona

1. Inicia el servidor: `pnpm run dev`
2. Abre el navegador en `http://localhost:5173` (o el puerto que uses)
3. Deberías ver el **botón flotante dorado** en la esquina inferior derecha
4. Haz clic y el chatbot se abrirá
5. Prueba escribiendo "Hola" o "Buscar hospedaje"

---

**Fecha de última actualización:** 16 de Noviembre, 2025
