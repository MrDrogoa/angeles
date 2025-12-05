<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import testUsersService from "@/services/testUsersService";
import { formatRelativeDate } from "@/utils/dateFormatter";

const route = useRoute();
const router = useRouter();

// Estado
const post = ref(null);
const comments = ref([]);
const currentUser = ref(null);
const userVotes = ref({});
const commentVotes = ref({});
const newComment = ref("");
const isSubmitting = ref(false);

// Cargar post
const loadPost = () => {
  const postId = parseInt(route.params.id);
  const savedPosts = localStorage.getItem("foroPosts");

  if (savedPosts) {
    const posts = JSON.parse(savedPosts);
    post.value = posts.find((p) => p.id === postId);

    if (!post.value) {
      router.push("/forum");
    }
  } else {
    router.push("/forum");
  }
};

// Cargar comentarios
const loadComments = () => {
  const savedComments = localStorage.getItem("foroComments");
  if (savedComments) {
    const allComments = JSON.parse(savedComments);
    comments.value = allComments
      .filter((c) => c.postId === post.value?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};

// Votar en post
const handlePostVote = (voteType) => {
  if (!post.value || !currentUser.value) return;

  const postId = post.value.id;
  const currentVote = userVotes.value[postId];

  // Remover voto
  if (currentVote === voteType) {
    if (voteType === "like") {
      post.value.likes = Math.max(0, post.value.likes - 1);
    } else {
      post.value.dislikes = Math.max(0, post.value.dislikes - 1);
    }
    delete userVotes.value[postId];
  }
  // Cambiar voto
  else if (currentVote && currentVote !== voteType) {
    if (currentVote === "like") {
      post.value.likes = Math.max(0, post.value.likes - 1);
    } else {
      post.value.dislikes = Math.max(0, post.value.dislikes - 1);
    }
    if (voteType === "like") {
      post.value.likes++;
    } else {
      post.value.dislikes++;
    }
    userVotes.value[postId] = voteType;
  }
  // Agregar voto
  else {
    if (voteType === "like") {
      post.value.likes++;
    } else {
      post.value.dislikes++;
    }
    userVotes.value[postId] = voteType;
  }

  // Guardar
  const savedPosts = JSON.parse(localStorage.getItem("foroPosts"));
  const index = savedPosts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    savedPosts[index] = post.value;
    localStorage.setItem("foroPosts", JSON.stringify(savedPosts));
  }
  localStorage.setItem("foroUserVotes", JSON.stringify(userVotes.value));
};

// Votar en comentario
const handleCommentVote = ({ commentId, voteType }) => {
  const comment = comments.value.find((c) => c.id === commentId);
  if (!comment || !currentUser.value) return;

  const currentVote = commentVotes.value[commentId];

  if (currentVote === voteType) {
    if (voteType === "like") {
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }
    delete commentVotes.value[commentId];
  } else if (currentVote && currentVote !== voteType) {
    if (currentVote === "like") {
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }
    if (voteType === "like") {
      comment.likes++;
    } else {
      comment.dislikes++;
    }
    commentVotes.value[commentId] = voteType;
  } else {
    if (voteType === "like") {
      comment.likes++;
    } else {
      comment.dislikes++;
    }
    commentVotes.value[commentId] = voteType;
  }

  // Guardar
  const allComments = JSON.parse(localStorage.getItem("foroComments") || "[]");
  const index = allComments.findIndex((c) => c.id === commentId);
  if (index !== -1) {
    allComments[index] = comment;
    localStorage.setItem("foroComments", JSON.stringify(allComments));
  }
  localStorage.setItem("foroCommentVotes", JSON.stringify(commentVotes.value));
};

// Publicar comentario
const publishComment = () => {
  if (!newComment.value.trim() || !currentUser.value || !post.value) {
    return;
  }

  isSubmitting.value = true;

  const comment = {
    id: Date.now(),
    postId: post.value.id,
    author: {
      id: currentUser.value.id,
      name: currentUser.value.name,
      location: currentUser.value.location,
      avatar: currentUser.value.avatar,
    },
    comment: newComment.value.trim(),
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };

  // Guardar comentario
  const allComments = JSON.parse(localStorage.getItem("foroComments") || "[]");
  allComments.push(comment);
  localStorage.setItem("foroComments", JSON.stringify(allComments));

  // Actualizar contador en post
  post.value.commentsCount = (post.value.commentsCount || 0) + 1;
  const savedPosts = JSON.parse(localStorage.getItem("foroPosts"));
  const index = savedPosts.findIndex((p) => p.id === post.value.id);
  if (index !== -1) {
    savedPosts[index].commentsCount = post.value.commentsCount;
    localStorage.setItem("foroPosts", JSON.stringify(savedPosts));
  }

  // Actualizar lista local
  comments.value.unshift(comment);
  newComment.value = "";
  isSubmitting.value = false;
};

// Estado de voto del post
const isPostVoteActive = (voteType) => {
  return userVotes.value[post.value?.id] === voteType;
};

// Contador de comentarios
const commentsCount = computed(() => comments.value.length);

onMounted(() => {
  currentUser.value = testUsersService.loadCurrentUser();

  // Cargar votos
  const savedVotes = localStorage.getItem("foroUserVotes");
  if (savedVotes) {
    userVotes.value = JSON.parse(savedVotes);
  }

  const savedCommentVotes = localStorage.getItem("foroCommentVotes");
  if (savedCommentVotes) {
    commentVotes.value = JSON.parse(savedCommentVotes);
  }

  loadPost();
  loadComments();
});
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4 py-8 md:py-12">
    <!-- Botón volver -->
    <button
      @click="router.push('/forum')"
      class="flex items-center gap-2 text-[#FFD700] lg:hover:text-[#FFB200] transition-colors mb-6 mode-paragraph cursor-pointer"
    >
      <font-awesome-icon icon="chevron-left" />
      <span class="font-semibold">Volver al foro</span>
    </button>

    <!-- Post principal -->
    <div
      v-if="post"
      class="bg-[#1a1a1a] border-2 border-[#FFD700] rounded-2xl p-6 md:p-8 mb-8 mode-card"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl md:text-4xl">{{
            post.author?.avatar || "👤"
          }}</span>
          <div>
            <h3
              class="text-white font-semibold text-base md:text-lg mode-paragraph"
            >
              {{ post.author?.name || "Usuario Anónimo" }}
            </h3>
            <div
              class="flex items-center gap-2 text-xs md:text-sm text-gray-400 mt-1"
            >
              <font-awesome-icon
                icon="map-marker-alt"
                class="text-[#FFD700] text-xs"
              />
              <span>{{
                post.author?.location || "Ubicación desconocida"
              }}</span>
              <span>•</span>
              <font-awesome-icon icon="clock" class="text-xs" />
              <span>{{ formatRelativeDate(post.date) }}</span>
            </div>
          </div>
        </div>
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs md:text-sm font-semibold',
            post.category === 'Clientes'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-pink-500/20 text-pink-400',
          ]"
        >
          {{ post.category }}
        </span>
      </div>

      <!-- Título -->
      <h1
        class="text-[#FFD700] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 mode-title"
      >
        {{ post.title }}
      </h1>

      <!-- Comentario completo -->
      <p
        class="text-gray-300 text-base md:text-lg mb-6 whitespace-pre-wrap mode-paragraph"
      >
        {{ post.comment }}
      </p>

      <!-- Footer con votación -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-700"
      >
        <div class="flex items-center gap-4">
          <!-- Like -->
          <button
            @click="handlePostVote('like')"
            :class="[
              'flex items-center gap-2 transition-all duration-300 cursor-pointer',
              isPostVoteActive('like')
                ? 'text-green-500 scale-110'
                : 'text-gray-400 lg:hover:text-green-500 lg:hover:scale-105',
            ]"
            :title="isPostVoteActive('like') ? 'Quitar me gusta' : 'Me gusta'"
          >
            <font-awesome-icon
              :icon="
                isPostVoteActive('like') ? 'thumbs-up' : ['far', 'thumbs-up']
              "
              class="text-lg md:text-xl"
            />
            <span class="text-sm md:text-base font-semibold">{{
              post.likes
            }}</span>
          </button>

          <!-- Dislike -->
          <button
            @click="handlePostVote('dislike')"
            :class="[
              'flex items-center gap-2 transition-all duration-300 cursor-pointer',
              isPostVoteActive('dislike')
                ? 'text-red-500 scale-110'
                : 'text-gray-400 lg:hover:text-red-500 lg:hover:scale-105',
            ]"
            :title="
              isPostVoteActive('dislike') ? 'Quitar no me gusta' : 'No me gusta'
            "
          >
            <font-awesome-icon
              :icon="
                isPostVoteActive('dislike')
                  ? 'thumbs-down'
                  : ['far', 'thumbs-down']
              "
              class="text-lg md:text-xl"
            />
            <span class="text-sm md:text-base font-semibold">{{
              post.dislikes
            }}</span>
          </button>
        </div>

        <!-- Contador de comentarios -->
        <div class="flex items-center gap-2 text-gray-400">
          <font-awesome-icon icon="comment" class="text-base md:text-lg" />
          <span class="text-sm md:text-base font-semibold">{{
            commentsCount
          }}</span>
          <span class="text-sm md:text-base">
            {{ commentsCount === 1 ? "comentario" : "comentarios" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Sección de comentarios -->
    <div
      class="bg-[#1a1a1a] border-2 border-[#FFD700] rounded-2xl p-6 md:p-8 mode-card"
    >
      <h2 class="text-white font-bold text-xl md:text-2xl mb-6 mode-title">
        💬 Comentarios ({{ commentsCount }})
      </h2>

      <!-- Formulario nuevo comentario -->
      <div class="mb-8">
        <div class="flex items-start gap-3 md:gap-4">
          <span class="text-2xl md:text-3xl">{{
            currentUser?.avatar || "👤"
          }}</span>
          <div class="flex-1">
            <textarea
              v-model="newComment"
              placeholder="Escribe tu comentario..."
              rows="4"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all resize-none mode-input mode-register-input"
              :disabled="isSubmitting"
            ></textarea>
            <button
              @click="publishComment"
              :disabled="!newComment.trim() || isSubmitting"
              class="mt-3 bg-[#FFD700] lg:hover:bg-[#FFB200] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded-lg transition-colors duration-300 mode-btn cursor-pointer"
            >
              {{ isSubmitting ? "Publicando..." : "Comentar" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de comentarios -->
      <div v-if="comments.length === 0" class="text-center py-12">
        <font-awesome-icon
          icon="comments"
          class="text-5xl text-[#FFD700] mb-4 opacity-50"
        />
        <p class="text-gray-400 text-lg mode-paragraph">
          Sé el primero en comentar
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 md:p-5 mode-card"
        >
          <!-- Header del comentario -->
          <div class="flex items-start gap-3 mb-3">
            <span class="text-2xl">{{ comment.author?.avatar || "👤" }}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <h4
                    class="text-white font-semibold text-sm md:text-base mode-paragraph"
                  >
                    {{ comment.author?.name || "Usuario Anónimo" }}
                  </h4>
                  <div
                    class="flex items-center gap-2 text-xs text-gray-500 mt-1"
                  >
                    <font-awesome-icon
                      icon="map-marker-alt"
                      class="text-[#FFD700] text-[10px]"
                    />
                    <span>{{ comment.author?.location }}</span>
                    <span>•</span>
                    <font-awesome-icon icon="clock" class="text-[10px]" />
                    <span>{{ formatRelativeDate(comment.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Texto del comentario -->
          <p
            class="text-gray-300 text-sm md:text-base mb-3 ml-11 whitespace-pre-wrap mode-paragraph"
          >
            {{ comment.comment }}
          </p>

          <!-- Footer con votación -->
          <div class="flex items-center gap-3 ml-11">
            <button
              @click="
                handleCommentVote({ commentId: comment.id, voteType: 'like' })
              "
              :class="[
                'flex items-center gap-1 transition-all duration-300 cursor-pointer',
                commentVotes[comment.id] === 'like'
                  ? 'text-green-500 scale-110'
                  : 'text-gray-400 lg:hover:text-green-500',
              ]"
            >
              <font-awesome-icon
                :icon="
                  commentVotes[comment.id] === 'like'
                    ? 'thumbs-up'
                    : ['far', 'thumbs-up']
                "
                class="text-sm"
              />
              <span class="text-xs font-semibold">{{ comment.likes }}</span>
            </button>

            <button
              @click="
                handleCommentVote({
                  commentId: comment.id,
                  voteType: 'dislike',
                })
              "
              :class="[
                'flex items-center gap-1 transition-all duration-300 cursor-pointer',
                commentVotes[comment.id] === 'dislike'
                  ? 'text-red-500 scale-110'
                  : 'text-gray-400 lg:hover:text-red-500',
              ]"
            >
              <font-awesome-icon
                :icon="
                  commentVotes[comment.id] === 'dislike'
                    ? 'thumbs-down'
                    : ['far', 'thumbs-down']
                "
                class="text-sm"
              />
              <span class="text-xs font-semibold">{{ comment.dislikes }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
