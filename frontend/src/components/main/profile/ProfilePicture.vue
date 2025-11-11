<script setup>
import { computed } from "vue";
import TitleH2Components from "@/components/TitleH2Components.vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Limitar a 15 imágenes
const limitedImages = computed(() => props.images.slice(0, 15));
</script>

<template>
  <section class="py-8 md:py-20 lg:py-25 xl:py-30">
    <title-h-2-components title="Fotos" class="text-center mb-6 md:mb-8" />

    <!-- Grid de 5 columnas responsive -->
    <div class="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      <div
        v-for="(image, index) in limitedImages"
        :key="index"
        class="aspect-square overflow-hidden rounded-lg lg:hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <img
          :src="image.url"
          :alt="image.alt"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Mensaje si no hay imágenes -->
    <p
      v-if="limitedImages.length === 0"
      class="text-center text-gray-400 text-sm sm:text-base mt-8"
    >
      No hay imágenes disponibles
    </p>
  </section>
</template>

<style scoped></style>
