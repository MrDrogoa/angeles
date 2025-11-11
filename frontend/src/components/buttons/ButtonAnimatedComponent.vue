<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

// Verificar si el input tiene contenido o está en foco
const isActive = computed(() => {
  return isFocused.value || (inputValue.value && inputValue.value.length > 0);
});

// Convertir el label en letras individuales con delay
const labelLetters = computed(() => {
  return props.label.split("").map((letter, index) => ({
    char: letter,
    delay: index * 50,
  }));
});
</script>

<template>
  <div class="relative my-5 mb-10 w-full">
    <input
      v-model="inputValue"
      :type="type"
      required
      class="bg-transparent border-0 rounded-lg border-b-2 border-white block w-full px-2 lg:px-4 py-[15px] text-lg text-white outline-none focus:border-[#E6C200]"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <label class="absolute top-[15px] left-0 pointer-events-none flex">
      <span
        v-for="(letter, index) in labelLetters"
        :key="index"
        :style="{ transitionDelay: `${letter.delay}ms` }"
        :class="['letter', { 'letter-active': isActive }]"
      >
        {{ letter.char }}
      </span>
    </label>
  </div>
</template>

<style scoped>
/* Solo las animaciones que Tailwind no puede manejar */
.letter {
  display: inline-block;
  font-size: 16px;
  min-width: 5px;
  color: #fff;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.letter-active {
  color: #fff;
  transform: translateY(-40px);
}
</style>
