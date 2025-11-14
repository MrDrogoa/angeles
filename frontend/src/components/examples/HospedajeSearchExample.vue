<template>
  <div class="hospedaje-search-example">
    <h2>Ejemplo de Búsqueda de Hospedajes</h2>

    <!-- Formulario de búsqueda -->
    <div class="search-form">
      <input
        v-model="searchLocation"
        type="text"
        placeholder="¿Dónde buscas hospedaje?"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch" :disabled="isLoading">
        {{ isLoading ? "Buscando..." : "Buscar" }}
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <select v-model="selectedCategory" @change="handleCategoryChange">
        <option value="">Todas las categorías</option>
        <option value="vip">💎 VIP</option>
        <option value="premium">⭐ Premium</option>
        <option value="normal">🏠 Normal</option>
        <option value="masajistas">💆 Masajistas</option>
      </select>

      <button @click="handleGetRecommendations">Ver Recomendaciones</button>
    </div>

    <!-- Resultados -->
    <div v-if="hospedajes.length > 0" class="results">
      <h3>
        {{ hospedajes.length }} hospedaje{{
          hospedajes.length !== 1 ? "s" : ""
        }}
        encontrado{{ hospedajes.length !== 1 ? "s" : "" }}
      </h3>

      <div class="hospedaje-grid">
        <div
          v-for="hospedaje in hospedajes"
          :key="hospedaje.id"
          class="hospedaje-card"
          :class="{ featured: hospedaje.destacado }"
          @click="selectHospedaje(hospedaje)"
        >
          <div v-if="hospedaje.destacado" class="featured-badge">
            💎 Destacado
          </div>

          <h4>{{ hospedaje.nombre }}</h4>
          <p class="location">📍 {{ hospedaje.ubicacion }}</p>
          <p class="category">{{ getCategoryLabel(hospedaje.categoria) }}</p>
          <p class="price">💰 {{ formatPrice(hospedaje.precio) }}</p>
          <p v-if="hospedaje.ranking" class="rating">
            ⭐ {{ hospedaje.ranking }}
          </p>
        </div>
      </div>
    </div>

    <!-- Hospedaje seleccionado -->
    <div v-if="selectedHospedaje" class="hospedaje-details">
      <h3>{{ selectedHospedaje.nombre }}</h3>
      <button @click="clearSelection">Cerrar</button>

      <div class="details-content">
        <p><strong>📍 Ubicación:</strong> {{ selectedHospedaje.ubicacion }}</p>
        <p>
          <strong>🏷️ Categoría:</strong>
          {{ getCategoryLabel(selectedHospedaje.categoria) }}
        </p>
        <p>
          <strong>💰 Precio:</strong>
          {{ formatPrice(selectedHospedaje.precio) }}
        </p>
        <p v-if="selectedHospedaje.descripcion">
          <strong>📝 Descripción:</strong> {{ selectedHospedaje.descripcion }}
        </p>

        <div v-if="selectedHospedaje.servicios?.length > 0">
          <strong>✨ Servicios:</strong>
          <ul>
            <li v-for="servicio in selectedHospedaje.servicios" :key="servicio">
              {{ servicio }}
            </li>
          </ul>
        </div>

        <button class="reserve-btn">Reservar Ahora</button>
      </div>
    </div>

    <!-- Estado de carga o error -->
    <div v-if="error" class="error">❌ {{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useHospedajeStore } from "@/store/hospedajeStore";
import ChatBotHospedajeService from "@/services/ChatBotHospedajeService";

// Store
const hospedajeStore = useHospedajeStore();

// Estado local
const searchLocation = ref("");
const selectedCategory = ref("");
const error = ref(null);

// Computed
const hospedajes = computed(() => hospedajeStore.filteredHospedajes);
const selectedHospedaje = computed(() => hospedajeStore.selectedHospedaje);
const isLoading = computed(() => hospedajeStore.isLoading);

// Métodos
const handleSearch = async () => {
  if (!searchLocation.value.trim()) {
    error.value = "Por favor ingresa una ubicación";
    return;
  }

  error.value = null;

  // Validar ubicación
  const validation = ChatBotHospedajeService.validateLocation(
    searchLocation.value
  );

  if (!validation.isValid) {
    error.value = validation.message;
    return;
  }

  // Buscar
  const result = await hospedajeStore.searchByLocation(validation.location);

  if (!result.success) {
    error.value = result.error || "No se encontraron resultados";
  }
};

const handleCategoryChange = async () => {
  if (selectedCategory.value) {
    hospedajeStore.updateFilters({ tipo: selectedCategory.value });
  } else {
    hospedajeStore.clearFilters();
  }
};

const handleGetRecommendations = () => {
  const recommendations = hospedajeStore.getRecommendations({
    ubicacion: searchLocation.value,
    categoria: selectedCategory.value,
  });

  if (recommendations.length === 0) {
    error.value = "No hay recomendaciones disponibles";
  } else {
    error.value = null;
  }
};

const selectHospedaje = (hospedaje) => {
  hospedajeStore.selectHospedaje(hospedaje);
};

const clearSelection = () => {
  hospedajeStore.clearSelection();
};

const formatPrice = (price) => {
  if (!price) return "Consultar precio";
  return `$${price.toLocaleString("es-CL")} CLP`;
};

const getCategoryLabel = (category) => {
  const labels = {
    vip: "💎 VIP",
    premium: "⭐ Premium",
    normal: "🏠 Normal",
    masajistas: "💆 Masajistas",
  };
  return labels[category?.toLowerCase()] || category;
};

// Cargar datos de ejemplo al montar (TEMPORAL - eliminar al conectar backend)
onMounted(() => {
  // Datos mock para testing
  const mockData = [
    {
      id: "1",
      nombre: "Loft Moderno Santiago Centro",
      ubicacion: "Santiago Centro",
      categoria: "premium",
      precio: 45000,
      destacado: true,
      ranking: 4.9,
      descripcion:
        "Hermoso loft completamente equipado en el corazón de Santiago",
      servicios: ["WiFi", "TV Cable", "Cocina", "Estacionamiento"],
    },
    {
      id: "2",
      nombre: "Suite Premium Providencia",
      ubicacion: "Providencia",
      categoria: "vip",
      precio: 65000,
      destacado: true,
      ranking: 5.0,
      descripcion: "Suite de lujo con vista panorámica y todos los servicios",
      servicios: ["WiFi", "Gimnasio", "Piscina", "Room Service"],
    },
    {
      id: "3",
      nombre: "Departamento Acogedor Las Condes",
      ubicacion: "Las Condes",
      categoria: "normal",
      precio: 28000,
      destacado: false,
      ranking: 4.5,
      descripcion: "Departamento cómodo y bien ubicado",
      servicios: ["WiFi", "TV"],
    },
    {
      id: "4",
      nombre: "Spa & Relax Center",
      ubicacion: "Vitacura",
      categoria: "masajistas",
      precio: 55000,
      destacado: true,
      ranking: 4.8,
      descripcion: "Servicios de masajes profesionales con hospedaje incluido",
      servicios: ["Masajes", "Sauna", "Jacuzzi", "WiFi"],
    },
  ];

  hospedajeStore.setHospedajes(mockData);
});
</script>

<style scoped>
.hospedaje-search-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.search-form button {
  padding: 12px 24px;
  background: #ffd700;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.search-form button:hover:not(:disabled) {
  background: #ffed4e;
  transform: translateY(-2px);
}

.search-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.filters select,
.filters button {
  padding: 10px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.results h3 {
  margin-bottom: 20px;
  color: #333;
}

.hospedaje-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.hospedaje-card {
  position: relative;
  background: white;
  border: 2px solid #eee;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.hospedaje-card:hover {
  border-color: #ffd700;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hospedaje-card.featured {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fffef8 0%, #fff 100%);
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffd700;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.hospedaje-card h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.hospedaje-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.hospedaje-card .price {
  color: #ffd700;
  font-weight: 600;
  font-size: 16px;
}

.hospedaje-details {
  background: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 30px;
  margin-top: 20px;
}

.hospedaje-details h3 {
  margin-top: 0;
  color: #333;
}

.hospedaje-details button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #666;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.details-content p {
  margin: 15px 0;
}

.details-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.reserve-btn {
  margin-top: 20px;
  padding: 12px 32px;
  background: #ffd700;
  color: #333;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.reserve-btn:hover {
  background: #ffed4e;
  transform: translateY(-2px);
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
