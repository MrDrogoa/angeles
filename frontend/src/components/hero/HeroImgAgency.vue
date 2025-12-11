<script setup>
import Hero from "@/assets/agency/karinagency.webp";
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
        class="hidden md:block absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black/40 pointer-events-none mode-bg-hero"
      ></div>
    </div>
  </section>
</template>

<style scoped></style>
