/**
 * Composable para gestos touch avanzados
 * Útil cuando necesitas lógica más compleja que las directivas básicas
 */

import { ref, onMounted, onUnmounted } from "vue";

/**
 * Hook para detectar gestos touch en un elemento
 * @param {Object} options - Configuración de gestos
 * @returns {Object} - Ref del elemento y métodos
 */
export function useTouchGestures(options = {}) {
  const elementRef = ref(null);
  const touchState = ref({
    isTouching: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    startTime: 0,
    duration: 0,
    direction: null,
    distance: 0,
  });

  let touchStartHandler;
  let touchMoveHandler;
  let touchEndHandler;

  const setupListeners = () => {
    if (!elementRef.value) return;

    touchStartHandler = (e) => {
      const touch = e.touches[0];
      touchState.value = {
        isTouching: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        startTime: Date.now(),
        duration: 0,
        direction: null,
        distance: 0,
      };

      if (options.onTouchStart) {
        options.onTouchStart(touchState.value);
      }
    };

    touchMoveHandler = (e) => {
      if (!touchState.value.isTouching) return;

      const touch = e.touches[0];
      touchState.value.currentX = touch.clientX;
      touchState.value.currentY = touch.clientY;
      touchState.value.deltaX = touch.clientX - touchState.value.startX;
      touchState.value.deltaY = touch.clientY - touchState.value.startY;

      // Calcular distancia
      touchState.value.distance = Math.sqrt(
        touchState.value.deltaX ** 2 + touchState.value.deltaY ** 2
      );

      // Determinar dirección
      const absX = Math.abs(touchState.value.deltaX);
      const absY = Math.abs(touchState.value.deltaY);

      if (absX > absY) {
        touchState.value.direction =
          touchState.value.deltaX > 0 ? "right" : "left";
      } else {
        touchState.value.direction =
          touchState.value.deltaY > 0 ? "down" : "up";
      }

      if (options.onTouchMove) {
        options.onTouchMove(touchState.value);
      }
    };

    touchEndHandler = (e) => {
      if (!touchState.value.isTouching) return;

      touchState.value.duration = Date.now() - touchState.value.startTime;
      touchState.value.isTouching = false;

      if (options.onTouchEnd) {
        options.onTouchEnd(touchState.value);
      }

      // Reset
      setTimeout(() => {
        touchState.value = {
          isTouching: false,
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          deltaX: 0,
          deltaY: 0,
          startTime: 0,
          duration: 0,
          direction: null,
          distance: 0,
        };
      }, 100);
    };

    elementRef.value.addEventListener("touchstart", touchStartHandler, {
      passive: true,
    });
    elementRef.value.addEventListener("touchmove", touchMoveHandler, {
      passive: true,
    });
    elementRef.value.addEventListener("touchend", touchEndHandler, {
      passive: true,
    });
  };

  const removeListeners = () => {
    if (!elementRef.value) return;

    elementRef.value.removeEventListener("touchstart", touchStartHandler);
    elementRef.value.removeEventListener("touchmove", touchMoveHandler);
    elementRef.value.removeEventListener("touchend", touchEndHandler);
  };

  onMounted(() => {
    setupListeners();
  });

  onUnmounted(() => {
    removeListeners();
  });

  return {
    elementRef,
    touchState,
  };
}

/**
 * Hook para detectar swipe con velocidad
 */
export function useSwipeDetection(options = {}) {
  const { threshold = 50, velocityThreshold = 0.3, onSwipe } = options;

  return useTouchGestures({
    onTouchEnd: (state) => {
      if (state.distance > threshold) {
        const velocity = state.distance / state.duration;

        if (velocity > velocityThreshold) {
          if (onSwipe) {
            onSwipe({
              direction: state.direction,
              distance: state.distance,
              velocity,
              duration: state.duration,
            });
          }
        }
      }
    },
  });
}

/**
 * Hook para drag and drop táctil
 */
export function useTouchDrag(options = {}) {
  const { onDragStart, onDrag, onDragEnd } = options;

  return useTouchGestures({
    onTouchStart: (state) => {
      if (onDragStart) {
        onDragStart(state);
      }
    },
    onTouchMove: (state) => {
      if (onDrag) {
        onDrag({
          x: state.currentX,
          y: state.currentY,
          deltaX: state.deltaX,
          deltaY: state.deltaY,
        });
      }
    },
    onTouchEnd: (state) => {
      if (onDragEnd) {
        onDragEnd(state);
      }
    },
  });
}

/**
 * Hook para pull to refresh
 */
export function usePullToRefresh(options = {}) {
  const { threshold = 80, onRefresh } = options;

  const isPulling = ref(false);
  const pullDistance = ref(0);

  const { elementRef, touchState } = useTouchGestures({
    onTouchMove: (state) => {
      // Solo pull down
      if (state.direction === "down" && state.startY < 50) {
        isPulling.value = true;
        pullDistance.value = Math.min(state.deltaY, threshold * 1.5);
      }
    },
    onTouchEnd: (state) => {
      if (isPulling.value && pullDistance.value >= threshold) {
        if (onRefresh) {
          onRefresh();
        }
      }

      isPulling.value = false;
      pullDistance.value = 0;
    },
  });

  return {
    elementRef,
    isPulling,
    pullDistance,
    touchState,
  };
}

/**
 * Hook para detectar multi-touch (pinch, rotate)
 */
export function useMultiTouch(options = {}) {
  const { onPinch, onRotate } = options;

  const elementRef = ref(null);
  const initialDistance = ref(0);
  const initialAngle = ref(0);
  const currentScale = ref(1);
  const currentRotation = ref(0);

  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getAngle = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const setupListeners = () => {
    if (!elementRef.value) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistance.value = getDistance(e.touches[0], e.touches[1]);
        initialAngle.value = getAngle(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const currentAngle = getAngle(e.touches[0], e.touches[1]);

        // Pinch
        if (initialDistance.value > 0) {
          currentScale.value = currentDistance / initialDistance.value;

          if (onPinch) {
            onPinch({
              scale: currentScale.value,
              distance: currentDistance,
              delta: currentDistance - initialDistance.value,
            });
          }
        }

        // Rotate
        if (onRotate) {
          currentRotation.value = currentAngle - initialAngle.value;

          onRotate({
            rotation: currentRotation.value,
            angle: currentAngle,
          });
        }
      }
    };

    const handleTouchEnd = () => {
      initialDistance.value = 0;
      initialAngle.value = 0;
    };

    elementRef.value.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    elementRef.value.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    elementRef.value.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
  };

  onMounted(() => {
    setupListeners();
  });

  return {
    elementRef,
    currentScale,
    currentRotation,
  };
}
