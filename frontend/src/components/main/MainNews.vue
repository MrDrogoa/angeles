<script setup>
import { useRouter } from "vue-router";
import TitleH2Components from "@/components/TitleH2Components.vue";
import Hero from "@/assets/hero.webp";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";

const router = useRouter();

const newsCards = [
  {
    id: 1,
    title: "Nombre",
    img: Hero,
    path: "/",
  },
  {
    id: 2,
    title: "Nombre",
    img: Hero,
    path: "/",
  },
  {
    id: 3,
    title: "Nombre",
    img: Hero,
    path: "/",
  },
  {
    id: 4,
    title: "Nombre",
    img: Hero,
    path: "/",
  },
];

const goToPage = (path) => {
  router.push(path);
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto py-8 md:py-20 lg:py-25 xl:py-30 px-4">
    <title-h-2-components title="Novedades" class="text-center" />

    <!-- Grid de tarjetas con Flexbox -->
    <div class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
      <!-- Tarjeta individual -->
      <div
        v-for="card in newsCards"
        :key="card.id"
        @click="goToPage(card.path)"
        class="w-[calc(50%-0.375rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-[180px] md:max-w-[260px] lg:max-w-[300px] relative border-2 border-[#FFD700] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 lg:hover:border-white lg:hover:shadow-2xl lg:hover:-translate-y-2"
      >
        <!-- Imagen con overlay -->
        <div class="relative overflow-hidden aspect-3/4 group">
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
            class="text-[#F5F5F5] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg text-center"
          >
            {{ card.title }}
          </h3>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <router-link to="/news">
        <button-components>Ver más</button-components>
      </router-link>
    </div>
  </section>
</template>

<style scoped></style>
