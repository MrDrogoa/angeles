<script setup>
import TitleH2Components from "@/components/TitleH2Components.vue";
import { ref, computed } from "vue";
import Hero from "@/assets/hero.webp";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import ButtonCarouselComponents from "@/components/buttons/ButtonCarouselComponents.vue";
import MainOutstanding from "@/components/main/MainOutstanding.vue";

const currentPage = ref(1);
const itemsPerPage = 9;
const newsRedes = [
  {
    id: 1,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 2,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 3,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 4,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 5,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 6,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 7,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 8,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 9,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 10,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 11,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 12,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 13,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 14,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 15,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 16,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 17,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 18,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 19,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
  {
    id: 20,
    title: "Nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    location: "Ubicación",
    img: Hero,
    path: "/",
  },
];

// Computed para calcular el total de páginas
const totalPages = computed(() => Math.ceil(newsRedes.length / itemsPerPage));

// Computed para obtener las tarjetas de la página actual
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return newsRedes.slice(start, end);
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
    <title-h-2-components title="Redes A&D" class="text-center" />
    <button-carousel-components />
    <article
      class="flex justify-center flex-wrap gap-4 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"
    >
      <div
        v-for="redes in paginatedCards"
        :key="redes.id"
        @click="goToPage(card.path)"
        class="mode-card border-2 border-[#FFD700] rounded-xl p-4 md:p-5 lg:p-6 xl:p-7 max-w-md cursor-pointer"
      >
        <div class="flex justify-between items-center max-w-xs">
          <div class="flex flex-col gap-1 md:gap-2 xl:gap-3">
            <h3
              class="text-[#F5F5F5] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg mode-title"
            >
              {{ redes.title }}
            </h3>
            <span
              class="text-xs md:text-base lg:text-lg xl:text-xl text-[#FFD700] font-bold mode-paragraph"
              >{{ redes.location }}</span
            >
            <p
              class="text-[#A2A2A2] text-xs md:text-sm lg:text-base xl:text-lg mode-paragraph"
            >
              {{ redes.descripcion }}
            </p>
          </div>
          <div class="overflow-hidden">
            <img
              :src="redes.img"
              :alt="redes.title"
              class="rounded-full object-cover w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
            />
          </div>
        </div>
      </div>
    </article>
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
  <main-outstanding class="py-8 md:py-20 lg:py-25 xl:py-30" />
</template>

<style scoped></style>
