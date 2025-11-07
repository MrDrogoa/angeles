<script setup>
import Hero from "@/assets/hero.webp";
</script>

<template>
  <section class="w-full">
    <div
      class="w-full h-full overflow-hidden relative shadow-none md:shadow-2xl"
    >
      <img
        :src="Hero"
        alt="Hero Image"
        class="w-full h-full object-cover object-center"
      />

      <!-- overlay sombreado -->
      <div
        class="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/60 pointer-events-none"
      ></div>
    </div>
  </section>
</template>

<style scoped></style>
