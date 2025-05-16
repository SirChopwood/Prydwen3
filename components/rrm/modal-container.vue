<script setup lang="ts">
</script>

<template>
  <div
      id="ModalParentContainer"
      class="flex place-content-center items-center justify-center content-center h-full w-full fixed top-0 left-0 pointer-events-none bg-black bg-opacity-75 z-10 transition-all duration-500"
      style="opacity: 0; pointer-events: none;"
  >
    <div
        id="ModalChildContainer"
        class="w-1/3 min-h-1/2 h-fit pointer-events-auto z-20"
    />
  </div>
</template>

<style scoped>
</style>