<script setup>
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
</script>

<template>
  <section>
    <div class="md:flex items-center justify-center py-5 hidden">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <h1
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#DAA520] playball mode-title"
        >
          Avenida Alemania Suites
        </h1>

        <p
          class="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#DAA520] playball font-semibold md:mt-3 md:mb-4 lg:mt-4 lg:mb-5 xl:mt-5 xl:mb-6 mode-paragraph"
        >
          Temuco
        </p>
        <!-- button de action -->

        <router-link to="/all"
          ><button-components>Explorar ahora</button-components></router-link
        >
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
