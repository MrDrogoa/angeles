<script setup>
import Logo from "@/components/nav/Logo.vue";
import Lists from "@/components/nav/Lists.vue";
</script>

<template>
  <nav class="border-b-2 border-[#DAA520]">
    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-2 md:py-3 lg:py-4">
        <!-- Logo -->
        <logo />
        <!-- Navigation Lists -->
        <lists />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
