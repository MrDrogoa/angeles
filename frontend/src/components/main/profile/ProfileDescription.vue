<script setup>
// Recibir description como prop desde el componente padre
const props = defineProps({
  description: {
    type: String,
    required: true,
    default: "",
  },
});
</script>

<template>
  <!-- Descripción -->
  <div class="py-8 md:py-20 lg:py-25 xl:py-30">
    <h2
      class="font-bold text-xl text-center lg:text-start sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#A2A2A2] mb-3 sm:mb-4 mode-title"
    >
      Descripción
    </h2>
    <p
      class="text-[#A2A2A2] text-xs md:text-sm lg:text-base xl:text-lg leading-relaxed m-auto w-full md:w-5/6 xl:w-4/5 text-center lg:text-start mode-paragraph"
    >
      {{ props.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
