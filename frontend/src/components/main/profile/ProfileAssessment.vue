<script setup>
import { ref, computed } from "vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import { useProfileStore } from "@/composables/useProfileStore";

const profileStore = useProfileStore();

// Estado local para la selección del usuario
const selectedHearts = ref(0);
const hoverHearts = ref(0);

// Computar el promedio y total de valoraciones
const averageRating = computed(() => profileStore.getAverageAssessment());
const totalAssessments = computed(() => profileStore.getTotalAssessments());

// Función para seleccionar corazones
const selectHearts = (hearts) => {
  selectedHearts.value = hearts;
};

// Función para hover
const setHover = (hearts) => {
  hoverHearts.value = hearts;
};

// Función para enviar la valoración
const submitAssessment = () => {
  if (selectedHearts.value > 0) {
    profileStore.addAssessment(selectedHearts.value);
    const currentSelection = selectedHearts.value;
    // Resetear selección
    selectedHearts.value = 0;
    hoverHearts.value = 0;

    // Mostrar confirmación
    setTimeout(() => {
      alert(
        `¡Gracias por tu valoración de ${currentSelection} ${
          currentSelection === 1 ? "corazón" : "corazones"
        }!`
      );
    }, 100);
  } else {
    alert("Por favor selecciona al menos un corazón");
  }
};

// Determinar si un corazón debe estar activo
const isHeartActive = (heartNumber) => {
  if (hoverHearts.value > 0) {
    return heartNumber <= hoverHearts.value;
  }
  return heartNumber <= selectedHearts.value;
};
</script>

<template>
  <section>
    <title-h-2-components title="Valoración" class="text-center mb-6 md:mb-8" />

    <!-- Estadísticas de valoración -->
    <div
      v-if="totalAssessments > 0"
      class="text-center mb-8 md:mb-10 p-4 bg-gray-800/30 rounded-xl"
    >
      <p class="text-gray-300 text-sm md:text-base mb-2 mode-paragraph">
        Promedio de valoraciones
      </p>
      <p class="text-[#FFD700] text-3xl md:text-4xl font-bold mode-paragraph">
        {{ averageRating }}
      </p>
      <p class="text-gray-400 text-xs md:text-sm mt-2 mode-paragraph">
        {{ totalAssessments }}
        {{ totalAssessments === 1 ? "valoración" : "valoraciones" }}
      </p>
    </div>

    <!-- Selector de corazones -->
    <div class="flex justify-center items-center gap-3 md:gap-4 lg:gap-6 mb-8">
      <button
        v-for="heart in 5"
        :key="heart"
        @click="selectHearts(heart)"
        @mouseenter="setHover(heart)"
        @mouseleave="setHover(0)"
        class="transition-all duration-300 transform hover:scale-110 focus:outline-none cursor-pointer mode-heart"
        :class="[isHeartActive(heart) ? 'opacity-100' : 'opacity-40']"
        :aria-label="`Valorar con ${heart} corazones`"
      >
        <font-awesome-icon
          :icon="isHeartActive(heart) ? 'heart' : ['far', 'heart']"
          :class="[
            isHeartActive(heart) ? 'text-[#FFD700]' : 'text-white',
            'text-2xl md:text-3xl lg:text-4xl xl:text-5xl mode-icon',
          ]"
        />
      </button>
    </div>

    <!-- Indicador de selección -->
    <div class="text-center mb-6 md:mb-8">
      <p class="text-gray-300 text-sm md:text-base">
        {{
          selectedHearts > 0
            ? `Has seleccionado ${selectedHearts} ${
                selectedHearts === 1 ? "corazón" : "corazones"
              }`
            : "Selecciona tu valoración"
        }}
      </p>
    </div>

    <!-- Botón para enviar valoración -->
    <div class="flex justify-center">
      <button-components @click="submitAssessment">
        Enviar valoración
      </button-components>
    </div>
  </section>
</template>

<style scoped></style>
