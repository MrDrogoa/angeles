<!--
  Componente de Navegación para el ChatBot
  
  Muestra breadcrumbs del flujo actual y botón para volver atrás
-->

<template>
  <div v-if="showNavigation" class="chatbot-navigation">
    <!-- Breadcrumbs -->
    <div v-if="breadcrumbs.length > 0" class="breadcrumbs-container">
      <transition-group
        name="breadcrumb-fade"
        tag="div"
        class="breadcrumbs-list"
      >
        <div
          v-for="(crumb, index) in visibleBreadcrumbs"
          :key="`${crumb.state}-${index}`"
          class="breadcrumb-item"
          :class="{ 'is-current': index === visibleBreadcrumbs.length - 1 }"
          @click="navigateToCrumb(crumb, index)"
        >
          <span class="breadcrumb-icon">{{ crumb.icon }}</span>
          <span class="breadcrumb-label">{{ crumb.label }}</span>
          <i
            v-if="index < visibleBreadcrumbs.length - 1"
            class="fas fa-chevron-right breadcrumb-arrow"
          ></i>
        </div>
      </transition-group>
    </div>

    <!-- Botón Atrás -->
    <div v-if="canGoBack" class="navigation-actions">
      <button
        @click="handleGoBack"
        class="btn-back"
        :disabled="isLoading"
        title="Volver al paso anterior"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Atrás</span>
      </button>

      <!-- Botón volver al menú -->
      <button
        @click="handleGoToMenu"
        class="btn-menu"
        :disabled="isLoading"
        title="Volver al menú principal"
      >
        <i class="fas fa-home"></i>
        <span>Menú</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useChatBotStore } from "@/store/chatBotStore.js";

// Props
const props = defineProps({
  maxBreadcrumbs: {
    type: Number,
    default: 5,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["navigation-change"]);

// Store
const chatBotStore = useChatBotStore();

// State
const isLoading = ref(false);

// Computed
const breadcrumbs = computed(() => chatBotStore.breadcrumbs);

const visibleBreadcrumbs = computed(() => {
  const crumbs = breadcrumbs.value;
  if (crumbs.length <= props.maxBreadcrumbs) {
    return crumbs;
  }

  // Mostrar primero, ... y últimos
  return [
    crumbs[0],
    { label: "...", icon: "•", state: "ellipsis" },
    ...crumbs.slice(-3),
  ];
});

const canGoBack = computed(() => chatBotStore.canGoBack && props.showActions);

const showNavigation = computed(() => {
  return breadcrumbs.value.length > 0 || canGoBack.value;
});

// Methods
const handleGoBack = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const success = await chatBotStore.goBack();
    if (success) {
      emit("navigation-change", { action: "back", success: true });
    }
  } catch (error) {
    console.error("Error al navegar atrás:", error);
    emit("navigation-change", { action: "back", success: false, error });
  } finally {
    isLoading.value = false;
  }
};

const handleGoToMenu = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    await chatBotStore.navigateToState("MENU");
    emit("navigation-change", { action: "menu", success: true });
  } catch (error) {
    console.error("Error al navegar al menú:", error);
    emit("navigation-change", { action: "menu", success: false, error });
  } finally {
    isLoading.value = false;
  }
};

const navigateToCrumb = async (crumb, index) => {
  // No permitir navegación al breadcrumb actual o al ellipsis
  if (
    index === visibleBreadcrumbs.value.length - 1 ||
    crumb.state === "ellipsis"
  ) {
    return;
  }

  if (isLoading.value) return;

  isLoading.value = true;
  try {
    await chatBotStore.navigateToState(crumb.state);
    emit("navigation-change", {
      action: "breadcrumb",
      state: crumb.state,
      success: true,
    });
  } catch (error) {
    console.error("Error al navegar al breadcrumb:", error);
    emit("navigation-change", {
      action: "breadcrumb",
      state: crumb.state,
      success: false,
      error,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.chatbot-navigation {
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Breadcrumbs */
.breadcrumbs-container {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.breadcrumbs-container::-webkit-scrollbar {
  height: 4px;
}

.breadcrumbs-container::-webkit-scrollbar-track {
  background: transparent;
}

.breadcrumbs-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: fit-content;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.breadcrumb-item:hover:not(.is-current) {
  background: #f1f5f9;
  border-color: #cbd5e0;
  color: #475569;
  transform: translateY(-1px);
}

.breadcrumb-item.is-current {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  cursor: default;
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 14px;
}

.breadcrumb-label {
  font-weight: 500;
}

.breadcrumb-arrow {
  margin-left: 4px;
  font-size: 10px;
  opacity: 0.5;
}

/* Animaciones de breadcrumbs */
.breadcrumb-fade-enter-active,
.breadcrumb-fade-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Acciones de navegación */
.navigation-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-back,
.btn-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back {
  background: #6c757d;
  color: white;
}

.btn-back:hover:not(:disabled) {
  background: #5a6268;
  transform: translateX(-2px);
}

.btn-menu {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-menu:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.btn-back:disabled,
.btn-menu:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-back i,
.btn-menu i {
  font-size: 12px;
}

/* Responsive */
@media (max-width: 640px) {
  .chatbot-navigation {
    padding: 8px 12px;
  }

  .breadcrumb-item {
    padding: 4px 10px;
    font-size: 12px;
  }

  .btn-back span,
  .btn-menu span {
    display: none;
  }

  .btn-back,
  .btn-menu {
    padding: 8px 12px;
    justify-content: center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .chatbot-navigation {
    background: linear-gradient(to right, #1e293b, #334155);
    border-bottom-color: #475569;
  }

  .breadcrumb-item {
    background: #334155;
    border-color: #475569;
    color: #cbd5e0;
  }

  .breadcrumb-item:hover:not(.is-current) {
    background: #475569;
    border-color: #64748b;
    color: #e2e8f0;
  }

  .btn-menu {
    background: #334155;
    color: #cbd5e0;
    border-color: #475569;
  }

  .btn-menu:hover:not(:disabled) {
    background: #475569;
    border-color: #64748b;
  }
}
</style>
