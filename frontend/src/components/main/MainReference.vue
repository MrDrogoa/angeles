<script setup>
import TitleH2Components from "@/components/TitleH2Components.vue";
import MundoEs from "@/assets/mundoes.webp";

const redesCards = [
  {
    id: 1,
    title: "Mundo Es",
    img: MundoEs,
  },
];
</script>

<template>
  <section class="max-w-[1300px] mx-auto py-8 md:py-20 lg:py-25 xl:py-30 px-4">
    <title-h-2-components title="Paginas amigas" class="text-center" />
    <div class="flex justify-center flex-wrap gap-6">
      <img
        v-for="card in redesCards"
        :key="card.id"
        :src="card.img"
        :alt="card.title"
      />
    </div>
  </section>
</template>

<style scoped></style>
