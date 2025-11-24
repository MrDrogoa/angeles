/**
 * Directivas Vue personalizadas para eventos touch
 * Compatibles con: Chrome, Safari, Firefox, Edge, Samsung Internet, Opera, Brave, Vivaldi, DuckDuckGo, UC Browser
 * Soporta: Tap, Swipe, Pinch to Zoom
 */

// Configuración global
const TOUCH_CONFIG = {
  tapTimeout: 200, // ms - tiempo máximo para considerar un tap
  swipeThreshold: 50, // px - distancia mínima para considerar un swipe
  longPressTimeout: 500, // ms - tiempo para long press
  pinchThreshold: 10, // px - distancia mínima para pinch
};

/**
 * Detecta si el dispositivo soporta touch
 */
const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Calcula la distancia entre dos puntos (para pinch)
 */
const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Directiva v-tap
 * Uso: v-tap="handler" o v-tap="{ handler, preventDefault: true }"
 */
export const vTap = {
  mounted(el, binding) {
    const handler =
      typeof binding.value === "function"
        ? binding.value
        : binding.value.handler;
    const options = typeof binding.value === "object" ? binding.value : {};

    let startTime;
    let startX;
    let startY;
    let moved = false;

    const handleTouchStart = (e) => {
      startTime = Date.now();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moved = false;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);

      // Si se movió más de 10px, no es un tap
      if (deltaX > 10 || deltaY > 10) {
        moved = true;
      }
    };

    const handleTouchEnd = (e) => {
      const duration = Date.now() - startTime;

      // Solo ejecutar si no se movió y fue rápido
      if (!moved && duration < TOUCH_CONFIG.tapTimeout) {
        if (options.preventDefault) {
          e.preventDefault();
        }
        handler(e);
      }

      startTime = null;
      startX = null;
      startY = null;
      moved = false;
    };

    // Click fallback para dispositivos sin touch
    const handleClick = (e) => {
      if (!isTouchDevice()) {
        handler(e);
      }
    };

    el._tapHandlers = {
      touchstart: handleTouchStart,
      touchmove: handleTouchMove,
      touchend: handleTouchEnd,
      click: handleClick,
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    el.addEventListener("click", handleClick);
  },

  unmounted(el) {
    if (el._tapHandlers) {
      el.removeEventListener("touchstart", el._tapHandlers.touchstart);
      el.removeEventListener("touchmove", el._tapHandlers.touchmove);
      el.removeEventListener("touchend", el._tapHandlers.touchend);
      el.removeEventListener("click", el._tapHandlers.click);
      delete el._tapHandlers;
    }
  },
};

/**
 * Directiva v-swipe
 * Uso: v-swipe="{ left: handler1, right: handler2, up: handler3, down: handler4 }"
 * o: v-swipe:left="handler"
 */
export const vSwipe = {
  mounted(el, binding) {
    let startX;
    let startY;
    let startTime;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const duration = Date.now() - startTime;

      // Determinar dirección del swipe
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Solo considerar swipe si superó el threshold
      if (
        absX > TOUCH_CONFIG.swipeThreshold ||
        absY > TOUCH_CONFIG.swipeThreshold
      ) {
        let direction;

        // Determinar si es horizontal o vertical
        if (absX > absY) {
          direction = deltaX > 0 ? "right" : "left";
        } else {
          direction = deltaY > 0 ? "down" : "up";
        }

        // Ejecutar handler según binding
        if (binding.arg) {
          // Uso: v-swipe:left="handler"
          if (
            binding.arg === direction &&
            typeof binding.value === "function"
          ) {
            binding.value({
              direction,
              deltaX,
              deltaY,
              duration,
              event: e,
            });
          }
        } else if (typeof binding.value === "object") {
          // Uso: v-swipe="{ left: handler, right: handler2 }"
          const handler = binding.value[direction];
          if (typeof handler === "function") {
            handler({
              direction,
              deltaX,
              deltaY,
              duration,
              event: e,
            });
          }
        }
      }

      startX = null;
      startY = null;
      startTime = null;
    };

    el._swipeHandlers = {
      touchstart: handleTouchStart,
      touchend: handleTouchEnd,
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
  },

  unmounted(el) {
    if (el._swipeHandlers) {
      el.removeEventListener("touchstart", el._swipeHandlers.touchstart);
      el.removeEventListener("touchend", el._swipeHandlers.touchend);
      delete el._swipeHandlers;
    }
  },
};

/**
 * Directiva v-pinch
 * Uso: v-pinch="{ in: zoomInHandler, out: zoomOutHandler }"
 */
export const vPinch = {
  mounted(el, binding) {
    let initialDistance = null;
    let currentScale = 1;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const delta = currentDistance - initialDistance;

        // Solo considerar si superó el threshold
        if (Math.abs(delta) > TOUCH_CONFIG.pinchThreshold) {
          const scale = currentDistance / initialDistance;
          const direction = delta > 0 ? "in" : "out";

          // Ejecutar handler
          if (typeof binding.value === "object") {
            const handler = binding.value[direction];
            if (typeof handler === "function") {
              handler({
                scale,
                delta,
                direction,
                event: e,
              });
            }
          }

          currentScale = scale;
        }
      }
    };

    const handleTouchEnd = () => {
      initialDistance = null;
      currentScale = 1;
    };

    el._pinchHandlers = {
      touchstart: handleTouchStart,
      touchmove: handleTouchMove,
      touchend: handleTouchEnd,
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
  },

  unmounted(el) {
    if (el._pinchHandlers) {
      el.removeEventListener("touchstart", el._pinchHandlers.touchstart);
      el.removeEventListener("touchmove", el._pinchHandlers.touchmove);
      el.removeEventListener("touchend", el._pinchHandlers.touchend);
      delete el._pinchHandlers;
    }
  },
};

/**
 * Directiva v-long-press
 * Uso: v-long-press="handler"
 */
export const vLongPress = {
  mounted(el, binding) {
    let timeout;
    let moved = false;
    let startX;
    let startY;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      moved = false;

      timeout = setTimeout(() => {
        if (!moved && typeof binding.value === "function") {
          binding.value(e);
        }
      }, TOUCH_CONFIG.longPressTimeout);
    };

    const handleTouchMove = (e) => {
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);

      if (deltaX > 10 || deltaY > 10) {
        moved = true;
        clearTimeout(timeout);
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(timeout);
    };

    el._longPressHandlers = {
      touchstart: handleTouchStart,
      touchmove: handleTouchMove,
      touchend: handleTouchEnd,
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
  },

  unmounted(el) {
    if (el._longPressHandlers) {
      el.removeEventListener("touchstart", el._longPressHandlers.touchstart);
      el.removeEventListener("touchmove", el._longPressHandlers.touchmove);
      el.removeEventListener("touchend", el._longPressHandlers.touchend);
      delete el._longPressHandlers;
    }
  },
};

/**
 * Registrar todas las directivas
 */
export default {
  install(app) {
    app.directive("tap", vTap);
    app.directive("swipe", vSwipe);
    app.directive("pinch", vPinch);
    app.directive("long-press", vLongPress);
  },
};
