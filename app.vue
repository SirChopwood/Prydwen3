<script setup>
</script>

<template>
  <div class="font-cabin h-fit">
    <div id="Background" class="fixed top-0 bg-gradient-to-b from-neutral-950 to-neutral-800 w-full h-full -z-50">
      <!-- Background stuff here -->
    </div>
    <div class="min-h-screen h-fit relative flex flex-col gap-20">
      <root-page-header v-if="$route.meta.hideHeader !== true"/>
      <div id="Content" class="relative h-fit w-full text-white grow">
        <div ref="headerBlocker" v-if="$route.meta.hideHeader !== true" class="h-20"/>
        <div>
          <NuxtRouteAnnouncer/>
        </div>
        <NuxtPage />
      </div>
      <root-page-footer v-if="$route.meta.hideFooter !== true"/>
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5vh;
}
</style>