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

