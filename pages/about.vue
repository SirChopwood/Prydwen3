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
    <div class="w-fit">
      <div class="pt-4 text-primary font-bold text-3xl">Hi there!</div>
      <div class="w-full flex justify-center"><nuxt-img src="/images/misc/profile_picture.png" class="h-40 md:h-52 my-2 rounded-md" placeholder/></div>
      <br>
      I was born and raised in the south-east of England, obsessed with computers and games.
      <br>
      Not to mention loving my three cats.
      <br>
      I've been a lifelong Sci-fi nerd with a keen interest for anything set a long time ago in a galaxy, far far away.
      <br><br>
      I have just completed my Degree at Staffordshire University earning a MEng (Hons) Computer Games Design.
      <br>
      Much of my time was spent learning and specialising in using Unreal Engine.
      <br><br>
      For the last 10+ years I have been making mods for some of my favourite games,
      <br>
      including Garry's Mod, Arma 3, Battlefront 2 and Satisfactory.
      <br><br>
      Recently I've made a name for myself in the VRC VTubing scene.
      <br>
      Making friends and sharing experiences in worlds we can all create.
      <br><br>
      <div class="py-4 text-primary font-bold text-2xl">Feel free to <a href="mailto:contact@louismayes.xyz" class="underline hover:text-white">message me</a>, I don't bite much, let's talk! :D</div>
    </div>
  </div>
</template>

<style scoped>

</style>