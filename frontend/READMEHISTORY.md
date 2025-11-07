
# 📖 Implementación de Historias estilo Instagram en Vue + Tailwind

Este proyecto implementa un componente de **historias tipo Instagram** usando Vue 3 y TailwindCSS.  
Cada círculo representa un usuario, y al abrirlo se muestran sus fotos en secuencia con barras de progreso independientes. Al terminar las fotos de un usuario, se pasa automáticamente al siguiente.

---

## 🚀 Objetivo
- Mostrar miniaturas circulares (usuarios).  
- Al hacer clic, abrir un modal con las fotos de ese usuario.  
- Cada foto tiene un tiempo de duración (`duration`).  
- Las barras de progreso muestran el estado de cada foto.  
- Al terminar las fotos de un usuario, se avanza al siguiente.  
- Transiciones animadas (fade o slide) entre fotos.

---

## 🛠️ Estructura de datos
Cada usuario tiene un `thumbnail` y un array `items` con sus fotos y duración:

```js
const stories = [
  {
    user: "Usuario 1",
    thumbnail: "thumb1.jpg",
    items: [
      { url: "foto1a.jpg", duration: 4000 },
      { url: "foto1b.jpg", duration: 5000 },
    ],
  },
  {
    user: "Usuario 2",
    thumbnail: "thumb2.jpg",
    items: [{ url: "foto2a.jpg", duration: 3000 }],
  },
  {
    user: "Usuario 3",
    thumbnail: "thumb3.jpg",
    items: [
      { url: "foto3a.jpg", duration: 4000 },
      { url: "foto3b.jpg", duration: 4000 },
      { url: "foto3c.jpg", duration: 4000 },
    ],
  },
];
```

---

## 📌 Problemas iniciales
1. Se intentaba acceder a `stories[currentIndex].duration`, pero cada historia tiene un array `items`.  
   👉 Solución: acceder a `stories[currentStory].items[currentItem].duration`.

2. En el template se usaban `currentStory` y `currentItem`, pero en el script no estaban definidos.  
   👉 Solución: crear `ref`s para ambos índices.

3. El temporizador estaba corriendo para todas las historias a la vez.  
   👉 Solución: controlar el progreso solo de la foto activa.

---

## ✅ Código final

### Script
```vue
<script setup>
import { ref } from "vue";

const isOpen = ref(false);
const currentStory = ref(0);   // índice del círculo (usuario)
const currentItem = ref(0);    // índice de la foto dentro del círculo
const progress = ref(0);
let interval = null;

function openStory(index) {
  currentStory.value = index;
  currentItem.value = 0;
  isOpen.value = true;
  startTimer();
}

function closeStory() {
  isOpen.value = false;
  clearInterval(interval);
  progress.value = 0;
}

function startTimer() {
  clearInterval(interval);
  progress.value = 0;
  let elapsed = 0;

  const duration = stories[currentStory.value].items[currentItem.value].duration;

  interval = setInterval(() => {
    elapsed += 100;
    progress.value = Math.min((elapsed / duration) * 100, 100);

    if (elapsed >= duration) {
      nextItem();
    }
  }, 100);
}

function nextItem() {
  if (currentItem.value < stories[currentStory.value].items.length - 1) {
    currentItem.value++;
    startTimer();
  } else {
    nextStory();
  }
}

function nextStory() {
  if (currentStory.value < stories.length - 1) {
    currentStory.value++;
    currentItem.value = 0;
    startTimer();
  } else {
    closeStory();
  }
}
</script>
```

---

### Template
```vue
<template>
  <!-- Miniaturas -->
  <div class="flex space-x-4">
    <div
      v-for="(story, index) in stories"
      :key="index"
      @click="openStory(index)"
      class="w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 border-white"
    >
      <img :src="story.thumbnail" class="w-full h-full object-cover" />
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
    <div class="relative w-[400px] h-[600px] bg-black rounded-lg overflow-hidden">

      <!-- Carrusel con transición -->
      <transition name="fade" mode="out-in">
        <img
          :key="stories[currentStory].items[currentItem].url"
          :src="stories[currentStory].items[currentItem].url"
          class="w-full h-full object-cover"
        />
      </transition>

      <!-- Barras de progreso -->
      <div class="absolute top-2 left-2 right-2 flex space-x-2">
        <div
          v-for="(item, i) in stories[currentStory].items"
          :key="i"
          class="h-1 flex-1 bg-gray-700"
        >
          <div
            class="h-1 bg-white transition-all ease-linear"
            :style="{
              width:
                i < currentItem
                  ? '100%'
                  : i === currentItem
                  ? progress + '%'
                  : '0%',
            }"
          ></div>
        </div>
      </div>

      <!-- Botón cerrar -->
      <button @click="closeStory" class="absolute top-2 right-2 text-white">✕</button>
    </div>
  </div>
</template>
```

---

### Estilos
```css
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## 🎨 Resultado
- Cada círculo abre sus fotos con barras de progreso independientes.  
- Al terminar las fotos de un usuario, se pasa al siguiente automáticamente.  
- El cambio de foto tiene animación (fade).  
- Las barras muestran el estado de cada foto, igual que en Instagram.

---

## ✋ Pausar y reanudar historias al mantener presionado

Se implementó la funcionalidad para que, al mantener presionado sobre la foto de la historia, el temporizador se detenga y al soltar continúe normalmente. Esto replica el comportamiento de Instagram Stories.

### 🔧 Cambios realizados

1. **Nuevo estado de pausa**
```js
const isPaused = ref(false);
```

2. **Modificar el temporizador para respetar la pausa**
```js
interval = setInterval(() => {
  if (isPaused.value) return; // si está pausado, no avanza

  elapsed += 100;
  progress.value = Math.min((elapsed / duration) * 100, 100);

  if (elapsed >= duration) {
    nextItem();
  }
}, 100);
```

3. **Eventos en la imagen para pausar/reanudar**
```vue
<img
  :key="stories[currentStory].items[currentItem].url"
  :src="stories[currentStory].items[currentItem].url"
  class="w-full h-full object-cover"
  @mousedown="pauseStory"
  @mouseup="resumeStory"
  @touchstart="pauseStory"
  @touchend="resumeStory"
/>
```

4. **Funciones de control**
```js
function pauseStory() {
  isPaused.value = true;
}

function resumeStory() {
  isPaused.value = false;
}
```

---

### 📌 Resultado
- Al **mantener presionado** con el mouse o dedo, la barra de progreso se detiene.  
- Al **soltar**, la barra continúa normalmente.  
- Funciona tanto en **desktop** como en **móvil**.  

---


