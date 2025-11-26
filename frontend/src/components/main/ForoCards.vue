<script setup>
import { defineProps } from "vue";

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

// Emitir evento para votar
const emit = defineEmits(["vote"]);

const handleVote = (postId, voteType) => {
  emit("vote", { postId, voteType });
};

// Formatear fecha
const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("es-CL", options);
};
</script>

<template>
  <div v-if="posts.length === 0" class="text-center py-16 md:py-20 lg:py-24">
    <font-awesome-icon
      icon="comments"
      class="text-6xl md:text-7xl text-[#FFD700] mb-4 opacity-50"
    />
    <p class="text-xl md:text-2xl text-[#A2A2A2] font-medium mode-paragraph">
      Aún no hay foros disponibles
    </p>
  </div>

  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
  >
    <div
      v-for="post in posts"
      :key="post.id"
      class="bg-[#1a1a1a] border-2 border-[#FFD700] rounded-xl p-4 md:p-5 mode-card"
    >
      <!-- Header del post -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <font-awesome-icon
              icon="user-circle"
              class="text-[#FFD700] text-lg mode-icon"
            />
            <h3
              class="text-white font-semibold text-sm md:text-base mode-paragraph"
            >
              {{ post.alias }}
            </h3>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <font-awesome-icon icon="map-marker-alt" class="text-[#FFD700]" />
              {{ post.city }}
            </span>
            <span>•</span>
            <span>{{ formatDate(post.date) }}</span>
          </div>
        </div>
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-semibold',
            post.category === 'Clientes'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-pink-500/20 text-pink-400',
          ]"
        >
          {{ post.category }}
        </span>
      </div>

      <!-- Título del post -->
      <h4 class="text-[#FFD700] font-bold text-base md:text-lg mb-2 mode-title">
        {{ post.title }}
      </h4>

      <!-- Comentario -->
      <p
        class="text-gray-300 text-sm md:text-base mb-4 line-clamp-3 mode-paragraph"
      >
        {{ post.comment }}
      </p>

      <!-- Footer con botones de votación -->
      <div
        class="flex items-center justify-between pt-3 border-t border-gray-700"
      >
        <div class="flex items-center gap-3">
          <!-- Like -->
          <button
            @click="handleVote(post.id, 'like')"
            class="flex items-center gap-1 text-gray-400 lg:hover:text-green-500 transition-colors cursor-pointer"
          >
            <font-awesome-icon icon="thumbs-up" class="text-sm md:text-base" />
            <span class="text-xs md:text-sm font-semibold">{{
              post.likes
            }}</span>
          </button>

          <!-- Dislike -->
          <button
            @click="handleVote(post.id, 'dislike')"
            class="flex items-center gap-1 text-gray-400 lg:hover:text-red-500 transition-colors cursor-pointer"
          >
            <font-awesome-icon
              icon="thumbs-down"
              class="text-sm md:text-base"
            />
            <span class="text-xs md:text-sm font-semibold">{{
              post.dislikes
            }}</span>
          </button>
        </div>

        <!-- Contador de comentarios (futuro) -->
        <div class="flex items-center gap-1 text-gray-400">
          <font-awesome-icon icon="comment" class="text-sm" />
          <span class="text-xs md:text-sm">0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
