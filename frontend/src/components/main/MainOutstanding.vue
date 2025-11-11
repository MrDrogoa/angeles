<script setup>
import { useRouter } from "vue-router";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import TitleH2Components from "@/components/TitleH2Components.vue";
import Hero from "@/assets/hero.webp";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";

const router = useRouter();

const destacadasCards = [
  {
    id: 1,
    title: "Nombre",
    category: "Categoria",
    location: "Ubicacion",
    img: Hero,
    path: "/",
  },
  {
    id: 2,
    title: "Nombre",
    category: "Categoria",
    location: "Ubicacion",
    img: Hero,
    path: "/",
  },
  {
    id: 3,
    title: "Nombre",
    category: "Categoria",
    location: "Ubicacion",
    img: Hero,
    path: "/",
  },
];

const goToPage = (path) => {
  router.push(path);
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4">
    <title-h-2-components title="Destacadas" class="text-center" />

    <!-- Carrusel de tarjetas destacadas -->
    <div class="relative">
      <Carousel
        :items-to-show="3"
        :wrap-around="true"
        snap-align="center"
        :breakpoints="{
          0: { itemsToShow: 2, snapAlign: 'center' },
          1024: { itemsToShow: 3, snapAlign: 'center' },
        }"
      >
        <Slide v-for="card in destacadasCards" :key="card.id">
          <div @click="goToPage(card.path)" class="mx-2 sm:mx-3 cursor-pointer">
            <div
              class="w-full max-w-[180px] sm:max-w-[200px] md:max-w-60 lg:max-w-[280px] xl:max-w-80 mx-auto"
            >
              <div
                class="aspect-3/4 overflow-hidden border-2 border-[#FFD700] rounded-xl transition-all duration-300 hover:border-white hover:shadow-2xl"
              >
                <img
                  :src="card.img"
                  :alt="card.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="p-2 sm:p-3 md:p-4">
                <h3
                  class="text-[#A2A2A2] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center"
                >
                  {{ card.title }}
                </h3>
                <span
                  class="block text-center text-xs md:text-sm lg:text-base xl:text-lg text-gray-400 mt-1 truncate"
                >
                  {{ card.category }}
                </span>
                <p
                  class="text-center text-xs md:text-base lg:text-lg xl:text-xl text-[#FFD700] mt-1 font-bold"
                >
                  {{ card.location }}
                </p>
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
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <router-link to="/destacadas">
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
  color: #a2a2a2;
}
</style>
