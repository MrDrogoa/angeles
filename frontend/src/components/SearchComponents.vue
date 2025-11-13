<script setup></script>

<template>
  <div class="flex justify-center items-center gap-4 relative">
    <button class="icon">
      <font-awesome-icon
        icon="search"
        class="text-lg lg:text-xl cursor-pointer text-white transition-colors duration-200"
      />
    </button>
    <input
      type="text"
      name="text"
      class="input placeholder:text-white text-white w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-[#DAA520]"
      placeholder="search.."
    />
  </div>
</template>

<style scoped>
.input {
  padding: 10px;
  outline: none;
  transition: 0.5s ease-in-out;
  padding-right: 40px;
}

.icon {
  position: absolute;
  right: 0px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  outline: none;
  border-style: none;
  border-radius: 50%;
  pointer-events: painted;
  background-color: transparent;
  transition: 0.2s linear;
}

.icon:focus ~ .input,
.input:focus {
  box-shadow: none;
  border-radius: 0px;
  width: 250px;
  background-color: transparent;
  border-bottom: 3px solid #ffd700;
  transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
}

@media (max-width: 768px) {
  .icon:focus ~ .input,
  .input:focus {
    width: 150px;
  }
}
@media (max-width: 320px) {
  .icon:focus ~ .input,
  .input:focus {
    width: 120px;
  }
}
</style>
