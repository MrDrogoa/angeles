<template>
  <!-- Botón flotante de accesibilidad (lado derecho, centrado verticalmente) -->
  <div
    class="fixed right-5 bottom-13 md:bottom-15 lg:bottom-70 transform -translate-y-1/2 z-40"
  >
    <!-- Botón principal de accesibilidad -->
    <button
      @click="toggleAccessibilityPanel"
      class="bg-[#FFD700] hover:bg-[#FFC700] text-black p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center w-11 h-11 md:w-14 md:h-14 font-bold text-lg cursor-pointer mode-btn-acces"
      :title="
        isAccessibilityOpen ? 'Cerrar accesibilidad' : 'Abrir accesibilidad'
      "
      aria-label="Abrir panel de accesibilidad"
    >
      <font-awesome-icon
        icon="universal-access"
        class="text-xl md:text-2xl lg:text-2xl"
      />
    </button>

    <!-- Panel de modos (aparece en fila horizontal) -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isAccessibilityOpen"
        class="absolute -right-5 md:right-0 bottom-15 md:bottom-20 bg-gray-900 border-2 border-[#FFD700] rounded-2xl shadow-2xl p-1 sm:p-3 md:p-4 w-max mode-access-card"
      >
        <!-- Título del panel -->
        <p class="text-white text-xs lg:text-sm font-bold mb-3 text-center">
          Modos de Accesibilidad
        </p>

        <!-- Botones de modos en fila -->
        <div class="flex gap-2 flex-wrap justify-center max-w-xs md:max-w-sm">
          <button
            v-for="mode in modes"
            :key="mode.id"
            @click="handleModeChange(mode.id)"
            :class="[
              'p-1 md:p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 relative',
              currentMode === mode.id
                ? 'bg-[#FFD700] text-black border-2 border-white shadow-lg scale-110'
                : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:border-[#FFD700] hover:bg-gray-600',
            ]"
            :title="mode.description"
            :aria-label="`Activar ${mode.description}`"
          >
            <!-- Caso especial: Large Text con controles + y - -->
            <template
              v-if="mode.id === 'large-text' && currentMode === 'large-text'"
            >
              <div class="flex items-center gap-2">
                <!-- Botón Disminuir -->
                <button
                  @click.stop="decreaseTextSize"
                  :disabled="isTextSizeAtMin"
                  class="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded transition-all duration-200 flex items-center justify-center"
                  title="Disminuir tamaño"
                  aria-label="Disminuir tamaño de texto"
                >
                  <font-awesome-icon icon="minus" class="text-xs" />
                </button>
                <!-- Tamaño actual -->
                <span class="text-xs font-bold whitespace-nowrap"
                  >{{ textSize }}%</span
                >
                <!-- Botón Aumentar -->
                <button
                  @click.stop="increaseTextSize"
                  :disabled="isTextSizeAtMax"
                  class="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded transition-all duration-200 flex items-center justify-center"
                  title="Aumentar tamaño"
                  aria-label="Aumentar tamaño de texto"
                >
                  <font-awesome-icon icon="plus" class="text-xs" />
                </button>
              </div>
            </template>

            <!-- Caso normal: mostrar icono -->
            <template v-else>
              <font-awesome-icon
                :icon="mode.icon"
                class="text-xs md:text-lg mb-1"
              />
              <!-- Etiqueta pequeña -->
              <span
                class="text-[8px] md:text-xs font-semibold text-center leading-tight"
                >{{ mode.label }}</span
              >
              <!-- Indicador de selección -->
              <span
                v-if="currentMode === mode.id"
                class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"
              ></span>
            </template>
          </button>
        </div>

        <!-- Cierre automático al hacer click fuera -->
        <div @click="closeAccessibilityPanel" class="hidden"></div>
      </div>
    </transition>
  </div>

  <!-- Click fuera para cerrar -->
  <div
    v-if="isAccessibilityOpen"
    @click="closeAccessibilityPanel"
    class="fixed inset-0 z-30"
  ></div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAccessibilityStore } from "@/composables/useAccessibilityStore";

const {
  currentMode,
  modes,
  isAccessibilityOpen,
  textSize,
  textSizeConfig,
  loadAccessibilityMode,
  setAccessibilityMode,
  toggleAccessibilityPanel,
  closeAccessibilityPanel,
  increaseTextSize,
  decreaseTextSize,
  resetTextSize,
  isTextSizeAtMax,
  isTextSizeAtMin,
} = useAccessibilityStore();

// Cargar modo guardado al montar el componente
onMounted(() => {
  loadAccessibilityMode();
});

// Cambiar modo de accesibilidad
const handleModeChange = (modeId) => {
  setAccessibilityMode(modeId);
};
</script>

<style scoped></style>
