<script setup>
import { computed, useAttrs } from "vue";

// No props by design — this component should be used as a child with slot content and optional attributes
const attrs = useAttrs();
const emit = defineEmits(["click"]);

const base =
  "cursor-pointer bg-[#A2A2A2] hover:bg-none lg:hover:bg-white text-[#000000] transition-colors duration-300 font-semibold rounded-2xl px-4 py-2 text-sm lg:text-base xl:text-lg mode-btn";

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
  <div
    class="flex lg:justify-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 mb-4 md:mb-5 xl:mb-6 overflow-x-auto"
  >
    <router-link to="/all">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Todas
      </button>
    </router-link>
    <router-link to="/news">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Novedades
      </button>
    </router-link>
    <router-link to="/social">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Redes
      </button>
    </router-link>
    <router-link to="/masajistas">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Masajistas
      </button>
    </router-link>
    <router-link to="/premium">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Premium
      </button>
    </router-link>
    <router-link to="/top">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Top
      </button>
    </router-link>
    <router-link to="/vip">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Vip
      </button>
    </router-link>
    <router-link to="/normal">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Normal
      </button>
    </router-link>
    <router-link to="/destacadas">
      <button v-bind="attrs" :class="classes" @click="$emit('click', $event)">
        Destacadas
      </button>
    </router-link>
  </div>
</template>

<style scoped></style>
