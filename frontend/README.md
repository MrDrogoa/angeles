# Angeles y Demonios — Frontend (Vue 3 + Vite)

Este README resume, de forma detallada, los cambios y componentes que se implementaron recientemente (hoy y ayer) en la carpeta `frontend/` del proyecto.

Contenido
- Resumen ejecutivo
- **🚀 Deployment a Producción (16-17 Diciembre 2025)**
- Lista de archivos / componentes creados o modificados
- Descripción funcional por componente
- Dependencias relevantes
- Cómo ejecutar el proyecto (dev / build)
- Notas y siguientes pasos

---

## 🚀 DEPLOYMENT A PRODUCCIÓN - SEXYANGELES.CL (16-17 Diciembre 2025)

### Resumen del Deployment
Se completó el deployment full-stack del proyecto Ángeles y Demonios en el servidor de producción Bluehost (sexyangeles.cl). El proceso incluyó configuración de frontend Vue, backend Node.js, base de datos MySQL y proxy Apache.

### Configuraciones Realizadas

#### Frontend (Vue 3 + Vite)
- **URL Producción:** `https://sexyangeles.cl/`
- **Build Tool:** Vite 7.1.7
- **Compilación:** `npm run build` genera carpeta `dist/`
- **Ubicación en servidor:** `/home/neekworl/public_html/sexyangeles.cl/`

**Archivos modificados para producción:**
- `src/config/api.js` — Configuración de URLs para producción:
  ```javascript
  export const API_URL = "https://sexyangeles.cl";
  export const API_URL_DEV = "http://localhost:3000";
  export const getApiUrl = () => {
    return import.meta.env.PROD ? API_URL : API_URL_DEV;
  };
  ```
- `src/services/forumService.js` — Uso de `getApiUrl()` en lugar de URL hardcodeada
- `src/views/TestAPIView.vue` — Actualizado para usar `getApiUrl()`

**Estructura en servidor:**
```
/home/neekworl/public_html/sexyangeles.cl/
├── index.html
├── assets/
│   ├── index-txx0r4Ap.js
│   └── index-8AfziV7N.css
├── transparente-logo.webp
└── .htaccess (proxy + Vue Router)
```

#### Backend (Node.js + Express)
- **Puerto:** 3000
- **Runtime:** Node.js 20.19.2
- **Ubicación:** `/home/neekworl/backend-foroAyD/`
- **Startup file:** `index.js`
- **Dependencias:** express, mysql2, cors, dotenv

**Configuración de producción (.env):**
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=neekworl_danielR
DB_PASSWORD=DaRo.2001
DB_NAME=neekworl_foroayd_prod
DB_PORT=3306
FRONTEND_URL=https://sexyangeles.cl
ALLOWED_ORIGIN=https://sexyangeles.cl
```

**Archivos creados para deployment:**
- `.env.production` — Variables de entorno para cPanel
- `diagnostic-server.js` — Servidor de diagnóstico temporal
- `test-db-connection.js` — Script de prueba de conexión MySQL

#### Base de Datos (MySQL)
- **Host:** localhost
- **Base de datos:** `neekworl_foroayd_prod`
- **Usuario:** `neekworl_danielR`
- **Estructura:** 5 tablas (posts, post_likes, comments, comment_likes, user_reputation)
- **Registros:** 14+ posts importados desde desarrollo local

**Proceso de migración:**
1. Exportación desde MAMP (phpMyAdmin) → `foroayd_backup.sql`
2. Creación de BD y usuario en cPanel
3. Asignación de privilegios ALL PRIVILEGES
4. Importación via phpMyAdmin en cPanel

#### Proxy y Configuración Apache (.htaccess)
Ubicación: `/home/neekworl/public_html/sexyangeles.cl/.htaccess`

```apache
RewriteEngine On

# Forzar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy para API Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]

# Vue Router - SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^.*$ /index.html [L]

# CORS Headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Proceso de Deployment en cPanel

#### Setup Node.js App
1. Acceso: cPanel → "Setup Node.js App"
2. Configuración:
   - Node.js version: 20.19.2
   - Application mode: Production
   - Application root: `backend-foroAyD`
   - Application startup file: `index.js`
3. Instalación de dependencias: `npm install --production`
4. Estado: 🟢 Running

#### Comandos de activación:
```bash
source /home/neekworl/nodevenv/backend-foroAyD/20/bin/activate
cd /home/neekworl/backend-foroAyD
npm install --production
```

### Endpoints API Disponibles
- `GET /api/test` — Verificación de conexión BD
- `GET /api/posts` — Obtener todos los posts del foro
- `POST /api/posts` — Crear nuevo post
- `POST /api/posts/like` — Votar en post (like/dislike)

### Guías Creadas
- `GUIA_COMPLETA_CPANEL.md` — Guía general para cualquier proyecto en cPanel
- `GUIA_DEPLOYMENT_SEXYANGELES.md` — Guía específica para este proyecto

### Problemas Resueltos Durante el Deployment

1. **Error: "Specified directory already used"**
   - Causa: Aplicación Node.js previa usando el mismo directorio
   - Solución: Eliminar app vieja y crear nueva

2. **Error: "node_modules folder must be removed"**
   - Causa: CloudLinux requiere symlink en lugar de carpeta real
   - Solución: Eliminar node_modules/ y ejecutar "Run NPM Install" desde cPanel

3. **Archivos .env ocultos no visibles**
   - Solución: File Manager → Settings → "Show Hidden Files" → Save

4. **Error 503 - Backend no responde**
   - Causa: Credenciales DB incorrectas (faltaba prefijo `neekworl_`)
   - Solución: Corregir .env con nombres completos: `neekworl_danielR`, `neekworl_foroayd_prod`

5. **SSH Connection Timed Out**
   - Causa: Puerto 22 bloqueado en plan de hosting
   - Solución: Diagnóstico via endpoint HTTP temporal

6. **Frontend carga pero error "can't access property 'map'"**
   - Causa: Backend corriendo pero sin conexión a BD
   - Solución: Verificar y corregir credenciales en .env del servidor

### Actualizaciones Futuras del Sitio

Para actualizar el sitio después de hacer cambios:

```bash
# 1. Reconstruir frontend
cd C:/Users/danie/Desktop/AngelesyDemonios/frontend
npm run build

# 2. Subir a cPanel via File Manager
# - Ir a: /home/neekworl/public_html/sexyangeles.cl/
# - Eliminar archivos viejos (excepto .htaccess y backups)
# - Upload: Todo el contenido de dist/

# 3. Limpiar caché del navegador
# - Ctrl + F5 para recarga forzada
```

### Estado Actual del Proyecto
- ✅ Frontend Vue 3 desplegado y funcionando
- ✅ Backend Node.js corriendo en puerto 3000
- ⚠️ Base de datos MySQL con problemas de conexión (pendiente de resolver)
- ✅ Proxy .htaccess configurado correctamente
- ✅ Vue Router funcionando con redirecciones
- ✅ Página 404 personalizada implementada
- ⏸️ Sistema de foro temporalmente deshabilitado (BD pendiente)

### Próximos Pasos
1. Resolver conexión a base de datos MySQL
2. Probar funcionalidad completa del foro en producción
3. Configurar backups automáticos
4. Implementar CI/CD para deployments automáticos
5. Monitoreo y logging de errores en producción

---

## Resumen ejecutivo

Durante las últimas sesiones se implementó y refinó la UI principal y varios componentes interactivos del front-end. Los puntos clave son:

- Configuración y uso global de Font Awesome para íconos.
- Navbar responsiva con menú desplegable y cierre por click fuera.
- Componente de input/label con animación letra-por-letra.
- Componente Hero (imagen con overlay y estilos).
- Carrusel tipo "stories" (similar a Instagram) con modal, barras de progreso y control de pausa/avance.
- Carrusel de tarjetas destacadas (componente `Outstanding.vue`) usando `vue3-carousel`, responsive (2 en móvil, 3 en desktop), con tamaños ajustados por breakpoint y efectos hover.
- Se creó un componente de Noticias (news) con tarjetas dinámicas.
- Footer completamente rediseñado y dinámico con logos de métodos de pago.
- Corrección de un bug en `Outstanding.vue` relacionado con el scope de `v-for` (propiedades undefined fuera del alcance del bucle).

## Archivos / Componentes creados o modificados

Ruta base: `frontend/src`

- `src/icons/icon.js` — (creado) centraliza imports de Font Awesome y registra la librería.
- `src/main.js` — (modificado) registro global del componente `font-awesome-icon`.
- `src/components/NavbarComponents.vue` — navbar responsive con dropdown y comportamiento mobile.
- `src/components/nav/Lists.vue` — menú/overlay para el navbar (click outside para cerrar).
- `src/components/buttons/ButtonAnimatedComponent.vue` — input con etiqueta animada letra-por-letra.
- `src/components/hero/HeroImg.vue` — componente hero con gradiente/overlay.
- `src/components/main/MainHistory.vue` — carrusel de historias con modal, barras de progreso y navegación.
- `src/components/main/News.vue` — grid de noticias / cards (4 dinámicas) y navegación.
- `src/components/main/Outstanding.vue` — carrusel de tarjetas destacadas (integrado `vue3-carousel`), responsive y con ajustes de tamaño.
- `src/components/TitleH2Components.vue` — componente reutilizable para títulos H2 con props de clase.
- `src/components/Footer.vue` — footer dinámico reconstruido con Tailwind (logo, columnas, métodos de pago).
- `tailwind.config.cjs` — (modificado) rutas de contenido y posibles extensiones de diseño.
- `.gitignore` — (modificado) entradas para node_modules / dist / .env según convención.

> Nota: algunas rutas pueden variar levemente según tu estructura exacta; las anteriores reflejan la estructura actual en `frontend/`.

## Descripción funcional (por componente)

- `icon.js` / `main.js`
	- Se importaron y registraron iconos Font Awesome utilizados en la app (ej.: `faSearch`, `faHeart`, `faBars`, `faXmark`, `faChevronLeft`, `faChevronRight`, `faUser`, etc.). Esto permite usar `<font-awesome-icon icon="..." />` globalmente.

- `NavbarComponents.vue` y `nav/Lists.vue`
	- Navbar responsive que abre y cierra el menú con `@click.stop`, usa `z-index` y click-outside para cerrar. Incluye iconos (hamburger, close) y está optimizado para mobile.

- `ButtonAnimatedComponent.vue`
	- Input con label que se separa en letras y anima con delay (estilo flotante). Soporta estados `:focus` y `:valid` (se usa `v-model` para mantener estado cuando hay texto).

- `MainHistory.vue`
	- Implementa un carrusel de miniaturas con `vue3-carousel` y un modal que muestra items de cada historia.
	- Modal con transition `fade`, barras de progreso (uno por item), controles de avance/retroceso por item y por historia, pausa con `mousedown`/`touchstart` y resume con `mouseup`/`touchend`.

- `Outstanding.vue`
	- Se integró `vue3-carousel` aquí para mostrar tarjetas destacadas.
	- Comportamiento solicitado: 2 tarjetas visibles en pantallas pequeñas, 3 en desktop, `wrap-around: true` (infinito).
	- Ajustes de tamaño por breakpoint (Tailwind): max-widths reducidas en cada breakpoint para que las tarjetas no se vean gigantes en desktop.
	- Aspect ratio de las imágenes fijo (3:4) para consistencia.
	- Efectos hover: cambio de borde a blanco, sombra y elevación.
	- Bug fix: se corrigió un scope problem donde `card.title` era accedido fuera del `v-for`.

- `News.vue`
	- Grid responsive de 4 cards con rutas para navegación.
	- Uso de `TitleH2Components` para el título de sección.

- `Footer.vue`
	- Reescrito para ser dinámico: objeto `footerData` que contiene slogan, columnas con links/descr, y métodos de pago.
	- Layout responsive: grid 1 / 2 / 4 columnas (mobile → tablet → desktop). Grid adicional para logos de pago (3 cols mobile, 5 cols desktop).
	- Styling con Tailwind: fondo oscuro `#1a1a1a`, borde superior dorado `#FFD700`, enlaces con hover dorado, logos con fondo blanco contenedor.

	## Cambios recientes (añadidos)

	Estos cambios se realizaron después del resumen anterior y están incluidos en el frontend:

	### Sistema de Comentarios y Valoraciones (Nuevo - 11/11/2025)

	Se implementó un sistema completo de comentarios dinámicos y valoraciones con corazones, utilizando un store reactivo centralizado:

	- `src/composables/useProfileStore.js` — composable/store global para gestión de datos del perfil:
		- `setComments()` — guarda comentarios desde ProfileComponents.
		- `getComments()` — obtiene comentarios para ComentsComponents.
		- `addAssessment()` — agrega nueva valoración (1-5 corazones).
		- `getAverageAssessment()` — calcula promedio de valoraciones.
		- `getTotalAssessments()` — retorna total de valoraciones acumuladas.
		- Usa `ref()` para reactividad total sin necesidad de localStorage.

	- `src/components/ProfileComponents.vue` — actualizado:
		- Importa y usa `useProfileStore` para compartir datos globalmente.
		- Inicializa el store con `qualifications` en `onMounted()`.
		- Muestra **indicador visual de valoración promedio** debajo de la categoría del perfil.
		- Formato: "⭐⭐⭐⭐⭐ 4.5 / 5 (10 valoraciones)" (solo si hay valoraciones).
		- Estrellas doradas (#FFD700) hasta el promedio redondeado, grises después.
		- Pasaje dinámico de `qualifications` a componentes hijos (ProfileComents, ProfileQualifications, ProfileAssessment).

	- `src/components/main/profile/ProfileComents.vue` — actualizado:
		- Simplificado: elimina localStorage, usa props directamente.
		- Muestra **solo los primeros 3 comentarios** del perfil (preview).
		- Botón "Ver todo" navega a `/coments` usando `router-link`.
		- Cada tarjeta: usuario, fecha, comentario.

	- `src/components/ComentsComponents.vue` — completamente reescrito:
		- Usa `computed` para obtener comentarios del store (`useProfileStore.getComments()`).
		- Elimina localStorage: los datos vienen **dinámicamente del store**.
		- **Layout de 2 columnas responsive** con Flexbox y Tailwind:
			- Mobile (1 col): `flex-col`
			- Tablet/Desktop (2 cols): `md:flex-row md:flex-wrap` con `basis-[calc(50%-...)]`
		- Cada tarjeta muestra: usuario, fecha, rating/7, categoría y comentario completo.
		- Borde dorado (#FFD700), hover con cambio de fondo, transición suave.
		- Mensaje si no hay comentarios.

	- `src/components/main/profile/ProfileAssessment.vue` — nuevo componente de valoración:
		- **Diseño de 5 corazones interactivos** (imagen de referencia):
			- Corazones llenos en dorado (#FFD700) cuando se seleccionan/hover.
			- Corazones vacíos en gris cuando no están seleccionados.
			- Efectos: hover con `scale-110`, transiciones suaves, cursor pointer.
		- Tamaños responsive: 64px (mobile) → 80px (sm) → 96px (md) → 112px (lg).
		- **Estadísticas superiores**: muestra promedio actual y total de valoraciones acumuladas (ej. "4.5 / 5 (10 valoraciones)").
		- Interactividad:
			- Click en corazón selecciona (1-5) y cambia color.
			- Hover pre-visualiza cuántos corazones se van a votar.
			- Texto dinámico: "Has seleccionado 3 corazones" o "Selecciona tu valoración".
		- Botón "Enviar valoración" llama `profileStore.addAssessment()`.
		- Resetea selección tras enviar y muestra alert de confirmación.
		- Usa Font Awesome: `faHeart` (lleno) y `['far', 'heart']` (vacío).

	- `src/components/main/profile/ProfileQualifications.vue` — refactorizado dinámicamente:
		- **Eliminada repetición de código**: 4 divs idénticos ahora son 1 div con `v-for`.
		- Array dinámico `qualificationCards` que genera las 4 tarjetas:
			- Lugar y Presencia (promedio categoría "lugar")
			- Físico (promedio categoría "fisico")
			- Servicio (promedio categoría "servicio")
			- Nota final (promedio de los 3 anteriores, máximo 7.0)
		- Estilos dinámicos con `:class` binding:
			- Tarjeta 4 (Nota final): borde dorado + texto dorado.
			- Tarjetas 1-3: borde blanco + texto blanco.
			- Todos: fondo gris oscuro, hover con efecto, border-2, rounded-2xl.
		- Responsive: `w-32/h-32` (mobile) → `w-44/h-44` (lg).
		- Botón "Calificar" al pie.

	- `src/icons/icon.js` — actualizado:
		- Se agregaron iconos: `faHeart` (solid), `farHeart` (regular), `faCheckCircle`, `faCreditCard`, `faClock`.
		- Se mantiene exportación por defecto de `FontAwesomeIcon`.

	### Migración del Sistema de Foro a MySQL (Nuevo - 11/12/2024)

	Se completó la migración completa del sistema de foro desde localStorage a base de datos MySQL, implementando un sistema híbrido resiliente en 5 fases:

	#### FASE 1: Verificación Backend ✅
	- Backend corriendo en `localhost:3000` con Node.js + Express + MySQL2
	- Base de datos `foroayd_local` en MAMP con 5 tablas:
		- `posts` — Almacena posts del foro
		- `post_likes` — Sistema de votación (likes/dislikes)
		- `comments` — Para sistema futuro de comentarios
		- `comment_likes` — Para votos en comentarios
		- `user_reputation` — Estadísticas de usuarios
	- Endpoints REST verificados:
		- `GET /api/test` — Verificar conexión
		- `GET /api/posts` — Obtener todos los posts con contadores
		- `POST /api/posts` — Crear nuevo post
		- `POST /api/posts/like` — Votar (toggle like/dislike)

	#### FASE 2: Guardar Posts en Base de Datos ✅
	- `src/components/ForoComponents.vue` — actualizado:
		- Función `publishPost()` migrada a async
		- Integración con `forumService.createPost()`
		- Posts ahora obtienen ID real de la base de datos
		- Loading spinner durante publicación
		- Mapeo de campos: `comment` → `content` para BD
		- Sistema híbrido: guarda en BD primero, luego actualiza localStorage como caché

	#### FASE 3: Cargar Posts desde Base de Datos ✅
	- Nueva función `loadPostsFromDB()` implementada:
		- Llamada automática en `onMounted()`
		- Integración con `forumService.getAllPosts()`
		- Mapeo completo de datos BD → Frontend (14+ campos)
		- Fallback automático a localStorage si BD no disponible
		- UI de loading con spinner dorado
		- UI de error con botón "Reintentar"
	- Estados agregados:
		- `isLoadingPosts` — Indica carga en progreso
		- `loadError` — Mensaje de error si falla

	#### FASE 4: Sistema de Votos con Base de Datos ✅
	- Función `handleVote()` migrada a async con BD:
		- Integración con `forumService.togglePostLike()`
		- Manejo de 3 respuestas del servidor:
			- `action: "added"` — Nuevo voto agregado
			- `action: "removed"` — Voto eliminado (click repetido)
			- `action: "updated"` — Voto cambiado (like ↔ dislike)
		- Actualización de contadores en tiempo real
		- Persistencia en tabla `post_likes` de MySQL
		- Sincronización con localStorage para caché local
		- Logs detallados en consola para debugging

	#### FASE 5: Limpieza y Testing Final ✅
	- Sistema de notificaciones toast implementado:
		- Ubicación: esquina superior derecha (fixed)
		- Colores dinámicos: verde (✅ éxito), rojo (❌ error)
		- Auto-cierre en 3 segundos
		- Animación fade-in suave con CSS
		- Reemplaza alerts nativos para mejor UX
	- Botón "Limpiar Caché" agregado:
		- Ubicación: esquina inferior derecha (fixed)
		- Función: elimina localStorage y recarga desde BD
		- Confirmación antes de ejecutar
		- Útil para forzar sincronización con servidor
	- Estado de votación visual:
		- `isVoting` flag previene votos duplicados
		- Pasado como prop a `ForoCards`
	- Manejo robusto de errores:
		- Todos los mensajes usan sistema toast
		- Fallbacks automáticos a caché local
		- No bloquea UI con alerts
	- `src/style.css` — actualizado:
		- Animación `@keyframes fadeIn` para toast
		- Clase `.animate-fade-in` aplicable globalmente

	#### Servicios y Configuración
	- `src/services/forumService.js` — verificado y funcional:
		- Cliente axios con baseURL `http://localhost:3000`
		- Timeout de 10 segundos
		- Métodos: `createPost()`, `getAllPosts()`, `togglePostLike()`, `testConnection()`
	- `src/config/api.js` — configurado:
		- URL desarrollo: `http://localhost:3000`
		- URL producción: `https://easyventas.cl` (preparado)
	- `src/services/testUsersService.js` — mantiene usuarios de prueba (IDs 1-15)

	#### Arquitectura Final del Sistema de Foro

	```
	┌─────────────────────────────────────┐
	│     FRONTEND (Vue 3 + Vite)         │
	│                                     │
	│  ForoComponents.vue                 │
	│  ├── posts (ref)                    │
	│  ├── userVotes (ref)                │
	│  ├── isPublishing (ref)             │
	│  ├── isLoadingPosts (ref)           │
	│  ├── isVoting (ref)                 │
	│  ├── successMessage (ref)           │
	│  └── loadError (ref)                │
	│                                     │
	│  forumService.js → axios client     │
	│  localStorage → caché local         │
	└─────────────────────────────────────┘
	              ↓ HTTP REST
	┌─────────────────────────────────────┐
	│   BACKEND (Express + MySQL2)        │
	│                                     │
	│  POST /api/posts                    │
	│  GET  /api/posts                    │
	│  POST /api/posts/like               │
	│                                     │
	│  MySQL Pool (10 conexiones)         │
	└─────────────────────────────────────┘
	              ↓
	┌─────────────────────────────────────┐
	│    MySQL (foroayd_local)            │
	│                                     │
	│  - posts (14+ registros)            │
	│  - post_likes (votos)               │
	│  - comments (futuro)                │
	│  - comment_likes (futuro)           │
	│  - user_reputation (stats)          │
	└─────────────────────────────────────┘
	```

	#### Características del Sistema Híbrido
	- **Base de Datos (MySQL):**
		- Fuente de verdad permanente
		- Datos compartidos entre usuarios
		- Persistencia real y duradera
	- **localStorage (Caché):**
		- Mejora rendimiento (menos requests HTTP)
		- Fallback si BD no disponible
		- Sincronización automática bidireccional
	- **Flujo de datos:**
		1. Usuario crea post → POST a BD → Respuesta con ID
		2. Frontend actualiza vista → Guarda en localStorage
		3. Usuario recarga página → GET desde BD → Actualiza caché
		4. Usuario vota → POST a BD → Actualiza contadores locales
		5. Si BD falla → Usa localStorage → Muestra mensaje de error

	#### Documentación Generada
	- `FASE1_VERIFICACION_COMPLETA.md` (843 líneas):
		- Detalle técnico de las 5 fases
		- Testing checklists completos
		- Troubleshooting guide
		- Mapeo de campos BD ↔ Frontend
	- `MIGRACION_COMPLETADA.md` (resumen ejecutivo):
		- Arquitectura final del sistema
		- Flujos de datos documentados
		- Guía de testing
		- Próximos pasos opcionales

	#### Testing Realizado
	- ✅ Crear posts → Se guardan en BD con ID real
	- ✅ Cargar posts → Obtiene desde BD, fallback a localStorage
	- ✅ Votar posts → Toggle like/dislike funcional
	- ✅ Persistencia → Votos y posts persisten tras recargar
	- ✅ Manejo de errores → Fallbacks automáticos, mensajes claros
	- ✅ Sistema híbrido → BD + localStorage funcionando coordinadamente

	#### Estado del Proyecto de Foro
	**✅ 5/5 FASES COMPLETADAS**
	- Sistema listo para producción
	- Configuración para deploy preparada
	- Backend en `backend-foroAyD/` corriendo exitosamente

	### Sistema de Autenticación Completo (11/11/2025 - NUEVO)

	Se implementó un sistema completo de autenticación con registro, login y gestión de usuarios, incluyendo persistencia en localStorage:

	- `src/composables/useAuthStore.js` — composable/store para autenticación global (NUEVO):
		- `registerUser(userData)` — registra nuevo usuario con validación de email único:
			- Valida que no exista email duplicado
			- Crea usuario con id, nombre, email, password, fechaNacimiento
			- Guarda en `users` ref y localStorage
			- Retorna `{ success, message, user }`
		- `loginUser(email, password)` — verifica credenciales:
			- Busca usuario en array local
			- Valida email y password
			- Establece `currentUser` y lo guarda en localStorage
			- Retorna `{ success, message, user }`
		- `logoutUser()` — limpia sesión:
			- Borra `currentUser` y localStorage
			- Retorna mensaje de confirmación
		- `loadUsersFromStorage()` — restaura estado desde localStorage:
			- Llamada en `onMounted()` de components
			- Restaura array de usuarios y usuario actual
		- `getCurrentUser()`, `getAllUsers()` — getters para acceso a datos
		- `isAuthenticated` — computed que verifica si hay usuario activo
		- Estado: `users` ref[], `currentUser` ref, `isAuthenticated` computed
		- ⚠️ TODO: Reemplazar endpoints `/api/auth/register` y `/api/auth/login` con backend real

	- `src/components/RegisterComponents.vue` — formulario de registro (NUEVO):
		- Campos: **nombre, email, password, confirmPassword, fechaNacimiento** (5 campos requeridos)
		- Validaciones dinámicas:
			- Nombre: no vacío
			- Email: formato válido (regex) + no duplicado en store
			- Password: mínimo 6 caracteres, indicador visual "6 / 6 caracteres mínimo ✓"
			- Confirmación: coincide con password, indicador "✓ Las contraseñas coinciden" o "✗ Las contraseñas no coinciden"
			- Fecha de nacimiento: requerida
		- Estados:
			- `isFormValid` computed: true solo si todos los campos son válidos
			- `isSubmitting` ref: desactiva inputs/botones mientras se procesa
			- `submitError` / `submitMessage` refs: muestran feedback al usuario
		- Funcionalidad:
			- `handleRegister()` async: valida y llama `authStore.registerUser()`
			- En éxito: resetea form, muestra mensaje y redirige a `/login` después de 2 segundos
			- En error: muestra mensaje de error específico
			- `resetForm()` function: limpia todos los campos y mensajes
		- Estilo:
			- Border dorado 2px `#FFD700`, rounded-3xl
			- Grid responsive: flex-col → md:flex-row
			- Inputs con ring focus `#FFD700`, rounded-lg, placeholder gris
			- Botones: gris con hover oscuro, deshabilitados semi-transparentes
		- Enlace a login: "¿Ya tienes cuenta? Inicia sesión aquí"
		- Debug: muestra "Formulario válido: ✓ Sí / ✗ No"

	- `src/components/LoginComponents.vue` — formulario de inicio de sesión (ACTUALIZADO):
		- **Diseño original preservado**: ButtonAnimatedComponent, Button3Components, border-[#E6C200]
		- Campos: **email, password** (simples refs, no formData object)
		- Validaciones:
			- Email: no vacío + formato válido (regex)
			- Password: mínimo 6 caracteres
			- Credenciales: coinciden con usuario registrado en store
		- Estados:
			- `submitError` ref: muestra errores en rojo
			- `isSubmitting` ref: desactiva inputs/botón durante login
		- Funcionalidad:
			- `onMounted()` hook: carga usuarios desde localStorage (`authStore.loadUsersFromStorage()`)
			- `handleLogin()` async: valida campos y llama `authStore.loginUser()`
			- En éxito: resetea form y redirige a `/home` después de 2 segundos
			- En error: muestra mensaje específico
		- Estilo:
			- Max-width sm → lg, border-2 border-[#E6C200], rounded-2xl
			- ButtonAnimatedComponent para inputs animados
			- Button3Components para submit con estado disabled
			- Error message: bg-red-500/20, border-red-500, text-red-400
		- Enlace a registro: "¿No tienes cuenta? Regístrate aquí"

	- `src/components/ContactComponents.vue` — formulario de contacto (ACTUALIZADO):
		- Campos: **nombre, apellido, correo, mensaje**
		- Validaciones:
			- Nombre: no vacío
			- Apellido: no vacío
			- Correo: formato válido (regex)
			- Mensaje: **mínimo 15 caracteres**, indicador visual dinámico:
				- Contador: "5 / 15 caracteres mínimo" → "15 / 15 caracteres mínimo ✓ Válido"
				- Focus ring: `focus:ring-[#FFD700]` (inválido) → `focus:ring-green-500` (válido)
		- Estados:
			- `isFormValid` computed: true si todos cumples requisitos
			- `isSubmitting` ref: desactiva durante envío
			- `submitError` / `submitMessage` refs: feedback al usuario
		- Funcionalidad:
			- `handleSubmit()` async: valida y envía POST a `/api/contact`
			- En éxito: muestra "¡Tu mensaje ha sido enviado exitosamente!" y resetea después de 5 segundos
			- En error: muestra mensaje de error específico
			- `resetForm()` function: limpia formulario
		- Layout responsive:
			- Nombre + Apellido: flex-col → md:flex-row (2 columnas en desktop)
			- Correo: full width
			- Mensaje: textarea con 6 filas, resize-none
		- Estilo:
			- Border dorado 2px `#FFD700`, rounded-3xl
			- Inputs/textarea con ring focus dinámico
			- Botones: gris con hover, deshabilitados semi-transparentes
		- Debug: "Formulario válido: ✓ Sí / ✗ No" con detalles de validación
		- ⚠️ TODO: Reemplazar endpoint `/api/contact` con backend real

	### Flujo de autenticación (11/11/2025):

	```
	RegisterComponents (captura datos)
	  └→ authStore.registerUser() → almacena en users[] + localStorage
	     └→ redirige a LoginComponents después de éxito

	LoginComponents (verifica credenciales)
	  ├→ onMounted() → carga usuarios desde localStorage
	  └→ authStore.loginUser() → busca usuario + verifica password
	     └→ establece currentUser + localStorage
	        └→ redirige a Home si éxito

	ContactComponents (envía contacto)
	  └→ POST /api/contact (TODO: backend)
	     └→ muestra confirmación o error
	```

	### Características del sistema de autenticación (11/11/2025):

	✅ **Registro completo**:
	- 5 campos requeridos: nombre, email, password, confirmPassword, fechaNacimiento
	- Validación de email único (impide duplicados)
	- Indicadores visuales de validez (contraseñas coinciden, password strength)
	- Error messages específicos por campo
	- Persistencia en localStorage (desarrollo) / TODO: JWT en backend

	✅ **Login funcional**:
	- Verifica credenciales contra usuarios registrados
	- Restora sesión anterior al abrir app (loadUsersFromStorage)
	- Mantiene diseño original (ButtonAnimatedComponent, Button3Components)
	- Error handling con mensajes claros
	- Desactiva inputs/botones durante proceso

	✅ **Contacto dinámico**:
	- Validación de 15+ caracteres en mensaje
	- Contador visual de caracteres con feedback colorido
	- Layout responsive (nombre+apellido lado a lado en desktop)
	- Mensaje de éxito/error con auto-limpieza
	- Integración con backend lista (cambiar endpoint)

	✅ **Persistencia**:
	- localStorage guarda usuarios registrados
	- localStorage mantiene sesión actual
	- App carga sesión automáticamente al iniciar (onMounted)
	- ⚠️ Temporal: usar para desarrollo solo

	✅ **Seguridad (TODO)**:
	- Validación en cliente completa
	- ⚠️ Passwords guardados en plaintext (solo desarrollo)
	- TODO: Implementar JWT en backend
	- TODO: Hash de passwords en servidor

	### Flujo de datos del perfil (11/11/2025):

	```
	ProfileComponents (origen de datos)
	  ├→ qualifications[] → ProfileComents (primeros 3)
	  ├→ onMounted() → profileStore.setComments(qualifications)
	  └→ Muestra promedio de valoraciones (computed desde store)
	
	useProfileStore (estado global reactivo)
	  ├→ getComments() → ComentsComponents (todos, 2 columnas)
	  └→ getAverageAssessment() / getTotalAssessments() → ProfileComponents & ProfileAssessment
	
	ProfileAssessment (captura valoraciones)
	  └→ addAssessment(hearts) → profileStore (acumula ratings)
	     └→ ProfileComponents re-renderiza promedio automáticamente (computed reactivo)
	```

	### Características del sistema de perfil (11/11/2025):

	✅ **Comentarios dinámicos**:
	- Fuente única: `profileData.qualifications` en ProfileComponents.
	- Sin localStorage: Todo reactivo via composable.
	- 3 comentarios en perfil (preview).
	- Todos los comentarios en ComentsComponents (grid 2 columnas).

	✅ **Valoraciones con corazones**:
	- 5 corazones interactivos con diseño visual igual a la imagen referencia.
	- Cada usuario puede valorar (1-5 corazones).
	- Promedio calculado automáticamente con 1 decimal.
	- Promedio visible en el perfil con estrellas doradas.
	- Persistente: se guarda en el store global.

	✅ **Responsive**:
	- Mobile: comentarios 1 columna, corazones 64px.
	- Tablet: comentarios 2 columnas, corazones 80-96px.
	- Desktop: layout optimizado, corazones 112px.

	✅ **Código optimizado**:
	- ProfileQualifications: 1 div dinámico en lugar de 4 divs repetidos (~110 líneas ahorradas).
	- Todos los estilos en un solo `:class` binding.
	- Array de configuración para fácil mantenimiento.

	---

	- `src/components/buttons/ReturnComponents.vue` — botón "Volver" mejorado:
		- Ahora usa `useRouter()` y llama a `router.back()` para navegar al historial anterior.
		- Integra el icono de Font Awesome girado (ej. `arrow-turn-down`) y soporta estados disabled.

	- `src/components/main/category/AllCardsComponents.vue` — paginación de tarjetas:
		- Se añadió paginación con control previa/siguiente y número de página central.
		- Implementación responsive y estilos con Tailwind (botones conectados como en la imagen de referencia).
		- Se generaron 56 tarjetas de ejemplo (2 páginas de 28) y el layout cambia correctamente entre páginas.

	- `src/components/main/ProfileComponents.vue` y subcomponentes bajo `src/components/main/profile/`:
		- `ProfileComponents.vue`: nuevo layout de perfil con carrusel (vue3-carousel), badges, botones de contacto, descripción y listados de características.
		- `ProfileDescription.vue`: ahora recibe `description` por prop (dinámico desde el padre).
		- `ProfileIcons.vue` / `Profilecons.vue`: recibe `features` por prop y renderiza iconos + texto (dinámico desde el padre).
		- `ProfilePicture.vue`: recibe `images` por prop, limita a 15 imágenes y las muestra en un grid responsive de hasta 5 columnas (estilos con Tailwind, hover y borde dorado).
		- Se añadieron funciones auxiliares: toggle favorito, llamadas telefónicas (`tel:`) y apertura a WhatsApp.

	- `src/components/main/Outstanding.vue` y `src/components/main/MainHistory.vue`:
		- Ajustes menores de tamaño y breakpoints para que los carruseles se vean correctos en mobile y desktop.

	- `src/icons/icon.js` — mejoras en la librería de iconos:
		- Se agregaron iconos adicionales necesarios por los nuevos componentes (brands y solid): `faWhatsapp`, `faCheckCircle`, `faCreditCard`, `faClock`, y se mantuvo la exportación por defecto de `FontAwesomeIcon`.

	- Varios fixes menores:
		- Corrección de imports usando el alias `@/` (p. ej. `Footer.vue` import Logo con `@/components/...`).
		- Reemplazo de estilos nativos por clases Tailwind donde fue posible (ej. paginación, grids de imágenes).

	Estos cambios están listos y preparados para ser conectados a datos reales (back-end). Si quieres, puedo incluir en el README ejemplos de la estructura JSON esperada para `profileData` (útil para el API) o crear un pequeño mock service para consumir desde los componentes.

	### Mejoras en Formularios de Autenticación (13/11/2025 - NUEVO)

	Se implementaron mejoras en la experiencia de usuario de los formularios de autenticación, enfocándose en la visibilidad de contraseñas y refinamientos menores en validaciones:

	- `src/icons/icon.js` — actualizado:
		- Se agregaron iconos `faEye` (solid) y `faEyeSlash` (solid) para los botones de mostrar/ocultar contraseña.
		- Estos iconos permiten alternar la visibilidad de los campos de contraseña en los formularios.

	- `src/components/RegisterComponents.vue` — actualizado:
		- **Funcionalidad de visibilidad de contraseña**: Se añadieron botones con íconos de ojo al lado derecho de los campos de contraseña y confirmación de contraseña.
			- Estados reactivos: `showPassword` y `showConfirmPassword` (refs booleanos) para controlar la visibilidad.
			- Funciones: `togglePasswordVisibility()` y `toggleConfirmPasswordVisibility()` para alternar entre `type="password"` y `type="text"`.
			- Estilo: Botones posicionados absolutamente con `absolute right-3 top-1/2 transform -translate-y-1/2`, usando Tailwind para alineación.
			- Iconos: `faEye` cuando la contraseña está oculta, `faEyeSlash` cuando está visible.
			- Deshabilitación: Los botones se deshabilitan durante el envío del formulario (`isSubmitting`).
		- Mantiene todas las validaciones existentes: indicadores visuales de coincidencia de contraseñas, validación de email único, etc.
		- Mejora la UX al permitir a los usuarios verificar sus contraseñas sin necesidad de borrar y reescribir.

	- `src/components/ContactComponents.vue` — actualizado:
		- Refinamientos menores en el manejo de estados y validaciones, asegurando consistencia con los otros formularios.

	- `src/components/LoginComponents.vue` — actualizado:
		- Refinamientos menores en el manejo de errores y estados de carga, preservando el diseño original.

	### Características de las mejoras en autenticación (13/11/2025):

	✅ **Visibilidad de contraseñas**:
	- Botones intuitivos con íconos de Font Awesome para mostrar/ocultar contraseñas.
	- Funciona en ambos campos de contraseña en el registro (password y confirmPassword).
	- No interfiere con las validaciones existentes ni con el estado de envío.
	- Mejora la accesibilidad y reduce errores de tipeo en contraseñas.

	✅ **Consistencia visual**:
	- Los íconos siguen el esquema de colores dorado (#FFD700) del proyecto.
	- Posicionamiento consistente y responsive.
	- Integración perfecta con Tailwind CSS.

	✅ **Estado reactivo**:
	- Cambios inmediatos en el tipo de input sin recargar la página.
	- Estados independientes para cada campo de contraseña.

	Estos cambios completan la implementación del sistema de autenticación, proporcionando una experiencia de usuario más fluida y segura.

	### Sistema de Chatbot de Hospedajes con IA (14/11/2025 - NUEVO)

	Se implementó un sistema completo de chatbot conversacional inteligente enfocado en búsqueda y recomendación de hospedajes (alojamientos), con integración total al sistema Vue 3:

	- `src/store/chatBotStore.js` — store principal del chatbot (NUEVO - 4200+ líneas):
		- **Estado del chatbot**: `isVisible`, `messages`, `currentStep`, `sessionId`, `conversationContext`
		- **Flujo conversacional completo**: 50+ pasos organizados en categorías (bienvenida, búsqueda, categorías, precio, recomendaciones)
		- **Gestión de mensajes**: `addMessage()`, `addBotMessage()`, `addUserMessage()`, `clearMessages()`
		- **Navegación**: `goToStep()`, `goBack()`, `restartConversation()`, `toggleVisibility()`
		- **Procesamiento de entrada**: `handleUserInput()` con validación y respuestas contextuales
		- **Validaciones**: ubicación (min 2 chars), precio (formato "30000" o "20000-50000"), categorías (vip/premium/normal/masajistas)
		- **Sugerencias rápidas**: botones dinámicos según paso actual (ubicaciones, categorías, rangos de precio)
		- **Reportes**: integración con sistema de reportes (express y estándar)
		- **Persistencia**: guarda conversación en localStorage
		- **Métricas**: tracking de interacciones, conversiones, abandono

	- `src/store/hospedajeStore.js` — store de hospedajes (NUEVO):
		- **Estado**: `hospedajes`, `featured`, `selectedHospedaje`, `searchFilters`, `isLoading`
		- **Computed getters**:
			- `filteredHospedajes` — aplica filtros de ubicación/categoría/precio
			- `featuredHospedajes` — filtra hospedajes con `destacado: true`
			- `hospedajesByCategory` — agrupa por categoría (vip/premium/normal/masajistas)
		- **Actions**:
			- `searchByLocation(ubicacion)` — busca hospedajes por ubicación
			- `getRecommendations(criteria)` — obtiene recomendaciones personalizadas, **prioriza destacado: true**
			- `updateFilters(filters)` — actualiza filtros de búsqueda
			- `clearFilters()` — resetea filtros
		- **Lógica de negocio**: hospedajes destacados aparecen primero en recomendaciones (revenue optimization)

	- `src/store/reportsStore.js` — store de reportes (NUEVO):
		- Estado básico para reportes estándar
		- Integración con chatbot para crear reportes desde conversación

	- `src/store/expressReportsStore.js` — store de reportes express (NUEVO):
		- Estado para reportes express (rápidos)
		- Compatible con flujo de chatbot

	- `src/repositories/hospedajeRepository.js` — capa de API para hospedajes (NUEVO):
		- **Métodos HTTP**:
			- `searchByLocation(ubicacion, options)` — GET /hospedajes/search
			- `getByCategory(category, options)` — GET /hospedajes/category/:category
			- `getFeatured(options)` — GET /hospedajes/featured
			- `getRecommendations(criteria)` — POST /hospedajes/recommendations
			- `getById(id)` — GET /hospedajes/:id
			- `filter(filters)` — POST /hospedajes/filter
			- `getLocations()` — GET /hospedajes/locations
		- Todos retornan `{ success, hospedajes/data, error }`

	- `src/repositories/authRepository.js` — repositorio de autenticación (NUEVO):
		- **Métodos**:
			- `register(userData)` — POST /auth/register
			- `login(credentials)` — POST /auth/login (guarda token en localStorage)
			- `logout()` — POST /auth/logout (limpia tokens)
			- `isAuthenticated()` — verifica si hay token
			- `getCurrentUser()` — GET /auth/me
			- `updateProfile(userData)` — PUT /auth/profile
			- `changePassword(passwordData)` — POST /auth/change-password
			- `requestPasswordReset(email)` — POST /auth/forgot-password
			- `resetPassword(token, newPassword)` — POST /auth/reset-password
			- `verifyEmail(token)` — POST /auth/verify-email
		- Exportado como singleton

	- `src/repositories/botRepository.js` — repositorio del bot (NUEVO):
		- Métodos para validaciones y sugerencias del chatbot
		- Integración con backend para analytics

	- `src/services/ChatBotHospedajeService.js` — servicio de integración chatbot-hospedajes (NUEVO):
		- **Métodos de búsqueda**:
			- `searchByLocation(ubicacion)` — busca hospedajes por ubicación
			- `searchByCategory(category)` — busca por categoría
			- `getRecommendations(criteria)` — obtiene recomendaciones personalizadas
			- `getHospedajeDetails(id)` — detalles de hospedaje específico
		- **Formatters para respuestas del bot**:
			- `formatSearchResults(hospedajes)` — formatea lista de resultados (max 5) con badge 💎 para destacados
			- `formatRecommendations(hospedajes)` — formatea recomendaciones
			- `formatHospedajeDetails(hospedaje)` — formatea detalles completos
			- `formatPrice(precio)` — formatea precios en CLP (ej: "$30.000")
		- **Validadores**:
			- `validateLocation(ubicacion)` — min 2 chars, letras/espacios/guiones
			- `validatePriceRange(precio)` — acepta "30000" o "20000-50000"

	- `src/services/BotPersonalityService.js` — servicio de personalidad del bot (NUEVO):
		- Wrapper para configuración de personalidad
		- `getGreeting(user)` — saludo dinámico según hora del día
		- `getSearchMessage()` — mensaje de búsqueda
		- `getMenuMessage()` — mensaje de menú principal
		- `getName()`, `getAvatar()`, `getEmoji()`

	- `src/services/RealTimeValidationService.js` — validaciones en tiempo real (NUEVO):
		- Validadores para formularios del chatbot
		- Campos: nombre, ubicacion, precio, email, telefono

	- `src/services/ErrorHandlerService.js` — manejo centralizado de errores (NUEVO):
		- `handleError(error, context)` — manejo genérico
		- `handleValidationError(errors)` — errores de validación
		- `handleNetworkError(error)` — errores de red

	- `src/services/httpService.js` — cliente HTTP con axios (NUEVO):
		- BaseURL desde `VITE_API_URL` env variable
		- Timeout: 10000ms
		- **Request interceptor**: agrega token Bearer desde localStorage
		- **Response interceptor**: maneja 401 (token inválido/expirado), limpia localStorage y redirige a /login

	- `src/services/SessionSyncService.js` — sincronización entre pestañas (NUEVO):
		- Usa BroadcastChannel API
		- `onLogin(callback)` / `onLogout(callback)` — escucha eventos
		- `notifyLogin(userData)` / `notifyLogout()` — notifica a otras pestañas
		- Sincroniza sesión automáticamente en todas las pestañas abiertas

	- `src/config/botPersonality.js` — configuración de personalidad del bot (NUEVO):
		- **Identidad del bot**:
			- name: "AMIN"
			- fullName: "Asistente de Hospedajes Inteligente"
			- emoji: "🏠"
			- avatar: "@/assets/amin-transparente.webp"
		- **Mensajes categorizados**:
			- `greetings` — saludos según hora (mañana/tarde/noche/madrugada)
			- `searchMessages` — mensajes de búsqueda por ubicación/categoría/precio
			- `hospedajeMessages` — mensajes para mostrar detalles, categorías, acciones
			- `errorMessages` — mensajes de error específicos
			- `helpMessages` — ayuda contextual
		- **Adaptado completamente**: cambió de sistema de reportes a búsqueda de hospedajes

	- `src/components/boot/component/bot/ChatBot.vue` — componente principal del chatbot (NUEVO - 1300+ líneas):
		- **Estructura visual**:
			- Header con avatar AMIN, nombre y botones (cerrar, minimizar, navegación)
			- Área de navegación con migas de pan (breadcrumbs)
			- Contenedor de mensajes con scroll automático
			- Input area con textarea y botón enviar
			- Floating button (botón flotante circular) para abrir chat
		- **Funcionalidades**:
			- Renderiza mensajes del bot y usuario
			- Indicador de escritura (typing indicator) con animación
			- Sugerencias rápidas (quick replies) dinámicas
			- Componente de progreso para reportes
			- Editable fields para datos de usuario
			- Confirmación de reportes
			- Resumen de reportes
		- **Interactividad**:
			- Auto-scroll al último mensaje
			- Focus automático en input
			- Envío con Enter (Shift+Enter para nueva línea)
			- Cierre con tecla Escape
			- Click outside para cerrar (opcional)
		- **Estilos**:
			- Tema oscuro con acentos dorados (#FFD700)
			- Burbujas de chat diferenciadas (bot: gris, usuario: dorado)
			- Animaciones suaves (fade, slide)
			- Responsive: adapta tamaños en mobile
		- **Autenticación**: solo visible si `isUserAuthenticated` (comentado temporalmente para testing)

	- `src/components/boot/component/bot/ChatMessage.vue` — componente de mensaje individual (NUEVO):
		- Renderiza mensajes del bot y usuario
		- Avatar del bot (amin-transparente.webp)
		- Formato HTML para texto del bot (v-html)
		- Indicador de carga para mensajes tipo "loading"
		- Timestamp opcional

	- `src/components/boot/component/bot/QuickReply.vue` — botones de respuesta rápida (NUEVO):
		- Botones con iconos opcionales
		- Estilos: borde dorado, hover con fondo dorado
		- Emit `@select` al hacer click

	- `src/components/boot/component/bot/ChatBotNavigation.vue` — navegación breadcrumbs (NUEVO):
		- Muestra ruta de navegación del chatbot
		- Click en paso anterior para volver
		- Iconos de Font Awesome

	- `src/components/boot/component/bot/ProgressIndicator.vue` — barra de progreso (NUEVO):
		- Indicador visual de progreso en reportes
		- Barra con porcentaje y color dinámico
		- Estados: incompleto (gris) → completo (verde)

	- `src/components/boot/component/bot/EditableField.vue` — campo editable (NUEVO):
		- Campo de formulario con edición inline
		- Validación en tiempo real
		- Iconos de estado (check/error)

	- `src/components/boot/component/bot/ReportConfirmation.vue` — confirmación de reporte (NUEVO):
		- Muestra datos del reporte antes de enviar
		- Botones de confirmar/cancelar
		- Resumen visual con iconos

	- `src/components/boot/component/bot/ReportSummary.vue` — resumen de reporte (NUEVO):
		- Muestra resumen después de crear reporte
		- Información de seguimiento
		- Opciones de descarga/compartir

	- `src/components/boot/component/bot/ReportViewModal.vue` — modal de visualización (NUEVO):
		- Modal para ver detalles de reportes
		- Integra ExpressReportDetails y ReportDetails
		- Transiciones suaves

	- `src/components/boot/component/bot/ExpressReportDetails.vue` — detalles de reporte express (NUEVO):
		- Componente para mostrar reportes express
		- Layout con cards responsive
		- Información del usuario, estado, fechas
		- Badges de estado con colores dinámicos

	- `src/components/boot/component/bot/ReportDetails.vue` — detalles de reporte estándar (NUEVO):
		- Componente para reportes completos
		- Más detallado que express
		- Secciones: info general, descripción, reportante, fechas, adjuntos, notas
		- Badges de prioridad y estado

	- `src/components/boot/component/bot/ChatBotRealTimeInput.vue` — input con validación (NUEVO):
		- Input con validación en tiempo real
		- Mensajes de error dinámicos
		- Integración con RealTimeValidationService

	- `src/utils/authDebug.js` — utilidades de depuración (NUEVO):
		- `debugAuth()` — muestra estado de tokens/cookies en consola
		- `migrateAuthTokens()` — migra tokens de formato antiguo
		- `clearAuthDebug()` — limpia todos los datos de auth
		- `isTokenValid(token)` — valida JWT y verifica expiración
		- `decodeToken(token)` — decodifica payload de JWT (sin verificar firma)

	- `src/data/countries.json` — lista de países (NUEVO):
		- JSON con nombres de países para autocompletado

	- `src/data/paises.json` — países en español (NUEVO):
		- Alternativa en español para formularios

	- `src/data/nacionalidades.json` — lista de nacionalidades (NUEVO):
		- JSON con nacionalidades para formularios

	- `src/components/examples/HospedajeSearchExample.vue` — componente de ejemplo (NUEVO):
		- Ejemplo completo de búsqueda de hospedajes
		- Formulario con filtros (ubicación, categoría, precio)
		- Grid de resultados responsive
		- Mock data para testing sin backend
		- Badges para hospedajes destacados

	- `CHATBOT_INTEGRATION.md` — documentación técnica (NUEVO - 400+ líneas):
		- **Secciones completas**:
			1. Estructura de archivos (23 archivos)
			2. Funcionalidad overview
			3. Endpoints de backend requeridos (15 endpoints)
			4. Variables de entorno (.env setup)
			5. Estructura de datos (hospedajes, reportes)
			6. Guía de customización
			7. Troubleshooting
		- Ejemplos de código para cada endpoint
		- Estructura JSON esperada
		- Instrucciones de integración paso a paso

	- `src/App.vue` — actualizado:
		- Importa y registra `ChatBot` component
		- Agregado entre `AccessibilityComponents` y `Layout`
		- Disponible globalmente en toda la app

	- `.env` — archivo de configuración (NUEVO):
		- `VITE_API_URL=http://localhost:3000/api`
		- Configuración Firebase comentada (para cuando se necesite)

	### Flujo del chatbot de hospedajes (14/11/2025):

	```
	Usuario abre chatbot (floating button)
	  └→ ChatBot.vue renderiza
	     └→ chatBotStore.initialize() carga contexto
	        ├→ Saludo personalizado (BotPersonalityService)
	        └→ Menú principal con opciones rápidas

	Usuario selecciona "Buscar por ubicación"
	  └→ chatBotStore.handleUserInput(ubicacion)
	     └→ ChatBotHospedajeService.searchByLocation()
	        └→ hospedajeRepository.searchByLocation()
	           └→ GET /hospedajes/search?ubicacion=...
	              └→ hospedajeStore.updateHospedajes()
	                 └→ Bot formatea resultados (formatSearchResults)
	                    └→ Muestra top 5 con badge 💎 para destacados

	Usuario pide recomendaciones
	  └→ chatBotStore.getRecommendations(criteria)
	     └→ hospedajeStore.getRecommendations()
	        └→ Filtra destacado: true PRIMERO
	           └→ Ordena por ranking
	              └→ Retorna top 5
	                 └→ Bot muestra con formatRecommendations()
	```

	### Características del sistema de chatbot (14/11/2025):

	✅ **Chatbot conversacional completo**:
	- 50+ pasos organizados en flujo lógico
	- Bienvenida personalizada según hora del día
	- Búsqueda por ubicación, categoría y rango de precio
	- Recomendaciones inteligentes (prioriza destacado: true)
	- Validaciones en tiempo real
	- Sugerencias rápidas contextuales
	- Navegación con breadcrumbs
	- Historial de conversación

	✅ **Integración con hospedajes**:
	- Store dedicado (hospedajeStore.js)
	- Repository con 8 métodos HTTP
	- Service con formatters y validadores
	- Filtros avanzados (ubicación/categoría/precio)
	- Destacados priorizados en recomendaciones
	- Formato de precios en CLP

	✅ **Sistema de reportes integrado**:
	- Reportes estándar y express
	- Formularios con validación
	- Progreso visual con barra
	- Confirmación antes de enviar
	- Resumen después de crear
	- Modal de visualización

	✅ **Autenticación y seguridad**:
	- Repository completo (10 métodos)
	- Interceptor HTTP con Bearer token
	- Manejo de 401 automático
	- Sincronización entre pestañas
	- Utilidades de debugging
	- Validación de JWT

	✅ **UI/UX optimizada**:
	- Tema oscuro con acentos dorados
	- Botón flotante circular
	- Animaciones suaves
	- Auto-scroll inteligente
	- Typing indicator
	- Responsive (mobile/tablet/desktop)
	- Atajos de teclado (Enter, Escape)
	- Click outside para cerrar

	✅ **Personalidad del bot**:
	- Nombre: AMIN (Asistente de Hospedajes Inteligente)
	- Emoji: 🏠
	- Avatar: amin-transparente.webp
	- Mensajes según contexto
	- Tono amigable y profesional
	- Saludos según hora del día

	✅ **Lógica de negocio**:
	- Hospedajes destacados (destacado: true) aparecen primero
	- Optimizado para revenue generation
	- Categorías: VIP 💎, Premium ⭐, Normal 🏠, Masajistas 💆
	- Rangos de precio configurables
	- Filtros combinables

	✅ **Documentación completa**:
	- CHATBOT_INTEGRATION.md (400+ líneas)
	- Estructura de archivos detallada
	- 15 endpoints documentados
	- Ejemplos de código
	- Guía de troubleshooting
	- Variables de entorno

	✅ **Testing y desarrollo**:
	- Componente de ejemplo (HospedajeSearchExample.vue)
	- Mock data para testing
	- Autenticación temporal deshabilitada
	- Logs de debug en consola
	- Validaciones exhaustivas

	✅ **Persistencia**:
	- localStorage para conversación
	- localStorage para filtros
	- localStorage para sesión de usuario
	- Restauración automática al recargar

	✅ **Preparado para producción**:
	- Todos los archivos creados (23 archivos)
	- Rutas de import corregidas (@/store/, @/services/, etc.)
	- Imágenes corregidas (amin-transparente.webp)
	- Sin errores de compilación
	- .env configurado
	- README actualizado

	⚠️ **Pendiente (backend)**:
	- Implementar 15 endpoints REST
	- Configurar base de datos para hospedajes
	- Implementar sistema de autenticación JWT
	- Agregar campo destacado a modelo de hospedaje
	- Deploy de API en servidor

	### Sistema de Calificación y Valoración de Perfiles (18/11/2025 - NUEVO)

	Se implementó un sistema completo de calificación con modal de estrellas (1-7), comentarios obligatorios y visualización de valoraciones en los perfiles:

	- `src/components/main/profile/RatingModal.vue` — modal de calificación (NUEVO - 300+ líneas):
		- **3 categorías de calificación** con 7 estrellas cada una:
			- 📍 Lugar y Presencia (1-7)
			- 💪 Físico (1-7)
			- 🛎️ Servicio (1-7)
		- **Nota Final automática**: promedio de las 3 categorías (X.X/7)
		- **Comentario obligatorio**: validación 15-500 caracteres
		- **Características**:
			- Estrellas interactivas con hover preview (Font Awesome)
			- Colores dinámicos: dorado (#FFD700) activo, gris inactivo
			- Contador de caracteres con validación visual (rojo < 15, verde ≥ 15)
			- Validación completa del formulario (isFormValid computed)
			- Usuario de prueba (TODO: integrar con authStore)
			- Fecha automática en formato español
			- Botón submit deshabilitado hasta completar todo
		- **Emisión de eventos**: @close, @submit
		- **Estructura de datos guardada**:
			```javascript
			{
			  user: "Usuario Prueba",
			  date: "18/11/2025",
			  rating: 6.3,
			  category: "general",
			  comment: "Excelente servicio...",
			  ratings: { lugar: 7, fisico: 6, servicio: 6 }
			}
			```
		- **Responsive**: Tailwind con breakpoints sm/md/lg
		- **Tema**: Borde dorado 2px, fondo oscuro, scrollbar personalizado

	- `src/components/main/profile/ProfileQualifications.vue` — refactorizado completamente:
		- **ANTES**: Calculaba promedios de datos hardcodeados en props.qualifications
		- **AHORA**: Calcula promedios solo de calificaciones del usuario desde useProfileStore
		- **Cambios clave**:
			- Importa `useProfileStore` para acceso reactivo a datos
			- `userQualifications` computed obtiene comentarios del store
			- Promedios calculados desde `ratings.lugar`, `ratings.fisico`, `ratings.servicio`
			- Inicia en 0.0 cuando no hay calificaciones del usuario
			- Integración completa con RatingModal (estado, apertura, cierre)
		- **Funcionalidad del modal**:
			- `showRatingModal` ref controla visibilidad
			- `openRatingModal()` abre modal al click en "Calificar"
			- `closeRatingModal()` cierra modal
			- `handleRatingSubmit(newRating)` callback después de envío
		- **Tarjetas dinámicas**: 3 categorías + Nota Final (misma estructura, datos diferentes)

	- `src/components/main/profile/ProfileAssessment.vue` — rediseñado:
		- **ANTES**: Mostraba corazones interactivos para valorar
		- **AHORA**: Muestra la Nota Final del sistema de calificación
		- **Mensaje por defecto**: "Aún no hay valoraciones" cuando totalAssessments === 0
			- Borde gris, fondo oscuro transparente
		- **Con valoraciones**: Muestra nota final en escala 1-7
			- Borde dorado (#FFD700)
			- Texto grande: "Nota Final X.X/7"
			- Contador de valoraciones: "N valoración(es)"
		- **Sin corazones**: Se eliminó el sistema de 5 corazones
		- **Datos desde store**: `getAverageAssessment()` retorna promedio en escala 1-7

	- `src/components/main/profile/ProfileComents.vue` — actualizado:
		- **ANTES**: Mostraba comentarios desde props.qualifications
		- **AHORA**: Muestra comentarios desde `profileStore.getComments()`
		- **Mensaje por defecto**: "Aún no hay comentarios" cuando array vacío
			- Mismo estilo que ProfileAssessment (borde gris)
		- **Cuando hay comentarios**:
			- Muestra primeros 3 comentarios (limitedComments.slice(0, 3))
			- Espaciado entre tarjetas: `space-y-4 md:space-y-5`
			- Word-wrap en textos largos: `break-words` → `wrap-break-word`
			- Fecha con `whitespace-nowrap` (no se rompe)
			- Gap en header: `gap-2` entre usuario y fecha
		- **Layout responsive**: Grid 50%-50% en desktop (desde ProfileComponents)

	- `src/components/ComentsComponents.vue` — reescrito completamente:
		- **ANTES**: Flexbox con basis-[calc(...)] para 2 columnas
		- **AHORA**: Grid nativo CSS con `grid-cols-1 md:grid-cols-2`
		- **Orden del DOM**:
			1. Mensaje "No hay comentarios disponibles" (si array vacío)
			2. Grid de comentarios (si hay datos)
		- **Correcciones**:
			- Word-wrap correcto: `wrap-break-word` (Tailwind v4)
			- Espaciado consistente: `gap-4 md:gap-5 lg:gap-6`
			- Fecha protegida: `whitespace-nowrap`
			- Gap en header: `gap-2`
		- **Responsive perfecto**:
			- Mobile: 1 columna vertical
			- Tablet/Desktop: 2 columnas balanceadas
		- **Mensaje por defecto mejorado**: padding, borde gris, rounded-xl

	- `src/composables/useProfileStore.js` — actualizado:
		- **Método agregado**: `reset()` limpia comentarios y valoraciones
		- **Método mejorado**: `getAverageAssessment()` retorna "0.0" en lugar de 0
		- **Flujo de reset**: Llamado en ProfileComponents onMounted
		- **Persistencia**: Sin localStorage, solo state reactivo en memoria
		- **Escala actualizada**: Valoraciones guardadas en escala 1-7 (no convertidas a 1-5)

	- `src/components/ProfileComponents.vue` — modificado:
		- **ANTES**: Inicializaba store con `setComments(profileData.qualifications)` en onMounted
		- **AHORA**: Resetea store con `profileStore.reset()` en onMounted
		- **Layout actualizado**: Grid 50%-50% en desktop
			- Cambio de `flex gap-4 flex-col lg:flex-row` a `grid grid-cols-1 lg:grid-cols-2`
			- Gap aumentado: `gap-6 lg:gap-8`
			- Ambas columnas con `flex flex-col` para alineación
		- **Efecto**: Al recargar página, todas las calificaciones vuelven a 0

	- `src/icons/icon.js` — actualizado:
		- Se agregaron iconos para el sistema de estrellas:
			- `faStar` (solid) — estrella llena dorada
			- `farStar` (regular) — estrella vacía gris
		- Total de 42+ iconos Font Awesome disponibles

	- `SISTEMA_CALIFICACION.md` — documentación completa creada (NUEVO - 400+ líneas):
		- **Secciones**:
			1. ¿Qué se implementó? (resumen de funcionalidad)
			2. Archivos creados/modificados (RatingModal, ProfileQualifications, etc.)
			3. Características del modal (header, categorías, nota final, comentario)
			4. Flujo de datos completo (diagrama paso a paso)
			5. Estructura de datos guardada (JSON examples)
			6. Estilos y responsive (breakpoints, colores, scrollbar)
			7. Checklist de funcionalidad (25+ items)
			8. TODOs para producción (usuario real, backend, restricciones)
			9. Troubleshooting (problemas comunes y soluciones)
			10. Capturas de funcionalidad (estados del modal)
			11. Cómo usar (guía paso a paso)
		- **Código de ejemplo**: snippets para integración con authStore y backend
		- **Configuración**: límites, validaciones, estilos personalizables

	### Características del sistema de calificación (18/11/2025):

	✅ **Modal de calificación completo**:
	- 3 categorías con 7 estrellas cada una
	- Nota final calculada automáticamente
	- Comentario obligatorio (15-500 chars)
	- Validación completa antes de enviar
	- Fecha automática en español
	- Usuario de prueba (preparado para authStore)

	✅ **Sistema de valoraciones**:
	- Escala 1-7 (sin conversión a corazones)
	- Promedios calculados por categoría
	- Nota final como promedio de las 3
	- ProfileAssessment muestra nota final
	- Mensaje por defecto cuando no hay datos

	✅ **Gestión de comentarios**:
	- Store reactivo centralizado (useProfileStore)
	- Comentarios se agregan al enviar modal
	- Primeros 3 en perfil (ProfileComents)
	- Todos en página dedicada (ComentsComponents)
	- Grid responsive 2 columnas en desktop

	✅ **Reset automático al recargar**:
	- ProfileComponents resetea store en onMounted
	- Todas las calificaciones vuelven a 0
	- Datos no persisten en localStorage
	- Ideal para desarrollo y testing

	✅ **UI/UX optimizada**:
	- Hover effects en estrellas (preview antes de seleccionar)
	- Contador de caracteres con feedback visual
	- Botones deshabilitados hasta validar
	- Mensajes por defecto cuando no hay datos
	- Word-wrap en textos largos
	- Layout equilibrado 50%-50% en desktop

	✅ **Responsive completo**:
	- Mobile: 1 columna, estrellas compactas
	- Tablet: transición suave
	- Desktop: 2 columnas balanceadas, estrellas grandes
	- Breakpoints: sm/md/lg optimizados

	✅ **Documentación exhaustiva**:
	- SISTEMA_CALIFICACION.md con 400+ líneas
	- Guía de uso paso a paso
	- Troubleshooting completo
	- TODOs para producción
	- Ejemplos de código

	⚠️ **Pendiente para producción**:
	- Integrar con authStore para usuario real
	- Conectar con backend (POST /api/ratings)
	- Restringir a una calificación por usuario
	- Implementar edición/eliminación de ratings
	- Agregar persistencia en base de datos
	- Reemplazar alerts por toast notifications

	### Flujo completo del sistema de calificación (18/11/2025):

	```
	Usuario carga perfil
	  └→ ProfileComponents.onMounted()
	     └→ profileStore.reset() — limpia datos anteriores
	        ├→ ProfileQualifications muestra 0.0 en todas las tarjetas
	        ├→ ProfileAssessment muestra "Aún no hay valoraciones"
	        └→ ProfileComents muestra "Aún no hay comentarios"

	Usuario hace click en "Calificar"
	  └→ RatingModal se abre (showRatingModal = true)
	     ├→ Usuario califica 3 categorías (1-7 estrellas)
	     ├→ Nota Final se calcula automáticamente (promedio)
	     ├→ Usuario escribe comentario (15+ caracteres)
	     └→ Usuario hace click en "Enviar Calificación"
	        ├→ Validación: ¿Todo completo?
	        │  ├→ NO: Botón deshabilitado
	        │  └→ SÍ: Continúa
	        ├→ Crea objeto newRating con todas las datos
	        ├→ profileStore.addComment(newRating)
	        ├→ profileStore.addAssessment(notaFinal) — guarda en escala 1-7
	        ├→ Muestra alert de confirmación
	        └→ Cierra modal y resetea formulario

	ProfileQualifications se actualiza reactivamente
	  ├→ userQualifications computed detecta nuevo comentario
	  ├→ Recalcula promedios por categoría
	  ├→ Muestra nuevas notas en las 4 tarjetas
	  └→ Tarjeta "Nota final" con borde dorado

	ProfileAssessment se actualiza reactivamente
	  ├→ totalAssessments computed detecta nueva valoración
	  ├→ averageRating computed calcula promedio
	  ├→ Muestra "Nota Final X.X/7"
	  └→ Muestra "N valoración(es)"

	ProfileComents se actualiza reactivamente
	  ├→ limitedComments computed detecta nuevo comentario
	  ├→ Muestra primeros 3 comentarios
	  └→ Cada tarjeta: usuario, fecha, comentario

	Usuario navega a /coments
	  └→ ComentsComponents se renderiza
	     ├→ comments computed obtiene todos desde store
	     ├→ Grid 2 columnas en desktop
	     └→ Muestra todos los comentarios con word-wrap
	```

	---

	### Desactivación Temporal de Autenticación del Chatbot (16/11/2025 - NUEVO)

	Se desactivó temporalmente la autenticación del chatbot para permitir testing y pruebas sin necesidad de login:

	- `src/store/chatBotStore.js` — modificado (3 puntos clave):
		- **Línea ~143** - `isUserAuthenticated()`:
			- ✅ Ahora retorna siempre `true` (forzado para testing)
			- 🔄 Para revertir: cambiar `return true` por `return authStore.isAuthenticated`
			- Comentario agregado: `⚠️ TEMPORAL: Forzando autenticación para testing`
			- Comentario agregado: `⚠️ REVERTIR: Cambiar 'return true' por 'return authStore.isAuthenticated'`
		
		- **Línea ~715** - `checkPermissionForAction()`:
			- ✅ Validación de login completamente comentada
			- Bloque `if (!this.isUserAuthenticated)` convertido a comentario multilínea
			- 🔄 Para revertir: descomentar el bloque de validación
			- Comentario agregado: `⚠️ TEMPORAL: Autenticación desactivada para testing`
			- Comentario agregado: `⚠️ REVERTIR: Descomentar las siguientes 6 líneas`
		
		- **Línea ~1883** - `getQuickReplies()`:
			- ✅ Filtro de menú para usuarios no autenticados comentado
			- Bloque `if (!authStore.isAuthenticated)` que limitaba opciones a "Ayuda" e "Iniciar sesión" desactivado
			- 🔄 Para revertir: descomentar el bloque de filtrado
			- Comentario agregado: `⚠️ TEMPORAL: Autenticación desactivada para testing`
			- Comentario agregado: `⚠️ REVERTIR: Descomentar las siguientes 7 líneas`

	- `REVERTIR_AUTENTICACION.md` — archivo de instrucciones creado (NUEVO):
		- **Propósito**: Guía detallada para reactivar la autenticación cuando sea necesario
		- **Contenido**:
			- Descripción de los 3 cambios realizados
			- Código "antes" y "después" de cada modificación
			- Números de línea exactos en chatBotStore.js
			- Instrucciones paso a paso para revertir
			- Resumen rápido de cambios
			- Lista de verificación post-reversión
		- **Marcadores visuales**: Todos los cambios en el código tienen `⚠️ TEMPORAL` y `⚠️ REVERTIR`
		- **Búsqueda rápida**: Usar Ctrl+F con "⚠️ TEMPORAL" o "⚠️ REVERTIR" para encontrar los puntos modificados

	### Características de la desactivación temporal (16/11/2025):

	✅ **Acceso sin restricciones**:
	- Chatbot completamente funcional sin necesidad de login
	- Todas las funciones de búsqueda disponibles:
		- Búsqueda por ubicación
		- Búsqueda por categoría (VIP, Premium, Normal, Masajistas)
		- Búsqueda por rango de precio
		- Recomendaciones personalizadas
	- Sistema de reportes accesible sin autenticación
	- Menú completo visible para todos los usuarios

	✅ **Documentación clara para revertir**:
	- Archivo dedicado `REVERTIR_AUTENTICACION.md` con instrucciones completas
	- Marcadores visuales en el código (⚠️ TEMPORAL y ⚠️ REVERTIR)
	- 3 cambios específicos documentados con números de línea
	- Código completo "antes y después" para cada cambio
	- Lista de verificación para confirmar que la reversión funcionó

	✅ **Testing facilitado**:
	- Permite probar el chatbot AMIN sin configurar backend de autenticación
	- Ideal para desarrollo y pruebas de funcionalidad
	- No requiere crear usuarios de prueba
	- Acceso inmediato a todas las características

	✅ **Reversión sencilla**:
	- Solo 3 puntos a modificar en un único archivo
	- Búsqueda rápida con marcadores especiales
	- Documentación detallada en REVERTIR_AUTENTICACION.md
	- Puede revertirse en menos de 5 minutos

	⚠️ **Importante**:
	- Esta configuración es **solo para desarrollo/testing**
	- **NO usar en producción** sin reactivar autenticación
	- Revertir cambios antes de deployment
	- El archivo REVERTIR_AUTENTICACION.md puede eliminarse después de revertir

	### Flujo actual del chatbot (16/11/2025 - SIN AUTENTICACIÓN):

	```
	Usuario accede a la aplicación
	  └→ Botón flotante de AMIN visible inmediatamente
	     └→ Click en botón flotante
	        └→ Chatbot se abre sin verificar autenticación
	           ├→ Saludo personalizado
	           └→ Menú completo con todas las opciones:
	              ├→ 🔍 Buscar hospedaje por ubicación
	              ├→ 🏷️ Buscar hospedaje por categoría
	              ├→ 💰 Buscar por rango de precio
	              ├→ ⭐ Ver hospedajes destacados
	              ├→ 📋 Crear reporte estándar
	              ├→ ⚡ Crear reporte express
	              ├→ 🏠 Navegar en la app
	              └→ ❓ Ayuda

	Usuario puede:
	  ✅ Buscar hospedajes libremente
	  ✅ Recibir recomendaciones
	  ✅ Ver detalles de hospedajes
	  ✅ Crear reportes
	  ✅ Usar todas las funciones sin restricción
	```

	### Sistema de Accesibilidad Completo (13/11/2025 - NUEVO)

	Se implementó un sistema integral de accesibilidad con 8 modos diferentes, botones flotantes y controles dinámicos de tamaño de texto:

	- `src/composables/useAccessibilityStore.js` — composable/store para gestión de accesibilidad (NUEVO):
		- `currentMode` ref: modo actual seleccionado (normal, blindness, dyslexia, etc.)
		- `textSize` ref: tamaño actual del texto (80-200%)
		- `textSizeConfig`: configuración personalizable de límites y pasos:
			- `min: 80` — tamaño mínimo (80%)
			- `max: 200` — tamaño máximo (200%)
			- `step: 10` — incremento por click (10%)
			- `default: 100` — tamaño por defecto (100%)
		- Métodos principales:
			- `setAccessibilityMode(modeId)` — cambia modo y aplica clase CSS
			- `increaseTextSize()` / `decreaseTextSize()` — controla tamaño de h1-h6 y párrafos
			- `resetTextSize()` — vuelve al 100%
			- `applyTextSize(size)` — aplica estilos dinámicos solo a títulos y párrafos
			- `loadAccessibilityMode()` — restaura configuración desde localStorage
		- Computed properties:
			- `isTextSizeAtMax` / `isTextSizeAtMin` — deshabilita botones en límites
			- `getCurrentMode()` — obtiene modo actual
		- Persistencia: guarda modo y tamaño en localStorage

	- `src/components/AccessiblityComponents.vue` — componente flotante de accesibilidad (NUEVO):
		- **Posicionamiento**: botón flotante dorado (#FFD700) en lado derecho, centrado verticalmente
		- **Botón principal**: icono de accesibilidad universal (universal-access)
		- **Panel desplegable**: 8 modos en grid flexible:
			1. **Normal** (icono eye) — modo estándar
			2. **Ceguera** (icono eye-slash) — optimizado para lectores de pantalla
			3. **Dislexia** (icono book) — fuente amigable y espaciado aumentado
			4. **Alto Contraste** (icono circle-half-stroke) — máximo contraste blanco/amarillo
			5. **Texto Grande** (icono text-height) — **ESPECIAL**: muestra botones + y - para control dinámico
			6. **Luz** (icono sun) — tema claro con máxima claridad
			7. **Sin Movimiento** (icono pause) — desactiva todas las animaciones
			8. **Descanso Visual** (icono moon) — tema oscuro relajante
		- **Control de tamaño (Modo Texto Grande)**:
			- Botón `-` para disminuir (deshabilitado al mínimo)
			- Displays porcentaje actual (80%-200%)
			- Botón `+` para aumentar (deshabilitado al máximo)
			- Solo afecta títulos (h1-h6) y párrafos (p)
		- **Interactividad**:
			- Click en modo activa/desactiva
			- Click fuera cierra panel
			- Transiciones suaves
			- Indicador visual de modo activo
		- **Estilos con Tailwind**:
			- Botones activos: fondo dorado, escala 110%, borde blanco
			- Botones inactivos: gris oscuro, hover con dorado
			- Panel: fondo gris oscuro, borde dorado, sombra 2xl
			- Responsive: adapta tamaños en mobile

	- `src/css/accessibilityBlindness.css` — modo ceguera:
		- Fondo negro (#000000), texto blanco (#ffffff)
		- Enlaces en amarillo (#ffff00) con subrayado
		- Bordes amarillos en inputs y botones
		- Oculta imágenes sin alt
		- Mayor espaciado (letter-spacing, line-height)

	- `src/css/accessibilityDyslexia.css` — modo dislexia:
		- Fuente OpenDyslexic (alternativa: Trebuchet MS)
		- Letter-spacing: 0.12em, line-height: 1.8-1.9
		- Fondo gris claro (#f5f5f5), texto negro
		- Enlaces azul (#0066cc) con subrayado
		- Botones con mayor espaciado interno

	- `src/css/accessibilityHighContrast.css` — modo alto contraste:
		- Fondo negro, texto blanco/amarillo (#ffff00)
		- Botones amarillo con texto negro (invertido)
		- Bordes de 2px en todos los elementos
		- Enlaces amarillo con subrayado
		- Inputs con fondo oscuro y bordes amarillos

	- `src/css/accessibilityLargeText.css` — modo texto grande:
		- Solo estilos base (line-height: 1.6)
		- El tamaño real se controla dinámicamente vía JavaScript
		- Multiplica tamaños base:
			- h1: 2x, h2: 1.75x, h3: 1.5x, h4: 1.25x, h5: 1.1x, h6: 1x
			- p, span, li: 1x
		- Configurable en `useAccessibilityStore.js`

	- `src/css/accessibilityLight.css` — modo luz:
		- Fondo blanco (#ffffff), texto negro (#000000)
		- Enlaces azul (#0066cc) con subrayado
		- Bordes negros en inputs (2px)
		- Mayor legibilidad general
		- Ideal para usuarios con sensibilidad a oscuridad

	- `src/css/accessibilityReduceMotion.css` — modo sin movimiento:
		- Desactiva todas las transiciones (transition: none !important)
		- Desactiva todas las animaciones (animation: none !important)
		- Elimina transforms y efectos de scroll suave
		- Previene mareos y náuseas por movimiento

	- `src/css/accessibilityVisualRest.css` — modo descanso visual:
		- Fondo oscuro (#1a1a2e), texto gris claro (#e0e0e0)
		- Acentos púrpura (#6c5ce7) y azul (#74b9ff)
		- Botones con fondo oscuro (#16213e) y bordes púrpura
		- Enlaces azul claro (#74b9ff)
		- Inputs con tema oscuro
		- Sin transiciones para reducir fatiga
		- Overlay hero: gradiente gris suave (rgba(60-100, 60-100, 60-100, 0-0.5))

	- `src/icons/icon.js` — actualizado:
		- Se agregaron iconos: `faPlus`, `faMinus` para controles de tamaño
		- Total de 40+ iconos Font Awesome disponibles globalmente

	- `src/main.js` — actualizado:
		- Importación de los 7 CSS de accesibilidad
		- Registro global de `AccessibilityComponents`

	### Características del sistema de accesibilidad (13/11/2025):

	✅ **8 modos accesibles**:
	- Normal, Ceguera, Dislexia, Alto Contraste, Texto Grande, Luz, Sin Movimiento, Descanso Visual
	- Cada modo con estilos CSS completos y optimizados
	- Transición suave entre modos

	✅ **Control dinámico de tamaño**:
	- Rango 80%-200% con incrementos de 10%
	- Solo afecta títulos y párrafos
	- Botones + y - se deshabilitan en límites
	- Muestra porcentaje actual
	- Persiste en localStorage

	✅ **Interfaz intuitiva**:
	- Botón flotante dorado en lado derecho
	- Panel desplegable con 8 modos en grid
	- Indicador visual de modo activo
	- Click fuera para cerrar
	- Responsive y accesible

	✅ **Personalización sencilla**:
	- Modificar límites en `textSizeConfig` (línea 11-14)
	- Ajustar multiplicadores en `baseSizes` (línea 168-176)
	- Agregar nuevos elementos (button, a, etc.)
	- Cambiar colores en archivos CSS

	✅ **Persistencia**:
	- localStorage guarda modo activo
	- localStorage guarda tamaño de texto
	- Se restaura automáticamente al recargar
	- Compatible con todos los navegadores modernos

## Dependencias principales usadas

- Vue 3 (script setup)
- Vite (dev server / build)
- Tailwind CSS (clases utilitarias)
- @fortawesome/* (fontawesome-svg-core, free-solid, free-regular, free-brands, vue-fontawesome)
- vue3-carousel (carruseles y slides)
- vue-router (navegación)

Revisa `package.json` para las versiones exactas instaladas.

## Cómo ejecutar (frontend)

Desde la carpeta `frontend/`:

```bash
# instalar dependencias (usa pnpm si lo usas)
pnpm install

# ejecutar en modo desarrollo
pnpm run dev

# construir para producción
pnpm run build

# servir build (opcional)
pnpm run preview
```

Si usas `npm` o `yarn`, reemplaza `pnpm` por tu gestor de paquetes preferido.

## Notas técnicas y recomendaciones

- Asegúrate de que el alias `@` esté configurado en `vite.config.js` (por defecto suele apuntar a `src/`). En múltiples archivos se usa `@/components/...`.
- Si agregas más tarjetas al carrusel o más logos al footer, el diseño se adaptará por las clases Tailwind; para agregar rutas reales, editar `path` dentro de los arrays en cada componente.
- Al modificar `tailwind.config.cjs`, vuelve a reiniciar el dev server para que las clases se recompilen.

## Sistema de Touch Events para Móviles (24/11/2025 - NUEVO)

Se implementó un sistema completo de directivas Vue personalizadas para eventos touch, optimizado para todos los navegadores móviles modernos y desktop.

### 🌐 Navegadores Soportados

✅ Chrome | ✅ Safari | ✅ Firefox | ✅ Edge | ✅ Samsung Internet  
✅ Opera | ✅ Brave | ✅ Vivaldi | ✅ DuckDuckGo | ✅ UC Browser

### 📱 Directivas Implementadas

- `src/directives/touch.js` — Sistema completo de directivas touch (NUEVO):
	- **v-tap**: Tap optimizado sin delay de 300ms
		- Reemplaza `@click` para mejor performance en móviles
		- Detecta automáticamente si el usuario se movió (no ejecuta si hay swipe)
		- Fallback a click en dispositivos sin touch
		- Uso: `v-tap="handler"` o `v-tap="{ handler, preventDefault: true }"`
	
	- **v-swipe**: Detectar deslizamientos en 4 direcciones
		- Soporta: left, right, up, down
		- Threshold configurable (50px por defecto)
		- Retorna información detallada: dirección, deltaX, deltaY, duración
		- Uso: `v-swipe="{ left: handler1, right: handler2 }"` o `v-swipe:left="handler"`
	
	- **v-pinch**: Zoom con dos dedos (pinch to zoom)
		- Detecta pinch in (acercar) y pinch out (alejar)
		- Calcula escala y delta en tiempo real
		- Ideal para galerías de imágenes
		- Uso: `v-pinch="{ in: zoomIn, out: zoomOut }"`
	
	- **v-long-press**: Mantener presionado
		- Timeout configurable (500ms por defecto)
		- Cancela automáticamente si hay movimiento
		- Ideal para menús contextuales
		- Uso: `v-long-press="handler"`

- `src/composables/useTouchGestures.js` — Composables avanzados para lógica compleja (NUEVO):
	- `useTouchGestures()` — Hook genérico con estado de touch completo
	- `useSwipeDetection()` — Swipe con detección de velocidad
	- `useTouchDrag()` — Drag and drop táctil
	- `usePullToRefresh()` — Pull to refresh (deslizar para actualizar)
	- `useMultiTouch()` — Multi-touch con pinch y rotate

- `TOUCH_DIRECTIVES.md` — Documentación completa con ejemplos (NUEVO - 400+ líneas):
	- Guía de uso para cada directiva
	- Ejemplos reales de implementación
	- Aplicación en componentes existentes
	- Configuración personalizada
	- Troubleshooting

### ✨ Características del Sistema

✅ **Sin delay de 300ms**: Tap instantáneo en todos los dispositivos
✅ **Detección inteligente**: Diferencia entre tap, swipe y long press
✅ **Cancelación automática**: No ejecuta tap si hay movimiento
✅ **Multi-touch support**: Pinch to zoom con dos dedos
✅ **Configuración global**: TOUCH_CONFIG editable en touch.js
✅ **Event listeners optimizados**: Passive listeners para mejor performance
✅ **Fallback automático**: Click normal en dispositivos sin touch
✅ **Memory leak prevention**: Limpieza automática de listeners en unmount

### 🎯 Aplicaciones Recomendadas

**RatingModal.vue** - Calificar con estrellas:
\`\`\`vue
<font-awesome-icon
  v-tap="() => rate(star)"
  :icon="isStarActive(star) ? 'star' : ['far', 'star']"
/>
\`\`\`

**MainHistory.vue** - Carrusel de historias:
\`\`\`vue
<div 
  v-swipe="{ left: nextStory, right: prevStory }"
  v-long-press="pauseStory"
>
  <!-- Contenido -->
</div>
\`\`\`

**ProfilePicture.vue** - Galería con zoom:
\`\`\`vue
<div v-pinch="{ in: zoomIn, out: zoomOut }">
  <img :style="{ transform: \`scale(\${scale})\` }" />
</div>
\`\`\`

**ChatBot.vue** - Navegación táctil:
\`\`\`vue
<button v-tap="sendMessage">Enviar</button>
<div v-swipe:down="closeChatBot">Desliza para cerrar</div>
\`\`\`

**NavbarComponents.vue** - Menú hamburguesa:
\`\`\`vue
<button v-tap="toggleMenu">☰</button>
<div v-swipe:left="closeMenu">Menu</div>
\`\`\`

### ⚙️ Configuración

Editar `src/directives/touch.js`:
\`\`\`javascript
const TOUCH_CONFIG = {
  tapTimeout: 200,        // ms - tiempo máximo para tap
  swipeThreshold: 50,     // px - distancia mínima para swipe
  longPressTimeout: 500,  // ms - tiempo para long press
  pinchThreshold: 10,     // px - sensibilidad del pinch
};
\`\`\`

### 📚 Documentación Completa

Ver `TOUCH_DIRECTIVES.md` para:
- Ejemplos detallados de cada directiva
- Aplicación en todos los componentes
- Troubleshooting común
- Best practices para touch events
- Configuración avanzada con composables

### 🔧 Integración en main.js

\`\`\`javascript
import TouchDirectives from "./directives/touch.js";

app.use(TouchDirectives); // Registra todas las directivas globalmente
\`\`\`

Ahora puedes usar `v-tap`, `v-swipe`, `v-pinch` y `v-long-press` en cualquier componente sin imports adicionales.

---

## Sistema de Navegación por Regiones y Foro de Experiencias (25/11/2025 - NUEVO)

Se implementó un sistema completo de navegación por regiones geográficas y un foro de experiencias con categorías, filtros y sistema de votación.

### 🗺️ Sistema de Regiones Geográficas

- `src/components/nav/Location.vue` — Selector de ubicación con regiones (ACTUALIZADO):
	- **3 regiones principales**: Norte, Centro, Sur
	- **8 ciudades por región** (24 ciudades totales):
		- **Norte**: Arica, Iquique, Antofagasta, Calama, Copiapó, Vallenar, Chañaral, Tocopilla
		- **Centro**: La Serena, Coquimbo, Ovalle, Valparaíso, Viña del Mar, Santiago, Rancagua, Talca
		- **Sur**: Concepción, Temuco, Valdivia, Puerto Montt, Osorno, Punta Arenas, Coyhaique, Castro
	- **Accordion behavior**: Click en región expande ciudades, otras se cierran automáticamente
	- **Estilos diferenciados**:
		- Región activa: solo texto dorado (#FFD700)
		- Ciudad activa: background dorado (#DAA520), texto negro, font-semibold
		- Ciudades con indentación (pl-8) para jerarquía visual
	- **Persistencia**: localStorage guarda última ciudad seleccionada
	- **Animaciones suaves**: Transiciones de 300ms en expand/collapse
	- **Botón principal**: Texto "Regiones" con icono map-marker-alt
	- **Dropdown compacto**: max-h-96 con scroll automático
	- **onMounted**: Carga ciudad guardada automáticamente

### 📝 Sistema de Foro de Experiencias

- `src/components/ForoComponents.vue` — Componente principal del foro (NUEVO - 700+ líneas):
	- **Categorías con tabs** (estilo MainNews.vue):
		- "Todos", "Clientes", "Chicas"
		- Separadores "|" entre categorías
		- Activo: bg-[#DAA520], text-white, shadow-lg
		- Inactivo: text-[#FFD700], hover con opacidad
		- Filtrado automático de posts por categoría seleccionada
	
	- **Filtros avanzados**:
		- **Dropdown de Ciudades**: 
			- Opción "Todas las ciudades" en la parte superior
			- 3 regiones (Norte, Centro, Sur) con accordion
			- Ciudades indentadas bajo cada región
			- Región activa: texto dorado
			- Ciudad activa: background #DAA520
			- max-h-80 con scroll
		- **Select de Ordenamiento**:
			- "Más recientes" (ordena por fecha descendente)
			- "Más votados" (ordena por cantidad de likes)
			- Dropdown simple con estilos consistentes
	
	- **Modal "Crear nuevo post"**:
		- **Campos del formulario**:
			- Alias (input text)
			- Ciudad (dropdown con 3 regiones en accordion, igual que Location.vue)
			- Categoría (select: Clientes/Chicas)
			- Título del post (input text)
			- Comentario (textarea, 6 filas)
		- **Validación completa**: alert si faltan campos
		- **Diseño**: Borde dorado 2px, rounded-2xl, max-w-2xl
		- **Header**: Título + botón cerrar (X)
		- **Footer**: Botón "Publicar" dorado full-width
		- **Comportamiento**: 
			- Click en input de ciudad abre dropdown de regiones
			- Select de categoría con opciones predefinidas
			- Close con X o click fuera del modal
			- Reset completo del formulario al cerrar
	
	- **Botón "Nuevo Post"**:
		- Ubicado debajo del párrafo descriptivo
		- Icono plus (#plus) + texto "Nuevo Post"
		- Estilo: bg-[#FFD000], hover bg-[#FFB200]
		- Abre modal al hacer click
	
	- **Estados y lógica**:
		- `posts` ref: array de posts guardados en localStorage
		- `activeCategory` ref: categoría activa (todos/clientes/chicas)
		- `selectedCity` ref: ciudad seleccionada para filtrar
		- `sortBy` ref: criterio de ordenamiento (recientes/votados)
		- `filterRegions` ref: regiones para el dropdown de filtro (separadas del modal)
		- `regions` ref: regiones para el modal de crear post
		- `filteredPosts` computed: aplica filtros + ordenamiento
		- `toggleFilterRegion()`: accordion en filtro de ciudades
		- `selectCity()`: selecciona ciudad y cierra regiones
		- `publishPost()`: valida, crea post, guarda en localStorage
	
	- **Estructura de post guardado**:
		```javascript
		{
		  id: Date.now(),
		  alias: "Usuario1",
		  city: "Santiago",
		  category: "Clientes",
		  title: "Excelente experiencia",
		  comment: "Muy buena atención...",
		  date: new Date().toISOString(),
		  likes: 0,
		  dislikes: 0
		}
		```

- `src/components/main/ForoCards.vue` — Tarjetas de posts del foro (NUEVO):
	- **Grid responsive**: 1 col mobile, 2 cols tablet, 3 cols desktop
	- **Mensaje por defecto**: "Aún no hay foros disponibles" con icono comments
	- **Cada tarjeta incluye**:
		- **Header**:
			- Icono user-circle + alias del usuario
			- Ciudad + fecha (formatDate en español)
			- Badge de categoría (Clientes: azul, Chicas: rosa)
		- **Contenido**:
			- Título del post (text-[#FFD700], font-bold)
			- Comentario con line-clamp-3 (máx 3 líneas)
		- **Footer** (votación):
			- Botón like (thumbs-up) con contador
			- Botón dislike (thumbs-down) con contador
			- Contador de comentarios (0 por ahora)
			- Hover: like verde, dislike rojo
	- **Emisión de eventos**: @vote con { postId, voteType }
	- **Estilos**:
		- Borde dorado 2px, rounded-xl
		- Hover: shadow-lg con sombra dorada
		- Transiciones suaves (300ms)
		- Gap de 4-6px entre tarjetas

- `src/components/TitleForoComponents.vue` — Título del foro (NUEVO):
	- Componente reutilizable para título H2
	- Props: `title` (required)
	- Clases base: text-xl → text-5xl responsive
	- Color: text-[#A2A2A2]
	- Acepta clases adicionales via attrs.class
	- Uso: `<title-foro-components title="Foro de experiencias..." />`

- `src/components/buttons/Button4Components.vue` — Botón rojo (NUEVO):
	- Botón rojo para destacar "Foro" en el menú
	- bg-[#FF2600], hover bg-[#FF5700]
	- Mismo patrón que Button2Components y Button3Components
	- Computed classes con soporte para disabled
	- Emite evento @click
	- Uso: `<button4-components>Texto</button4-components>`

- `src/views/ForoViews.vue` — Vista del foro (NUEVO):
	- Vista simple que renderiza ForoComponents
	- Registrada en router como `/forum`
	- Meta title: "Foro - Angeles y Demonios"

- `src/components/nav/Lists.vue` — Menú hamburguesa (ACTUALIZADO):
	- Agregado botón "Foro" en sección "Acciones"
	- Importa Button4Components (botón rojo)
	- router-link a `/forum`
	- Icono message + texto "Foro"
	- Orden: Acceder → Registro → Publicar → Contacto → **Foro**

- `src/router/index.js` — Router (ACTUALIZADO):
	- Nueva ruta `/forum`:
		- name: "Foro"
		- component: ForoViews
		- meta.title: "Foro - Angeles y Demonios"
	- Importa ForoViews desde `@/views/ForoViews.vue`

- `src/icons/icon.js` — Iconos (ACTUALIZADO):
	- **7 nuevos iconos agregados**:
		- `faUserCircle` — avatar de usuario en posts
		- `faComments` — mensaje "sin posts"
		- `faThumbsUp` — like en posts
		- `faThumbsDown` — dislike en posts
		- `faComment` — contador de comentarios
		- `faTimes` — cerrar modal
		- `faSort` — icono de ordenamiento
	- Total: 49+ iconos Font Awesome disponibles

### ✨ Características del Sistema de Foro (25/11/2025)

✅ **Sistema completo de posts**:
- Crear posts con alias, ciudad, categoría, título y comentario
- Validación completa de campos obligatorios
- Modal con diseño consistente (borde dorado)
- Formulario con regiones en accordion
- localStorage para persistencia de posts

✅ **Filtros avanzados**:
- Filtro por categoría (Todos/Clientes/Chicas) con tabs
- Filtro por ciudad con 3 regiones en accordion
- Ordenamiento por más recientes o más votados
- Opción "Todas las ciudades" para ver todos
- Filtros combinables (categoría + ciudad + orden)

✅ **Sistema de votación**:
- Like y dislike con contadores independientes
- Actualización en tiempo real
- Persistencia en localStorage
- Hover effects (verde para like, rojo para dislike)
- Preparado para futuro sistema de comentarios

✅ **Navegación mejorada**:
- Location.vue con 3 regiones (Norte, Centro, Sur)
- 8 ciudades por región (24 totales)
- Accordion: una región abierta a la vez
- Persistencia de última ciudad seleccionada
- Botón "Foro" en menú hamburguesa

✅ **UI/UX optimizada**:
- Tabs con separadores "|" estilo MainNews.vue
- Grid responsive 1/2/3 columnas
- Line-clamp en comentarios (máx 3 líneas)
- Badges de categoría con colores diferenciados
- Animaciones suaves (300ms)
- Mensaje por defecto cuando no hay posts

✅ **Diseño consistente**:
- Paleta dorada (#FFD700, #DAA520, #FFD000)
- Bordes dorados en modales y tarjetas
- Hover effects en todos los elementos interactivos
- Clases mode- para compatibilidad con accesibilidad
- Responsive mobile/tablet/desktop

✅ **Persistencia completa**:
- Posts guardados en localStorage (key: "foroPosts")
- Última ciudad guardada (key: "selectedCity")
- Categoría activa restaurada al navegar
- Filtros preservados durante la sesión

### 📊 Estructura de Datos del Foro (25/11/2025)

**Post completo en localStorage**:
```javascript
{
  id: 1732582400000,
  alias: "Juan123",
  city: "Santiago",
  category: "Clientes",
  title: "Excelente servicio en Santiago Centro",
  comment: "Muy buena atención, ambiente agradable y profesionalismo...",
  date: "2025-11-25T14:30:00.000Z",
  likes: 5,
  dislikes: 1
}
```

**Regiones disponibles** (Norte, Centro, Sur):
```javascript
[
  {
    id: "norte",
    name: "Norte",
    isOpen: false,
    cities: ["Arica", "Iquique", "Antofagasta", "Calama", "Copiapó", "Vallenar", "Chañaral", "Tocopilla"]
  },
  {
    id: "centro",
    name: "Centro",
    isOpen: false,
    cities: ["La Serena", "Coquimbo", "Ovalle", "Valparaíso", "Viña del Mar", "Santiago", "Rancagua", "Talca"]
  },
  {
    id: "sur",
    name: "Sur",
    isOpen: false,
    cities: ["Concepción", "Temuco", "Valdivia", "Puerto Montt", "Osorno", "Punta Arenas", "Coyhaique", "Castro"]
  }
]
```

### 🔄 Flujo Completo del Foro (25/11/2025)

```
Usuario navega a /forum
  └→ ForoViews renderiza ForoComponents
     ├→ onMounted() carga posts desde localStorage
     ├→ Muestra tabs de categorías (Todos activo por defecto)
     ├→ Muestra filtros (ciudad + ordenamiento)
     └→ Renderiza ForoCards con filteredPosts

Usuario hace click en "Nuevo Post"
  └→ Modal se abre (isModalOpen = true)
     ├→ Usuario llena formulario:
     │  ├→ Alias: "Usuario1"
     │  ├→ Ciudad: Click → abre regiones → selecciona "Santiago"
     │  ├→ Categoría: Select → "Clientes"
     │  ├→ Título: "Excelente servicio"
     │  └→ Comentario: "Muy buena atención..."
     ├→ Click en "Publicar"
     ├→ Validación: ¿Todos los campos completos?
     │  ├→ NO: Alert "Por favor completa todos los campos"
     │  └→ SÍ: Continúa
     ├→ Crea objeto newPost con id único (Date.now())
     ├→ posts.unshift(newPost) — agrega al inicio del array
     ├→ localStorage.setItem("foroPosts", JSON.stringify(posts))
     ├→ closeModal() — resetea formulario
     └→ ForoCards se actualiza reactivamente

Usuario filtra por categoría "Clientes"
  └→ setCategory("clientes")
     ├→ activeCategory.value = "clientes"
     ├→ filteredPosts computed se recalcula
     ├→ Filtra posts donde post.category === "Clientes"
     └→ ForoCards muestra solo posts de clientes

Usuario selecciona ciudad "Valparaíso" (región Centro)
  └→ Click en dropdown de ciudad
     ├→ isCityDropdownOpen = true
     ├→ Click en región "Centro"
     │  └→ toggleFilterRegion("centro") — expande ciudades
     ├→ Click en "Valparaíso"
     │  ├→ selectedCity.value = "Valparaíso"
     │  ├→ Cierra todas las regiones
     │  └→ isCityDropdownOpen = false
     ├→ filteredPosts computed se recalcula
     ├→ Filtra posts donde post.city === "Valparaíso"
     └→ ForoCards muestra solo posts de Valparaíso

Usuario cambia ordenamiento a "Más votados"
  └→ changeSortBy("votados")
     ├→ sortBy.value = "votados"
     ├→ filteredPosts computed se recalcula
     ├→ Ordena posts: [...filtered].sort((a, b) => b.likes - a.likes)
     └→ ForoCards muestra posts ordenados por likes

Usuario hace like en un post
  └→ handleVote({ postId: 123, voteType: "like" })
     ├→ Encuentra post en array: posts.find(p => p.id === 123)
     ├→ Incrementa post.likes++
     ├→ localStorage.setItem("foroPosts", JSON.stringify(posts))
     └→ ForoCards se actualiza con nuevo contador
```

### ⚙️ Configuración y Personalización (25/11/2025)

**Agregar más ciudades a una región**:
```javascript
// En ForoComponents.vue, líneas 20-67
const filterRegions = ref([
  {
    id: "norte",
    name: "Norte",
    isOpen: false,
    cities: [
      "Arica",
      "Iquique",
      "Antofagasta",
      "Calama",
      "Copiapó",
      "Vallenar",
      "Chañaral",
      "Tocopilla",
      // Agregar aquí nuevas ciudades
      "Taltal",
      "Diego de Almagro"
    ],
  },
  // ... otras regiones
]);
```

**Cambiar colores de categorías**:
```javascript
// En ForoCards.vue, líneas 100-105
post.category === 'Clientes'
  ? 'bg-blue-500/20 text-blue-400'  // Cambiar azul aquí
  : 'bg-pink-500/20 text-pink-400'  // Cambiar rosa aquí
```

**Agregar nueva categoría**:
```javascript
// En ForoComponents.vue, líneas 131-135
const categories = [
  { id: "todos", label: "Todos" },
  { id: "clientes", label: "Clientes" },
  { id: "chicas", label: "Chicas" },
  { id: "trans", label: "Trans" }, // Nueva categoría
];
```

**Modificar ordenamiento**:
```javascript
// En ForoComponents.vue, líneas 138-141
const sortOptions = [
  { value: "recientes", label: "Más recientes" },
  { value: "votados", label: "Más votados" },
  { value: "comentados", label: "Más comentados" }, // Nueva opción
];
```

### 🎯 TODOs para Producción (25/11/2025)

⚠️ **Backend requerido**:
- Crear endpoint POST /api/forum/posts (crear post)
- Crear endpoint GET /api/forum/posts (listar posts con filtros)
- Crear endpoint PUT /api/forum/posts/:id/vote (votar post)
- Crear endpoint GET /api/forum/cities (obtener ciudades dinámicas)
- Implementar autenticación: solo usuarios logueados pueden postear
- Implementar límite de posts por usuario/día

⚠️ **Mejoras UI/UX**:
- Sistema de comentarios en cada post (modal o página dedicada)
- Editar/eliminar posts propios
- Reportar posts inapropiados
- Imágenes en posts (opcional)
- Reacciones más allá de like/dislike (emojis)
- Notificaciones de nuevos comentarios

⚠️ **Seguridad**:
- Sanitizar inputs antes de guardar (prevenir XSS)
- Validación de datos en backend
- Rate limiting para evitar spam
- Moderación de contenido inapropiado
- Bloqueo de usuarios abusivos

⚠️ **Optimización**:
- Paginación de posts (cargar de 10 en 10)
- Infinite scroll en lugar de "Ver más"
- Lazy loading de imágenes en posts
- Debounce en filtros de búsqueda
- Cache de posts en memoria (Vuex/Pinia)

---

## Mejoras en Accesibilidad y Componentes (26/11/2025 - NUEVO)

Se implementaron múltiples mejoras en accesibilidad, estilos de componentes y correcciones de diseño responsive.

### 🎨 Mejoras en Sistema de Accesibilidad

- `src/components/AccessiblityComponents.vue` — Panel de accesibilidad (ACTUALIZADO):
	- **Diseño responsive mejorado**:
		- Botones: 12x12px (mobile) → 16x16px (desktop)
		- Panel: `max-w-2xs sm:max-w-xs md:max-w-sm` con flex-wrap
		- Gap reducido a 2px entre botones para compactar en mobile
	- **Modo Large Text optimizado**:
		- Controles + y - con diseño compacto
		- Display de porcentaje actual (80%-200%)
		- Botones deshabilitados en límites con opacity-50
		- Icons minus/plus con text-xs
		- Espaciado interno reducido (p-1)

- `src/css/accessibilityHighContrast.css` — Modo Alto Contraste (ACTUALIZADO):
	- **Nuevas clases agregadas**:
		- `.mode-select` — background negro para selects/dropdowns
		- `.mode-login` — background transparente para inputs de login
	- **Estilos existentes preservados**:
		- mode-title, mode-paragraph, mode-icon-menu (blanco)
		- mode-card, mode-nav-card, mode-body (negro)
		- mode-btn (amarillo con texto negro)
		- mode-input, mode-btn-acces (amarillo)
		- mode-register-input (blanco)
		- mode-icon-eyes (transparente)

- `src/css/accessibilityVisualRest.css` — Modo Descanso Visual (ACTUALIZADO):
	- **Nueva clase agregada**:
		- `.mode-foro` — background #2a2a2a (gris oscuro) para componentes del foro
	- **Estilos existentes preservados**:
		- mode-card, mode-nav-card, mode-body, mode-access-card (gris oscuro #2a2a2a)
		- mode-title, mode-paragraph, mode-icon-menu (gris claro #d9d9d9)
		- mode-bg-hero (gradiente gris suave)

### 🔧 Mejoras en Componentes del Foro

- `src/components/ForoComponents.vue` — Componente principal del foro (ACTUALIZADO):
	- **Clases de accesibilidad agregadas**:
		- Categorías (tabs): `mode-paragraph` en botones y separadores
		- Botones activos: `mode-btn`
		- Botones inactivos: `mode-btn-location cursor-pointer`
		- Separador "|": text-sm md:text-base font-bold
		- Párrafo descriptivo: text-sm → text-2xl responsive
	- **Filtros mejorados**:
		- Dropdown ciudad: `mode-carac-btn mode-select mode-foro`
		- Chevron: `cursor-pointer` en todos los iconos de rotación
		- Panel dropdown: `mode-icon-profile mode-nav-card`
		- Dropdown ordenamiento: `mode-carac-btn mode-select mode-foro`
	- **Modal actualizado**:
		- Background: `bg-black/70 backdrop-blur-sm` (antes bg-black/80)
		- Container: `mode-card bg-gray-900/50` (antes bg-[#1a1a1a])
		- Botón cerrar: `cursor-pointer mode-icon` + aria-label
		- Inputs: `mode-input mode-register-input` (fondo blanco, texto gris oscuro)
		- Select categoría: `mode-input mode-register-input cursor-pointer`
		- Textarea: `mode-input mode-register-input`
		- Chevron ciudad: `cursor-pointer` (antes pointer-events-none)
		- Placeholder colors: `placeholder-gray-400`

- `src/components/main/ForoCards.vue` — Tarjetas del foro (ACTUALIZADO):
	- **Clase de accesibilidad**:
		- Tarjetas: `mode-card` agregado para compatibilidad con modos
	- **Eliminado**:
		- Hover effect `lg:hover:shadow-lg lg:hover:shadow-[#FFD700]/20`
		- Simplificación de estilos para mejor performance

### 📝 Mejoras en Componentes de Comentarios y Perfiles

- `src/components/ComentsComponents.vue` — Página de comentarios (ACTUALIZADO):
	- **Clases de accesibilidad agregadas**:
		- Tarjetas: `mode-card`
		- Título (usuario): `mode-title`
		- Fecha: `mode-paragraph`
	- **Sin cambios en estructura**: Grid 2 columnas preservado

- `src/components/ProfileComponents.vue` — Perfil completo (ACTUALIZADO):
	- **Características actualizadas**:
		- Badges: font-semibold en lugar de font-medium
		- Hover: `lg:hover:bg-[#FFD700] lg:hover:text-black` (solo desktop)
	- **Comentario agregado**:
		- Datos de API comentados con ejemplo de axios
		- useRoute y fetchProfile preparados para integración

- `src/components/main/profile/RatingModal.vue` — Modal de calificación (ACTUALIZADO):
	- **Diseño optimizado**:
		- Container: `mode-card` agregado
		- Header/Footer: sin sticky (antes sticky top-0/bottom-0)
		- Botón cerrar: `cursor-pointer mode-icon` + aria-label
		- Botón cancelar: `cursor-pointer mode-paragraph`
	- **Sin cambios funcionales**: Lógica de calificación preservada

### 🗺️ Mejoras en Navegación

- `src/components/nav/Location.vue` — Selector de regiones (ACTUALIZADO):
	- **Wrapper actualizado**:
		- Div principal: `mode-nav-card` agregado (antes solo borde)
	- **Chevrons mejorados**:
		- Todos los chevron-down: `cursor-pointer` agregado
	- **Botones de ciudad**:
		- `cursor-pointer` agregado para consistencia
	- **Sin cambios en lógica**: Accordion de regiones preservado

### 🎭 Mejoras en Componentes Visuales

- `src/components/main/MainNews.vue` — Carrusel de novedades (ACTUALIZADO):
	- **Categorías (tabs) mejoradas**:
		- Botones: `mode-paragraph` agregado
		- Activos: `mode-btn`
		- Inactivos: `mode-btn-location cursor-pointer`
		- Separador "|": `mode-paragraph`
	- **Estilos preservados**: Layout responsive, grid, transiciones

- `src/components/buttons/ButtonAnimatedComponent.vue` — Input animado (ACTUALIZADO):
	- **Clases de accesibilidad**:
		- Input: `mode-input mode-login` agregado
		- Label span: `mode-paragraph`
	- **Sin cambios en animación**: Letter-by-letter animation preservada

- `src/components/main/form/LoginComponents.vue` — Formulario de login (ACTUALIZADO):
	- **Componentes actualizados**:
		- ButtonAnimatedComponent → button-animated-component (kebab-case)
	- **Sin cambios funcionales**: Validación y lógica preservadas

### ✨ Características de las Mejoras (26/11/2025)

✅ **Accesibilidad mejorada**:
- Todas las clases mode- aplicadas consistentemente
- Compatibilidad con 8 modos de accesibilidad
- Estilos diferenciados para alto contraste y descanso visual
- Inputs y selects con backgrounds correctos en cada modo

✅ **Responsive optimizado**:
- Panel de accesibilidad compacto en mobile
- Botones escalables según breakpoint
- Texto responsive en todos los componentes
- Gap reducido para mejor uso del espacio

✅ **UX mejorada**:
- Cursor pointer en todos los elementos clickeables
- Aria-labels en botones de cerrar
- Hover effects solo en desktop (lg:hover)
- Placeholders con colores consistentes

✅ **Consistencia visual**:
- Separadores "|" con font-bold
- Chevrons con cursor-pointer
- Clases mode- en todos los componentes
- Estilos uniformes en modales

✅ **Performance**:
- Eliminados hover effects innecesarios
- Backdrop-blur en modales
- Transitions optimizadas
- Clases reutilizables

✅ **Preparación para backend**:
- Comentarios con ejemplos de API
- useRoute preparado en ProfileComponents
- fetchProfile comentado para futura integración
- Estructura de datos documentada

### 🎯 Componentes Actualizados (26/11/2025)

**Total: 11 archivos modificados**

1. **AccessiblityComponents.vue** — Panel responsive mejorado
2. **accessibilityHighContrast.css** — mode-select y mode-login
3. **accessibilityVisualRest.css** — mode-foro
4. **ForoComponents.vue** — Clases de accesibilidad completas
5. **ForoCards.vue** — mode-card agregado
6. **ComentsComponents.vue** — mode-card y mode-title
7. **ProfileComponents.vue** — Hover solo desktop
8. **RatingModal.vue** — mode-card y cursor-pointer
9. **Location.vue** — mode-nav-card y cursor-pointer
10. **MainNews.vue** — mode-paragraph en tabs
11. **ButtonAnimatedComponent.vue** — mode-input mode-login

### 📊 Clases de Accesibilidad Implementadas (26/11/2025)

**Nuevas clases agregadas a CSS**:
- `mode-select` — Backgrounds para selects en alto contraste
- `mode-login` — Inputs transparentes para formularios de login
- `mode-foro` — Background oscuro para componentes del foro

**Clases aplicadas en componentes**:
- `mode-card` — Todas las tarjetas y modales
- `mode-paragraph` — Textos descriptivos, labels, separadores
- `mode-title` — Títulos de secciones y nombres de usuario
- `mode-btn` — Botones activos y principales
- `mode-btn-location` — Botones inactivos de navegación
- `mode-input` — Todos los inputs y textareas
- `mode-register-input` — Inputs de formularios (fondo blanco)
- `mode-icon` — Iconos de Font Awesome
- `mode-icon-profile` — Iconos en dropdowns y perfiles
- `mode-nav-card` — Componentes de navegación
- `mode-carac-btn` — Botones de características
- `mode-foro` — Dropdowns y selects del foro

### 🔄 Flujo de Accesibilidad Completo (26/11/2025)

```
Usuario activa modo "Alto Contraste"
  └→ AccessibilityComponents aplica clase "high-contrast-mode" al body
     ├→ ForoComponents: mode-select aplica bg negro a dropdowns
     ├→ ButtonAnimatedComponent: mode-login hace inputs transparentes
     ├→ ComentsComponents: mode-card aplica bg negro a tarjetas
     ├→ ProfileComponents: mode-carac-btn aplica bg amarillo a badges
     └→ Location.vue: mode-nav-card aplica bg negro a navegación

Usuario activa modo "Descanso Visual"
  └→ AccessibilityComponents aplica clase "visual-rest-mode" al body
     ├→ ForoComponents: mode-foro aplica bg #2a2a2a a dropdowns
     ├→ MainNews.vue: mode-paragraph aplica color #d9d9d9 a textos
     ├→ ForoCards: mode-card aplica bg #2a2a2a a tarjetas
     └→ RatingModal: mode-card aplica bg #2a2a2a al modal

Usuario activa modo "Texto Grande"
  └→ AccessibilityComponents muestra controles + y -
     ├→ Click en "+" incrementa textSize de 100% a 110%
     ├→ useAccessibilityStore aplica estilos dinámicos:
     │  ├→ h1-h6 escalan según multiplicadores
     │  └→ p, span, li escalan a 110%
     ├→ Todos los textos con mode-paragraph se agrandan
     └→ Layout responsive se ajusta automáticamente
```

### ⚙️ Configuración de Estilos de Accesibilidad (26/11/2025)

**Agregar nueva clase mode en Alto Contraste**:
```css
/* En accessibilityHighContrast.css */
.high-contrast-mode .mode-nueva-clase {
  background-color: #000;
  color: #fff;
  border: 2px solid #ffff00;
}
```

**Agregar nueva clase mode en Descanso Visual**:
```css
/* En accessibilityVisualRest.css */
.visual-rest-mode .mode-nueva-clase {
  background-color: #2a2a2a;
  color: #d9d9d9;
}
```

**Aplicar clase en componente**:
```vue
<div class="mode-nueva-clase">
  <!-- Contenido adaptable a modos de accesibilidad -->
</div>
```

---

## Siguientes pasos sugeridos

1. Conectar componentes a un backend para obtener datos dinámicos (stories, noticias, destacadas, foro).
2. Añadir tests unitarios para componentes clave (carrusel, navbar, footer, foro).
3. Optimizar imágenes y usar lazy-loading en las cards para mejorar rendimiento.
4. Implementar sistema de comentarios en posts del foro.
5. Agregar autenticación completa para crear posts (integrar con authStore).
6. Implementar backend para sistema de calificaciones (POST /api/ratings).
7. Agregar paginación en lista de comentarios (ComentsComponents).
8. Crear tests para modos de accesibilidad (verificar contraste, tamaños).

---

Si quieres, puedo:

- Crear un `CHANGELOG.md` con cada commit relevante y mensajes sugeridos.
- Abrir un PR con estas modificaciones (si necesitas que lo haga y me das permiso para crear branches/commits en tu repo).

Si quieres que añada más detalles (por ejemplo versiones exactas de paquetes, diffs de cambios, o screenshots embebidos), dime qué prefieres y lo incluyo.

