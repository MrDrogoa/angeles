<script setup>
import TitleH2Components from "@/components/TitleH2Components.vue";

const description = [
  {
    id: 1,
    text: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque esse
        dicta accusantium quam, nisi aspernatur, recusandae officia nostrum maxime
        magnam inventore distinctio, eum optio ratione! Adipisci nesciunt
        molestias possimus fugiat veniam, voluptas quas numquam quo rem aspernatur
        doloremque sed illum eum nisi sunt. Suscipit qui officia quae eveniet
        voluptatem, nemo assumenda, quis quia labore deleniti consectetur alias
        autem, voluptas a excepturi ullam! Totam accusantium rem dicta dolores
        magni natus a.`,
  },
];
</script>

<template>
  <div class="max-w-[1300px] mx-auto py-8 md:py-20 lg:py-25 xl:py-30 px-4">
    <title-h-2-components
      title="Sobre Nosotros"
      class="text-center"
      subtitle="Conoce más acerca de Karin Agencia"
    />

    <p
      v-for="description in description"
      :key="description.id"
      class="block lg:w-1/2 mx-auto text-center text-[#A2A2A2] text-xs md:text-sm lg:text-base xl:text-lg mode-paragraph"
    >
      {{ description.text }}
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
