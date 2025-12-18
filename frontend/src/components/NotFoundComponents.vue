<script setup>
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h3
      class="text-[#FFD700] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mode-title mb-4"
    >
      404 - Página No Encontrada
    </h3>
    <p class="mode-paragraph text-white text-lg lg:text-2xl mb-4">
      Lo siento, la página que buscas no existe.
    </p>
    <router-link to="/">
      <button-components>Volver</button-components></router-link
    >
  </div>
</template>
