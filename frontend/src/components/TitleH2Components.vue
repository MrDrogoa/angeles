<script setup>
import { computed, useAttrs } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const attrs = useAttrs();

// Clases base del componente
const baseClasses =
  "font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#A2A2A2] mb-6 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 mode-title";

// Combinar clases base con clases adicionales
const classes = computed(() => {
  const extraClasses = attrs.class || "";
  return `${baseClasses} ${extraClasses}`;
});
</script>

<template>
  <h2 :class="classes">{{ title }}</h2>
</template>

<style scoped></style>
