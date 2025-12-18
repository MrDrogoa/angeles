<template>
  <div
    class="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 p-8"
  >
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">
        🧪 Prueba de Conexión - Base de Datos
      </h1>

      <!-- Test de Conexión -->
      <div class="bg-white rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          1️⃣ Test de Conexión a la Base de Datos
        </h2>
        <button
          @click="testConnection"
          :disabled="loading.test"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading.test ? "⏳ Probando..." : "🔌 Probar Conexión" }}
        </button>

        <div
          v-if="results.test"
          class="mt-4 p-4 rounded-lg"
          :class="
            results.test.success
              ? 'bg-green-100 border border-green-400'
              : 'bg-red-100 border border-red-400'
          "
        >
          <p
            class="font-bold"
            :class="results.test.success ? 'text-green-800' : 'text-red-800'"
          >
            {{
              results.test.success
                ? "✅ Conexión Exitosa"
                : "❌ Error de Conexión"
            }}
          </p>
          <pre class="mt-2 text-sm text-gray-700 overflow-auto">{{
            JSON.stringify(results.test, null, 2)
          }}</pre>
        </div>
      </div>

      <!-- Obtener Posts -->
      <div class="bg-white rounded-lg shadow-xl p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          2️⃣ Obtener Posts del Foro
        </h2>
        <button
          @click="getPosts"
          :disabled="loading.posts"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading.posts ? "⏳ Cargando..." : "📝 Obtener Posts" }}
        </button>

        <div
          v-if="results.posts"
          class="mt-4 p-4 rounded-lg bg-blue-100 border border-blue-400"
        >
          <p class="font-bold text-blue-800">
            {{
              results.posts.success
                ? `✅ ${results.posts.data.length} posts encontrados`
                : "❌ Error al obtener posts"
            }}
          </p>
          <pre class="mt-2 text-sm text-gray-700 overflow-auto max-h-64">{{
            JSON.stringify(results.posts, null, 2)
          }}</pre>
        </div>
      </div>

      <!-- Información de la API -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          ℹ️ Información de la API
        </h2>
        <div class="space-y-2 text-gray-700">
          <p>
            <strong>URL de la API:</strong>
            <code class="bg-gray-100 px-2 py-1 rounded">{{ apiUrl }}</code>
          </p>
          <p><strong>Endpoints disponibles:</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li>
              <code class="bg-gray-100 px-2 py-1 rounded">GET /api/test</code> -
              Probar conexión
            </li>
            <li>
              <code class="bg-gray-100 px-2 py-1 rounded">GET /api/posts</code>
              - Obtener posts
            </li>
            <li>
              <code class="bg-gray-100 px-2 py-1 rounded">POST /api/posts</code>
              - Crear post
            </li>
            <li>
              <code class="bg-gray-100 px-2 py-1 rounded"
                >POST /api/posts/like</code
              >
              - Like/Dislike
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import forumService from "@/services/forumService.js";
import { getApiUrl } from "@/config/api.js";

const apiUrl = getApiUrl();

const loading = ref({
  test: false,
  posts: false,
  create: false,
});

const results = ref({
  test: null,
  posts: null,
  create: null,
});

// Test de conexión
const testConnection = async () => {
  loading.value.test = true;
  results.value.test = null;
  try {
    const response = await forumService.testConnection();
    results.value.test = response;
  } catch (error) {
    results.value.test = {
      success: false,
      error: error.message,
      details: error.response?.data || "No se pudo conectar con el servidor",
    };
  } finally {
    loading.value.test = false;
  }
};

// Obtener posts
const getPosts = async () => {
  loading.value.posts = true;
  results.value.posts = null;
  try {
    const response = await forumService.getAllPosts();
    results.value.posts = response;
  } catch (error) {
    results.value.posts = {
      success: false,
      error: error.message,
      details: error.response?.data || "No se pudo obtener los posts",
    };
  } finally {
    loading.value.posts = false;
  }
};
</script>
