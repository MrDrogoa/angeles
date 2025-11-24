<script setup>
import { ref, onMounted } from "vue";

// Estado para la ubicación activa
const activeLocation = ref("HOME");
const isDropdownOpen = ref(false);

// Regiones con sus ciudades
const regions = ref([
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

// Toggle región (accordion - solo una abierta a la vez)
const toggleRegion = (regionId) => {
  regions.value = regions.value.map((region) => ({
    ...region,
    isOpen: region.id === regionId ? !region.isOpen : false,
  }));
};

// Función para cambiar ciudad
const setCity = (cityName) => {
  activeLocation.value = cityName;
  localStorage.setItem("selectedCity", cityName);
  isDropdownOpen.value = false;
};

// Toggle dropdown principal
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Cargar última ciudad seleccionada del localStorage
onMounted(() => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    activeLocation.value = savedCity;
  }
});
</script>

<template>
  <div class="border-b-2 border-[#DAA520]">
    <!-- MOBILE: Dropdown -->
    <div class="relative max-w-[1300px] mx-auto mode-nav-card">
      <!-- Botón para abrir dropdown -->
      <button
        @click="toggleDropdown"
        class="w-full bg-[#1a1a1a] text-white px-4 py-3 flex items-center justify-between transition-colors mode-nav-card"
      >
        <div class="flex items-center gap-2">
          <font-awesome-icon
            icon="map-marker-alt"
            class="text-[#DAA520] mode-icon-profile"
          />
          <span class="font-semibold text-xs md:text-base">Regiones</span>
        </div>
        <font-awesome-icon
          icon="chevron-down"
          :class="[
            'transition-transform duration-300',
            isDropdownOpen ? 'rotate-180' : '',
          ]"
        />
      </button>

      <!-- Dropdown menu con regiones -->
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
          class="absolute top-full left-0 right-0 bg-black shadow-lg z-50 max-h-96 overflow-y-auto border-2 border-[#DAA520] mode-icon-profile mode-nav-card"
        >
          <!-- Regiones -->
          <div
            v-for="region in regions"
            :key="region.id"
            class="border-b border-gray-800 last:border-b-0"
          >
            <!-- Botón de región -->
            <button
              @click="toggleRegion(region.id)"
              class="w-full text-left px-4 py-3 transition-colors flex items-center justify-between lg:hover:bg-[#1a1a1a]"
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
                  'transition-transform duration-300 text-xs',
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
                  @click="setCity(city)"
                  :class="[
                    'w-full text-left pl-8 pr-4 py-2 transition-colors border-t border-gray-800 text-sm md:text-base',
                    activeLocation === city
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
    <div
      v-if="isDropdownOpen"
      @click="toggleDropdown"
      class="fixed inset-0 z-30"
    ></div>
  </div>
</template>

<style scoped></style>
