# 🧪 Tests y Verificación del Foro - Fase 2: Votación Única

## ✅ Checklist de Pruebas

### 1. **Sistema de Voto Único**
- [ ] Al hacer click en like, el contador incrementa en 1
- [ ] El ícono cambia a verde (sólido) cuando está activo
- [ ] Al hacer click de nuevo en like, el voto se remueve
- [ ] El contador decrementa en 1 al remover el voto
- [ ] El ícono vuelve a gris (outline) cuando se remueve

### 2. **Cambio de Voto**
- [ ] Dar like a un post
- [ ] Dar dislike al mismo post
- [ ] Verificar que el like se remueve automáticamente
- [ ] Verificar que el dislike se agrega
- [ ] El contador de likes baja en 1
- [ ] El contador de dislikes sube en 1

### 3. **Persistencia de Votos**
- [ ] Dar like a 3 posts diferentes
- [ ] Recargar la página (F5)
- [ ] Verificar que los 3 likes siguen activos (verdes)
- [ ] Verificar que los contadores se mantienen

### 4. **Feedback Visual**
- [ ] Like activo: ícono verde sólido, escala 110%
- [ ] Dislike activo: ícono rojo sólido, escala 110%
- [ ] Sin voto: ícono gris outline, escala 100%
- [ ] Hover sobre like sin votar: verde con escala 105%
- [ ] Hover sobre dislike sin votar: rojo con escala 105%

### 5. **Tooltips**
- [ ] Hover sobre like sin votar: muestra "Me gusta"
- [ ] Hover sobre like ya votado: muestra "Quitar me gusta"
- [ ] Hover sobre dislike sin votar: muestra "No me gusta"
- [ ] Hover sobre dislike ya votado: muestra "Quitar no me gusta"

### 6. **LocalStorage**
Verificar en consola:
```javascript
// Ver votos del usuario actual
console.log(JSON.parse(localStorage.getItem('foroUserVotes')));

// Debe mostrar algo como:
{
  "1733184720000": "like",
  "1733184730000": "dislike",
  "1733184740000": "like"
}
```

### 7. **Múltiples Usuarios**
- [ ] Crear posts con un usuario
- [ ] Votar en esos posts
- [ ] Cambiar de usuario (ver comandos abajo)
- [ ] Verificar que los votos se reinician
- [ ] Votar con el nuevo usuario
- [ ] Cambiar de vuelta al primer usuario
- [ ] Verificar que los votos originales siguen ahí

---

## 🎯 Escenarios de Prueba

### Escenario 1: Votación Básica
1. Crear 5 posts nuevos
2. Dar like al post 1
3. Dar dislike al post 2
4. Dar like al post 3
5. Verificar contadores correctos
6. Verificar íconos de colores apropiados

**Resultado esperado:**
- Post 1: 1 like (verde), 0 dislikes
- Post 2: 0 likes, 1 dislike (rojo)
- Post 3: 1 like (verde), 0 dislikes
- Posts 4 y 5: Sin votos (grises)

### Escenario 2: Cambio de Voto
1. Dar like al post 1
2. Verificar: 1 like, ícono verde
3. Dar dislike al mismo post
4. Verificar: 0 likes, 1 dislike, ícono rojo
5. Dar dislike de nuevo (remover)
6. Verificar: 0 likes, 0 dislikes, ícono gris

**Resultado esperado:**
- Los contadores cambian correctamente
- Solo un tipo de voto está activo a la vez
- Se puede remover el voto haciendo click de nuevo

### Escenario 3: Persistencia
1. Dar like a 3 posts
2. Dar dislike a 2 posts
3. Abrir DevTools → Application → Local Storage
4. Verificar key: `foroUserVotes`
5. Cerrar navegador completamente
6. Volver a abrir http://localhost:8081/foro
7. Verificar que los 5 votos siguen activos

**Resultado esperado:**
- Todos los votos se mantienen después de cerrar/abrir
- Los íconos se mantienen en color (verde/rojo)
- Los contadores son correctos

### Escenario 4: Usuario Diferente
1. Votar en varios posts
2. Ejecutar en consola:
```javascript
localStorage.removeItem('currentTestUser');
localStorage.removeItem('foroUserVotes');
location.reload();
```
3. Verificar que ahora es un usuario diferente
4. Verificar que NO hay votos activos (todos grises)
5. Los contadores de los posts se mantienen
6. Votar con el nuevo usuario
7. Verificar que los votos del nuevo usuario funcionan

**Resultado esperado:**
- Cada usuario tiene su propio registro de votos
- Los votos totales del post se acumulan
- Cambiar de usuario no afecta los votos totales

### Escenario 5: Remover Votos
1. Dar like a 5 posts
2. Verificar: 5 íconos verdes
3. Hacer click en cada like nuevamente
4. Verificar: 5 íconos grises
5. Verificar contadores vuelven a 0 (si nadie más votó)

**Resultado esperado:**
- Se puede deshacer cualquier voto
- El contador decrementa correctamente
- El ícono vuelve a outline gris

### Escenario 6: Ordenamiento por Popularidad
1. Crear 5 posts
2. Dar diferentes cantidades de likes/dislikes:
   - Post 1: 5 likes, 0 dislikes (popularidad: +5)
   - Post 2: 3 likes, 1 dislike (popularidad: +2)
   - Post 3: 2 likes, 4 dislikes (popularidad: -2)
   - Post 4: 0 likes, 0 dislikes (popularidad: 0)
   - Post 5: 1 like, 0 dislikes (popularidad: +1)
3. Cambiar ordenamiento a "Más populares"
4. Verificar orden: Post 1, Post 2, Post 5, Post 4, Post 3

**Resultado esperado:**
- El ordenamiento por popularidad usa (likes - dislikes)
- Los posts se ordenan de mayor a menor popularidad

---

## 🐛 Debugging

### Ver estado completo en consola:
```javascript
// Posts con votos
const posts = JSON.parse(localStorage.getItem('foroPosts'));
console.table(posts.map(p => ({
  id: p.id,
  title: p.title.substring(0, 20),
  likes: p.likes,
  dislikes: p.dislikes,
  popularidad: p.likes - p.dislikes
})));

// Votos del usuario
const votes = JSON.parse(localStorage.getItem('foroUserVotes'));
console.log('Mis votos:', votes);

// Usuario actual
const user = JSON.parse(localStorage.getItem('currentTestUser'));
console.log('Usuario actual:', user.name);
```

### Resetear votos pero mantener posts:
```javascript
localStorage.removeItem('foroUserVotes');
location.reload();
```

### Simular votos de múltiples usuarios:
```javascript
// Manualmente agregar likes/dislikes a un post
const posts = JSON.parse(localStorage.getItem('foroPosts'));
posts[0].likes = 5;
posts[0].dislikes = 2;
localStorage.setItem('foroPosts', JSON.stringify(posts));
location.reload();
```

---

## 📊 Validación de Estados

### Estado 1: Sin votar
```
Ícono: thumbs-up (outline)
Color: Gris (#9CA3AF)
Escala: 100%
Tooltip: "Me gusta"
```

### Estado 2: Like activo
```
Ícono: thumbs-up (solid)
Color: Verde (#10B981)
Escala: 110%
Tooltip: "Quitar me gusta"
```

### Estado 3: Dislike activo
```
Ícono: thumbs-down (solid)
Color: Rojo (#EF4444)
Escala: 110%
Tooltip: "Quitar no me gusta"
```

---

## ✅ Criterios de Aceptación

### La Fase 2 está completa cuando:

1. ✅ **Voto único por usuario**
   - Solo se puede dar 1 like O 1 dislike por post
   - No ambos al mismo tiempo

2. ✅ **Cambio de voto**
   - Se puede cambiar de like a dislike
   - Se puede cambiar de dislike a like
   - El contador se ajusta correctamente

3. ✅ **Remover voto**
   - Click en like/dislike activo lo remueve
   - El contador decrementa
   - El ícono vuelve a gris

4. ✅ **Persistencia**
   - Los votos se guardan en localStorage
   - Se mantienen al recargar la página
   - Son específicos del usuario

5. ✅ **Feedback visual claro**
   - Íconos sólidos cuando están activos
   - Colores distintivos (verde/rojo)
   - Animación de escala
   - Tooltips informativos

6. ✅ **Sin errores en consola**
   - No hay errores JavaScript
   - No hay warnings de Vue
   - LocalStorage funciona correctamente

---

## 🎨 Mejoras Implementadas

### Visual:
- ✅ Íconos solid/outline según estado
- ✅ Colores verde (like) y rojo (dislike)
- ✅ Escala 110% cuando está activo
- ✅ Transiciones suaves (300ms)
- ✅ Hover con escala 105%

### Funcional:
- ✅ Sistema de voto único
- ✅ Cambio de voto permitido
- ✅ Remover voto permitido
- ✅ Persistencia en localStorage
- ✅ Sincronización con usuario actual

### UX:
- ✅ Tooltips descriptivos
- ✅ Cursor pointer
- ✅ Estados claros e intuitivos
- ✅ Feedback inmediato

---

## 📝 Checklist Final

Antes de marcar como completa, verificar:

- [ ] Crear 10 posts de prueba
- [ ] Votar en todos (mix de likes/dislikes)
- [ ] Cambiar algunos votos
- [ ] Remover algunos votos
- [ ] Recargar página → Votos persisten
- [ ] Cambiar usuario → Votos se resetean
- [ ] Volver al primer usuario → Votos originales vuelven
- [ ] Probar ordenamiento "Más populares"
- [ ] Probar ordenamiento "Más votados"
- [ ] Sin errores en consola
- [ ] Íconos se muestran correctamente
- [ ] Colores son los correctos
- [ ] Tooltips funcionan

---

**Estado:** ⏳ PENDIENTE
**Fecha de pruebas:** __________
**Probado por:** __________
**Resultado:** ⏳ / ✅ APROBADO / ❌ RECHAZADO
