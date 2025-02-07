<script lang="ts" setup>
useHead({
  title: "Loading...",
  titleTemplate: "%s - Louis Mayes"
})
</script>

<template>
  <div class="font-cabin h-full">
    <div id="Background" class="fixed top-0 bg-gradient-to-b from-neutral-950 to-neutral-800 w-full h-full -z-50">
      <!-- Background stuff here -->
    </div>
      <NuxtLayout>
          <div>
            <NuxtRouteAnnouncer/>
          </div>
          <NuxtPage />
      </NuxtLayout>
    </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5vh;
}
</style>