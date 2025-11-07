<script setup>
import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";

const slides = [
  { url: "foto1.jpg" },
  { url: "foto2.jpg" },
  { url: "foto3.jpg" },
];
</script>

<template>
  <Carousel :items-to-show="1" :wrap-around="true" :autoplay="true">
    <Slide v-for="(slide, index) in slides" :key="index">
      <img :src="slide.url" class="w-full h-full object-cover" />
    </Slide>

    <!-- Opcional: navegación y paginación -->
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>
