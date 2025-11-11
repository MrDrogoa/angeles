<script setup>
import { ref, computed } from "vue";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";

// Estado reactivo del formulario
const formData = ref({
  nombre: "",
  apellido: "",
  correo: "",
  mensaje: "",
});

// Estado para manejo de envío
const isSubmitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");

// Validar que el formulario sea válido
const isFormValid = computed(() => {
  const nombre = formData.value.nombre.trim();
  const apellido = formData.value.apellido.trim();
  const correo = formData.value.correo.trim();
  const mensaje = formData.value.mensaje.trim();

  // Validar email básicamente
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    nombre.length > 0 &&
    apellido.length > 0 &&
    correo.length > 0 &&
    mensaje.length >= 15 && // Mínimo 15 caracteres
    emailRegex.test(correo)
  );
});

// Función para manejar el envío del formulario
const handleSubmit = async () => {
  // Validaciones básicas
  if (
    !formData.value.nombre.trim() ||
    !formData.value.apellido.trim() ||
    !formData.value.correo.trim() ||
    !formData.value.mensaje.trim()
  ) {
    submitError.value = "Por favor completa todos los campos";
    return;
  }

  // Validar longitud del mensaje
  if (formData.value.mensaje.trim().length < 15) {
    submitError.value = "El mensaje debe tener al menos 15 caracteres";
    return;
  }

  // Validar email básicamente
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.correo)) {
    submitError.value = "Por favor ingresa un correo válido";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";
  submitMessage.value = "";

  try {
    // TODO: Reemplazar con tu endpoint real del backend
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: formData.value.nombre,
        apellido: formData.value.apellido,
        correo: formData.value.correo,
        mensaje: formData.value.mensaje,
      }),
    });

    if (response.ok) {
      submitMessage.value =
        "¡Tu mensaje ha sido enviado exitosamente! Nos pondremos en contacto pronto.";
      // Resetear formulario
      formData.value = {
        nombre: "",
        apellido: "",
        correo: "",
        mensaje: "",
      };
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        submitMessage.value = "";
      }, 5000);
    } else {
      submitError.value =
        "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.";
    }
  } catch (error) {
    console.error("Error enviando formulario:", error);
    submitError.value =
      "Error de conexión. Por favor verifica tu conexión e intenta nuevamente.";
  } finally {
    isSubmitting.value = false;
  }
};

// Función para resetear el formulario
const resetForm = () => {
  formData.value = {
    nombre: "",
    apellido: "",
    correo: "",
    mensaje: "",
  };
  submitMessage.value = "";
  submitError.value = "";
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4">
    <return-components class="mb-4" />
    <title-h-2-components title="Contactate con Nosotros" class="text-center" />

    <div class="flex flex-col items-center justify-center">
      <!-- Contenedor principal del formulario -->
      <div
        class="border-2 border-[#FFD700] rounded-3xl p-6 md:p-8 lg:p-10 w-full max-w-2xl"
      >
        <!-- Formulario dinámico -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <!-- Fila: Nombre y Apellido -->
          <div class="flex flex-col md:flex-row gap-4 md:gap-6">
            <!-- Campo Nombre -->
            <div class="flex-1">
              <label
                for="nombre"
                class="block text-white text-sm font-semibold mb-2"
              >
                Nombre
              </label>
              <input
                id="nombre"
                v-model="formData.nombre"
                type="text"
                placeholder="Tu nombre"
                class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Campo Apellido -->
            <div class="flex-1">
              <label
                for="apellido"
                class="block text-white text-sm font-semibold mb-2"
              >
                Apellido
              </label>
              <input
                id="apellido"
                v-model="formData.apellido"
                type="text"
                placeholder="Tu apellido"
                class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Campo Correo (Full Width) -->
          <div>
            <label
              for="correo"
              class="block text-white text-sm font-semibold mb-2"
            >
              Correo
            </label>
            <input
              id="correo"
              v-model="formData.correo"
              type="email"
              placeholder="example@gmail.com"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Campo Mensaje (Full Width) -->
          <div>
            <label
              for="mensaje"
              class="block text-white text-sm font-semibold mb-2"
            >
              Mensaje
              <span class="text-gray-400 text-xs">
                (Mínimo 15 caracteres)
              </span>
            </label>
            <textarea
              id="mensaje"
              v-model="formData.mensaje"
              placeholder="Tu mensaje..."
              rows="6"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none"
              :class="
                formData.mensaje.length >= 15
                  ? 'focus:ring-green-500'
                  : 'focus:ring-[#FFD700]'
              "
              :disabled="isSubmitting"
            ></textarea>
            <!-- Contador de caracteres -->
            <div class="mt-2 text-xs text-gray-400">
              {{ formData.mensaje.length }} / 15 caracteres mínimo
              <span
                v-if="formData.mensaje.length >= 15"
                class="text-green-400 ml-2"
              >
                ✓ Válido
              </span>
            </div>
          </div>

          <!-- Mensajes de error/éxito -->
          <div
            v-if="submitError"
            class="p-4 bg-red-500/20 border border-red-500 rounded-lg"
          >
            <p class="text-red-400 text-sm">{{ submitError }}</p>
          </div>

          <div
            v-if="submitMessage"
            class="p-4 bg-green-500/20 border border-green-500 rounded-lg"
          >
            <p class="text-green-400 text-sm">{{ submitMessage }}</p>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              :disabled="!isFormValid || isSubmitting"
              class="px-8 py-3 font-semibold bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ isSubmitting ? "Enviando..." : "Enviar" }}
            </button>
            <button
              type="button"
              @click="resetForm"
              :disabled="isSubmitting"
              class="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Limpiar
            </button>
          </div>

          <!-- Estado del formulario (debugging) -->
          <div class="text-xs text-gray-400 text-center mt-4">
            <p>
              Formulario válido:
              <span :class="isFormValid ? 'text-green-400' : 'text-red-400'">
                {{ isFormValid ? "✓ Sí" : "✗ No" }}
              </span>
            </p>
            <p v-if="!isFormValid" class="mt-2">
              <span v-if="formData.mensaje.trim().length < 15" class="block"
                >• Mensaje debe tener 15+ caracteres ({{
                  formData.mensaje.trim().length
                }}/15)</span
              >
            </p>
          </div>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="my-12 text-center">
        <p class="text-gray-300 text-sm">
          ¿Tienes alguna pregunta? Nos encantaría escucharte.
        </p>
        <p class="text-gray-400 text-xs mt-2">
          Nos pondremos en contacto lo antes posible.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
