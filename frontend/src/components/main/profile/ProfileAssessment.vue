<script setup>
import { computed } from "vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import { useProfileStore } from "@/composables/useProfileStore";

const profileStore = useProfileStore();

// Computar el promedio y total de valoraciones
const averageRating = computed(() => profileStore.getAverageAssessment());
const totalAssessments = computed(() => profileStore.getTotalAssessments());
</script>

<template>
  <section>
    <title-h-2-components title="Valoración" class="text-center mb-6 md:mb-8" />

    <!-- Mensaje por defecto cuando no hay valoraciones -->
    <div
      v-if="totalAssessments === 0"
      class="text-center mb-8 md:mb-10 p-6 bg-gray-800/30 rounded-xl border-2 border-gray-700"
    >
      <p class="text-gray-400 text-base md:text-lg mode-paragraph">
        Aún no hay valoraciones
      </p>
    </div>

    <!-- Estadísticas de valoración -->
    <div
      v-else
      class="text-center mb-8 md:mb-10 p-6 bg-gray-800/30 rounded-xl border-2 border-[#FFD700] mode-card"
    >
      <p class="text-gray-300 text-sm md:text-base mb-2 mode-paragraph">
        Nota Final
      </p>
      <p class="text-[#FFD700] text-4xl md:text-5xl font-bold mode-paragraph">
        {{ averageRating }} / 7.0
      </p>
      <p class="text-gray-400 text-xs md:text-sm mt-2 mode-paragraph">
        {{ totalAssessments }}
        {{ totalAssessments === 1 ? "valoración" : "valoraciones" }}
      </p>
    </div>
  </section>
</template>

<style scoped></style>
