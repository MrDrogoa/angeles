# 🧪 Tests y Verificación del Foro - Fase 1

## ✅ Checklist de Pruebas

### 1. **Usuario de Prueba**
- [ ] Al cargar la página, se asigna un usuario aleatorio
- [ ] El usuario se guarda en localStorage
- [ ] El usuario persiste al recargar la página
- [ ] Se puede ver en consola: `localStorage.getItem('currentTestUser')`

### 2. **Crear Nuevo Post**
- [ ] El botón "Nuevo Post" abre el modal
- [ ] El modal solo muestra: Título y Comentario
- [ ] NO muestra campos de: Alias, Ciudad, Categoría
- [ ] Validación: No permite publicar sin título o comentario
- [ ] Al publicar, el post aparece inmediatamente en la lista
- [ ] El post muestra:
  - ✅ Nombre del usuario de prueba
  - ✅ Avatar emoji
  - ✅ Ubicación (ciudad, región)
  - ✅ Fecha relativa ("Hace X minutos/horas")
  - ✅ Categoría asignada aleatoriamente
  - ✅ Título y comentario ingresados
  - ✅ Likes: 0, Dislikes: 0, Comentarios: 0

### 3. **Estructura de Datos**
Verificar en consola:
```javascript
const posts = JSON.parse(localStorage.getItem('foroPosts'));
console.log(posts[0]);
```

Debe mostrar:
```javascript
{
  id: 1733184720000,
  author: {
    id: 5,
    name: "Andrés Silva",
    location: "Santiago, Centro",
    avatar: "👨‍🦱"
  },
  title: "Excelente experiencia",
  comment: "Todo fue increíble...",
  category: "Clientes", // o "Chicas" (aleatorio)
  city: "Santiago",
  date: "2024-12-02T...",
  likes: 0,
  dislikes: 0,
  commentsCount: 0,
  userVotes: {}
}
```

### 4. **Filtros (Fase 1)**
- [ ] Tabs de categorías funcionan:
  - "Todos" muestra todos los posts
  - "Clientes" filtra solo categoría Clientes
  - "Chicas" filtra solo categoría Chicas
- [ ] Filtro de ciudad funciona (accordion con regiones)
- [ ] Filtro de ordenamiento tiene 4 opciones:
  - ✅ Más recientes
  - ✅ Más votados
  - ✅ **Más populares** (NEW)
  - ✅ **Más comentados** (NEW)

### 5. **Fecha Relativa**
- [ ] Posts recién creados muestran "Hace unos segundos"
- [ ] Después de 1 min: "Hace X minutos"
- [ ] Después de 1 hora: "Hace X horas"
- [ ] Después de 1 día: "Hace X días"
- [ ] Después de 7 días: Fecha completa (ej: "15 Nov 2024")

### 6. **Votación (Preparación)**
- [ ] Botones de like/dislike están visibles
- [ ] Al hacer click, incrementa el contador (por ahora sin límite)
- [ ] Los votos se guardan en localStorage

### 7. **Múltiples Usuarios**
Para probar diferentes usuarios:
```javascript
// En consola del navegador:
localStorage.removeItem('currentTestUser');
location.reload(); // Asignará un nuevo usuario aleatorio
```

---

## 🎯 Escenarios de Prueba

### Escenario 1: Primer Usuario
1. Abrir http://localhost:8081/foro (o ruta correspondiente)
2. Verificar que se asigna un usuario de prueba
3. Crear 3 posts con diferentes títulos y comentarios
4. Verificar que todos tienen el mismo autor
5. Verificar diferentes categorías (Clientes/Chicas)

### Escenario 2: Cambiar de Usuario
1. Abrir consola del navegador
2. Ejecutar: `localStorage.removeItem('currentTestUser')`
3. Recargar la página
4. Crear 2 posts más
5. Verificar que tienen un autor diferente

### Escenario 3: Persistencia
1. Crear 5 posts
2. Cerrar el navegador
3. Volver a abrir http://localhost:8081/foro
4. Verificar que los 5 posts siguen ahí
5. Verificar que el mismo usuario está activo

### Escenario 4: Filtros Combinados
1. Crear posts de ambas categorías (Clientes y Chicas)
2. Filtrar por "Clientes" → Solo muestra Clientes
3. Agregar filtro de ciudad → Combina ambos filtros
4. Probar cada opción de ordenamiento

### Escenario 5: Fecha Relativa (Simulación)
Para simular posts antiguos:
```javascript
const posts = JSON.parse(localStorage.getItem('foroPosts'));
posts[0].date = new Date(Date.now() - 3600000).toISOString(); // Hace 1 hora
posts[1].date = new Date(Date.now() - 86400000).toISOString(); // Hace 1 día
posts[2].date = new Date(Date.now() - 864000000).toISOString(); // Hace 10 días
localStorage.setItem('foroPosts', JSON.stringify(posts));
location.reload();
```

---

## 🐛 Bugs Conocidos y Soluciones

### Bug: Usuario siempre es el mismo
**Solución:** Ejecutar en consola:
```javascript
localStorage.removeItem('currentTestUser');
location.reload();
```

### Bug: Posts no se guardan
**Verificar:**
1. Consola del navegador → Buscar errores
2. localStorage tiene espacio disponible
3. JSON.stringify funciona correctamente

### Bug: Fecha no se muestra correctamente
**Verificar:**
1. Archivo `utils/dateFormatter.js` existe
2. Está importado en `ForoCards.vue`
3. La función `formatRelativeDate` se llama correctamente

---

## 📊 Métricas de Éxito - Fase 1

| Criterio | Objetivo | Estado |
|----------|----------|--------|
| Crear posts | Solo título y comentario | ⏳ |
| Usuario de prueba | Asignado automáticamente | ⏳ |
| Autor visible | Nombre + ubicación + avatar | ⏳ |
| Fecha relativa | "Hace X minutos/horas/días" | ⏳ |
| Filtros | 4 opciones de ordenamiento | ⏳ |
| Persistencia | LocalStorage funcional | ⏳ |
| Categorías | Aleatorias Clientes/Chicas | ⏳ |

---

## 🚀 Comandos Útiles

### Limpiar todo y empezar de cero:
```javascript
localStorage.clear();
location.reload();
```

### Ver usuario actual:
```javascript
console.log(JSON.parse(localStorage.getItem('currentTestUser')));
```

### Ver todos los posts:
```javascript
console.log(JSON.parse(localStorage.getItem('foroPosts')));
```

### Simular 10 usuarios diferentes con posts:
```javascript
// Ejecutar en consola (después de implementar la Fase 5)
for (let i = 0; i < 10; i++) {
  localStorage.removeItem('currentTestUser');
  // Crear post manualmente
  location.reload();
}
```

---

## ✅ Validación Final

**Fase 1 está completa cuando:**
- ✅ Se puede crear un post con solo título y comentario
- ✅ El post muestra nombre, ubicación y avatar del usuario de prueba
- ✅ La fecha se muestra de forma relativa
- ✅ Los 4 filtros de ordenamiento funcionan
- ✅ Todo se guarda en localStorage y persiste
- ✅ No hay errores en consola

**Fecha de pruebas:** __________
**Probado por:** __________
**Estado:** ⏳ PENDIENTE / ✅ COMPLETO
