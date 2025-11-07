<script setup>
import HeroContent from "@/components/hero/HeroContent.vue";
import HeroImg from "@/components/hero/HeroImg.vue";
</script>

<template>
  <section class="relative">
    <hero-img />
    <div class="static md:absolute md:inset-0 flex items-center justify-center">
      <hero-content />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
