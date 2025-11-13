<script setup>
import FontAwesomeIcon from "@/icons/icon.js";

// Recibir features como prop desde el componente padre
const props = defineProps({
  features: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<template>
  <!-- Features (iconos con información) -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
    <div
      v-for="(feature, index) in props.features"
      :key="index"
      class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-lg lg:hover:bg-gray-800 transition-all duration-300"
    >
      <font-awesome-icon
        :icon="feature.icon"
        class="text-[#FFD700] text-lg sm:text-xl md:text-2xl lg:text-3xl mode-icon-profile"
      />
      <div class="flex flex-col min-w-0">
        <span
          class="text-white text-xs sm:text-sm lg:text-lg font-semibold truncate mode-paragraph"
        >
          {{ feature.label }}
        </span>
        <span
          class="text-[#A2A2A2] text-xs md:text-base truncate mode-paragraph"
        >
          {{ feature.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
