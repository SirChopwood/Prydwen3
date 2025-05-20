<script lang="ts" setup>
useHead({
  title: "Loading...",
  titleTemplate: "%s - Louis Mayes"
})
useSeoMeta({
  title: 'Home',
  ogTitle: 'Home',

  description: "Welcome to my portfolio! Browse my projects and see what I've been up to.",
  ogDescription: "Welcome to my portfolio! Browse my projects and see what I've been up to.",

  ogImage: `https://louismayes.xyz/images/misc/banner.png`,
  ogImageUrl: `https://louismayes.xyz/images/misc/banner.png`,
  twitterImage: `https://louismayes.xyz/images/misc/banner.png`,

  twitterCard: 'summary_large_image',
  themeColor: "#ffcc00",

  author: "Louis Mayes"
})
</script>

<template>
  <div class="font-cabin h-full">
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