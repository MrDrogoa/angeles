<script setup>
import HeroContentAgency from "@/components/hero/HeroContentAgency.vue";
import HeroImgAgency from "@/components/hero/HeroImgAgency.vue";
</script>

<template>
  <section class="relative">
    <hero-img-agency />
    <div class="static md:absolute md:inset-0 flex items-center justify-center">
      <hero-content-agency />
    </div>
  </section>
</template>

<style scoped></style>
