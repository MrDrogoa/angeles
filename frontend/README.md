# Angeles y Demonios — Frontend (Vue 3 + Vite)

Este README resume, de forma detallada, los cambios y componentes que se implementaron recientemente (hoy y ayer) en la carpeta `frontend/` del proyecto.

Contenido
- Resumen ejecutivo
- Lista de archivos / componentes creados o modificados
- Descripción funcional por componente
- Dependencias relevantes
- Cómo ejecutar el proyecto (dev / build)
- Notas y siguientes pasos

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

## Siguientes pasos sugeridos

1. Conectar componentes a un backend para obtener datos dinámicos (stories, noticias, destacadas).
2. Añadir tests unitarios para componentes clave (carrusel, navbar, footer).
3. Optimizar imágenes y usar lazy-loading en las cards para mejorar rendimiento.

---

Si quieres, puedo:

- Crear un `CHANGELOG.md` con cada commit relevante y mensajes sugeridos.
- Abrir un PR con estas modificaciones (si necesitas que lo haga y me das permiso para crear branches/commits en tu repo).

Si quieres que añada más detalles (por ejemplo versiones exactas de paquetes, diffs de cambios, o screenshots embebidos), dime qué prefieres y lo incluyo.

