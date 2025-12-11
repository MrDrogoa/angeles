<script setup>
import { ref, computed, onMounted } from "vue";
import TitleForoComponents from "@/components/TitleForoComponents.vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import ForoCards from "@/components/main/ForoCards.vue";
import ForoRule from "@/components/main/ForoRule.vue";
import testUsersService from "@/services/testUsersService";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import forumService from "@/services/forumService";

// Ref para el componente de reglamento
const foroRuleRef = ref(null);

// Estado del modal
const isModalOpen = ref(false);

// Estados de filtros
const activeCategory = ref("todos");
const selectedCity = ref("todas");
const sortBy = ref("recientes");

// Estados de dropdowns
const isCityDropdownOpen = ref(false);
const isSortDropdownOpen = ref(false);

// Regiones para filtro (separadas de las del modal)
const filterRegions = ref([
  {
    id: "norte",
    name: "Norte",
    isOpen: false,
    cities: [
      "Arica",
      "Iquique",
      "Antofagasta",
      "Calama",
      "Copiapó",
      "Vallenar",
      "Chañaral",
      "Tocopilla",
    ],
  },
  {
    id: "centro",
    name: "Centro",
    isOpen: false,
    cities: [
      "La Serena",
      "Coquimbo",
      "Ovalle",
      "Valparaíso",
      "Viña del Mar",
      "Santiago",
      "Rancagua",
      "Talca",
    ],
  },
  {
    id: "sur",
    name: "Sur",
    isOpen: false,
    cities: [
      "Concepción",
      "Temuco",
      "Valdivia",
      "Puerto Montt",
      "Osorno",
      "Punta Arenas",
      "Coyhaique",
      "Castro",
    ],
  },
]);

// Formulario del modal (simplificado)
const formData = ref({
  title: "",
  comment: "",
});

// Usuario actual (de prueba)
const currentUser = ref(null);

// Lista de posts (localStorage)
const posts = ref([]);

// Votos del usuario actual (localStorage)
const userVotes = ref({});

// Estados de publicación (FASE 2)
const isPublishing = ref(false);

// Estados de carga (FASE 3)
const isLoadingPosts = ref(false);
const loadError = ref(null);

// Estados FASE 5
const successMessage = ref(null);
const isVoting = ref(false);

// Categorías para tabs
const categories = [
  { id: "todos", label: "Todos" },
  { id: "clientes", label: "Clientes" },
  { id: "chicas", label: "Chicas" },
];

// Opciones de ordenamiento
const sortOptions = [
  { value: "recientes", label: "Más recientes" },
  { value: "votados", label: "Más votados" },
  { value: "populares", label: "Más populares" },
  { value: "comentados", label: "Más comentados" },
];

// Abrir/cerrar modal
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  formData.value = {
    title: "",
    comment: "",
  };
};

// Abrir modal de reglamento
const openModalRule = () => {
  if (foroRuleRef.value) {
    foroRuleRef.value.open();
  }
};

// Publicar post
const publishPost = async () => {
  if (!formData.value.title || !formData.value.comment) {
    alert("Por favor completa título y comentario");
    return;
  }

  isPublishing.value = true;

  try {
    // Obtener usuario actual (de prueba)
    const user = currentUser.value;

    // Determinar categoría aleatoria (será reemplazado con datos reales)
    const randomCategory = Math.random() > 0.5 ? "Clientes" : "Chicas";

    // Preparar datos para la BD
    const postData = {
      user_id: user.id,
      title: formData.value.title,
      content: formData.value.comment, // ⚠️ BD usa "content", no "comment"
      category: randomCategory,
      image_url: null,
    };

    // Guardar en BD
    const response = await forumService.createPost(postData);

    // Crear objeto completo para el frontend
    const newPost = {
      id: response.data.id, // ID real de la BD
      user_id: user.id,
      author: {
        id: user.id,
        name: user.name,
        location: user.location,
        avatar: user.avatar,
      },
      title: formData.value.title,
      comment: formData.value.comment,
      content: formData.value.comment,
      category: randomCategory,
      city: user.location.split(",")[0].trim(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      comment_count: 0,
      userVotes: {},
    };

    // Actualizar vista (agregar al inicio)
    posts.value.unshift(newPost);

    // Guardar en localStorage (caché local)
    localStorage.setItem("foroPosts", JSON.stringify(posts.value));

    // Cerrar modal y resetear formulario
    closeModal();

    // Mostrar mensaje de éxito
    successMessage.value = "✅ Post publicado exitosamente";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);

    console.log("✅ Post creado exitosamente en BD:", response.data);
  } catch (error) {
    console.error("❌ Error al publicar post:", error);

    // Mostrar mensaje de error con toast
    successMessage.value =
      "❌ No se pudo publicar el post. Intenta nuevamente.";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } finally {
    isPublishing.value = false;
  }
};

// Cambiar categoría
const setCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

// Toggle dropdowns de filtros
const toggleCityDropdown = () => {
  isCityDropdownOpen.value = !isCityDropdownOpen.value;
  isSortDropdownOpen.value = false;
};

const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value;
  isCityDropdownOpen.value = false;
};

// Toggle región en filtro
const toggleFilterRegion = (regionId) => {
  filterRegions.value = filterRegions.value.map((region) => ({
    ...region,
    isOpen: region.id === regionId ? !region.isOpen : false,
  }));
};

// Seleccionar ciudad para filtrar
const selectCity = (city) => {
  selectedCity.value = city;
  isCityDropdownOpen.value = false;
  // Cerrar todas las regiones del filtro
  filterRegions.value = filterRegions.value.map((region) => ({
    ...region,
    isOpen: false,
  }));
};

// Cambiar ordenamiento
const changeSortBy = (value) => {
  sortBy.value = value;
  isSortDropdownOpen.value = false;
};

// Posts filtrados y ordenados
const filteredPosts = computed(() => {
  let filtered = posts.value;

  // Filtrar por categoría
  if (activeCategory.value !== "todos") {
    filtered = filtered.filter(
      (post) =>
        post.category?.toLowerCase() === activeCategory.value.toLowerCase()
    );
  }

  // Filtrar por ciudad
  if (selectedCity.value !== "todas") {
    filtered = filtered.filter((post) => post.city === selectedCity.value);
  }

  // Ordenar
  if (sortBy.value === "recientes") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } else if (sortBy.value === "votados") {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else if (sortBy.value === "populares") {
    // Popularidad = likes - dislikes
    filtered = [...filtered].sort(
      (a, b) => b.likes - b.dislikes - (a.likes - a.dislikes)
    );
  } else if (sortBy.value === "comentados") {
    filtered = [...filtered].sort(
      (a, b) => (b.commentsCount || 0) - (a.commentsCount || 0)
    );
  }

  return filtered;
});

// Manejar votación (Sistema de voto único - FASE 4: Con BD)
const handleVote = async ({ postId, voteType }) => {
  const post = posts.value.find((p) => p.id === postId);
  if (!post || !currentUser.value) return;

  const userId = currentUser.value.id;
  const currentVote = userVotes.value[postId];

  try {
    console.log(
      `🗳️ Votando: postId=${postId}, userId=${userId}, voteType=${voteType}`
    );

    // Llamar a la API para registrar el voto
    const response = await forumService.togglePostLike({
      post_id: postId,
      user_id: userId,
      like_type: voteType,
    });

    console.log(`✅ Respuesta del servidor:`, response);

    // Actualizar contadores según la acción del servidor
    if (response.action === "added") {
      // Voto agregado
      if (voteType === "like") {
        post.likes++;
      } else if (voteType === "dislike") {
        post.dislikes++;
      }
      userVotes.value[postId] = voteType;
      console.log(`➕ Voto agregado: ${voteType}`);
    } else if (response.action === "removed") {
      // Voto eliminado (votó lo mismo)
      if (voteType === "like") {
        post.likes = Math.max(0, post.likes - 1);
      } else if (voteType === "dislike") {
        post.dislikes = Math.max(0, post.dislikes - 1);
      }
      delete userVotes.value[postId];
      console.log(`➖ Voto removido: ${voteType}`);
    } else if (response.action === "updated") {
      // Voto cambiado (de like a dislike o viceversa)
      if (voteType === "like") {
        post.likes++;
        post.dislikes = Math.max(0, post.dislikes - 1);
      } else if (voteType === "dislike") {
        post.dislikes++;
        post.likes = Math.max(0, post.likes - 1);
      }
      userVotes.value[postId] = voteType;
      console.log(`🔄 Voto actualizado: ${currentVote} → ${voteType}`);
    }

    // Guardar en localStorage (caché)
    localStorage.setItem("foroPosts", JSON.stringify(posts.value));
    localStorage.setItem("foroUserVotes", JSON.stringify(userVotes.value));
  } catch (error) {
    console.error("❌ Error al votar:", error);

    // Mensaje de error más amigable
    successMessage.value = "❌ Error al registrar voto. Intenta nuevamente.";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } finally {
    isVoting.value = false;
  }
};

// FASE 5: Limpiar localStorage
const clearLocalStorage = () => {
  if (
    confirm(
      "¿Eliminar todos los datos locales? Los posts en la base de datos permanecerán."
    )
  ) {
    localStorage.removeItem("foroPosts");
    localStorage.removeItem("foroUserVotes");
    console.log("🗑️ localStorage limpiado");

    // Limpiar votos del usuario
    userVotes.value = {};

    successMessage.value =
      "✅ Datos locales eliminados. Recargando desde base de datos...";
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);

    // Recargar posts desde BD
    loadPostsFromDB();
  }
};

// Cargar posts desde la base de datos (FASE 3)
const loadPostsFromDB = async () => {
  isLoadingPosts.value = true;
  loadError.value = null;

  try {
    console.log("🔄 Cargando posts desde BD...");
    const response = await forumService.getAllPosts();

    // Mapear posts de BD a formato del frontend
    posts.value = response.data.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      author: {
        id: post.user_id,
        name: `Usuario ${post.user_id}`, // Por ahora
        location: "Chile", // Por ahora
        avatar: "👤",
      },
      title: post.title,
      comment: post.content, // Mapear content → comment
      content: post.content,
      category: post.category || "General",
      city: "Santiago", // Por ahora
      date: post.created_at,
      created_at: post.created_at,
      likes: post.likes || 0,
      dislikes: post.dislikes || 0,
      commentsCount: post.comment_count || 0,
      comment_count: post.comment_count || 0,
      views: post.views || 0,
      is_pinned: post.is_pinned,
      is_locked: post.is_locked,
    }));

    // Guardar en localStorage (caché)
    localStorage.setItem("foroPosts", JSON.stringify(posts.value));

    console.log(`✅ ${posts.value.length} posts cargados desde BD`);
  } catch (error) {
    console.error("❌ Error al cargar posts:", error);
    loadError.value = "Error al cargar posts. Usando caché local.";

    // Fallback: intentar cargar desde localStorage
    const savedPosts = localStorage.getItem("foroPosts");
    if (savedPosts) {
      posts.value = JSON.parse(savedPosts);
      console.log("📦 Posts cargados desde localStorage (fallback)");
    }
  } finally {
    isLoadingPosts.value = false;
  }
};

// Cargar posts, usuario y votos al montar
onMounted(async () => {
  // Cargar usuario de prueba
  currentUser.value = testUsersService.loadCurrentUser();

  // Cargar votos del usuario
  const savedVotes = localStorage.getItem("foroUserVotes");
  if (savedVotes) {
    userVotes.value = JSON.parse(savedVotes);
  }

  // FASE 3: Cargar posts desde BD
  await loadPostsFromDB();
});
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4 pb-8 md:pb-12">
    <return-components />
    <title-foro-components
      title="Foro de experiencias y recomendaciones"
      class=""
    />
    <p
      class="mt-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#A2A2A2] font-medium md:mt-3 mb-3 md:mb-4 lg:mt-4 lg:mb-5 xl:mt-5 xl:mb-6 mode-paragraph"
    >
      Comparte y descubre experiencias en Ángeles y Demonios
    </p>

    <!-- Botón Nuevo Post -->
    <button
      @click="openModal"
      class="cursor-pointer bg-[#FFD000] lg:hover:bg-[#FFB200] text-[#000000] transition-colors duration-300 font-semibold rounded-lg px-4 py-2 text-sm lg:text-base xl:text-lg mode-btn mb-6 md:mb-8 mr-4"
    >
      <font-awesome-icon icon="plus" class="mr-2 mode-icon" />
      Nuevo Post
    </button>
    <button-components @click="openModalRule">
      Reglamento del Foro
    </button-components>

    <!-- FASE 5: Mensaje de éxito/error -->
    <div
      v-if="successMessage"
      :class="[
        'fixed top-4 right-4 z-50 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in',
        successMessage.includes('❌') ? 'bg-red-500' : 'bg-green-500',
      ]"
    >
      {{ successMessage }}
    </div>

    <!-- Categorías (Tabs) -->
    <div class="flex justify-center items-center gap-2 md:gap-4 mb-6 md:mb-8">
      <template v-for="(category, index) in categories" :key="category.id">
        <button
          @click="setCategory(category.id)"
          :class="[
            'px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 mode-paragraph',
            activeCategory === category.id
              ? 'bg-[#DAA520] text-white shadow-lg mode-btn'
              : 'bg-transparent text-[#FFD700] lg:hover:bg-[#FFD700]/20 mode-btn-location cursor-pointer',
          ]"
        >
          {{ category.label }}
        </button>
        <span
          v-if="index < categories.length - 1"
          class="text-[#FFD700] text-sm md:text-base font-bold mode-paragraph"
        >
          |
        </span>
      </template>
    </div>

    <!-- Filtros (Ciudad y Ordenamiento) -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
      <!-- Dropdown Ciudad -->
      <div class="relative flex-1">
        <button
          @click="toggleCityDropdown"
          class="mode-carac-btn mode-select w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg flex items-center justify-between transition-colors lg:hover:bg-[#2a2a2a] border border-[#FFD700] mode-foro"
        >
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="map-marker-alt" class="text-[#FFD700]" />
            <span class="text-sm md:text-base">
              {{
                selectedCity === "todas" ? "Todas las ciudades" : selectedCity
              }}
            </span>
          </div>
          <font-awesome-icon
            icon="chevron-down"
            :class="[
              'transition-transform duration-300 cursor-pointer',
              isCityDropdownOpen ? 'rotate-180' : '',
            ]"
          />
        </button>

        <!-- Dropdown de ciudades con regiones -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="isCityDropdownOpen"
            class="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-[#FFD700] rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto mode-icon-profile mode-nav-card"
          >
            <!-- Opción "Todas las ciudades" -->
            <button
              @click="selectCity('todas')"
              :class="[
                'w-full text-left px-4 py-3 text-sm md:text-base transition-colors border-b border-gray-800',
                selectedCity === 'todas'
                  ? 'bg-[#FFD700] text-black font-semibold'
                  : 'text-gray-300 lg:hover:bg-[#1a1a1a] lg:hover:text-[#FFD700]',
              ]"
            >
              Todas las ciudades
            </button>

            <!-- Regiones con accordion -->
            <div
              v-for="region in filterRegions"
              :key="region.id"
              class="border-b border-gray-800 last:border-b-0"
            >
              <!-- Botón de región -->
              <button
                @click="toggleFilterRegion(region.id)"
                class="w-full text-left px-4 py-2 transition-colors flex items-center justify-between lg:hover:bg-[#1a1a1a]"
                :class="[
                  region.isOpen
                    ? 'text-[#FFD700] font-semibold'
                    : 'text-gray-300',
                ]"
              >
                <span class="text-sm md:text-base">{{ region.name }}</span>
                <font-awesome-icon
                  icon="chevron-down"
                  :class="[
                    'transition-transform duration-300 text-xs cursor-pointer',
                    region.isOpen ? 'rotate-180' : '',
                  ]"
                />
              </button>

              <!-- Lista de ciudades (accordion) -->
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="max-h-96 opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-if="region.isOpen" class="overflow-hidden">
                  <button
                    v-for="city in region.cities"
                    :key="city"
                    @click="selectCity(city)"
                    :class="[
                      'w-full text-left pl-8 pr-4 py-2 transition-colors border-t border-gray-800 text-sm md:text-base',
                      selectedCity === city
                        ? 'bg-[#DAA520] text-[#000000] font-semibold'
                        : 'text-gray-400 lg:hover:text-[#FFD700] lg:hover:bg-[#1a1a1a]',
                    ]"
                  >
                    {{ city }}
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>

      <!-- Select Ordenamiento -->
      <div class="relative flex-1">
        <button
          @click="toggleSortDropdown"
          class="mode-carac-btn mode-select w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg flex items-center justify-between transition-colors lg:hover:bg-[#2a2a2a] border border-[#FFD700] mode-foro"
        >
          <div class="flex items-center gap-2">
            <font-awesome-icon icon="sort" class="text-[#FFD700]" />
            <span class="text-sm md:text-base">
              {{ sortOptions.find((opt) => opt.value === sortBy)?.label }}
            </span>
          </div>
          <font-awesome-icon
            icon="chevron-down"
            :class="[
              'transition-transform duration-300 cursor-pointer',
              isSortDropdownOpen ? 'rotate-180' : '',
            ]"
          />
        </button>

        <!-- Dropdown de ordenamiento -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="isSortDropdownOpen"
            class="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-[#FFD700] rounded-lg shadow-lg z-40 mode-icon-profile mode-nav-card"
          >
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="changeSortBy(option.value)"
              :class="[
                'w-full text-left px-4 py-2 text-sm md:text-base transition-colors border-b border-gray-800 last:border-b-0',
                sortBy === option.value
                  ? 'bg-[#FFD700] text-black font-semibold'
                  : 'text-gray-300 lg:hover:bg-[#1a1a1a] lg:hover:text-[#FFD700]',
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Loading state (FASE 3) -->
    <div v-if="isLoadingPosts" class="text-center py-16 md:py-20 lg:py-24">
      <font-awesome-icon
        icon="spinner"
        spin
        class="text-5xl md:text-6xl text-[#FFD700] mb-4 mode-icon"
      />
      <p class="text-xl md:text-2xl text-[#A2A2A2] font-medium mode-paragraph">
        Cargando posts...
      </p>
    </div>

    <!-- Error state (FASE 3) -->
    <div v-else-if="loadError" class="text-center py-16 md:py-20 lg:py-24">
      <font-awesome-icon
        icon="exclamation-triangle"
        class="text-5xl md:text-6xl text-red-500 mb-4 mode-icon"
      />
      <p
        class="text-xl md:text-2xl text-red-400 font-medium mb-6 mode-paragraph"
      >
        {{ loadError }}
      </p>
      <button
        @click="loadPostsFromDB"
        class="px-6 py-3 bg-[#FFD700] lg:hover:bg-[#FFB200] text-black font-semibold rounded-lg transition-colors mode-btn cursor-pointer"
      >
        <font-awesome-icon icon="redo" class="mr-2" />
        Reintentar
      </button>
    </div>

    <!-- Lista de Posts -->
    <foro-cards
      v-else
      :posts="filteredPosts"
      :user-votes="userVotes"
      :is-voting="isVoting"
      @vote="handleVote"
    />

    <!-- Modal Crear Nuevo Post -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="closeModal"
      >
        <div
          class="mode-card bg-gray-900/50 border-2 border-[#FFD700] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto mode-card"
        >
          <!-- Header del modal -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mode-title">
                Crear nuevo post
              </h2>
              <p class="text-gray-400 text-sm md:text-base mt-1 mode-paragraph">
                Comparte tu experiencia con la comunidad
              </p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 lg:hover:text-white transition-colors text-xl cursor-pointer mode-icon"
              aria-label="Cerrar modal"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>

          <!-- Formulario -->
          <div class="space-y-4">
            <!-- Título del post -->
            <div>
              <label
                class="block text-white font-semibold mb-2 text-sm md:text-base mode-paragraph"
              >
                Título del post
              </label>
              <input
                v-model="formData.title"
                type="text"
                placeholder="Escribe un título descriptivo"
                class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all mode-input mode-register-input"
              />
            </div>

            <!-- Comentario -->
            <div>
              <label
                class="block text-white font-semibold mb-2 text-sm md:text-base mode-paragraph"
              >
                Comentario
              </label>
              <textarea
                v-model="formData.comment"
                placeholder="Comparte tu experiencia..."
                rows="6"
                class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all resize-none mode-input mode-register-input"
              ></textarea>
            </div>

            <!-- Botón Publicar -->
            <button
              @click="publishPost"
              :disabled="isPublishing"
              class="w-full bg-[#FFD700] lg:hover:bg-[#FFB200] text-black font-bold py-3 rounded-lg transition-colors duration-300 text-base md:text-lg mode-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                v-if="isPublishing"
                class="flex items-center justify-center gap-2"
              >
                <font-awesome-icon icon="spinner" spin class="mode-icon" />
                Publicando...
              </span>
              <span v-else>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Componente de Reglamento del Foro -->
    <foro-rule ref="foroRuleRef" />
  </section>
</template>

<style lang="scss" scoped></style>
