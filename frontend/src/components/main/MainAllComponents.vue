<script setup>
import MainAllEnter from "@/components/main/MainAllEnter.vue";
import MainAllNormal from "@/components/main/MainAllNormal.vue";
import MainAllTop from "@/components/main/MainAllTop.vue";
import MainAllVip from "@/components/main/MainAllVip.vue";
import MainAllPremium from "@/components/main/MainAllPremium.vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
</script>

<template>
  <section class="max-w-[1300px] mx-auto py-8 md:py-20 lg:py-25 xl:py-30 px-4">
    <title-h-2-components
      title="Todas"
      class="text-center mb-6 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16"
    />
    <main-all-enter />
    <main-all-premium class="my-4 md:my-5 xl:my-6" />
    <main-all-top />
    <main-all-vip class="my-4 md:my-5 xl:my-6" />
    <main-all-normal />
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <button-components>Ver más</button-components>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
