<script setup>
import Logo from "@/assets/logo.png";
</script>

<template>
  <div class="flex items-center gap-3">
    <router-link to="/">
      <img
        :src="Logo"
        alt="Angeles y Demonios"
        class="w-30 lg:w-45 object-cover"
      />
    </router-link>
  </div>
</template>

<style lang="scss" scoped></style>
