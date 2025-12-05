# 📋 Plan de Desarrollo del Foro - Ángeles y Demonios

## 🎯 Objetivo General
Crear un sistema de foro completo con posts, comentarios, votaciones y usuarios de prueba, preparado para integración futura con autenticación real.

---

## 📦 FASE 1: Simplificación del Formulario y Estructura Base
**Estado:** ✅ COMPLETADA

### Tareas:
- [x] Simplificar formulario de nuevo post (solo título y comentario)
- [x] Crear sistema de usuarios de prueba
- [x] Actualizar estructura de datos de posts
- [x] Agregar campos: `author` (nombre, ubicación), `commentsCount`
- [x] Mantener `likes`, `dislikes`, `category`, `city`, `date`
- [x] Agregar fecha relativa ("Hace X minutos/horas")
- [x] Agregar filtros "Más populares" y "Más comentados"

### Archivos modificados:
- ✅ `ForoComponents.vue` - Formulario simplificado, usuarios de prueba
- ✅ `ForoCards.vue` - Mostrar nombre, ubicación y fecha relativa

### Archivos creados:
- ✅ `services/testUsersService.js` - 15 usuarios de prueba
- ✅ `utils/dateFormatter.js` - Formato de fecha relativa
- ✅ `FORO_TESTS_FASE1.md` - Tests y validaciones

### Datos de prueba:
```javascript
{
  id: timestamp,
  author: {
    name: "Usuario de Prueba",
    location: "Santiago, Centro"
  },
  title: "string",
  comment: "string",
  category: "Clientes" | "Chicas",
  city: "string",
  date: ISOString,
  likes: number,
  dislikes: number,
  commentsCount: number,
  userVotes: {} // Control de votos únicos
}
```

---

## 📦 FASE 2: Sistema de Votación Única
**Estado:** ✅ COMPLETADA

### Tareas:
- [x] Implementar control de votos (un like/dislike por usuario)
- [x] Guardar estado de votación en localStorage
- [x] Prevenir múltiples votos del mismo usuario
- [x] Feedback visual cuando ya votó (íconos sólidos, colores)
- [x] Permitir cambiar de like a dislike y viceversa
- [x] Permitir remover voto (click en ícono activo)
- [x] Tooltips descriptivos
- [x] Animaciones y transiciones

### Estructura de votación:
```javascript
// localStorage: foroUserVotes
{
  [postId]: "like" | "dislike" | null
}
```

### Archivos modificados:
- ✅ `ForoComponents.vue` - Lógica de votación única
- ✅ `ForoCards.vue` - UI con estados visuales
- ✅ `icons/icon.js` - Íconos regular (outline)

### Archivos creados:
- ✅ `FORO_TESTS_FASE2.md` - Tests de votación

### Características:
- **Voto único:** Solo 1 like O 1 dislike por post
- **Cambio de voto:** Click en opción diferente cambia el voto
- **Remover voto:** Click en mismo botón remueve el voto
- **Persistencia:** Votos guardados en localStorage
- **Visual:** Íconos solid/outline, colores verde/rojo, escala 110%
- **UX:** Tooltips, transiciones suaves, hover effects

---

## 📦 FASE 3: Sistema de Comentarios
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Crear componente `PostDetail.vue` (vista individual del post)
- [ ] Implementar ruta `/foro/:postId`
- [ ] Crear formulario de comentarios
- [ ] Listar comentarios con respuestas anidadas (opcional)
- [ ] Sistema de votación en comentarios
- [ ] Contador de comentarios en tiempo real

### Estructura de comentarios:
```javascript
{
  id: timestamp,
  postId: number,
  author: {
    name: "string",
    location: "string"
  },
  comment: "string",
  date: ISOString,
  likes: number,
  dislikes: number
}
```

### Archivos a crear:
- `views/PostDetailView.vue`
- `components/PostComments.vue`
- `components/CommentCard.vue`

### Archivos a modificar:
- `router/index.js` - Agregar ruta `/foro/:postId`
- `ForoCards.vue` - Link al detalle del post

---

## 📦 FASE 4: Filtros Avanzados
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Agregar "Más populares" al ordenamiento (por likes)
- [ ] Agregar "Más comentados" al ordenamiento (por commentsCount)
- [ ] Mantener filtros existentes: Categorías, Ciudad, Recientes, Votados
- [ ] Combinar múltiples filtros

### Opciones de ordenamiento:
```javascript
sortOptions = [
  { value: "recientes", label: "Más recientes" },
  { value: "votados", label: "Más votados" },
  { value: "populares", label: "Más populares" }, // NEW
  { value: "comentados", label: "Más comentados" } // NEW
]
```

### Archivos a modificar:
- `ForoComponents.vue` - Lógica de filtros

---

## 📦 FASE 5: Usuarios de Prueba
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Crear servicio de usuarios de prueba
- [ ] Generar 10-15 usuarios ficticios
- [ ] Rotación aleatoria de usuarios al crear posts
- [ ] Simular diferentes ubicaciones (Norte, Centro, Sur)
- [ ] Preparar estructura para autenticación real

### Usuarios de prueba (ejemplos):
```javascript
[
  { id: 1, name: "Carlos Pérez", location: "Santiago, Centro" },
  { id: 2, name: "María González", location: "Valparaíso, Centro" },
  { id: 3, name: "Juan Soto", location: "Concepción, Sur" },
  { id: 4, name: "Ana López", location: "Antofagasta, Norte" },
  // ... más usuarios
]
```

### Archivos a crear:
- `services/testUsersService.js`

### Archivos a modificar:
- `ForoComponents.vue` - Usar servicio de usuarios

---

## 📦 FASE 6: Fecha Relativa
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Crear utilidad para formato de fecha relativa
- [ ] Mostrar "Hace X minutos/horas/días"
- [ ] Fallback a fecha completa después de 7 días

### Ejemplos:
- "Hace 5 minutos"
- "Hace 2 horas"
- "Hace 3 días"
- "15 Nov 2024" (después de 7 días)

### Archivos a crear:
- `utils/dateFormatter.js`

### Archivos a modificar:
- `ForoCards.vue` - Usar fecha relativa

---

## 📦 FASE 7: Testing y Optimización
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Test de creación de posts
- [ ] Test de votación única
- [ ] Test de comentarios
- [ ] Test de filtros combinados
- [ ] Optimización de rendimiento
- [ ] Validación de formularios
- [ ] Manejo de errores

### Tests a realizar:
1. Crear 20+ posts con usuarios diferentes
2. Votar múltiples veces (debe permitir solo 1 voto)
3. Cambiar entre like/dislike
4. Crear comentarios en posts
5. Filtrar por categoría + ciudad + ordenamiento
6. Verificar persistencia en localStorage

---

## 📦 FASE 8: Preparación para Producción
**Estado:** ⏳ PENDIENTE

### Tareas:
- [ ] Documentar estructura de datos
- [ ] Crear interfaces/types para TypeScript (opcional)
- [ ] Preparar endpoints para API real
- [ ] Migrar de localStorage a API
- [ ] Documentar integración con auth
- [ ] Limpieza de código y optimización

### Archivos a crear:
- `docs/FORO_API_ENDPOINTS.md`
- `docs/FORO_DATA_STRUCTURE.md`

---

## 🚀 Progreso General

| Fase | Estado | Progreso | Prioridad |
|------|--------|----------|-----------|
| 1. Estructura Base | 🟢 Completada | 100% | 🔴 Alta |
| 2. Votación Única | 🟢 Completada | 100% | 🔴 Alta |
| 3. Comentarios | ⚪ Pendiente | 0% | 🔴 Alta |
| 4. Filtros Avanzados | 🟢 Completada | 100% | 🟡 Media |
| 5. Usuarios de Prueba | 🟢 Completada | 100% | 🔴 Alta |
| 6. Fecha Relativa | 🟢 Completada | 100% | 🟢 Baja |
| 7. Testing | ⚪ Pendiente | 0% | 🟡 Media |
| 8. Producción | ⚪ Pendiente | 0% | 🟢 Baja |

---

## 📝 Notas Importantes

### LocalStorage Keys:
- `foroPosts` - Lista de posts
- `foroComments` - Lista de comentarios
- `foroUserVotes` - Votaciones del usuario actual
- `currentTestUser` - Usuario de prueba activo

### Próxima Integración (Futuro):
- Reemplazar usuarios de prueba con datos reales de auth
- Migrar localStorage a API REST
- Implementar paginación
- Agregar búsqueda de posts
- Notificaciones de nuevos comentarios
- Sistema de moderación

---

## 🎯 Fase Actual: FASE 3 - Sistema de Comentarios
**Siguiente paso:** Crear vista individual del post con sistema de comentarios

**Última actualización:** 4 Diciembre 2024

---

## 📝 Resumen FASE 1 Completada

### ✅ Lo que se implementó:
1. **Formulario simplificado** - Solo título y comentario
2. **15 usuarios de prueba** - Norte, Centro y Sur
3. **Fecha relativa** - "Hace X minutos/horas/días"
4. **Filtros avanzados** - 4 opciones de ordenamiento
5. **Estructura de datos completa** - author, commentsCount, userVotes

### 📁 Archivos nuevos:
- `services/testUsersService.js`
- `utils/dateFormatter.js`
- `FORO_TESTS_FASE1.md`
- `FORO_DEVELOPMENT_PHASES.md`

### 🔄 Archivos modificados:
- `ForoComponents.vue`
- `ForoCards.vue`

### 🧪 Testing:
Ver archivo `FORO_TESTS_FASE1.md` para pruebas completas.

---

## 📝 Resumen FASE 2 Completada

### ✅ Lo que se implementó:
1. **Sistema de voto único** - Solo 1 like O 1 dislike por post
2. **Cambio de voto** - Cambiar entre like/dislike automáticamente
3. **Remover voto** - Click en botón activo remueve el voto
4. **Persistencia** - Votos guardados en `localStorage: foroUserVotes`
5. **Feedback visual avanzado**:
   - Íconos solid cuando activo, outline cuando inactivo
   - Verde (#10B981) para like, Rojo (#EF4444) para dislike
   - Escala 110% cuando activo, 105% en hover
   - Tooltips descriptivos
6. **Transiciones suaves** - 300ms en todos los cambios

### 🎨 Mejoras UX:
- Íconos de FontAwesome regular (outline) y solid
- Estados visuales claros e intuitivos
- Animaciones sutiles pero efectivas
- Cursor pointer en todos los botones
- Tooltips que cambian según estado

### 🧪 Testing:
Ver archivo `FORO_TESTS_FASE2.md` para pruebas completas.
