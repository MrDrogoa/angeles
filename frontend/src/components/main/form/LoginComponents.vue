<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ButtonAnimatedComponent from "@/components/buttons/ButtonAnimatedComponent.vue";
import Button3Components from "@/components/buttons/Button3Components.vue";
import ReturnComponents from "@/components/buttons/ReturnComponents.vue";
import { useAuthStore } from "@/composables/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

// Cargar usuarios desde localStorage al montar
onMounted(() => {
  authStore.loadUsersFromStorage();
});

const email = ref("");
const password = ref("");
const submitError = ref("");
const isSubmitting = ref(false);

const handleLogin = async () => {
  // Validaciones básicas
  if (!email.value.trim()) {
    submitError.value = "Por favor ingresa tu correo";
    return;
  }

  if (password.value.length < 6) {
    submitError.value = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    submitError.value = "Por favor ingresa un correo válido";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const result = await authStore.loginUser(email.value, password.value);

    if (result.success) {
      // Resetear formulario
      email.value = "";
      password.value = "";

      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        router.push({ name: "Home" });
      }, 2000);
    } else {
      submitError.value = result.message;
    }
  } catch (error) {
    console.error("Error en login:", error);
    submitError.value = "Error inesperado. Por favor intenta nuevamente.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="max-w-[1300px] mx-auto pb-8 md:pb-20 lg:pb-25 xl:pb-26 px-4">
    <return-components />
    <div class="flex flex-col items-center justify-center">
      <div
        class="mode-card border-2 border-[#E6C200] px-6 py-10 lg:px-8 lg:py-13 xl:px-10 xl:py-15 rounded-2xl shadow-2xl w-full max-w-sm lg:max-w-md bg-gray-900/50"
      >
        <h2
          class="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-8 text-center text-white mode-title"
        >
          Iniciar Sesión
        </h2>
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col items-center w-full sm:w-60 md:w-70 lg:w-80 m-auto"
        >
          <!-- Email Input Animado -->
          <button-animated-component
            v-model="email"
            label="Email"
            type="email"
            :disabled="isSubmitting"
          />

          <!-- Password Input Animado -->
          <button-animated-component
            v-model="password"
            label="Password"
            type="password"
            :disabled="isSubmitting"
          />

          <!-- Mensaje de error -->
          <div
            v-if="submitError"
            class="w-full mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg"
          >
            <p class="text-red-400 text-sm text-center mode-paragraph">
              {{ submitError }}
            </p>
          </div>

          <!-- Botón de Submit -->
          <Button3Components
            type="submit"
            class="w-full mt-2 md:mt-4 lg:mt-5"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión" }}
          </Button3Components>

          <!-- Enlace a registro -->
          <div class="text-center mt-6 w-full">
            <p class="text-gray-300 text-sm mode-paragraph">
              ¿No tienes cuenta?
              <router-link
                to="/register"
                class="text-[#FFD700] hover:text-[#FFE55C] font-semibold transition-colors"
              >
                Regístrate aquí
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
