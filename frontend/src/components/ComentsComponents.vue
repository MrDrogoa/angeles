<script setup>
import { computed } from "vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import { useProfileStore } from "@/composables/useProfileStore";

const profileStore = useProfileStore();

// Obtener comentarios del store
const comments = computed(() => profileStore.getComments());
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4 py-6">
    <return-components class="mb-6" />

    <title-h-2-components
      title="Todos los Comentarios"
      class="text-center mb-8 md:mb-12"
    />

    <!-- Mensaje si no hay comentarios -->
    <div
      v-if="comments.length === 0"
      class="text-center p-6 bg-gray-800/30 rounded-xl border-2 border-gray-700"
    >
      <p class="text-gray-400 text-base md:text-lg">
        No hay comentarios disponibles
      </p>
    </div>

    <!-- Grid de 2 columnas en desktop, 1 columna en mobile -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
      <div
        v-for="comment in comments"
        :key="comment.user + comment.date"
        class="border-2 border-[#FFD700] rounded-xl p-4 md:p-5 lg:p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
      >
        <!-- Header: Usuario y Fecha -->
        <div class="flex items-start justify-between mb-3 gap-2">
          <h3
            class="text-white font-semibold text-base md:text-lg lg:text-xl wrap-break-word"
          >
            {{ comment.user }}
          </h3>
          <span class="text-gray-400 text-xs md:text-sm whitespace-nowrap">
            {{ comment.date }}
          </span>
        </div>

        <!-- Comentario -->
        <p
          class="text-gray-300 text-sm md:text-base leading-relaxed wrap-break-word"
        >
          {{ comment.comment }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
