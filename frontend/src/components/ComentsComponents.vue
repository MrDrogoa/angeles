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

    <!-- Grid de 2 columnas con Flexbox y Tailwind -->
    <div class="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-5 lg:gap-6">
      <div
        v-for="comment in comments"
        :key="comment.user + comment.date"
        class="flex-1 md:basis-[calc(50%-0.625rem)] lg:basis-[calc(50%-0.75rem)] border-2 border-[#FFD700] rounded-xl p-4 md:p-5 lg:p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300"
      >
        <!-- Header: Usuario y Fecha -->
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-white font-semibold text-base md:text-lg lg:text-xl">
            {{ comment.user }}
          </h3>
          <span class="text-gray-400 text-xs md:text-sm">
            {{ comment.date }}
          </span>
        </div>

        <!-- Comentario -->
        <p class="text-gray-300 text-sm md:text-base leading-relaxed">
          {{ comment.comment }}
        </p>
      </div>
    </div>

    <!-- Mensaje si no hay comentarios -->
    <div
      v-if="comments.length === 0"
      class="text-center text-gray-400 text-lg py-12"
    >
      No hay comentarios disponibles
    </div>
  </section>
</template>

<style scoped></style>
