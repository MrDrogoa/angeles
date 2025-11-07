<script setup>
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
</script>

<template>
  <section>
    <div class="md:flex items-center justify-center py-5 hidden">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#A2A2A2]">
          Ángeles y Demonios
        </h1>

        <p
          class="mt-3 text-xl lg:text-2xl xl:text-3xl text-[#FFD700] font-medium md:mt-3 md:mb-4 lg:mt-4 lg:mb-5 xl:mt-5 xl:mb-6"
        >
          “Tu mejor lugar de encuentros”
        </p>
        <!-- button de action -->
        <button-components>Explorar ahora</button-components>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
