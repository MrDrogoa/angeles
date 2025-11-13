<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ButtonComponents from "@/components/buttons/ButtonComponents.vue";
import TitleH2Components from "@/components/TitleH2Components.vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import { useAuthStore } from "@/composables/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

// Estado reactivo del formulario
const formData = ref({
  nombre: "",
  email: "",
  password: "",
  confirmPassword: "",
  fechaNacimiento: "",
});

// Estado para manejo de envío
const isSubmitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");

// Estado para mostrar/ocultar contraseñas
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Funciones para toggle de visibilidad
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Validar que el formulario sea válido
const isFormValid = computed(() => {
  const nombre = formData.value.nombre.trim();
  const email = formData.value.email.trim();
  const password = formData.value.password.trim();
  const confirmPassword = formData.value.confirmPassword.trim();
  const fechaNacimiento = formData.value.fechaNacimiento.trim();

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validar contraseña mínimo 6 caracteres
  const passwordValid = password.length >= 6;

  // Validar que las contraseñas coincidan
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    nombre.length > 0 &&
    email.length > 0 &&
    emailRegex.test(email) &&
    passwordValid &&
    passwordsMatch &&
    fechaNacimiento.length > 0
  );
});

// Validar que las contraseñas coincidan
const passwordsMatch = computed(() => {
  if (
    formData.value.password.length === 0 &&
    formData.value.confirmPassword.length === 0
  ) {
    return true;
  }
  return formData.value.password === formData.value.confirmPassword;
});

// Función para registrar
const handleRegister = async () => {
  // Validaciones básicas
  if (!formData.value.nombre.trim()) {
    submitError.value = "Por favor ingresa tu nombre";
    return;
  }

  if (!formData.value.email.trim()) {
    submitError.value = "Por favor ingresa tu correo";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    submitError.value = "Por favor ingresa un correo válido";
    return;
  }

  if (formData.value.password.length < 6) {
    submitError.value = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    submitError.value = "Las contraseñas no coinciden";
    return;
  }

  if (!formData.value.fechaNacimiento) {
    submitError.value = "Por favor selecciona tu fecha de nacimiento";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";
  submitMessage.value = "";

  try {
    const result = await authStore.registerUser({
      nombre: formData.value.nombre,
      email: formData.value.email,
      password: formData.value.password,
      fechaNacimiento: formData.value.fechaNacimiento,
    });

    if (result.success) {
      submitMessage.value = result.message;

      // Resetear formulario
      formData.value = {
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        fechaNacimiento: "",
      };

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        router.push({ name: "Login" });
      }, 2000);
    } else {
      submitError.value = result.message;
    }
  } catch (error) {
    console.error("Error en registro:", error);
    submitError.value = "Error inesperado. Por favor intenta nuevamente.";
  } finally {
    isSubmitting.value = false;
  }
};

// Función para resetear el formulario
const resetForm = () => {
  formData.value = {
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
  };
  submitMessage.value = "";
  submitError.value = "";
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto px-4">
    <return-components />
    <title-h-2-components title="Registrate" class="text-center" />

    <div class="flex flex-col items-center justify-center px-4">
      <!-- Contenedor principal del formulario -->
      <div
        class="border-2 border-[#FFD700] rounded-3xl p-6 md:p-8 lg:p-10 w-full max-w-2xl bg-gray-900/50"
      >
        <!-- Formulario dinámico -->
        <form @submit.prevent="handleRegister" class="flex flex-col gap-6">
          <!-- Campo Nombre (Full Width) -->
          <div>
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
              placeholder="Tu nombre completo"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Campo Email (Full Width) -->
          <div>
            <label
              for="email"
              class="block text-white text-sm font-semibold mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="ejemplo@gmail.com"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Campo Contraseña (Full Width) -->
          <div>
            <label
              for="password"
              class="block text-white text-sm font-semibold mb-2"
            >
              Contraseña
              <span class="text-gray-400 text-xs"> (Mínimo 6 caracteres) </span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Tu contraseña"
                class="w-full px-4 py-3 pr-12 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                :disabled="isSubmitting"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                :disabled="isSubmitting"
              >
                <font-awesome-icon
                  :icon="showPassword ? 'eye' : 'eye-slash'"
                  class="text-lg"
                />
              </button>
            </div>
            <!-- Indicador de fortaleza -->
            <div class="mt-2 text-xs text-gray-400">
              {{ formData.password.length }} / 6 caracteres mínimo
              <span
                v-if="formData.password.length >= 6"
                class="text-green-400 ml-2"
              >
                ✓ Válido
              </span>
            </div>
          </div>

          <!-- Campo Confirmar Contraseña (Full Width) -->
          <div>
            <label
              for="confirmPassword"
              class="block text-white text-sm font-semibold mb-2"
            >
              Confirmar Contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 pr-12 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                :class="
                  formData.confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'focus:ring-green-500'
                      : 'focus:ring-red-500'
                    : 'focus:ring-[#FFD700]'
                "
                :disabled="isSubmitting"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                :disabled="isSubmitting"
              >
                <font-awesome-icon
                  :icon="showConfirmPassword ? 'eye' : 'eye-slash'"
                  class="text-lg"
                />
              </button>
            </div>
            <!-- Indicador de coincidencia -->
            <div
              v-if="formData.confirmPassword.length > 0"
              class="mt-2 text-xs"
            >
              <span v-if="passwordsMatch" class="text-green-400">
                ✓ Las contraseñas coinciden
              </span>
              <span v-else class="text-red-400">
                ✗ Las contraseñas no coinciden
              </span>
            </div>
          </div>

          <!-- Campo Fecha de Nacimiento (Full Width) -->
          <div>
            <label
              for="fechaNacimiento"
              class="block text-white text-sm font-semibold mb-2"
            >
              Fecha de Nacimiento
            </label>
            <input
              id="fechaNacimiento"
              v-model="formData.fechaNacimiento"
              type="date"
              class="w-full px-4 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
              :disabled="isSubmitting"
            />
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
              class="px-8 py-3 font-semibold bg-gray-600 lg:hover:bg-gray-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {{ isSubmitting ? "Registrando..." : "Registrarse" }}
            </button>
            <button
              type="button"
              @click="resetForm"
              :disabled="isSubmitting"
              class="px-8 py-3 bg-gray-600 lg:hover:bg-gray-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Limpiar
            </button>
          </div>

          <!-- Enlace a login -->
          <div class="text-center">
            <p class="text-gray-300 text-sm">
              ¿Ya tienes cuenta?
              <router-link
                to="/login"
                class="text-[#FFD700] hover:text-[#FFE55C] font-semibold transition-colors"
              >
                Inicia sesión aquí
              </router-link>
            </p>
          </div>

          <!-- Estado del formulario (debugging) -->
          <div class="text-xs text-gray-400 text-center mt-4">
            <p>
              Formulario válido:
              <span :class="isFormValid ? 'text-green-400' : 'text-red-400'">
                {{ isFormValid ? "✓ Sí" : "✗ No" }}
              </span>
            </p>
          </div>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="my-12 text-center">
        <p class="text-gray-300 text-sm">
          Crea tu cuenta para acceder a todos nuestros servicios.
        </p>
        <p class="text-gray-400 text-xs mt-2">
          Tu información está segura con nosotros.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
