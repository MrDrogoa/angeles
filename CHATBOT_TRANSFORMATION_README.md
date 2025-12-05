# 🤖 Transformación del Chatbot AYDA

## 📋 Resumen de Cambios

Se ha transformado completamente el chatbot de **AMIN** (Asistente de Hospedajes) a **AYDA** (Angeles y Demonios Asistente), cambiando su enfoque de búsqueda de hospedajes a búsqueda de perfiles de acompañantes.

---

## 🔄 Cambios Principales

### 1️⃣ Identidad del Bot

| Antes (AMIN) | Ahora (AYDA) |
|--------------|--------------|
| 🔥 Asistente de Hospedajes Inteligente | 💋 Angeles y Demonios Asistente |
| amin-transparente.webp | ayda-transparente.webp |
| Buscar hospedajes | Buscar perfiles de acompañantes |

### 2️⃣ Flujo de Búsqueda Actualizado

**Nuevo flujo de búsqueda:**

1. **Región** → Usuario selecciona: Norte, Centro o Sur
2. **Ciudad** → Usuario selecciona una de 8 ciudades en la región elegida
3. **Categoría** → Usuario selecciona: Enterprise 👑, VIP 💎, Premium ⭐, Top 🔥, Normal 💃
4. **Presupuesto** → Usuario ingresa su presupuesto máximo
5. **Resultados** → Bot muestra perfiles que coinciden con los criterios

### 3️⃣ Menú Principal Renovado

```
🗺️ Buscar por región
🏷️ Buscar por categoría
💰 Buscar por presupuesto
⭐ Ver agencias destacadas
❓ Ayuda
```

### 4️⃣ Nuevas Categorías

- **👑 Enterprise** - Exclusivo y premium
- **💎 VIP** - Experiencia de lujo
- **⭐ Premium** - Calidad superior
- **🔥 Top** - Las más solicitadas
- **💃 Normal** - Excelente relación calidad-precio

### 5️⃣ Regiones y Ciudades

#### 🌊 Norte
- Arica, Iquique, Antofagasta, Calama, Copiapó, Vallenar, Chañaral, Tocopilla

#### 🏙️ Centro
- La Serena, Coquimbo, Ovalle, Valparaíso, Viña del Mar, Santiago, Rancagua, Talca

#### 🏔️ Sur
- Concepción, Temuco, Valdivia, Puerto Montt, Osorno, Punta Arenas, Coyhaique, Castro

---

## 📁 Archivos Modificados

### ✅ Completamente Actualizados

1. **`config/botPersonality.js`**
   - Nombre: AMIN → AYDA
   - Avatar: amin-transparente.webp → ayda-transparente.webp
   - Emoji: 🔥 → 💋
   - Mensajes: hospedajes → perfiles
   - Categorías: 5 nuevas categorías con emojis
   - `searchMessages`: Agregados byRegion, byCity, byCategory actualizado
   - `profileMessages`: Reemplazó hospedajeMessages

2. **`components/boot/component/bot/ChatBot.vue`**
   - 4 referencias de imagen actualizadas
   - import Amin → import Ayda
   - Título: "Asistente de Reportes" → "Asistente AYDA"

3. **`components/boot/component/bot/ChatMessage.vue`**
   - Avatar del bot: amin-transparente.webp → ayda-transparente.webp

4. **`store/chatBotStore.js`**
   - Menú principal: 5 opciones nuevas (región, categoría, presupuesto, destacadas, ayuda)
   - `handleMenuSelection()`: Agregados casos para search_region, search_category, search_price, featured
   - `handleSearchFlow()`: Agregados casos 100-103 para manejar flujo región → ciudad → categoría → precio
   - `processMenuInput()`: Actualizado con nuevos flujos de búsqueda
   - `handleFlowStep()`: Agregados casos para search_region, search_category, search_price
   - Nuevos métodos:
     - `getCitiesByRegion()`: Retorna 8 ciudades según región
     - `searchProfiles()`: Busca perfiles según criterios (simulado por ahora)

5. **`services/BotPersonalityService.js`**
   - Agregado método `getProfileMessage()` para acceder a mensajes de perfiles

---

## 🔧 Funcionalidad Implementada

### ✅ Completado

- [x] Cambio de identidad del bot (AYDA)
- [x] Actualización de imágenes en todos los componentes
- [x] Menú principal con nuevas opciones
- [x] Flujo de búsqueda por región → ciudad → categoría → precio
- [x] Manejo de selección de regiones (Norte, Centro, Sur)
- [x] Listado de ciudades por región (8 ciudades cada una)
- [x] Selección de categorías (5 categorías con emojis)
- [x] Validación de presupuesto
- [x] Mensajes de agencias destacadas (beta)
- [x] Helpers: getCitiesByRegion(), searchProfiles()

### ⏳ Pendiente (No Crítico)

- [ ] Integración real con API de búsqueda de perfiles
- [ ] Actualizar hospedajeStore.js → profileStore.js
- [ ] Actualizar hospedajeRepository.js → profileRepository.js
- [ ] Actualizar ChatBotHospedajeService.js → ChatBotProfileService.js
- [ ] Mostrar resultados con enlaces a perfiles
- [ ] Implementar sistema de "agencias destacadas" real

---

## 🎯 Casos de Uso

### Ejemplo 1: Búsqueda por Región

```
Usuario: [Abre el chatbot]
AYDA: 💋 Hola! Soy AYDA, estoy aquí para ayudarte a encontrar perfiles...

Usuario: [Selecciona "Buscar por región"]
AYDA: 🗺️ ¿En qué región buscas?
      - 🌊 Norte
      - 🏙️ Centro
      - 🏔️ Sur

Usuario: [Selecciona "Centro"]
AYDA: 📍 Región Centro seleccionada. ¿En qué ciudad buscas?
      - 🌊 La Serena
      - 🏖️ Coquimbo
      - ... (8 ciudades)

Usuario: [Selecciona "Santiago"]
AYDA: Ciudad Santiago seleccionada. ¿Qué categoría te interesa?
      - 👑 Enterprise
      - 💎 VIP
      - ⭐ Premium
      - 🔥 Top
      - 💃 Normal

Usuario: [Selecciona "VIP"]
AYDA: 💎 VIP seleccionada. ¿Cuál es tu presupuesto máximo? (en $)

Usuario: 80000
AYDA: 🔍 Buscando perfiles...
      ✅ Encontré 3 perfiles en Santiago de categoría vip
      🔗 Ver perfiles disponibles en la sección principal
```

### Ejemplo 2: Búsqueda por Categoría

```
Usuario: [Selecciona "Buscar por categoría"]
AYDA: 🏷️ ¿Qué categoría prefieres?
      - 👑 Enterprise
      - 💎 VIP
      - ⭐ Premium
      - 🔥 Top
      - 💃 Normal

Usuario: [Selecciona "Enterprise"]
AYDA: 👑 Enterprise seleccionada. ¿Cuál es tu presupuesto máximo? (en $)
```

### Ejemplo 3: Agencias Destacadas

```
Usuario: [Selecciona "Ver agencias destacadas"]
AYDA: ⭐ Agencias Destacadas (Versión Beta)
      
      Estas agencias pagan para aparecer como recomendadas:
      
      💎 Agencia Premium 1
      📍 Santiago Centro
      💰 $45.000 - $80.000
      🔗 Ver perfil
      
      💎 Agencia VIP 2
      📍 Providencia
      💰 $50.000 - $100.000
      🔗 Ver perfil
```

---

## 🚀 Próximos Pasos

1. **Integración API**: Conectar `searchProfiles()` con el backend real
2. **Mostrar Resultados**: Formatear y mostrar perfiles en el chat con enlaces
3. **Renombrar Stores**: Actualizar nombres de archivos hospedaje → profile
4. **Testing**: Probar flujo completo end-to-end
5. **Agencias Premium**: Implementar sistema de pago para agencias destacadas

---

## 📝 Notas Técnicas

### Estructura de Datos de Búsqueda

```javascript
tempSearchData = {
  region: "region_centro",
  city: "Santiago",
  category: "vip",
  maxPrice: 80000
}
```

### Steps del Flujo

- **Step 1**: Selección inicial (search_region, search_category, search_price)
- **Step 100**: Selección de ciudad (después de región)
- **Step 101**: Selección de categoría (después de ciudad)
- **Step 102**: Entrada de presupuesto (después de categoría)
- **Step 103**: Búsqueda y resultados

### Métodos Principales

- `getCitiesByRegion(region)`: Retorna array de ciudades con formato { id, text, value }
- `searchProfiles()`: Ejecuta búsqueda con criterios en `tempSearchData`
- `handleSearchFlow(input, option)`: Maneja todo el flujo de búsqueda

---

## ✅ Verificación

Para verificar que todo está funcionando:

```bash
# 1. Revisar que no haya errores de sintaxis
npm run dev

# 2. Abrir el chatbot en el navegador
# 3. Probar cada opción del menú:
#    - Buscar por región
#    - Buscar por categoría
#    - Buscar por presupuesto
#    - Ver agencias destacadas
```

---

## 👥 Autor

**Transformación completada por:** GitHub Copilot
**Fecha:** Diciembre 2024
**Versión:** 1.0.0

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas sobre el chatbot AYDA, revisa:

1. `botPersonality.js` - Configuración de mensajes
2. `chatBotStore.js` - Lógica de conversación
3. Este documento README
