<script setup>
import { computed } from "vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";

const props = defineProps({
  qualifications: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Calcular promedios por categoría
const averageLugarPresencia = computed(() => {
  const lugarRatings = props.qualifications.filter(
    (q) => q.category === "lugar"
  );
  if (lugarRatings.length === 0) return "0.0";
  const sum = lugarRatings.reduce((acc, q) => acc + q.rating, 0);
  return (sum / lugarRatings.length).toFixed(1);
});

const averageFisico = computed(() => {
  const fisicoRatings = props.qualifications.filter(
    (q) => q.category === "fisico"
  );
  if (fisicoRatings.length === 0) return "0.0";
  const sum = fisicoRatings.reduce((acc, q) => acc + q.rating, 0);
  return (sum / fisicoRatings.length).toFixed(1);
});

const averageServicio = computed(() => {
  const servicioRatings = props.qualifications.filter(
    (q) => q.category === "servicio"
  );
  if (servicioRatings.length === 0) return "0.0";
  const sum = servicioRatings.reduce((acc, q) => acc + q.rating, 0);
  return (sum / servicioRatings.length).toFixed(1);
});

const notaFinal = computed(() => {
  const values = [
    parseFloat(averageLugarPresencia.value),
    parseFloat(averageFisico.value),
    parseFloat(averageServicio.value),
  ];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.min(avg, 7.0).toFixed(1);
});

// Array dinámico de cuadrados (ESTO ES LO NUEVO)
const qualificationCards = computed(() => [
  {
    value: averageLugarPresencia.value,
    label: "Lugar y\nPresencia",
    isHighlight: false,
  },
  {
    value: averageFisico.value,
    label: "Físico",
    isHighlight: false,
  },
  {
    value: averageServicio.value,
    label: "Servicio",
    isHighlight: false,
  },
  {
    value: notaFinal.value,
    label: "Nota final",
    isHighlight: true, // Solo este tiene borde dorado
  },
]);
</script>

<template>
  <section class="py-8 md:py-12 lg:py-16">
    <title-h-2-components title="Calificaciones" class="text-center mb-8" />

    <!-- Grid dinámico con un solo div repetido -->
    <div class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      <div
        v-for="(card, index) in qualificationCards"
        :key="index"
        :class="[
          'flex flex-col items-center justify-center rounded-2xl',
          'w-24 h-24 md:w-30 md:h-30',
          'bg-gray-800/50 lg:hover:bg-gray-800 transition-colors duration-300',
          'border-2',
          card.isHighlight
            ? 'border-[#FFD700] text-[#FFD700] mode-card'
            : 'border-white text-white mode-card',
        ]"
      >
        <!-- Número grande -->
        <div
          class="text-2xl sm:text-3xl md:text-4xl font-bold mode-title mode-profile-title"
        >
          {{ card.value }}
        </div>

        <!-- Label -->
        <div
          :class="[
            'text-xs sm:text-sm md:text-base text-center mt-2 whitespace-pre-line mode-paragraph',
            card.isHighlight ? 'text-[#FFD700]' : 'text-gray-300',
          ]"
        >
          {{ card.label }}
        </div>
      </div>
    </div>

    <!-- Botón Calificar -->
    <div class="flex justify-center mt-8 md:mt-12">
      <button-components> Calificar </button-components>
    </div>
  </section>
</template>

<style scoped></style>
