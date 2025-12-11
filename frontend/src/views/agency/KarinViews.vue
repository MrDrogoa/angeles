<script setup>
// import Login from "../components/Login.vue";
import HeroComponentsAgency from "@/components/HeroComponentsAgency.vue";
// import MainOutstanding from "@/components/main/MainOutstanding.vue";
import MainAllComponentsAgency from "@/components/main/agency/MainAllComponentsAgency.vue";
import MainNewsAgency from "@/components/main/agency/MainNewsAgency.vue";
import MainHistory from "@/components/main/MainHistory.vue";
import MainAboutUs from "@/components/main/agency/MainAboutUs.vue";
</script>

<template>
  <section>
    <hero-components-agency />
    <main-history />
    <main-news-agency />
    <!-- <main-outstanding /> -->
    <main-all-components-agency />
    <main-about-us />
  </section>
</template>

<style scoped></style>
