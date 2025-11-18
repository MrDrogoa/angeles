<script setup>
import { computed } from "vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import { useProfileStore } from "@/composables/useProfileStore";

const props = defineProps({
  qualifications: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const profileStore = useProfileStore();

// Mostrar solo los primeros 3 comentarios del store (calificaciones del usuario)
const limitedComments = computed(() => {
  return profileStore.getComments().slice(0, 3);
});
</script>

<template>
  <section class="py-8 md:py-12 lg:py-16">
    <title-h-2-components
      title="Comentarios"
      class="text-center mb-6 md:mb-8"
    />

    <!-- Mensaje por defecto cuando no hay comentarios -->
    <div
      v-if="limitedComments.length === 0"
      class="text-center mb-6 md:mb-8 p-6 bg-gray-800/30 rounded-xl border-2 border-gray-700"
    >
      <p class="text-gray-400 text-base md:text-lg mode-paragraph">
        Aún no hay comentarios
      </p>
    </div>

    <!-- Lista de comentarios (solo 3) -->
    <div v-else class="space-y-4 md:space-y-5 mb-6 md:mb-8">
      <div
        v-for="comment in limitedComments"
        :key="comment.user + comment.date"
        class="border-2 border-[#FFD700] rounded-xl p-4 md:p-5 bg-gray-800/30 lg:hover:bg-gray-800/50 transition-all duration-300 mode-card"
      >
        <!-- Header: Usuario y Fecha -->
        <div class="flex items-start justify-between mb-3 gap-2">
          <h3
            class="text-white font-semibold text-base md:text-lg mode-title break-words"
          >
            {{ comment.user }}
          </h3>
          <span
            class="text-gray-400 text-xs md:text-sm mode-paragraph whitespace-nowrap"
          >
            {{ comment.date }}
          </span>
        </div>

        <!-- Comentario -->
        <p
          class="text-gray-300 text-sm md:text-base leading-relaxed mode-paragraph break-words"
        >
          {{ comment.comment }}
        </p>
      </div>
    </div>

    <!-- Botón Ver todo -->
    <div class="flex justify-center">
      <router-link to="/coments">
        <button-components>Ver todo</button-components>
      </router-link>
    </div>
  </section>
</template>

<style scoped></style>
