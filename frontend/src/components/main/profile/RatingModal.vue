<script setup>
import { ref, computed } from "vue";
import { useProfileStore } from "@/composables/useProfileStore";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const profileStore = useProfileStore();

// Estado del formulario
const ratings = ref({
  lugar: 0,
  fisico: 0,
  servicio: 0,
});
const comment = ref("");
const hoverRatings = ref({
  lugar: 0,
  fisico: 0,
  servicio: 0,
});

// Usuario de prueba (TODO: obtener de authStore cuando esté listo)
const currentUser = ref("Usuario Prueba");

// Validación de caracteres del comentario
const commentLength = computed(() => comment.value.length);
const isCommentValid = computed(
  () => commentLength.value >= 15 && commentLength.value <= 500
);

// Calcular nota final (promedio de las 3 categorías)
const notaFinal = computed(() => {
  const values = [
    ratings.value.lugar,
    ratings.value.fisico,
    ratings.value.servicio,
  ];
  if (values.every((v) => v === 0)) return "0.0";
  const avg = values.reduce((a, b) => a + b, 0) / 3;
  return Math.min(avg, 7.0).toFixed(1);
});

// Validar si el formulario está completo
const isFormValid = computed(() => {
  return (
    ratings.value.lugar > 0 &&
    ratings.value.fisico > 0 &&
    ratings.value.servicio > 0 &&
    isCommentValid.value
  );
});

// Función para calificar una categoría
const rate = (category, stars) => {
  ratings.value[category] = stars;
};

// Función para hover
const setHover = (category, stars) => {
  hoverRatings.value[category] = stars;
};

// Verificar si una estrella está activa
const isStarActive = (category, starNumber) => {
  if (hoverRatings.value[category] > 0) {
    return starNumber <= hoverRatings.value[category];
  }
  return starNumber <= ratings.value[category];
};

// Cerrar modal
const closeModal = () => {
  // Resetear formulario
  ratings.value = { lugar: 0, fisico: 0, servicio: 0 };
  comment.value = "";
  hoverRatings.value = { lugar: 0, fisico: 0, servicio: 0 };
  emit("close");
};

// Enviar calificación
const submitRating = () => {
  if (!isFormValid.value) {
    alert(
      "Por favor completa todas las calificaciones y agrega un comentario de al menos 15 caracteres"
    );
    return;
  }

  // Crear objeto de calificación
  const newRating = {
    user: currentUser.value,
    date: new Date().toLocaleDateString("es-ES"),
    rating: parseFloat(notaFinal.value),
    category: "general", // Categoría general que incluye las 3
    comment: comment.value.trim(),
    ratings: {
      lugar: ratings.value.lugar,
      fisico: ratings.value.fisico,
      servicio: ratings.value.servicio,
    },
  };

  // Agregar al store
  profileStore.addComment(newRating);

  // Guardar la nota final en escala 1-7 (no convertir a corazones)
  profileStore.addAssessment(parseFloat(notaFinal.value));

  // Emitir evento de submit
  emit("submit", newRating);

  // Mostrar confirmación
  alert(
    `¡Gracias por tu calificación de ${notaFinal.value}/7!\nTu comentario ha sido agregado.`
  );

  // Cerrar modal
  closeModal();
};

// Categorías para el modal
const categories = [
  { key: "lugar", label: "📍 Lugar y Presencia", icon: "🏠" },
  { key: "fisico", label: "💪 Físico", icon: "💪" },
  { key: "servicio", label: "🛎️ Servicio", icon: "🛎️" },
];
</script>

<template>
  <!-- Modal overlay -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <!-- Modal container -->
    <div
      class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-2 border-[#FFD700] rounded-2xl shadow-2xl"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 bg-gray-900 border-b-2 border-[#FFD700]"
      >
        <h2 class="text-xl md:text-2xl font-bold text-[#FFD700] mode-title">
          ⭐ Calificar Perfil
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 md:p-6 space-y-6">
        <!-- Usuario -->
        <div
          class="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <span class="text-gray-400 text-sm mode-paragraph">👤 Usuario:</span>
          <span class="text-white font-semibold mode-paragraph">{{
            currentUser
          }}</span>
        </div>

        <!-- Calificaciones por categoría -->
        <div class="space-y-6">
          <div
            v-for="category in categories"
            :key="category.key"
            class="p-4 bg-gray-800/30 rounded-xl border border-gray-700 mode-card"
          >
            <!-- Label de categoría -->
            <div class="flex items-center justify-between mb-4">
              <h3
                class="text-base md:text-lg font-semibold text-white mode-title"
              >
                {{ category.label }}
              </h3>
              <span
                class="text-[#FFD700] text-xl md:text-2xl font-bold mode-paragraph"
              >
                {{ ratings[category.key] || 0 }}/7
              </span>
            </div>

            <!-- Estrellas -->
            <div class="flex justify-center items-center gap-1 md:gap-2">
              <button
                v-for="star in 7"
                :key="star"
                @click="rate(category.key, star)"
                @mouseenter="setHover(category.key, star)"
                @mouseleave="setHover(category.key, 0)"
                class="transition-all duration-200 transform hover:scale-110 focus:outline-none cursor-pointer"
                :aria-label="`Calificar ${category.label} con ${star} estrellas`"
              >
                <font-awesome-icon
                  :icon="
                    isStarActive(category.key, star) ? 'star' : ['far', 'star']
                  "
                  :class="[
                    isStarActive(category.key, star)
                      ? 'text-[#FFD700]'
                      : 'text-gray-600',
                    'text-xl md:text-2xl lg:text-3xl',
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Nota Final -->
        <div
          class="p-4 md:p-6 bg-linear-to-r from-[#FFD700]/20 to-[#FFD700]/10 rounded-xl border-2 border-[#FFD700]"
        >
          <div class="text-center">
            <p class="text-gray-300 text-sm md:text-base mb-2 mode-paragraph">
              Nota Final (Promedio)
            </p>
            <p class="text-[#FFD700] text-4xl md:text-5xl font-bold mode-title">
              {{ notaFinal }}/7
            </p>
          </div>
        </div>

        <!-- Comentario -->
        <div class="space-y-2">
          <label
            class="block text-white font-semibold text-sm md:text-base mode-title"
          >
            💬 Comentario <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="comment"
            placeholder="Escribe tu comentario aquí (mínimo 15 caracteres)..."
            rows="5"
            maxlength="500"
            class="w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none transition-colors duration-200 mode-paragraph"
            :class="[
              comment.length > 0 && !isCommentValid
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-[#FFD700]',
            ]"
          ></textarea>

          <!-- Contador de caracteres -->
          <div class="flex items-center justify-between text-xs md:text-sm">
            <span
              :class="[
                isCommentValid
                  ? 'text-green-500'
                  : commentLength > 0
                  ? 'text-red-500'
                  : 'text-gray-400',
                'mode-paragraph',
              ]"
            >
              {{ commentLength }} / 500 caracteres
              <span v-if="commentLength > 0 && commentLength < 15" class="ml-2">
                (mínimo 15)
              </span>
              <span v-if="isCommentValid" class="ml-2"> ✓ Válido </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Footer con botones -->
      <div
        class="sticky bottom-0 flex flex-col sm:flex-row gap-3 p-4 md:p-6 bg-gray-900 border-t-2 border-[#FFD700]"
      >
        <button
          @click="closeModal"
          class="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 mode-paragraph"
        >
          Cancelar
        </button>
        <button
          @click="submitRating"
          :disabled="!isFormValid"
          class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 mode-paragraph"
          :class="[
            isFormValid
              ? 'bg-[#FFD700] text-gray-900 hover:bg-[#FFD700]/90 cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50',
          ]"
        >
          {{ isFormValid ? "Enviar Calificación" : "Completa el formulario" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Personalización del scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #ffd700;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #ffc700;
}
</style>
