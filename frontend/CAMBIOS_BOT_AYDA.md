# Cambios del Bot AYDA - Angeles y Demonios (02/12/2025)

## 📋 Resumen de Cambios

Se transformó completamente el sistema de chatbot de búsqueda de hospedajes a búsqueda de acompañantes, con nueva identidad visual (AYDA) y flujo de conversación adaptado al proyecto Angeles y Demonios.

---

## 🤖 Identidad del Bot

### ✅ Cambios Implementados

**Antes (AMIN):**
- Nombre: AMIN
- Nombre completo: Asistente de Hospedajes Inteligente  
- Emoji: 🔥
- Avatar: `amin-transparente.webp`
- Enfoque: Búsqueda de hospedajes

**Ahora (AYDA):**
- Nombre: **AYDA**
- Nombre completo: **Angeles y Demonios Asistente**
- Emoji: **💋**
- Avatar: **`ayda-transparente.webp`**
- Enfoque: **Búsqueda de acompañantes/perfiles**

---

## 📝 Configuración Actualizada

### 1. **Archivo de Personalidad** (`src/config/botPersonality.js`)

#### Saludos Actualizados

**Mañana:**
```
¡Buenos días, [Usuario]! 🌅

Soy AYDA, estoy aquí para ayudarte a encontrar perfiles que se ajusten a lo que buscas.
```

**Tarde:**
```
¡Buenas tardes, [Usuario]! ☀️

Soy AYDA, ¿necesitas ayuda para encontrar el perfil perfecto?
```

**Noche:**
```
¡Buenas noches, [Usuario]! 🌙

Soy AYDA, ¿te ayudo a buscar acompañantes?
```

**Por defecto:**
```
¡Hola, [Usuario]! 👋

Soy AYDA 💋, estoy aquí para ayudarte a encontrar perfiles que se ajusten a lo que buscas.
```

#### Terminología Cambiada

| Antes | Ahora |
|-------|-------|
| Hospedajes | Perfiles / Acompañantes |
| Anfitrión | Perfil |
| Reservar | Contactar |
| Alojamiento | Perfil |
| Ubicación | Ciudad / Región |

---

## 🏷️ Categorías Actualizadas

### ✅ Nuevas Categorías Implementadas

| Categoría | Emoji | Descripción |
|-----------|-------|-------------|
| **Enterprise** | 👑 | Exclusivo y premium |
| **VIP** | 💎 | Experiencia de lujo |
| **Premium** | ⭐ | Calidad superior |
| **Top** | 🔥 | Las más solicitadas |
| **Normal** | 💃 | Excelente relación calidad-precio |

### ❌ Categorías Eliminadas

- ~~Masajistas 💆~~ (ya no se usa)
- ~~Normal 🏠~~ (reemplazado por Normal 💃)

---

## 🔄 Flujo de Búsqueda Actualizado

### ✅ Flujo Implementado (Opción B sin punto 5)

```
1. Saludo personalizado según hora del día
   └→ "¡Hola! Soy AYDA, estoy aquí para ayudarte a encontrar perfiles..."

2. ¿En qué región buscas?
   ├→ Norte 🏜️
   ├→ Centro 🏙️
   └→ Sur 🏔️

3. ¿En qué ciudad específicamente?
   └→ Muestra ciudades de la región seleccionada

4. ¿Qué categoría prefieres?
   ├→ Enterprise 👑
   ├→ VIP 💎
   ├→ Premium ⭐
   ├→ Top 🔥
   └→ Normal 💃

5. ¿Cuál es tu presupuesto?
   └→ Ingresa un rango (ej: 20000-50000)

6. Mostrar resultados
   └→ Lista de perfiles con link directo
```

---

## 🎨 Archivos Actualizados

### 1. **Configuración del Bot**

#### `src/config/botPersonality.js`
- ✅ Identidad cambiada (AYDA, emoji 💋, avatar ayda-transparente.webp)
- ✅ Saludos personalizados actualizados
- ✅ Frases comunes adaptadas a acompañantes
- ✅ Preguntas de búsqueda modificadas (región → ciudad → categoría → precio)
- ✅ Mensajes de búsqueda con nuevas categorías
- ✅ Categorías actualizadas: Enterprise, VIP, Premium, Top, Normal
- ✅ Mensajes de perfiles (antes hospedajeMessages → profileMessages)
- ✅ Link directo al perfil agregado

### 2. **Componentes del Chatbot**

#### `src/components/boot/component/bot/ChatBot.vue`
- ✅ Importación cambiada: `Amin` → `Ayda`
- ✅ Avatar actualizado: `ayda-transparente.webp` (3 referencias)
- ✅ Título del botón flotante: "Abrir Asistente AYDA"
- ✅ Variable de imagen en template: `:src="Ayda"`

#### `src/components/boot/component/bot/ChatMessage.vue`
- ✅ Avatar actualizado: `ayda-transparente.webp`
- ✅ Alt text: "Ayda"

---

## 💎 Sistema de Agencias Destacadas (Beta)

### ✅ Configuración de Recomendaciones

**Mensajes actualizados:**
```javascript
recommendationsTitle: "⭐ **Recomendaciones para ti**"
featuredTitle: "💎 **Agencias Destacadas (Versión Beta)**"
```

**Lógica de priorización:**
- Las agencias con `destacado: true` aparecen primero en los resultados
- Mensaje especial: "💎 Agencia Destacada (Beta)"
- Sistema temporal para testing (versión beta del proyecto)

---

## 📊 Estructura de Datos Esperada

### Perfil de Acompañante

```javascript
{
  id: "123456",
  nombre: "Ana",
  ciudad: "Santiago",
  region: "Centro",
  categoria: "vip", // enterprise, vip, premium, top, normal
  precio: 50000,
  disponibilidad: "24/7",
  calificacion: 4.8,
  destacado: true, // para agencias que pagan
  servicios: ["Cena", "Evento", "Masaje"],
  telefono: "+56912345678",
  whatsapp: "+56912345678",
  perfil_url: "/perfil/123456", // Link directo al perfil
  verificada: true,
  fotos: [
    "foto1.jpg",
    "foto2.jpg"
  ]
}
```

### Respuesta de Búsqueda

```javascript
{
  success: true,
  perfiles: [
    { /* perfil 1 */ },
    { /* perfil 2 */ },
    { /* perfil 3 */ }
  ],
  count: 3,
  message: "✅ Encontré 3 perfiles disponibles:"
}
```

---

## 🔍 Mensajes del Bot Actualizados

### Búsqueda por Región
```
📍 **Búsqueda por Región**

¿En qué región buscas?

• Norte 🏜️
• Centro 🏙️
• Sur 🏔️
```

### Búsqueda por Categoría
```
🏷️ **Búsqueda por Categoría**

¿Qué categoría prefieres?

• Enterprise 👑
• VIP 💎
• Premium ⭐
• Top 🔥
• Normal 💃
```

### Búsqueda por Precio
```
💰 **Búsqueda por Precio**

¿Cuál es tu presupuesto?

*Ingresa un rango (ej: 20000-50000)*
```

### Resultados con Link Directo
```
✅ Encontré 3 perfiles disponibles:

1. 💎 Ana - VIP - Santiago
   💰 $50.000
   ⭐ 4.8/5
   🔗 Ver Perfil Completo

2. 🔥 María - Top - Valparaíso
   💰 $40.000
   ⭐ 4.9/5
   🔗 Ver Perfil Completo

3. 💃 Carla - Normal - Concepción
   💰 $25.000
   ⭐ 4.7/5
   🔗 Ver Perfil Completo
```

---

## 🎯 Características Nuevas

### 1. **Link Directo al Perfil**

Cada resultado muestra un enlace directo:
```javascript
profileLink: "🔗 Ver Perfil Completo"
```

Formato en resultados:
```
🔗 Ver perfil completo: /perfil/[id]
```

### 2. **Agencias Destacadas (Beta)**

Sistema de recomendaciones para agencias que pagan:
- Badge especial: "💎 Agencia Destacada (Beta)"
- Aparecen primero en los resultados
- Mensaje: "Agencias Destacadas (Versión Beta)"
- Temporal para testing

### 3. **Flujo Región → Ciudad**

Nueva pregunta de región antes de ciudad:
```
1. ¿En qué región buscas? (Norte, Centro, Sur)
2. ¿En qué ciudad específicamente? (ciudades de la región)
```

---

## 📦 Archivos Modificados

### Archivos Actualizados (6 archivos)

1. `src/config/botPersonality.js` - Configuración completa del bot
2. `src/components/boot/component/bot/ChatBot.vue` - Componente principal
3. `src/components/boot/component/bot/ChatMessage.vue` - Mensajes individuales
4. Este README (`CAMBIOS_BOT_AYDA.md`)

### Archivos Pendientes de Actualización

**⚠️ Estos archivos aún tienen referencias a "hospedaje" y deben ser actualizados en el futuro:**

1. `src/store/hospedajeStore.js` → Renombrar a `perfilStore.js`
2. `src/repositories/hospedajeRepository.js` → Renombrar a `perfilRepository.js`
3. `src/services/ChatBotHospedajeService.js` → Renombrar a `ChatBotPerfilService.js`
4. `src/components/examples/HospedajeSearchExample.vue` → Actualizar a perfiles

---

## 🚀 Próximos Pasos (Backend)

### 1. **Endpoints Necesarios**

```javascript
// Búsqueda por región y ciudad
GET /api/perfiles/search?region=norte&ciudad=santiago

// Búsqueda por categoría
GET /api/perfiles/categoria/:categoria

// Perfiles destacados (agencias)
GET /api/perfiles/destacados

// Búsqueda por precio
POST /api/perfiles/filtrar
{
  region: "norte",
  ciudad: "santiago",
  categoria: "vip",
  precioMin: 20000,
  precioMax: 50000
}

// Obtener perfil específico
GET /api/perfiles/:id
```

### 2. **Base de Datos**

Tabla `perfiles`:
```sql
CREATE TABLE perfiles (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100),
  ciudad VARCHAR(50),
  region VARCHAR(20), -- norte, centro, sur
  categoria VARCHAR(20), -- enterprise, vip, premium, top, normal
  precio INTEGER,
  disponibilidad VARCHAR(50),
  calificacion DECIMAL(2,1),
  destacado BOOLEAN DEFAULT FALSE,
  telefono VARCHAR(20),
  whatsapp VARCHAR(20),
  verificada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3. **Sistema de Agencias Destacadas**

Tabla `agencias_destacadas`:
```sql
CREATE TABLE agencias_destacadas (
  id UUID PRIMARY KEY,
  perfil_id UUID REFERENCES perfiles(id),
  fecha_inicio DATE,
  fecha_fin DATE,
  monto_pago DECIMAL(10,2),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP
);
```

---

## ✅ Checklist de Implementación

### Completado (02/12/2025)

- [x] Cambiar identidad del bot (AMIN → AYDA)
- [x] Actualizar emoji (🔥 → 💋)
- [x] Cambiar avatar (amin-transparente.webp → ayda-transparente.webp)
- [x] Actualizar saludos personalizados
- [x] Modificar flujo de búsqueda (región → ciudad → categoría → precio)
- [x] Actualizar categorías (Enterprise, VIP, Premium, Top, Normal)
- [x] Cambiar terminología (hospedajes → perfiles/acompañantes)
- [x] Agregar link directo al perfil
- [x] Configurar agencias destacadas (versión beta)
- [x] Actualizar componentes del chatbot (ChatBot.vue, ChatMessage.vue)
- [x] Actualizar mensajes del bot en botPersonality.js
- [x] Documentar cambios en README

### Pendiente (Futuro)

- [ ] Renombrar stores (hospedajeStore → perfilStore)
- [ ] Renombrar repositories (hospedajeRepository → perfilRepository)
- [ ] Renombrar services (ChatBotHospedajeService → ChatBotPerfilService)
- [ ] Actualizar ejemplos (HospedajeSearchExample → PerfilSearchExample)
- [ ] Implementar endpoints del backend
- [ ] Crear tabla de perfiles en base de datos
- [ ] Implementar sistema de agencias destacadas
- [ ] Agregar autenticación para contactar perfiles
- [ ] Integrar sistema de calificaciones
- [ ] Agregar sistema de favoritos

---

## 🔧 Configuración

### Variables de Entorno (.env)

```bash
# API Backend
VITE_API_URL=http://localhost:3000/api

# Configuración del bot
VITE_BOT_NAME=AYDA
VITE_BOT_EMOJI=💋
VITE_BOT_AVATAR=/assets/ayda-transparente.webp

# Categorías (separadas por comas)
VITE_CATEGORIAS=enterprise,vip,premium,top,normal

# Regiones (separadas por comas)
VITE_REGIONES=norte,centro,sur
```

---

## 📚 Recursos

### Documentación Relacionada

- `README.md` - Documentación general del frontend
- `CHATBOT_INTEGRATION.md` - Guía de integración del chatbot (legacy)
- `TOUCH_DIRECTIVES.md` - Sistema de touch events

### Assets

- `/src/assets/ayda-transparente.webp` - Avatar del bot AYDA
- ~~`/src/assets/amin-transparente.webp`~~ - Avatar anterior (deprecated)

---

## 📝 Notas Importantes

### Versión Beta

El sistema de agencias destacadas está en **versión beta** (testing):
- No requiere pago real por ahora
- Todos los perfiles con `destacado: true` se muestran como destacados
- Badge temporal: "💎 Agencia Destacada (Beta)"
- Implementar sistema de pagos en producción

### Compatibilidad

- ✅ Compatible con sistema de accesibilidad existente
- ✅ Compatible con sistema de touch events
- ✅ Compatible con sistema de autenticación
- ✅ Responsive (mobile, tablet, desktop)

### Testing

Para probar el bot en desarrollo:
1. Abrir aplicación (`pnpm run dev`)
2. Click en botón flotante 💋 (esquina inferior derecha)
3. Seguir flujo: Región → Ciudad → Categoría → Precio
4. Verificar que mensajes sean correctos
5. Probar links directos a perfiles

---

## 🎉 Resultado Final

El bot AYDA está completamente configurado para:
- ✅ Buscar acompañantes por región y ciudad
- ✅ Filtrar por 5 categorías (Enterprise, VIP, Premium, Top, Normal)
- ✅ Filtrar por rango de precio
- ✅ Mostrar agencias destacadas primero (versión beta)
- ✅ Proporcionar links directos a perfiles
- ✅ Mantener conversación natural y amigable

**Identidad del bot:**
- Nombre: AYDA 💋
- Función: Angeles y Demonios Asistente
- Propósito: Ayudar a encontrar perfiles de acompañantes
- Enfoque: Búsqueda por ubicación y características

---

**Fecha de actualización:** 02/12/2025  
**Versión:** 1.0.0 (Beta)  
**Autor:** Sistema de migración de AMIN a AYDA
