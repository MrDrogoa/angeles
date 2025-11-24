<script setup>
import { ref } from "vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import Button2Components from "@/components/buttons/Button2Components.vue";
import Button3Components from "@/components/buttons/Button3Components.vue";
import SearchComponents from "@/components/SearchComponents.vue";

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
  { label: "Masajistas", url: "/masajistas" },
  { label: "Redes", url: "/social" },
  { label: "Enterprise", url: "#" },
  { label: "Premium", url: "/premium" },
  { label: "Top", url: "/top" },
  { label: "Vip", url: "/vip" },
  { label: "Normal", url: "/normal" },
  { label: "Agencias", url: "/agency" },
  { label: "Todas", url: "/all" },
];

const menuCategories = [
  { label: "Maduras", url: "/category1" },
  { label: "Jovenes", url: "/category2" },
  { label: "Gay", url: "/category3" },
  { label: "Trans", url: "/category4" },
  { label: "Fantasias", url: "/category5" },
  { label: "Extranjeras", url: "/category6" },
  { label: "Modelos con examenes", url: "/category7" },
  { label: "Exoticas", url: "/category8" },
  { label: "Packs", url: "/category9" },
];
</script>

<template>
  <div>
    <div class="flex items-center gap-2 md:gap-4 lg:gap-6">
      <!-- Search Icon -->
      <button
        class="hover:text-[#FFD700] transition-colors duration-200 mode-btn-icon"
        aria-label="Buscar"
      >
        <search-components />
      </button>

      <!-- Menu Icon -->
      <button
        @click="toggleMenu"
        class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200 mode-btn-icon"
        aria-label="Menú"
      >
        <font-awesome-icon
          icon="bars"
          class="text-lg lg:text-xl cursor-pointer mode-icon-menu"
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
        class="absolute top-14 md:top-16 lg:top-20 xl:top-24 left-0 right-0 bg-[#000000] border-t border-b border-[#FFD700] shadow-2xl max-h-[80vh] overflow-y-auto z-100 mode-card"
      >
        <div
          @click.self="closeMenu"
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
        >
          <!-- Close Button -->
          <div class="flex justify-end mb-4">
            <button
              @click="closeMenu"
              class="text-[#FFD700] hover:text-white transition-colors text-3xl cursor-pointer mode-btn-icon"
              aria-label="Cerrar menú"
            >
              <font-awesome-icon
                icon="xmark"
                class="text-lg lg:text-xl mode-icon"
              />
            </button>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-3"
          >
            <!-- Secciones Column -->
            <div @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2 mode-title"
              >
                Secciones
              </h3>
              <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.label">
                  <a
                    :href="item.url"
                    @click="closeMenu"
                    class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200 text-sm md:text-base py-1 mode-paragraph"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            </div>
            <!-- category Column-->
            <div @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2 mode-title"
              >
                Categorias
              </h3>
              <ul class="space-y-2">
                <li v-for="item in menuCategories" :key="item.label">
                  <a
                    :href="item.url"
                    @click="closeMenu"
                    class="text-gray-300 hover:text-[#FFD700] transition-colors duration-200 text-sm md:text-base py-1 mode-paragraph"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            </div>
            <!-- Actions Column -->
            <div class="lg:col-span-1 md:col-span-2" @click.self="closeMenu">
              <h3
                class="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2 mode-title"
              >
                Acciones
              </h3>
              <div class="space-y-4">
                <router-link to="/login" class="block">
                  <button2-components class="w-full">
                    <font-awesome-icon
                      icon="arrow-right-from-bracket"
                      class="mode-icon"
                    />
                    Acceder
                  </button2-components>
                </router-link>

                <router-link to="/register" class="block">
                  <button-components class="w-full"
                    ><font-awesome-icon icon="user" class="mode-icon" />
                    Registro</button-components
                  >
                </router-link>

                <button3-components class="w-full"
                  ><font-awesome-icon icon="dollar-sign" class="mode-icon" />
                  Publicar</button3-components
                >
                <router-link to="/contact">
                  <button-components class="w-full"
                    ><font-awesome-icon icon="envelope" class="mode-icon" />
                    Contacto</button-components
                  >
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="isMenuOpen" @click="closeMenu" class="fixed inset-0 z-30"></div>
  </div>
</template>

<style lang="scss" scoped></style>
