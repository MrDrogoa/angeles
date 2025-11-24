# 📱 Guía de Directivas Touch para Vue 3

Sistema completo de eventos touch optimizado para todos los navegadores móviles y desktop.

## 🌐 Navegadores Soportados

✅ Chrome | ✅ Safari | ✅ Firefox | ✅ Edge | ✅ Samsung Internet  
✅ Opera | ✅ Brave | ✅ Vivaldi | ✅ DuckDuckGo | ✅ UC Browser

---

## 🎯 Directivas Disponibles

### 1. **v-tap** - Tap optimizado (sin delay 300ms)

Reemplaza `@click` para mejor performance en móviles.

#### **Uso básico:**
\`\`\`vue
<template>
  <button v-tap="handleTap">Click me</button>
</template>

<script setup>
const handleTap = (event) => {
  console.log('Tap detectado!', event);
};
</script>
\`\`\`

#### **Con opciones:**
\`\`\`vue
<button v-tap="{ handler: handleTap, preventDefault: true }">
  Tap con preventDefault
</button>
\`\`\`

#### **Ejemplo real - Estrellas de calificación:**
\`\`\`vue
<template>
  <div class="rating-stars">
    <font-awesome-icon
      v-for="star in 7"
      :key="star"
      v-tap="() => rate(star)"
      :icon="isStarActive(star) ? 'star' : ['far', 'star']"
      class="star-icon"
    />
  </div>
</template>

<script setup>
const rate = (stars) => {
  ratings.value.lugar = stars;
};
</script>
\`\`\`

---

### 2. **v-swipe** - Detectar deslizamientos

Para carruseles, modales, navegación.

#### **Uso básico (todas las direcciones):**
\`\`\`vue
<template>
  <div v-swipe="{ 
    left: handleSwipeLeft, 
    right: handleSwipeRight,
    up: handleSwipeUp,
    down: handleSwipeDown
  }">
    Desliza en cualquier dirección
  </div>
</template>

<script setup>
const handleSwipeLeft = ({ direction, deltaX, deltaY, duration }) => {
  console.log('Swipe left detectado!', deltaX);
  // Ir a la siguiente imagen/slide
};

const handleSwipeRight = ({ direction, deltaX }) => {
  console.log('Swipe right detectado!', deltaX);
  // Ir a la anterior imagen/slide
};
</script>
\`\`\`

#### **Uso con modificador (una sola dirección):**
\`\`\`vue
<template>
  <!-- Solo detecta swipe a la izquierda -->
  <div v-swipe:left="handleSwipeLeft">
    Desliza a la izquierda
  </div>
  
  <!-- Solo detecta swipe a la derecha -->
  <div v-swipe:right="handleSwipeRight">
    Desliza a la derecha
  </div>
</template>
\`\`\`

#### **Ejemplo real - Carrusel de historias:**
\`\`\`vue
<template>
  <div v-swipe="{ 
    left: nextSlide, 
    right: prevSlide 
  }" class="carousel">
    <img :src="slides[currentIndex]" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentIndex = ref(0);
const slides = ref([...]);

const nextSlide = () => {
  if (currentIndex.value < slides.value.length - 1) {
    currentIndex.value++;
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>
\`\`\`

#### **Ejemplo real - Cerrar modal con swipe down:**
\`\`\`vue
<template>
  <div v-if="show" v-swipe:down="closeModal" class="modal">
    <div class="modal-content">
      Desliza hacia abajo para cerrar
    </div>
  </div>
</template>

<script setup>
const closeModal = () => {
  emit('close');
};
</script>
\`\`\`

---

### 3. **v-pinch** - Zoom con dos dedos

Para imágenes, galerías, mapas.

#### **Uso básico:**
\`\`\`vue
<template>
  <div v-pinch="{ 
    in: handleZoomIn, 
    out: handleZoomOut 
  }" class="image-container">
    <img :src="imageUrl" :style="{ transform: \`scale(\${scale})\` }" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const scale = ref(1);

const handleZoomIn = ({ scale: newScale, delta }) => {
  console.log('Zoom in!', newScale);
  scale.value = Math.min(newScale, 3); // Máximo 3x
};

const handleZoomOut = ({ scale: newScale, delta }) => {
  console.log('Zoom out!', newScale);
  scale.value = Math.max(newScale, 0.5); // Mínimo 0.5x
};
</script>
\`\`\`

#### **Ejemplo real - Galería de imágenes del perfil:**
\`\`\`vue
<template>
  <div class="profile-gallery">
    <div
      v-for="img in images"
      :key="img.id"
      v-pinch="{ in: zoomIn, out: zoomOut }"
      class="image-wrapper"
    >
      <img 
        :src="img.url" 
        :style="{ transform: \`scale(\${currentScale})\` }"
        class="zoomable-image"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentScale = ref(1);

const zoomIn = ({ scale }) => {
  currentScale.value = Math.min(scale, 4);
};

const zoomOut = ({ scale }) => {
  currentScale.value = Math.max(scale, 1);
};
</script>

<style scoped>
.image-wrapper {
  overflow: hidden;
  touch-action: none; /* Importante para pinch */
}

.zoomable-image {
  transition: transform 0.1s ease;
}
</style>
\`\`\`

---

### 4. **v-long-press** - Mantener presionado

Para menús contextuales, acciones secundarias.

#### **Uso básico:**
\`\`\`vue
<template>
  <button v-long-press="handleLongPress">
    Mantén presionado
  </button>
</template>

<script setup>
const handleLongPress = (event) => {
  console.log('Long press detectado!');
  // Mostrar menú contextual, etc.
};
</script>
\`\`\`

#### **Ejemplo real - Pausar historia en chatbot:**
\`\`\`vue
<template>
  <div 
    v-long-press="pauseStory"
    @touchend="resumeStory"
    class="story-viewer"
  >
    <img :src="currentStory.image" />
    <div v-if="isPaused" class="pause-overlay">⏸️</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isPaused = ref(false);

const pauseStory = () => {
  isPaused.value = true;
  // Pausar timer de historia
};

const resumeStory = () => {
  isPaused.value = false;
  // Reanudar timer
};
</script>
\`\`\`

---

## 🎨 Aplicación en Componentes Existentes

### **1. RatingModal.vue - Calificar con estrellas**

\`\`\`vue
<template>
  <div class="rating-category">
    <button
      v-for="star in 7"
      :key="star"
      v-tap="() => rate(category.key, star)"
      @mouseenter="setHover(category.key, star)"
      @mouseleave="setHover(category.key, 0)"
      class="star-button"
    >
      <font-awesome-icon
        :icon="isStarActive(category.key, star) ? 'star' : ['far', 'star']"
        :class="isStarActive(category.key, star) ? 'text-[#FFD700]' : 'text-gray-600'"
      />
    </button>
  </div>
</template>
\`\`\`

**Beneficios:**
- ✅ Sin delay de 300ms
- ✅ Funciona perfecto en todos los móviles
- ✅ Mantiene hover para desktop

---

### **2. MainHistory.vue - Carrusel de historias**

\`\`\`vue
<template>
  <div 
    v-swipe="{ left: nextStory, right: prevStory }"
    v-long-press="pauseStory"
    @touchend="resumeStory"
    class="story-modal"
  >
    <div class="story-content">
      <!-- Contenido de la historia -->
    </div>
  </div>
</template>

<script setup>
const nextStory = () => {
  // Avanzar a siguiente historia
};

const prevStory = () => {
  // Volver a historia anterior
};

const pauseStory = () => {
  // Pausar con long press
};

const resumeStory = () => {
  // Reanudar al soltar
};
</script>
\`\`\`

**Beneficios:**
- ✅ Swipe natural para navegar
- ✅ Long press para pausar (como Instagram)

---

### **3. ProfilePicture.vue - Galería con zoom**

\`\`\`vue
<template>
  <div class="images-grid">
    <div
      v-for="img in limitedImages"
      :key="img.id"
      v-tap="() => openFullscreen(img)"
      v-pinch="{ in: zoomIn, out: zoomOut }"
      class="image-card"
    >
      <img 
        :src="img.url" 
        :alt="img.alt"
        :style="{ transform: \`scale(\${imageScales[img.id] || 1})\` }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const imageScales = ref({});

const openFullscreen = (img) => {
  // Abrir modal fullscreen
};

const zoomIn = ({ scale }, imgId) => {
  imageScales.value[imgId] = Math.min(scale, 3);
};

const zoomOut = ({ scale }, imgId) => {
  imageScales.value[imgId] = Math.max(scale, 1);
};
</script>
\`\`\`

---

### **4. ChatBot.vue - Navegación táctil**

\`\`\`vue
<template>
  <div v-if="isVisible" class="chatbot-container">
    <!-- Botón cerrar -->
    <button v-tap="closeChatBot" class="close-btn">
      <font-awesome-icon icon="xmark" />
    </button>

    <!-- Área de mensajes con swipe para cerrar -->
    <div 
      v-swipe:down="closeChatBot"
      class="messages-container"
    >
      <!-- Mensajes -->
    </div>

    <!-- Input -->
    <button v-tap="sendMessage" class="send-button">
      Enviar
    </button>
  </div>

  <!-- Botón flotante -->
  <div v-if="!isVisible" class="chatbot-trigger">
    <button v-tap="openChatBot" class="btn-floating">
      <img src="@/assets/amin-transparente.webp" />
    </button>
  </div>
</template>
\`\`\`

**Beneficios:**
- ✅ Swipe down para cerrar chatbot
- ✅ Tap optimizado en todos los botones

---

### **5. NavbarComponents.vue - Menú hamburguesa**

\`\`\`vue
<template>
  <nav class="navbar">
    <!-- Botón hamburguesa -->
    <button v-tap="toggleMenu" class="hamburger-btn">
      <font-awesome-icon :icon="isMenuOpen ? 'xmark' : 'bars'" />
    </button>

    <!-- Menú desplegable -->
    <div 
      v-if="isMenuOpen" 
      v-swipe:left="closeMenu"
      class="mobile-menu"
    >
      <!-- Items del menú -->
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
\`\`\`

**Beneficios:**
- ✅ Swipe left para cerrar menú
- ✅ Tap sin delay

---

### **6. Outstanding.vue - Carrusel con swipe**

\`\`\`vue
<template>
  <div v-swipe="{ left: nextCard, right: prevCard }" class="carousel-wrapper">
    <Carousel :items-to-show="itemsToShow" :wrap-around="true">
      <Slide v-for="card in cards" :key="card.id">
        <div v-tap="() => navigateToCard(card.path)" class="card">
          <img :src="card.image" />
        </div>
      </Slide>
    </Carousel>
  </div>
</template>
\`\`\`

---

## ⚙️ Configuración Personalizada

Puedes modificar los valores en `src/directives/touch.js`:

\`\`\`javascript
const TOUCH_CONFIG = {
  tapTimeout: 200,        // ms - ajustar para tap más rápido/lento
  swipeThreshold: 50,     // px - distancia mínima para swipe
  longPressTimeout: 500,  // ms - tiempo para long press
  pinchThreshold: 10,     // px - sensibilidad del pinch
};
\`\`\`

---

## 🐛 Troubleshooting

### **Problema: El swipe no funciona**
**Solución:** Asegúrate de que el elemento tenga espacio suficiente y no esté bloqueado por CSS:
\`\`\`css
.swipeable-element {
  touch-action: pan-y; /* Para swipe horizontal */
  /* o */
  touch-action: pan-x; /* Para swipe vertical */
  /* o */
  touch-action: none; /* Para swipe en todas direcciones */
}
\`\`\`

### **Problema: El pinch interfiere con el scroll**
**Solución:** Usa `touch-action: none` en el elemento con pinch:
\`\`\`css
.pinchable-image {
  touch-action: none;
}
\`\`\`

### **Problema: v-tap se ejecuta al hacer swipe**
**Solución:** Está manejado automáticamente. Si el usuario se mueve más de 10px, no se considera tap.

### **Problema: Long press se activa al scrollear**
**Solución:** Está manejado automáticamente. Si hay movimiento, cancela el long press.

---

## ✅ Checklist de Implementación

- [ ] Directivas registradas en `main.js`
- [ ] `v-tap` aplicado a todos los botones importantes
- [ ] `v-swipe` en carruseles y modales
- [ ] `v-pinch` en galerías de imágenes
- [ ] `v-long-press` en historias/videos
- [ ] Probado en Chrome móvil
- [ ] Probado en Safari iOS
- [ ] Probado en Samsung Internet

---

## 📚 Recursos Adicionales

- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Vue Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html)
- [Touch Action CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

---

**¿Necesitas ayuda?** Revisa los ejemplos en esta guía o consulta el código en `src/directives/touch.js`.
