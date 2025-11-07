<script setup>
import { ref } from "vue";
import ButtonAnimatedComponent from "./buttons/ButtonAnimatedComponent.vue";
import Button3Components from "./buttons/Button3Components.vue";

const email = ref("");
const password = ref("");

const handleLogin = () => {
  // Implement login logic here
};
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4">
    <div
      class="border-2 border-[#E6C200] p-8 rounded-2xl shadow-2xl w-full max-w-sm lg:max-w-md"
    >
      <h2 class="text-3xl font-bold mb-8 text-center text-white">
        Iniciar Sesión
      </h2>
      <form
        @submit.prevent="handleLogin"
        class="flex flex-col items-center w-70 lg:w-80 m-auto"
      >
        <!-- Email Input Animado -->
        <ButtonAnimatedComponent v-model="email" label="Email" type="email" />

        <!-- Password Input Animado -->
        <ButtonAnimatedComponent
          v-model="password"
          label="Password"
          type="password"
        />

        <!-- Botón de Submit -->

        <Button3Components type="submit" class="w-full"
          >Iniciar Sesión</Button3Components
        >
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
