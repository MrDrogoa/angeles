import { defineStore } from "pinia";
import { ref, computed } from "vue";

/**
 * Store para gestionar hospedajes/alojamientos
 */
export const useHospedajeStore = defineStore("hospedaje", () => {
  // Estado
  const hospedajes = ref([]);
  const featured = ref([]); // Hospedajes destacados/que pagan comisión
  const selectedHospedaje = ref(null);
  const searchFilters = ref({
    ubicacion: "",
    tipo: "", // vip, premium, normal, masajistas
    precioMin: 0,
    precioMax: 0,
    servicios: [],
  });
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const filteredHospedajes = computed(() => {
    let result = hospedajes.value;

    if (searchFilters.value.ubicacion) {
      result = result.filter((h) =>
        h.ubicacion
          ?.toLowerCase()
          .includes(searchFilters.value.ubicacion.toLowerCase())
      );
    }

    if (searchFilters.value.tipo) {
      result = result.filter((h) => h.categoria === searchFilters.value.tipo);
    }

    if (searchFilters.value.precioMin > 0) {
      result = result.filter((h) => h.precio >= searchFilters.value.precioMin);
    }

    if (searchFilters.value.precioMax > 0) {
      result = result.filter((h) => h.precio <= searchFilters.value.precioMax);
    }

    return result;
  });

  const featuredHospedajes = computed(() => {
    return hospedajes.value.filter((h) => h.destacado === true);
  });

  const hospedajesByCategory = computed(() => {
    return {
      vip: hospedajes.value.filter((h) => h.categoria === "vip"),
      premium: hospedajes.value.filter((h) => h.categoria === "premium"),
      normal: hospedajes.value.filter((h) => h.categoria === "normal"),
      masajistas: hospedajes.value.filter((h) => h.categoria === "masajistas"),
    };
  });

  // Actions
  const setHospedajes = (data) => {
    hospedajes.value = data;
  };

  const addHospedaje = (hospedaje) => {
    hospedajes.value.push(hospedaje);
  };

  const selectHospedaje = (hospedaje) => {
    selectedHospedaje.value = hospedaje;
  };

  const clearSelection = () => {
    selectedHospedaje.value = null;
  };

  const updateFilters = (filters) => {
    searchFilters.value = { ...searchFilters.value, ...filters };
  };

  const clearFilters = () => {
    searchFilters.value = {
      ubicacion: "",
      tipo: "",
      precioMin: 0,
      precioMax: 0,
      servicios: [],
    };
  };

  const searchByLocation = async (location) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Simular búsqueda (reemplazar con API real)
      const results = hospedajes.value.filter((h) =>
        h.ubicacion?.toLowerCase().includes(location.toLowerCase())
      );

      return {
        success: true,
        results,
        count: results.length,
      };
    } catch (err) {
      error.value = err.message;
      return {
        success: false,
        error: err.message,
        results: [],
      };
    } finally {
      isLoading.value = false;
    }
  };

  const getRecommendations = (filters = {}) => {
    // Priorizar hospedajes destacados (que pagan comisión)
    let recommendations = [...featuredHospedajes.value];

    // Si hay filtros, aplicarlos
    if (filters.ubicacion) {
      recommendations = recommendations.filter((h) =>
        h.ubicacion?.toLowerCase().includes(filters.ubicacion.toLowerCase())
      );
    }

    if (filters.categoria) {
      recommendations = recommendations.filter(
        (h) => h.categoria === filters.categoria
      );
    }

    // Si no hay suficientes destacados, agregar otros hospedajes
    if (recommendations.length < 5) {
      const others = hospedajes.value
        .filter((h) => !h.destacado)
        .slice(0, 5 - recommendations.length);
      recommendations = [...recommendations, ...others];
    }

    // Ordenar por ranking/calificación
    recommendations.sort((a, b) => (b.ranking || 0) - (a.ranking || 0));

    return recommendations.slice(0, 5);
  };

  return {
    // State
    hospedajes,
    featured,
    selectedHospedaje,
    searchFilters,
    isLoading,
    error,

    // Getters
    filteredHospedajes,
    featuredHospedajes,
    hospedajesByCategory,

    // Actions
    setHospedajes,
    addHospedaje,
    selectHospedaje,
    clearSelection,
    updateFilters,
    clearFilters,
    searchByLocation,
    getRecommendations,
  };
});
