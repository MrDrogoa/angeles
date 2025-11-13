import { ref, computed } from "vue";

const currentMode = ref(null);
const isAccessibilityOpen = ref(false);
const textSize = ref(100);

// Configuración de tamaños de texto (en porcentaje)
const textSizeConfig = {
  min: 80, // Tamaño mínimo (80%)
  max: 200, // Tamaño máximo (200%)
  step: 10, // Incremento por click (10%)
  default: 100, // Tamaño por defecto (100%)
};

export function useAccessibilityStore() {
  // Modo de accesibilidad actual
  const modes = [
    {
      id: "normal",
      label: "Normal",
      icon: "eye",
      className: "",
      description: "Modo estándar",
    },
    {
      id: "blindness",
      label: "Ceguera",
      icon: "eye-slash",
      className: "blindness-mode",
      description: "Optimizado para ciegos",
    },
    {
      id: "dyslexia",
      label: "Dislexia",
      icon: "book",
      className: "dyslexia-mode",
      description: "Fuente amigable con dislexia",
    },
    {
      id: "high-contrast",
      label: "Alto Contraste",
      icon: "circle-half-stroke",
      className: "high-contrast-mode",
      description: "Mayor contraste de colores",
    },
    {
      id: "large-text",
      label: "Texto Grande",
      icon: "text-height",
      className: "large-text-mode",
      description: "Texto más grande",
    },
    // {
    //   id: "light",
    //   label: "Luz",
    //   icon: "sun",
    //   className: "light-mode",
    //   description: "Modo claro",
    // },
    {
      id: "reduce-motion",
      label: "Sin Movimiento",
      icon: "pause",
      className: "reduce-motion-mode",
      description: "Reduce animaciones",
    },
    {
      id: "visual-rest",
      label: "Descanso Visual",
      icon: "moon",
      className: "visual-rest-mode",
      description: "Modo oscuro relajante",
    },
  ];

  // Cargar modo desde localStorage
  const loadAccessibilityMode = () => {
    const savedMode = localStorage.getItem("accessibilityMode");
    if (savedMode) {
      currentMode.value = savedMode;
      applyMode(savedMode);
    } else {
      currentMode.value = "normal";
    }

    // Cargar tamaño de texto guardado
    const savedTextSize = localStorage.getItem("accessibilityTextSize");
    if (savedTextSize) {
      textSize.value = parseInt(savedTextSize);
      applyTextSize(parseInt(savedTextSize));
    }
  };

  // Cambiar modo de accesibilidad
  const setAccessibilityMode = (modeId) => {
    currentMode.value = modeId;
    localStorage.setItem("accessibilityMode", modeId);
    applyMode(modeId);
  };

  // Aplicar modo (agregar clase al documento)
  const applyMode = (modeId) => {
    // Remover todas las clases de accesibilidad
    modes.forEach((mode) => {
      if (mode.className) {
        document.documentElement.classList.remove(mode.className);
      }
    });

    // Agregar la clase del modo seleccionado
    const mode = modes.find((m) => m.id === modeId);
    if (mode && mode.className) {
      document.documentElement.classList.add(mode.className);
    }
  };

  // Obtener modo actual
  const getCurrentMode = computed(() => {
    return modes.find((m) => m.id === currentMode.value) || modes[0];
  });

  // Toggle del panel de accesibilidad
  const toggleAccessibilityPanel = () => {
    isAccessibilityOpen.value = !isAccessibilityOpen.value;
  };

  // Cerrar panel
  const closeAccessibilityPanel = () => {
    isAccessibilityOpen.value = false;
  };

  // Aumentar tamaño de texto
  const increaseTextSize = () => {
    if (textSize.value < textSizeConfig.max) {
      textSize.value += textSizeConfig.step;
      localStorage.setItem("accessibilityTextSize", textSize.value);
      applyTextSize(textSize.value);
    }
  };

  // Disminuir tamaño de texto
  const decreaseTextSize = () => {
    if (textSize.value > textSizeConfig.min) {
      textSize.value -= textSizeConfig.step;
      localStorage.setItem("accessibilityTextSize", textSize.value);
      applyTextSize(textSize.value);
    }
  };

  // Resetear tamaño de texto
  const resetTextSize = () => {
    textSize.value = textSizeConfig.default;
    localStorage.setItem("accessibilityTextSize", textSize.value);
    applyTextSize(textSize.value);
  };

  // Aplicar tamaño de texto al documento
  const applyTextSize = (size) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  // Verificar si el tamaño está al máximo
  const isTextSizeAtMax = computed(() => {
    return textSize.value >= textSizeConfig.max;
  });

  // Verificar si el tamaño está al mínimo
  const isTextSizeAtMin = computed(() => {
    return textSize.value <= textSizeConfig.min;
  });

  return {
    currentMode,
    modes,
    isAccessibilityOpen,
    textSize,
    textSizeConfig,
    loadAccessibilityMode,
    setAccessibilityMode,
    getCurrentMode,
    toggleAccessibilityPanel,
    closeAccessibilityPanel,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    isTextSizeAtMax,
    isTextSizeAtMin,
  };
}
