<script setup>
import Logo from "@/components/nav/Logo.vue";
import BancoEstado from "@/assets/bancos/bancoestado.png";
import Khipu from "@/assets/bancos/khipu.png";
import Paypal from "@/assets/bancos/paypal.png";
import Webpay from "@/assets/bancos/webpay.png";
import Stripe from "@/assets/bancos/stripe.png";

// Datos dinámicos del footer
const footerData = {
  slogan: '"Tu mejor lugar de encuentros"',
  columns: [
    {
      title: "Secciones",
      links: [
        { text: "Inicio", url: "/" },
        { text: "Novedades", url: "/news" },
        { text: "Disponibles ahora!", url: "/" },
        { text: "Masajistas", url: "/masajistas" },
        { text: "Redes", url: "/social" },
        { text: "Todas", url: "/all" },
      ],
    },
    {
      title: "Ubicaciones",
      links: [
        { text: "Escorts en Independencia", url: "/" },
        { text: "Escorts en La Florida", url: "/" },
        { text: "Escorts en Las Condes", url: "/" },
        { text: "Escorts en Lo Barnechea", url: "/" },
        { text: "Escorts en Ñuñoa", url: "/" },
        { text: "Escorts en Providencia", url: "/" },
        { text: "Escorts en Santiago Centro", url: "/" },
        { text: "Escorts en Vitacura", url: "/" },
      ],
    },
    {
      title: "Contactanos",
      links: [
        { text: "Contacto", url: "/contact" },
        { text: "Soporte", url: "/" },
        { text: "FAQ", url: "/" },
        { text: "Privacidad", url: "/" },
        { text: "Terminos", url: "/" },
      ],
    },
  ],
  paymentMethods: {
    title: "Métodos de pago:",
    images: [
      { src: BancoEstado, alt: "Banco Estado" },
      { src: Paypal, alt: "PayPal" },
      { src: Webpay, alt: "Webpay" },
      { src: Khipu, alt: "Khipu" },
      { src: Stripe, alt: "Stripe" },
    ],
  },
};
</script>

<template>
  <footer class="border-t-2 border-[#DAA520] mode-footer-card">
    <div class="max-w-[1300px] mx-auto px-4 py-8 sm:py-10 md:py-12 lg:py-14">
      <!-- Grid principal del footer -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
      >
        <!-- Columna 1: Logo y Slogan -->
        <div class="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <h3
            class="text-[#FFD700] text-lg sm:text-xl md:text-2xl font-bold mode-title mode-title-footer"
          >
            {{ footerData.slogan }}
          </h3>
        </div>

        <!-- Columnas de enlaces dinámicas -->
        <div
          v-for="(column, index) in footerData.columns"
          :key="index"
          class="flex flex-col gap-3"
        >
          <h4
            class="text-white text-base sm:text-lg font-semibold mb-2 mode-title mode-title-footer"
          >
            {{ column.title }}
          </h4>

          <!-- Si la columna tiene links -->
          <ul v-if="column.links" class="flex flex-col gap-2">
            <li v-for="(link, linkIndex) in column.links" :key="linkIndex">
              <a
                :href="link.url"
                class="text-gray-400 hover:text-[#FFD700] transition-colors duration-200 text-sm sm:text-base mode-paragraph mode-paragraph-footer"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Métodos de pago -->
      <div class="mt-10 sm:mt-12 lg:mt-14 pt-8 border-t border-gray-700">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <h4
            class="text-white text-base sm:text-lg font-semibold mode-title mode-title-footer"
          >
            {{ footerData.paymentMethods.title }}
          </h4>

          <!-- Grid de logos de métodos de pago -->
          <div
            class="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 items-center"
          >
            <div
              v-for="(payment, index) in footerData.paymentMethods.images"
              :key="index"
              class="bg-white rounded-md p-2 flex items-center justify-center hover:shadow-lg transition-shadow duration-200"
            >
              <img
                :src="payment.src"
                :alt="payment.alt"
                class="w-full h-auto max-h-8 sm:max-h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright (opcional) -->
      <div class="mt-8 pt-6 border-t border-gray-700 text-center">
        <p
          class="text-gray-500 text-xs sm:text-sm mode-paragraph mode-paragraph-footer"
        >
          © {{ new Date().getFullYear() }} Angeles y Demonios. Todos los
          derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
