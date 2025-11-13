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

// Mostrar solo los primeros 3 comentarios
const limitedComments = computed(() => {
  return props.qualifications.slice(0, 3);
});
</script>

<template>
  <section class="py-8 md:py-12 lg:py-16">
    <title-h-2-components
      title="Comentarios"
      class="text-center mb-6 md:mb-8"
    />

    <!-- Lista de comentarios (solo 3) -->
    <div class="space-y-4 md:space-y-5 mb-6 md:mb-8">
      <div
        v-for="comment in limitedComments"
        :key="comment.user + comment.date"
        class="border-2 border-[#FFD700] rounded-xl p-4 md:p-5 bg-gray-800/30 lg:hover:bg-gray-800/50 transition-all duration-300 mode-card"
      >
        <!-- Header: Usuario y Fecha -->
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-white font-semibold text-base md:text-lg mode-title">
            {{ comment.user }}
          </h3>
          <span class="text-gray-400 text-xs md:text-sm mode-paragraph">
            {{ comment.date }}
          </span>
        </div>

        <!-- Comentario -->
        <p
          class="text-gray-300 text-sm md:text-base leading-relaxed mode-paragraph"
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
