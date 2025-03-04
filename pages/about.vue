<script lang="ts">
import {defineComponent} from 'vue'
import CodeblockButton from "~/components/codeblock-button.vue";

export default defineComponent({
  name: "about",
  components: {HeaderButton: CodeblockButton}
})
</script>

<template>
  <Title>About Me</Title>
  <div class="text-center w-full flex flex-col justify-center place-content-center place-items-center items-center">
    <div class="mx-4 w-fit md:w-1/2 text-base md:text-lg flex flex-col justify-center place-items-center items-center text-pretty gap-2">
      <div class="text-primary font-bold text-2xl md:text-4xl">Hi there!</div>
      <div class="w-full flex justify-center"><nuxt-img src="/images/misc/profile_picture.png" class="h-40 md:h-52 my-2 rounded-md" placeholder/></div>
      <div>I was born and raised in the south-east of England, obsessed with computers and games, not to mention loving my three cats. I've been a lifelong Sci-fi nerd with a keen interest for anything set a long time ago in a galaxy, far far away.</div>
      <div>I have just completed my Degree at Staffordshire University earning a MEng (Hons) Computer Games Design. Much of my time was spent learning and specialising in using Unreal Engine.</div>
      <div>For the last 10+ years I have been making mods for some of my favourite games, including Garry's Mod, Arma 3, Battlefront 2 and Satisfactory.</div>
      <div>Recently I've been working on some project in the VR VTuber community, as well as some other things you can find in my <NuxtLink to="/#Projects" class="text-secondary underline hover:text-white">Portfolio</NuxtLink>.</div>
      <div class="py-4 text-primary font-bold text-lg md:text-2xl">Feel free to <a href="mailto:contact@louismayes.xyz" class="underline text-secondary hover:text-white">message me</a>, I don't bite much, let's talk! :D</div>
    </div>
  </div>
</template>

<style scoped>

</style>