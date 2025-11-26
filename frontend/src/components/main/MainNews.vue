<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import TitleH2Components from "@/components/TitleH2Components.vue";
import Hero from "@/assets/hero.webp";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";

const router = useRouter();

// Estado de la categoría activa
const activeCategory = ref("primera-vez");
const carouselKey = ref(0); // Para resetear el carrusel

// Categorías con sus datos
const categories = [
  {
    id: "primera-vez",
    label: "Por primera vez",
    route: "/news/primera-vez",
    cards: [
      { id: 1, title: "Persona A", img: Hero, path: "/" },
      { id: 2, title: "Persona B", img: Hero, path: "/" },
      { id: 3, title: "Persona C", img: Hero, path: "/" },
      { id: 4, title: "Persona D", img: Hero, path: "/" },
    ],
  },
  {
    id: "de-vuelta",
    label: "Están de vuelta",
    route: "/news/de-vuelta",
    cards: [
      { id: 5, title: "Persona E", img: Hero, path: "/" },
      { id: 6, title: "Persona F", img: Hero, path: "/" },
      { id: 7, title: "Persona G", img: Hero, path: "/" },
      { id: 8, title: "Persona H", img: Hero, path: "/" },
    ],
  },
  {
    id: "fotos-nuevas",
    label: "Fotos nuevas",
    route: "/news/fotos-nuevas",
    cards: [
      { id: 9, title: "Persona I", img: Hero, path: "/" },
      { id: 10, title: "Persona J", img: Hero, path: "/" },
      { id: 11, title: "Persona K", img: Hero, path: "/" },
      { id: 12, title: "Persona L", img: Hero, path: "/" },
    ],
  },
  {
    id: "promociones",
    label: "Promociones",
    route: "/news/promociones",
    cards: [
      { id: 13, title: "Persona M", img: Hero, path: "/" },
      { id: 14, title: "Persona N", img: Hero, path: "/" },
      { id: 15, title: "Persona O", img: Hero, path: "/" },
      { id: 16, title: "Persona P", img: Hero, path: "/" },
    ],
  },
];

// Computed para obtener la categoría activa
const currentCategory = computed(() => {
  return categories.find((cat) => cat.id === activeCategory.value);
});

// Computed para la ruta del botón "Ver más"
const viewMoreRoute = computed(() => {
  return currentCategory.value?.route || "/news";
});

// Cambiar categoría
const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
  // Guardar en localStorage
  localStorage.setItem("activeNewsCategory", categoryId);
  // Resetear carrusel al inicio
  carouselKey.value++;
};

// Cargar categoría guardada al montar
onMounted(() => {
  const savedCategory = localStorage.getItem("activeNewsCategory");
  if (savedCategory) {
    activeCategory.value = savedCategory;
  }
});

// Navegar a página de tarjeta
const goToPage = (path) => {
  router.push(path);
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto py-8 md:py-20 lg:py-25 xl:py-30 px-4">
    <title-h-2-components title="Novedades" class="text-center mb-6 md:mb-8" />

    <!-- Categorías (Tabs) -->
    <div class="flex justify-center items-center gap-2 md:gap-4 mb-6 md:mb-8">
      <template v-for="(category, index) in categories" :key="category.id">
        <!-- Botón de categoría -->
        <button
          @click="setCategory(category.id)"
          :class="[
            'px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold text-[8px] sm:text-xs md:text-sm lg:text-base transition-all duration-300 mode-paragraph',
            activeCategory === category.id
              ? 'bg-[#DAA520] text-white shadow-lg mode-btn'
              : 'bg-transparent text-[#FFD700] lg:hover:bg-[#FFD700]/20 mode-btn-location cursor-pointer',
          ]"
        >
          {{ category.label }}
        </button>

        <!-- Separador | -->
        <span
          v-if="index < categories.length - 1"
          class="text-[#FFD700] text-sm md:text-base font-bold mode-paragraph"
        >
          |
        </span>
      </template>
    </div>

    <!-- Carrusel de tarjetas con transición -->
    <transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div :key="activeCategory" class="relative">
        <Carousel
          :key="carouselKey"
          :items-to-show="3"
          :wrap-around="false"
          snap-align="center"
          :breakpoints="{
            0: { itemsToShow: 2, snapAlign: 'center' },
            768: { itemsToShow: 3, snapAlign: 'center' },
            1024: { itemsToShow: 4, snapAlign: 'center' },
          }"
        >
          <Slide v-for="card in currentCategory.cards" :key="card.id">
            <div
              @click="goToPage(card.path)"
              class="mx-2 sm:mx-3 cursor-pointer"
            >
              <div
                class="w-full max-w-[180px] sm:max-w-[200px] md:max-w-60 lg:max-w-[280px] xl:max-w-80 mx-auto overflow-hidden"
              >
                <div
                  class="relative border-2 border-[#FFD700] rounded-xl transition-all duration-300 lg:hover:border-white lg:hover:shadow-2xl mode-card overflow-hidden"
                >
                  <!-- Imagen con overlay -->
                  <div class="relative aspect-3/4 overflow-hidden">
                    <img
                      :src="card.img"
                      :alt="card.title"
                      class="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110"
                    />

                    <!-- Overlay degradado (sombreado) -->
                    <div
                      class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-70 lg:hover:opacity-80 transition-opacity duration-300"
                    ></div>
                  </div>

                  <!-- Título sobre la imagen -->
                  <div
                    class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 lg:p-6 z-10 transform translate-y-0 transition-transform duration-300"
                  >
                    <h3
                      class="text-[#F5F5F5] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg text-center mode-title"
                    >
                      {{ card.title }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          <!-- Botones de navegación -->
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>
    </transition>

    <!-- Botón Ver más (dinámico según categoría) -->
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <router-link :to="viewMoreRoute">
        <button-components>Ver más</button-components>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
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
  color: #ffd700;
}
</style>
