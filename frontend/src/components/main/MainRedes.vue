<script setup>
import TitleH2Components from "@/components/TitleH2Components.vue";
import Hero from "@/assets/hero.webp";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";

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
];
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4">
    <title-h-2-components title="Redes A&D" class="text-center" />
    <article class="flex justify-center flex-wrap gap-4">
      <div
        v-for="redes in newsRedes"
        :key="redes.id"
        class="border-2 border-[#FFD700] rounded-xl p-4 md:p-5 lg:p-6 xl:p-7 max-w-md cursor-pointer"
      >
        <div class="flex justify-between items-center max-w-xs">
          <div class="flex flex-col gap-1 md:gap-2 xl:gap-3">
            <h3
              class="text-[#F5F5F5] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg"
            >
              {{ redes.title }}
            </h3>
            <span
              class="text-xs md:text-base lg:text-lg xl:text-xl text-[#FFD700] font-bold"
              >{{ redes.location }}</span
            >
            <p
              class="text-[#A2A2A2] text-xs md:text-sm lg:text-base xl:text-lg"
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
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <router-link to="/social">
        <button-components>Ver más</button-components>
      </router-link>
    </div>
  </section>
</template>

<style scoped></style>
