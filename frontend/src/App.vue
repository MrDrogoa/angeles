<script setup>
import Layout from "@/layout/Layouts.vue";
import AccessibilityComponents from "@/components/AccessiblityComponents.vue";
import ChatBot from "@/components/boot/component/bot/ChatBot.vue";
</script>

<template>
  <ChatBot />
  <AccessibilityComponents />
  <Layout>
    <RouterView />
  </Layout>
</template>

<style scoped></style>
