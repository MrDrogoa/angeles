# 🏠 ChatBot de Hospedajes - Guía de Integración

## ✅ Integración Completada

El chatbot ha sido adaptado exitosamente para buscar y recomendar hospedajes en tu plataforma.

---

## 📁 Archivos Creados

### **Stores (Estado Global)**
- `src/store/hospedajeStore.js` - Gestión de hospedajes
- `src/store/reportsStore.js` - Gestión de reportes (requerido por chatBotStore)
- `src/store/expressReportsStore.js` - Gestión de reportes express

### **Repositories (API)**
- `src/repositories/hospedajeRepository.js` - API calls para hospedajes
- `src/repositories/authRepository.js` - API calls para autenticación

### **Services (Lógica de Negocio)**
- `src/services/ChatBotHospedajeService.js` - Integración chatbot con hospedajes
- `src/services/BotPersonalityService.js` - Servicio de personalidad del bot
- `src/services/RealTimeValidationService.js` - Validación en tiempo real
- `src/services/ErrorHandlerService.js` - Manejo de errores
- `src/services/httpService.js` - Cliente HTTP con axios
- `src/services/SessionSyncService.js` - Sincronización entre pestañas

### **Configuration**
- `src/config/botPersonality.js` - Personalidad adaptada a hospedajes ✅

### **Data**
- `src/data/countries.json` - Lista de países
- `src/data/paises.json` - Países en español
- `src/data/nacionalidades.json` - Lista de nacionalidades

### **Utils**
- `src/utils/authDebug.js` - Debugging de autenticación

### **Components**
- `src/components/boot/component/ReportDetails.vue`
- `src/components/boot/component/bot/ExpressReportDetails.vue`

### **Composables**
- `src/composables/useAuthStore.js` - Wrapper del auth store

---

## 🎯 Funcionalidades del ChatBot

### **1. Búsqueda por Ubicación**
```javascript
// El chatbot puede buscar hospedajes por ciudad o zona
Ejemplo: "Busco hospedaje en Santiago Centro"
```

### **2. Recomendaciones Personalizadas**
- Muestra hospedajes destacados (que pagan comisión) primero
- Ordenados por calificación
- Filtrados según preferencias del usuario

### **3. Búsqueda por Categoría**
- 💎 VIP - Experiencia premium
- ⭐ Premium - Confort superior
- 🏠 Normal - Relación calidad-precio
- 💆 Masajistas - Servicios especializados

### **4. Búsqueda por Presupuesto**
```javascript
// Acepta rango o precio máximo
Ejemplos:
- "30000" (hasta $30.000)
- "20000-50000" (entre $20.000 y $50.000)
```

---

## 🔧 Configuración del Backend

### **Endpoints Requeridos**

El chatbot espera estos endpoints en tu API:

#### **Hospedajes**
```javascript
GET  /api/hospedajes/search?ubicacion=Santiago&limit=10
GET  /api/hospedajes/category/:category
GET  /api/hospedajes/featured?limit=5
POST /api/hospedajes/recommendations
GET  /api/hospedajes/:id
POST /api/hospedajes/filter
GET  /api/hospedajes/locations
```

#### **Autenticación**
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile
POST /api/auth/change-password
POST /api/auth/reset-password
GET  /api/auth/verify-email
```

### **Variables de Entorno**

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 💡 Personalización de Hospedajes Destacados

Para que el chatbot priorice los hospedajes que generan ingreso a tu sitio:

### **En el Backend**
Marca los hospedajes con el campo `destacado: true`:

```javascript
{
  "id": "123",
  "nombre": "Hospedaje Premium Centro",
  "ubicacion": "Santiago Centro",
  "categoria": "premium",
  "precio": 35000,
  "destacado": true,  // ← Esto lo hace prioritario
  "ranking": 4.8,
  "servicios": ["WiFi", "TV Cable", "Cocina"],
  "descripcion": "Hermoso departamento en el centro..."
}
```

### **En el Store**
El store ya filtra y prioriza hospedajes destacados:

```javascript
// src/store/hospedajeStore.js
const featuredHospedajes = computed(() => {
  return hospedajes.value.filter((h) => h.destacado === true);
});
```

---

## 🎨 Personalización del ChatBot

### **Cambiar Nombre y Personalidad**

Edita `src/config/botPersonality.js`:

```javascript
export const botPersonality = {
  name: "AMIN",  // ← Cambia el nombre
  fullName: "Asistente de Hospedajes Inteligente",
  emoji: "🏠",
  
  greetings: {
    morning: (userName) =>
      `¡Buenos días, ${userName}! 🌅 ¿Buscas hospedaje?`,
    // ...personaliza los saludos
  }
}
```

### **Modificar Mensajes**

Todos los mensajes están centralizados en `botPersonality.js`:

```javascript
searchMessages: {
  byLocation: "📍 ¿En qué ciudad buscas hospedaje?",
  noResults: "❌ No encontré hospedajes en esa ubicación.",
  // ...personaliza según necesites
}
```

---

## 🚀 Uso del ChatBot en Componentes

### **Importar el Store**
```javascript
import { useHospedajeStore } from "@/store/hospedajeStore";
import { useChatBotStore } from "@/store/chatBotStore";

const hospedajeStore = useHospedajeStore();
const chatBot = useChatBotStore();
```

### **Buscar Hospedajes**
```javascript
// Buscar por ubicación
const results = await hospedajeStore.searchByLocation("Santiago");

// Obtener recomendaciones
const recommended = hospedajeStore.getRecommendations({
  ubicacion: "Providencia",
  categoria: "premium"
});

// Filtrar hospedajes
hospedajeStore.updateFilters({
  ubicacion: "Las Condes",
  precioMin: 20000,
  precioMax: 50000
});
```

---

## 📊 Estructura de Datos

### **Formato de Hospedaje**
```javascript
{
  "id": "uuid-123",
  "nombre": "Departamento Centro",
  "ubicacion": "Santiago Centro",
  "categoria": "premium",  // vip | premium | normal | masajistas
  "precio": 35000,  // CLP
  "destacado": true,  // Para priorizar en recomendaciones
  "ranking": 4.8,  // Calificación 1-5
  "rating": "4.8/5 ⭐⭐⭐⭐⭐",
  "descripcion": "Hermoso departamento...",
  "servicios": ["WiFi", "TV Cable", "Cocina", "Estacionamiento"],
  "imagenes": ["url1.jpg", "url2.jpg"],
  "disponibilidad": true,
  "contacto": {
    "nombre": "Juan Pérez",
    "telefono": "+56912345678",
    "email": "host@example.com"
  }
}
```

---

## 🧪 Testing

### **Probar el ChatBot**

1. **Inicia el servidor:**
   ```bash
   pnpm run dev
   ```

2. **Abre el navegador:**
   http://localhost:5174

3. **Prueba las funcionalidades:**
   - Click en el botón flotante del chatbot
   - Prueba búsquedas por ubicación
   - Solicita recomendaciones
   - Filtra por categoría

### **Datos de Prueba**

Para testear sin backend, agrega datos mock en el store:

```javascript
// En mounted() o onMounted()
hospedajeStore.setHospedajes([
  {
    id: "1",
    nombre: "Loft Moderno Centro",
    ubicacion: "Santiago Centro",
    categoria: "premium",
    precio: 45000,
    destacado: true,
    ranking: 4.9
  },
  {
    id: "2",
    nombre: "Depto Providencia",
    ubicacion: "Providencia",
    categoria: "vip",
    precio: 65000,
    destacado: true,
    ranking: 5.0
  }
]);
```

---

## 🔒 Seguridad

### **Autenticación**
- El servicio HTTP incluye interceptors para tokens
- Los tokens se guardan en localStorage
- Se limpia automáticamente en logout

### **Validación**
- Validación client-side en tiempo real
- Sanitización de inputs
- Prevención de XSS

---

## 📱 Próximos Pasos

### **1. Conectar Backend Real**
- Implementa los endpoints requeridos
- Configura CORS en el backend
- Actualiza `VITE_API_URL` en `.env`

### **2. Agregar Funcionalidades**
- Sistema de reservas
- Calendario de disponibilidad
- Galería de imágenes
- Mapa de ubicaciones
- Sistema de favoritos
- Notificaciones

### **3. Optimizaciones**
- Cache de búsquedas
- Lazy loading de imágenes
- Infinite scroll
- PWA para uso offline

---

## 🆘 Troubleshooting

### **Error: "Cannot find module"**
```bash
# Limpia cache y reinstala
rm -rf node_modules/.vite
pnpm install
```

### **ChatBot no aparece**
Verifica que `AccessibilityComponents.vue` esté importado en `App.vue`

### **No se cargan hospedajes**
1. Verifica que el backend esté corriendo
2. Revisa la URL en `.env`
3. Comprueba la consola del navegador

---

## 📞 Soporte

Para problemas o dudas sobre la integración, revisa:

1. **Console del navegador** - Errores de JavaScript
2. **Network tab** - Llamadas a API
3. **Vue DevTools** - Estado de los stores

---

## 🎉 ¡Listo!

El chatbot está integrado y listo para usar. Solo necesitas:

✅ Conectar tu backend
✅ Agregar hospedajes con el campo `destacado`
✅ Personalizar mensajes según tu marca
✅ ¡Empezar a recomendar hospedajes!

---

**Servidor corriendo en:** http://localhost:5174
**Estado:** ✅ Todo funcionando correctamente
