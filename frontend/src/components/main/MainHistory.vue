<script setup>
import { ref } from "vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import Hero from "@/assets/hero.webp";

const stories = [
  {
    user: "Usuario 1",
    thumbnail: Hero,
    items: [
      { url: Hero, duration: 4000 },
      { url: Hero, duration: 5000 },
    ],
  },
  {
    user: "Usuario 2",
    thumbnail: Hero,
    items: [{ url: Hero, duration: 3000 }],
  },
  {
    user: "Usuario 3",
    thumbnail: Hero,
    items: [
      { url: Hero, duration: 4000 },
      { url: Hero, duration: 4000 },
      { url: Hero, duration: 4000 },
    ],
  },
  {
    user: "Usuario 4",
    thumbnail: Hero,
    items: [{ url: Hero, duration: 3000 }],
  },
  {
    user: "Usuario 5",
    thumbnail: Hero,
    items: [{ url: Hero, duration: 3000 }],
  },
  {
    user: "Usuario 6",
    thumbnail: Hero,
    items: [
      { url: Hero, duration: 4000 },
      { url: Hero, duration: 5000 },
    ],
  },
  {
    user: "Usuario 7",
    thumbnail: Hero,
    items: [{ url: Hero, duration: 3000 }],
  },
];

const isOpen = ref(false);
const currentStory = ref(0);
const currentItem = ref(0);
const progress = ref(0);
const isPaused = ref(false);
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

  const duration =
    stories[currentStory.value].items[currentItem.value].duration;

  interval = setInterval(() => {
    if (isPaused.value) return;

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

function prevItem() {
  if (currentItem.value > 0) {
    currentItem.value--;
    startTimer();
  } else {
    prevStory();
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

function prevStory() {
  if (currentStory.value > 0) {
    currentStory.value--;
    currentItem.value = 0;
    startTimer();
  }
}

function pauseStory() {
  isPaused.value = true;
}

function resumeStory() {
  isPaused.value = false;
}
</script>

<template>
  <!-- Carrusel de Miniaturas con vue3-carousel -->
  <div
    class="relative w-full max-w-7xl mx-auto px-4 pt-6 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16"
  >
    <Carousel
      :items-to-show="5"
      :wrap-around="true"
      snap-align="start"
      :breakpoints="{
        0: { itemsToShow: 3, snapAlign: 'start' },
        640: { itemsToShow: 4, snapAlign: 'start' },
        1024: { itemsToShow: 5, snapAlign: 'start' },
        1280: { itemsToShow: 6, snapAlign: 'start' },
      }"
    >
      <Slide v-for="(story, index) in stories" :key="index">
        <div
          @click="openStory(index)"
          class="flex flex-col items-center gap-2 cursor-pointer mx-2"
        >
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-white"
          >
            <img
              :src="story.thumbnail"
              :alt="story.user"
              class="w-full h-full object-cover"
            />
          </div>
          <span
            class="text-white text-xs sm:text-sm md:text-base font-medium truncate max-w-20"
          >
            {{ story.user }}
          </span>
        </div>
      </Slide>

      <!-- Botones de navegación personalizados -->
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>

  <!-- Modal de Historia -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      @click.self="closeStory"
    >
      <div
        class="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl h-[85vh] sm:h-[90vh] md:h-[95vh] bg-black rounded-lg overflow-hidden shadow-2xl"
      >
        <!-- Imagen de la historia con transición -->
        <transition name="fade" mode="out-in">
          <img
            :key="stories[currentStory].items[currentItem].url"
            :src="stories[currentStory].items[currentItem].url"
            :alt="`Historia ${currentStory + 1}`"
            class="w-full h-full object-contain"
            @mousedown="pauseStory"
            @mouseup="resumeStory"
            @touchstart="pauseStory"
            @touchend="resumeStory"
          />
        </transition>

        <!-- Barras de progreso -->
        <div class="absolute top-3 left-3 right-3 flex gap-1">
          <div
            v-for="(item, i) in stories[currentStory].items"
            :key="i"
            class="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
          >
            <div
              class="h-full bg-white transition-all ease-linear rounded-full"
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

        <!-- Nombre de usuario -->
        <div
          class="absolute top-12 left-3 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-full"
        >
          <div
            class="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
          >
            <img
              :src="stories[currentStory].thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
          <span class="text-white font-semibold text-sm">
            {{ stories[currentStory].user }}
          </span>
        </div>

        <!-- Botón cerrar -->
        <button
          @click.stop="closeStory"
          class="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 z-50 cursor-pointer"
          aria-label="Cerrar historia"
        >
          <font-awesome-icon icon="xmark" class="text-xl" />
        </button>

        <!-- Botones para navegar entre items de la historia (izquierda/derecha) -->
        <!-- Zona invisible izquierda -->
        <div
          @click="prevItem"
          class="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
        ></div>

        <!-- Zona invisible derecha -->
        <div
          @click="nextItem"
          class="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
        ></div>

        <!-- Botones visibles para navegar entre historias (usuario anterior/siguiente) -->
        <button
          v-if="currentStory > 0"
          @click.stop="prevStory"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 z-50 cursor-pointer"
          aria-label="Historia anterior"
        >
          <font-awesome-icon icon="chevron-left" class="text-lg md:text-xl" />
        </button>

        <button
          v-if="currentStory < stories.length - 1"
          @click.stop="nextStory"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 z-50 cursor-pointer"
          aria-label="Siguiente historia"
        >
          <font-awesome-icon icon="chevron-right" class="text-lg md:text-xl" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos personalizados para los botones del carrusel */
:deep(.carousel__prev),
:deep(.carousel__next) {
  color: #fff;
  transition: all 0.3s ease;
  opacity: 1 !important; /* Siempre visible */
  cursor: pointer !important; /* Siempre clickeable */
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  color: #a2a2a2;
}
</style>
