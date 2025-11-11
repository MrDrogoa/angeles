<script setup>
import { ref } from "vue";
import ButtonComponents from "../buttons/ButtonComponents.vue";
import Button2Components from "../buttons/Button2Components.vue";
import Button3Components from "../buttons/Button3Components.vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const menuItems = [
  { label: "Inicio", url: "/" },
  { label: "Novedades", url: "/news" },
  { label: "Disponibles ahora!", url: "#" },
  { label: "Masajistas", url: "/masajistas" },
  { label: "Redes", url: "/social" },
  { label: "Enterprise", url: "#" },
  { label: "Premium", url: "/premium" },
  { label: "Top", url: "/top" },
  { label: "Vip", url: "/vip" },
  { label: "Normal", url: "/normal" },
  { label: "Todas", url: "/all" },
];

const locations = [
  "Escorts en Independencia",
  "Escorts en La Florida",
  "Escorts en Las Condes",
  "Escorts en Lo Barnechea",
  "Escorts en Ñuñoa",
  "Escorts en Providencia",
  "Escorts en Santiago Centro",
  "Escorts en Vitacura",
];
</script>

<template>
  <div>
    <div class="flex items-center gap-2 md:gap-4 lg:gap-6">
      <!-- Search Icon -->
      <button
        class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200"
        aria-label="Buscar"
      >
        <font-awesome-icon
          icon="search"
          class="text-lg lg:text-xl cursor-pointer"
        />
      </button>

      <!-- Heart Icon -->
      <button
        class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200"
        aria-label="Favoritos"
      >
        <font-awesome-icon
          icon="heart"
          class="text-lg lg:text-xl cursor-pointer"
        />
      </button>

      <!-- Menu Icon -->
      <button
        @click="toggleMenu"
        class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200"
        aria-label="Menú"
      >
        <font-awesome-icon
          icon="bars"
          class="text-lg lg:text-xl cursor-pointer"
        />
      </button>
    </div>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        @click.self="closeMenu"
        class="absolute top-14 md:top-16 lg:top-20 xl:top-24 left-0 right-0 bg-[#0a0a0a] border-t border-b border-[#FFD700] shadow-2xl max-h-[80vh] overflow-y-auto z-50"
      >
        <div
          @click.self="closeMenu"
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
        >
          <!-- Close Button -->
          <div class="flex justify-end mb-4">
            <button
              @click="closeMenu"
              class="text-[#FFD700] hover:text-white transition-colors text-3xl cursor-pointer"
              aria-label="Cerrar menú"
            >
              <font-awesome-icon icon="xmark" class="text-lg lg:text-xl" />
            </button>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-3"
          >
            <!-- Secciones Column -->
            <div @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2"
              >
                Secciones
              </h3>
              <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.label">
                  <a
                    :href="item.url"
                    @click="closeMenu"
                    class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200 text-sm md:text-base py-1"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Locations Column -->
            <div @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2"
              >
                Ubicaciones
              </h3>
              <ul class="space-y-2">
                <li v-for="location in locations" :key="location">
                  <a
                    href="#"
                    @click="closeMenu"
                    class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200 text-sm md:text-base py-1"
                  >
                    {{ location }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Actions Column -->
            <div class="lg:col-span-1 md:col-span-2" @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2"
              >
                Acciones
              </h3>
              <div class="space-y-4">
                <router-link to="/login" class="block">
                  <button2-components class="w-full">
                    <font-awesome-icon icon="arrow-right-from-bracket" />
                    Acceder
                  </button2-components>
                </router-link>

                <router-link to="/register" class="block">
                  <button-components class="w-full"
                    ><font-awesome-icon icon="user" />
                    Registro</button-components
                  >
                </router-link>

                <button3-components class="w-full"
                  ><font-awesome-icon icon="dollar-sign" />
                  Publicar</button3-components
                >
                <router-link to="/contact">
                  <button-components class="w-full"
                    ><font-awesome-icon icon="envelope" />
                    Contacto</button-components
                  >
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
