<script setup>
import { ref } from "vue";

// Estado para la ubicación activa
const activeLocation = ref("HOME");
const isDropdownOpen = ref(false);

// Lista de ubicaciones en Chile
const locations = [
  { id: 1, name: "Santiago", isNew: true },
  { id: 2, name: "Viña del Mar", isNew: false },
  { id: 3, name: "Ovalle", isNew: false },
  { id: 4, name: "Coquimbo", isNew: false },
  { id: 5, name: "La Serena", isNew: false },
  { id: 6, name: "Vallenar", isNew: false },
  { id: 7, name: "Copiapó", isNew: false },
  { id: 8, name: "Antofagasta", isNew: false },
  { id: 9, name: "Calama", isNew: false },
  { id: 10, name: "Iquique", isNew: false },
  { id: 11, name: "Arica", isNew: false },
];

// Función para cambiar ubicación
const setLocation = (locationName) => {
  activeLocation.value = locationName;
  isDropdownOpen.value = false;
};

// Toggle dropdown en mobile
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<template>
  <div>
    <!-- DESKTOP: Barra horizontal -->
    <div
      class="hidden m-auto lg:flex items-center justify-center gap-0 border-b border-[#FFD700] overflow-x-auto bg-[#1a1a1a] mode-nav-card"
    >
      <button
        @click="setLocation('HOME')"
        :class="[
          'px-6 py-3 font-bold text-sm text-white transition-colors duration-200 whitespace-nowrap mode-btn',
          activeLocation === 'HOME'
            ? 'bg-[#DAA520]'
            : 'bg-[#DAA520] hover:bg-[#DAA520] transition-colors',
        ]"
      >
        HOME
      </button>

      <button
        v-for="location in locations"
        :key="location.id"
        @click="setLocation(location.name)"
        :class="[
          'px-6 py-3 font-bold text-sm text-white transition-all duration-200 relative  whitespace-nowrap cursor-pointer mode-btn-location',
          activeLocation === location.name
            ? 'bg-[#DAA520]'
            : 'hover:bg-[#aa7b03]',
        ]"
      >
        {{ location.name.toUpperCase() }}
      </button>
    </div>

    <!-- MOBILE: Dropdown -->
    <div class="lg:hidden relative border-b border-[#FFD700] mode-nav-card">
      <!-- Botón para abrir dropdown -->
      <button
        @click="toggleDropdown"
        class="w-full bg-[#1a1a1a] text-white px-4 py-3 flex items-center border-b border-[#FFD700] justify-between transition-colors mode-nav-card"
      >
        <div class="flex items-center gap-2">
          <font-awesome-icon
            icon="map-marker-alt"
            class="text-[#FFD700] mode-icon-profile"
          />
          <span class="font-semibold text-xs md:text-base">Ciudad</span>
        </div>
        <font-awesome-icon
          icon="chevron-down"
          :class="[
            'transition-transform duration-300',
            isDropdownOpen ? 'rotate-180' : '',
          ]"
        />
      </button>

      <!-- Dropdown menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 bg-black shadow-lg z-50 max-h-96 overflow-y-auto border-b-2 border-r-2 border-l-2 border-[#ffd700] mode-icon-profile mode-nav-card"
        >
          <button
            v-for="location in locations"
            :key="location.id"
            @click="setLocation(location.name)"
            :class="[
              'w-full text-left px-4 py-3 transition-colors border-b border-gray-200 last:border-b-0 relative',
              activeLocation === location.name
                ? 'bg-[#DAA520] text-[#000000] font-semibold'
                : 'text-gray-300 hover:text-[#FFD700] text-sm md:text-base py-1',
            ]"
          >
            {{ location.name }}
          </button>
        </div>
      </transition>
    </div>
    <div
      v-if="isDropdownOpen"
      @click="toggleDropdown"
      class="fixed inset-0 z-30"
    ></div>
  </div>
</template>

<style scoped></style>
