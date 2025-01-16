<script lang="ts">
import {defineComponent} from 'vue'
import SkillCard from "../core/SkillCard.vue";
import BannerImage from "../core/BannerImage.vue";
import ProjectCard from "../core/ProjectCard.vue";

export default defineComponent({
  name: "Home",
  components: {ProjectCard, BannerImage, SkillCard}
})
</script>

<template>
  <div id="Home" class="flex flex-col mx-20 mt-20 items-center gap-12">
    <div ref="WelcomeText" class="font-jetbrains text-8xl text-white flex flex-col gap-4 my-20 bg-neutral-950 px-12 py-4">
      <div class="">Hello there. </div>
      <div class="">Welcome! </div>
      <div class="pl-24 w-fit">...<span class="text-neutral-950 bg-primary">I'm Louis</span><span class="animation-blinker">_</span></div>
    </div>
    <div ref="SkillTable" class="w-full" >
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> What I do <span class="animation-blinker">_</span></div>
      <div class="flex flex-row justify-center gap-4">
        <SkillCard title="Unreal Engine" icon="/images/UnrealLogo.png">Extremely proficient in blueprinting. Including Replication, Interfaces, Components and more.</SkillCard>
        <SkillCard title="Blender & Substance Painter" icon="/images/BlenderLogo.png">Experienced with the 3D asset pipeline, High/Low Poly baking, Rigging, Texturing etc.</SkillCard>
        <SkillCard title="VCS & Web" icon="/images/GitLogo.png">Actively learning Version Control Software and Web Development.</SkillCard>
      </div>
    </div>
    <div ref="Projects" id="Projects" class="w-full">
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> My projects <span class="animation-blinker">_</span></div>
      <div class="flex flex-col justify-center items-center gap-4">
        <BannerImage ref="FeaturedProject" class="w-2/3" image="/images/agm/tempbg.png" link="/projects/nebula" title="Newly Featured">
          <span class="text-secondary font-bold text-xl">Nebula Chat System</span>  - A recreation of the advanced chat system found in Space Station 13, including telecommunications.
        </BannerImage>
        <div ref="ProjectTable" class="flex flex-row justify-center gap-4 flex-wrap mt-4">
          <ProjectCard projectLink="projects/nebula"/>
          <ProjectCard projectLink="projects/dvz"/>
          <ProjectCard projectLink="projects/agm"/>
          <ProjectCard title="Munitions Officer Simulator" thumbnail="/images/mos/SplashScreen.png" >
            A dive into game feel and polish in the context of a Munitions Officer on a starship.
          </ProjectCard>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animation-blinker {
  animation: blinker 1.5s step-start infinite;
}

@keyframes blinker {
  50% {
   opacity: 0;
  }
}
</style>