<script setup>
import { ref, onMounted, computed } from "vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import Hero from "@/assets/hero.webp";
import ProfileDescription from "@/components/main/profile/ProfileDescription.vue";
import ProfileIcons from "@/components/main/profile/ProfileIcons.vue";
import ProfilePicture from "@/components/main/profile/ProfilePicture.vue";
import ProfileQualifications from "@/components/main/profile/ProfileQualifications.vue";
import ProfileComents from "@/components/main/profile/ProfileComents.vue";
import ProfileAssessment from "@/components/main/profile/ProfileAssessment.vue";
import { useProfileStore } from "@/composables/useProfileStore";

const profileStore = useProfileStore();

// Computar valoraciones
const averageAssessment = computed(() => profileStore.getAverageAssessment());
const totalAssessments = computed(() => profileStore.getTotalAssessments());

// Datos dinámicos del perfil
const profileData = ref({
  name: "Nombre",
  isFavorite: false,
  category: "Category",
  images: [
    { id: 1, url: Hero, alt: "Imagen 1" },
    { id: 2, url: Hero, alt: "Imagen 2" },
    { id: 3, url: Hero, alt: "Imagen 3" },
    { id: 4, url: Hero, alt: "Imagen 4" },
  ],
  characteristics: [
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
    "Caract.",
  ],
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  features: [
    { icon: "phone", label: "Número", value: "+1234567890" },
    { icon: "check-circle", label: "Verificado", value: "Sí" },
    { icon: "dollar-sign", label: "Dinero", value: "$100" },
    { icon: "credit-card", label: "Pago", value: "Tarjeta" },
    { icon: "clock", label: "Horas", value: "24/7" },
    { icon: "map-marker-alt", label: "Ubicación", value: "Ciudad" },
  ],
  phoneNumber: "+1234567890",
  whatsappNumber: "+1234567890",
  img: [
    { id: 1, url: Hero, alt: "Imagen 1" },
    { id: 2, url: Hero, alt: "Imagen 2" },
    { id: 3, url: Hero, alt: "Imagen 3" },
    { id: 4, url: Hero, alt: "Imagen 4" },
    { id: 5, url: Hero, alt: "Imagen 5" },
    { id: 6, url: Hero, alt: "Imagen 6" },
    { id: 7, url: Hero, alt: "Imagen 7" },
    { id: 8, url: Hero, alt: "Imagen 8" },
    { id: 9, url: Hero, alt: "Imagen 9" },
    { id: 10, url: Hero, alt: "Imagen 10" },
    { id: 11, url: Hero, alt: "Imagen 11" },
    { id: 12, url: Hero, alt: "Imagen 12" },
    { id: 13, url: Hero, alt: "Imagen 13" },
    { id: 14, url: Hero, alt: "Imagen 14" },
    { id: 15, url: Hero, alt: "Imagen 15" },
  ],
  qualifications: [
    {
      user: "Usuario 1",
      rating: 5.4,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "12-10-2025",
      category: "lugar",
    },
    {
      user: "Usuario 2",
      rating: 4.8,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "11-10-2025",
      category: "fisico",
    },
    {
      user: "Usuario 3",
      rating: 3,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "10-10-2025",
      category: "servicio",
    },
    {
      user: "Usuario 4",
      rating: 6.2,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-10-2025",
      category: "lugar",
    },
    {
      user: "Usuario 5",
      rating: 4.5,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "08-10-2025",
      category: "fisico",
    },
    {
      user: "Usuario 6",
      rating: 5.8,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "07-10-2025",
      category: "servicio",
    },
  ],
});

// Resetear el store al montar (para que inicie vacío cada vez que se recarga la página)
onMounted(() => {
  profileStore.reset();
});

// Función para marcar como favorito
const toggleFavorite = () => {
  profileData.value.isFavorite = !profileData.value.isFavorite;
};

// Funciones de contacto
const callNumber = () => {
  window.location.href = `tel:${profileData.value.phoneNumber}`;
};

const openWhatsApp = () => {
  window.open(
    `https://wa.me/${profileData.value.whatsappNumber.replace(/\+/g, "")}`,
    "_blank"
  );
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4 py-6">
    <return-components class="mb-4" />

    <!-- Layout principal: Grid responsive -->
    <article class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <!-- Columna izquierda: Carrusel de imágenes -->

      <div class="relative overflow-hidden">
        <Carousel :items-to-show="1" :wrap-around="true" snap-align="center">
          <Slide v-for="image in profileData.images" :key="image.id">
            <div class="overflow-hidden">
              <img
                :src="image.url"
                :alt="image.alt"
                class="w-full h-full object-cover rounded-xl"
              />
            </div>
          </Slide>

          <!-- Botones de navegación -->
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>

      <!-- Columna derecha: Información del perfil -->
      <div class="flex flex-col gap-4 sm:gap-5">
        <!-- Nombre y favorito -->
        <div class="flex items-center justify-between gap-4">
          <h2
            class="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#A2A2A2] mode-title"
          >
            {{ profileData.name }}
          </h2>
          <button
            @click="toggleFavorite"
            class="text-2xl sm:text-3xl transition-colors duration-300 focus:outline-none mode-heart"
            :class="profileData.isFavorite ? 'text-red-500' : 'text-gray-400'"
            aria-label="Marcar como favorito"
          >
            <font-awesome-icon
              :icon="profileData.isFavorite ? 'heart' : ['far', 'heart']"
              class="mode-icon"
            />
          </button>
        </div>

        <!-- Categoría -->
        <p
          class="text-[#FFD700] text-base sm:text-lg font-semibold -mt-2 mode-paragraph"
        >
          {{ profileData.category }}
        </p>

        <!-- Valoración promedio (si existe) -->
        <div v-if="totalAssessments > 0" class="flex items-center gap-2 -mt-2">
          <div class="flex gap-1">
            <font-awesome-icon
              v-for="star in 5"
              :key="star"
              icon="heart"
              :class="[
                star <= Math.round(parseFloat(averageAssessment))
                  ? 'text-[#FFD700]'
                  : 'text-gray-600',
                'w-4 h-4 sm:w-5 sm:h-5 mode-icon',
              ]"
            />
          </div>
          <span class="text-gray-300 text-sm sm:text-base mode-paragraph">
            {{ averageAssessment }} / 5 ({{ totalAssessments }}
            {{ totalAssessments === 1 ? "valoración" : "valoraciones" }})
          </span>
        </div>

        <!-- Características (badges) -->
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <span
            v-for="(char, index) in profileData.characteristics"
            :key="index"
            class="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#FFD700] rounded-full text-white text-xs sm:text-sm font-medium hover:bg-[#FFD700] hover:text-black transition-all duration-300 cursor-default mode-carac-btn"
          >
            {{ char }}
          </span>
        </div>

        <!-- Botones de contacto -->
        <div class="flex gap-3 sm:gap-4 justify-center lg:justify-start">
          <button
            @click="callNumber"
            class="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 lg:hover:bg-gray-500 text-white rounded-lg transition-all duration-300 text-sm sm:text-base font-medium cursor-pointer mode-btn"
          >
            <font-awesome-icon icon="phone" class="mode-icon" />
            <span>Llamar</span>
          </button>
          <button
            @click="openWhatsApp"
            class="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 lg:hover:bg-gray-500 text-white rounded-lg transition-all duration-300 text-sm sm:text-base font-medium cursor-pointer mode-btn"
          >
            <font-awesome-icon :icon="['fab', 'whatsapp']" class="mode-icon" />
            <span>Whatsapp</span>
          </button>
        </div>
      </div>
    </article>
    <!-- Descripción -->
    <profile-description :description="profileData.description" />
    <!-- Iconos de características -->
    <profile-icons :features="profileData.features" />
    <!-- profile fotos -->
    <profile-picture :images="profileData.img" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <!-- Calificaciones -->
      <div class="flex flex-col">
        <profile-qualifications :qualifications="profileData.qualifications" />
        <profile-assessment />
      </div>
      <!-- Comentarios -->
      <div class="flex flex-col">
        <profile-coments :qualifications="profileData.qualifications" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Estilos personalizados para los botones del carrusel */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 1 !important;
  cursor: pointer !important;
}

:deep(.carousel__prev):hover,
:deep(.carousel__next):hover {
  background-color: rgba(0, 0, 0, 0.8);
}

:deep(.carousel__icon) {
  width: 1.25rem;
  height: 1.25rem;
}

/* Posición de los botones */
:deep(.carousel__prev) {
  left: 1rem;
}

:deep(.carousel__next) {
  right: 1rem;
}

@media (min-width: 640px) {
  :deep(.carousel__prev),
  :deep(.carousel__next) {
    width: 50px;
    height: 50px;
  }

  :deep(.carousel__icon) {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
