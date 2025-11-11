<script setup>
import { ref, computed } from "vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import { useRouter } from "vue-router";
import Hero from "@/assets/hero.webp";
import ButtonCarouselComponents from "@/components/buttons/ButtonCarouselComponents.vue";

const router = useRouter();

// Control de paginación
const currentPage = ref(1);
const itemsPerPage = 28;

const newsCards = [
  // Página 1 (28 tarjetas)
  {
    id: 1,
    title: "Nombre 1",
    description: "Descripción de la noticia 1",
    img: Hero,
    path: "/",
  },
  {
    id: 2,
    title: "Nombre 2",
    description: "Descripción de la noticia 2",
    img: Hero,
    path: "/",
  },
  {
    id: 3,
    title: "Nombre 3",
    description: "Descripción de la noticia 3",
    img: Hero,
    path: "/",
  },
  {
    id: 4,
    title: "Nombre 4",
    description: "Descripción de la noticia 4",
    img: Hero,
    path: "/",
  },
  {
    id: 5,
    title: "Nombre 5",
    description: "Descripción de la noticia 5",
    img: Hero,
    path: "/",
  },
  {
    id: 6,
    title: "Nombre 6",
    description: "Descripción de la noticia 6",
    img: Hero,
    path: "/",
  },
  {
    id: 7,
    title: "Nombre 7",
    description: "Descripción de la noticia 7",
    img: Hero,
    path: "/",
  },
  {
    id: 8,
    title: "Nombre 8",
    description: "Descripción de la noticia 8",
    img: Hero,
    path: "/",
  },
  {
    id: 9,
    title: "Nombre 9",
    description: "Descripción de la noticia 9",
    img: Hero,
    path: "/",
  },
  {
    id: 10,
    title: "Nombre 10",
    description: "Descripción de la noticia 10",
    img: Hero,
    path: "/",
  },
  {
    id: 11,
    title: "Nombre 11",
    description: "Descripción de la noticia 11",
    img: Hero,
    path: "/",
  },
  {
    id: 12,
    title: "Nombre 12",
    description: "Descripción de la noticia 12",
    img: Hero,
    path: "/",
  },
  {
    id: 13,
    title: "Nombre 13",
    description: "Descripción de la noticia 13",
    img: Hero,
    path: "/",
  },
  {
    id: 14,
    title: "Nombre 14",
    description: "Descripción de la noticia 14",
    img: Hero,
    path: "/",
  },
  {
    id: 15,
    title: "Nombre 15",
    description: "Descripción de la noticia 15",
    img: Hero,
    path: "/",
  },
  {
    id: 16,
    title: "Nombre 16",
    description: "Descripción de la noticia 16",
    img: Hero,
    path: "/",
  },
  {
    id: 17,
    title: "Nombre 17",
    description: "Descripción de la noticia 17",
    img: Hero,
    path: "/",
  },
  {
    id: 18,
    title: "Nombre 18",
    description: "Descripción de la noticia 18",
    img: Hero,
    path: "/",
  },
  {
    id: 19,
    title: "Nombre 19",
    description: "Descripción de la noticia 19",
    img: Hero,
    path: "/",
  },
  {
    id: 20,
    title: "Nombre 20",
    description: "Descripción de la noticia 20",
    img: Hero,
    path: "/",
  },
  {
    id: 21,
    title: "Nombre 21",
    description: "Descripción de la noticia 21",
    img: Hero,
    path: "/",
  },
  {
    id: 22,
    title: "Nombre 22",
    description: "Descripción de la noticia 22",
    img: Hero,
    path: "/",
  },
  {
    id: 23,
    title: "Nombre 23",
    description: "Descripción de la noticia 23",
    img: Hero,
    path: "/",
  },
  {
    id: 24,
    title: "Nombre 24",
    description: "Descripción de la noticia 24",
    img: Hero,
    path: "/",
  },
  {
    id: 25,
    title: "Nombre 25",
    description: "Descripción de la noticia 25",
    img: Hero,
    path: "/",
  },
  {
    id: 26,
    title: "Nombre 26",
    description: "Descripción de la noticia 26",
    img: Hero,
    path: "/",
  },
  {
    id: 27,
    title: "Nombre 27",
    description: "Descripción de la noticia 27",
    img: Hero,
    path: "/",
  },
  {
    id: 28,
    title: "Nombre 28",
    description: "Descripción de la noticia 28",
    img: Hero,
    path: "/",
  },
  // Página 2 (28 tarjetas adicionales)
  {
    id: 29,
    title: "Nombre 29",
    description: "Descripción de la noticia 29",
    img: Hero,
    path: "/",
  },
  {
    id: 30,
    title: "Nombre 30",
    description: "Descripción de la noticia 30",
    img: Hero,
    path: "/",
  },
  {
    id: 31,
    title: "Nombre 31",
    description: "Descripción de la noticia 31",
    img: Hero,
    path: "/",
  },
  {
    id: 32,
    title: "Nombre 32",
    description: "Descripción de la noticia 32",
    img: Hero,
    path: "/",
  },
  {
    id: 33,
    title: "Nombre 33",
    description: "Descripción de la noticia 33",
    img: Hero,
    path: "/",
  },
  {
    id: 34,
    title: "Nombre 34",
    description: "Descripción de la noticia 34",
    img: Hero,
    path: "/",
  },
  {
    id: 35,
    title: "Nombre 35",
    description: "Descripción de la noticia 35",
    img: Hero,
    path: "/",
  },
  {
    id: 36,
    title: "Nombre 36",
    description: "Descripción de la noticia 36",
    img: Hero,
    path: "/",
  },
  {
    id: 37,
    title: "Nombre 37",
    description: "Descripción de la noticia 37",
    img: Hero,
    path: "/",
  },
  {
    id: 38,
    title: "Nombre 38",
    description: "Descripción de la noticia 38",
    img: Hero,
    path: "/",
  },
  {
    id: 39,
    title: "Nombre 39",
    description: "Descripción de la noticia 39",
    img: Hero,
    path: "/",
  },
  {
    id: 40,
    title: "Nombre 40",
    description: "Descripción de la noticia 40",
    img: Hero,
    path: "/",
  },
  {
    id: 41,
    title: "Nombre 41",
    description: "Descripción de la noticia 41",
    img: Hero,
    path: "/",
  },
  {
    id: 42,
    title: "Nombre 42",
    description: "Descripción de la noticia 42",
    img: Hero,
    path: "/",
  },
  {
    id: 43,
    title: "Nombre 43",
    description: "Descripción de la noticia 43",
    img: Hero,
    path: "/",
  },
  {
    id: 44,
    title: "Nombre 44",
    description: "Descripción de la noticia 44",
    img: Hero,
    path: "/",
  },
  {
    id: 45,
    title: "Nombre 45",
    description: "Descripción de la noticia 45",
    img: Hero,
    path: "/",
  },
  {
    id: 46,
    title: "Nombre 46",
    description: "Descripción de la noticia 46",
    img: Hero,
    path: "/",
  },
  {
    id: 47,
    title: "Nombre 47",
    description: "Descripción de la noticia 47",
    img: Hero,
    path: "/",
  },
  {
    id: 48,
    title: "Nombre 48",
    description: "Descripción de la noticia 48",
    img: Hero,
    path: "/",
  },
  {
    id: 49,
    title: "Nombre 49",
    description: "Descripción de la noticia 49",
    img: Hero,
    path: "/",
  },
  {
    id: 50,
    title: "Nombre 50",
    description: "Descripción de la noticia 50",
    img: Hero,
    path: "/",
  },
  {
    id: 51,
    title: "Nombre 51",
    description: "Descripción de la noticia 51",
    img: Hero,
    path: "/",
  },
  {
    id: 52,
    title: "Nombre 52",
    description: "Descripción de la noticia 52",
    img: Hero,
    path: "/",
  },
  {
    id: 53,
    title: "Nombre 53",
    description: "Descripción de la noticia 53",
    img: Hero,
    path: "/",
  },
  {
    id: 54,
    title: "Nombre 54",
    description: "Descripción de la noticia 54",
    img: Hero,
    path: "/",
  },
  {
    id: 55,
    title: "Nombre 55",
    description: "Descripción de la noticia 55",
    img: Hero,
    path: "/",
  },
  {
    id: 56,
    title: "Nombre 56",
    description: "Descripción de la noticia 56",
    img: Hero,
    path: "/",
  },
];

// Computed para calcular el total de páginas
const totalPages = computed(() => Math.ceil(newsCards.length / itemsPerPage));

// Computed para obtener las tarjetas de la página actual
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return newsCards.slice(start, end);
});

// Funciones de navegación
const goToPage = (path) => {
  router.push(path);
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4">
    <return-components />
    <title-h-2-components title="Destacadas" class="text-center mb-6" />

    <!-- buttons carrusel para mobile -->
    <button-carousel-components />
    <!-- Grid de tarjetas con Flexbox -->
    <div
      class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"
    >
      <!-- Tarjeta individual -->
      <div
        v-for="card in paginatedCards"
        :key="card.id"
        @click="goToPage(card.path)"
        class="w-[calc(50%-0.375rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[180px] md:max-w-[260px] lg:max-w-[300px] relative border-2 border-[#FFD700] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-white hover:shadow-2xl hover:-translate-y-2"
      >
        <!-- Imagen con overlay -->
        <div class="relative overflow-hidden aspect-3/4 group">
          <img
            :src="card.img"
            :alt="card.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <!-- Overlay degradado (sombreado) -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-70 hover:opacity-80 transition-opacity duration-300"
          ></div>
        </div>

        <!-- Título sobre la imagen -->
        <div
          class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 lg:p-6 z-10 transform translate-y-0 transition-transform duration-300"
        >
          <h3
            class="text-[#F5F5F5] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg"
          >
            {{ card.title }}
          </h3>
          <p class="text-[#A2A2A2] text-xs md:text-sm lg:text-base xl:text-lg">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div class="flex items-center justify-center">
      <!-- Botón anterior -->
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="bg-[#808080] text-white py-2.5 px-5 sm:py-3.5 sm:px-6 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 cursor-pointer border-none min-w-[60px] sm:min-w-[70px] flex items-center justify-center rounded-l-lg border-r border-white/20 hover:bg-[#a0a0a0] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#808080] disabled:active:scale-100"
        aria-label="Página anterior"
      >
        <font-awesome-icon icon="chevron-left" class="text-lg" />
      </button>

      <!-- Número de página -->
      <div
        class="bg-[#808080] text-white py-2 px-6 text-sm sm:text-base md:text-lg font-bold flex items-center justify-center border-x border-white/20"
      >
        {{ currentPage }}
      </div>

      <!-- Botón siguiente -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-[#808080] text-white py-2.5 px-5 sm:py-3.5 sm:px-6 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 cursor-pointer border-none min-w-[60px] sm:min-w-[70px] flex items-center justify-center rounded-r-lg border-l border-white/20 hover:bg-[#a0a0a0] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#808080] disabled:active:scale-100"
        aria-label="Página siguiente"
      >
        <font-awesome-icon icon="chevron-right" class="text-lg" />
      </button>
    </div>
  </section>
</template>

<style scoped></style>
