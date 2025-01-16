<script setup>
import Header from "./components/core/Header.vue";
</script>

<template>
  <div id="Root" class="font-cabin">
    <div id="Background" class="fixed top-0 bg-gradient-to-b from-neutral-950 to-neutral-800 w-full h-full -z-50">
      <!-- Background stuff here -->
    </div>
    <Header></Header>
    <div id="Content" class="relative h-fit w-full text-white my-20 ">
      <RouterView />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5vh;
}
</style>