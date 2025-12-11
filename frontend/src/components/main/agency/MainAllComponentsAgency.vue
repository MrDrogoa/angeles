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
  <section class="max-w-[1300px] mx-auto pt-8 md:pt-20 lg:pt-25 xl:pt-30 px-4">
    <title-h-2-components title="Nuestras habitaciones" class="text-center" />
    <main-all-enter />
    <main-all-premium class="my-4 md:my-5 xl:my-6" />
    <main-all-top />
    <main-all-vip class="my-4 md:my-5 xl:my-6" />
    <main-all-normal />
    <div class="flex justify-center mt-4 lg:mt-6 xl:mt-8">
      <router-link to="/all">
        <button-components>Ver más</button-components>
      </router-link>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
