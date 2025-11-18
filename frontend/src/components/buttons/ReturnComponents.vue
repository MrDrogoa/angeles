<script setup>
import { computed, useAttrs } from "vue";
import { useRouter } from "vue-router";
import FontAwesomeIcon from "@/icons/icon.js";

const router = useRouter();

// No props by design — this component should be used as a child with slot content and optional attributes
const attrs = useAttrs();
const emit = defineEmits(["click"]);

// Función para volver a la página anterior
const goBack = () => {
  router.back();
};

const base =
  "cursor-pointer text-[#FFD700] transition-colors duration-300 font-semibold rounded-2xl text-sm lg:text-base xl:text-lg xl:hover:text-[#DAA520] mt-6 sm:mt-7 md:mt-8 xl:mt-9 mb-5 sm:mb-6 md:mb-9 lg:mb-11 xl:mb-13 mode-btn-return";

const classes = computed(() => {
  const extra = attrs.class || "";
  const disabled =
    "disabled" in attrs || attrs.disabled
      ? " opacity-50 pointer-events-none"
      : "";
  return [base, extra, disabled];
});
</script>

<template>
  <!-- Use as a child: <ButtonComponents class="px-6">Ver mas</ButtonComponents> -->
  <button v-bind="attrs" :class="classes" @click="goBack">
    <!-- Font Awesome icon (rotated) -->
    <font-awesome-icon
      icon="arrow-turn-down"
      class="inline-block mr-2 transform rotate-90 mode-icon-return"
      aria-hidden="true"
    />
    Volver
  </button>
</template>

<style scoped></style>
