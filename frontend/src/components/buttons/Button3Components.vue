<script setup>
import { computed, useAttrs } from "vue";

// No props by design — this component should be used as a child with slot content and optional attributes
const attrs = useAttrs();
const emit = defineEmits(["click"]);

const base =
  "cursor-pointer bg-[#1B3EC1] hover:bg-none lg:hover:bg-[#5F38BB] text-[#FFFFFF] transition-colors duration-300 font-medium rounded-2xl px-4 py-2 text-sm lg:text-base ";

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
  <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<style scoped></style>
