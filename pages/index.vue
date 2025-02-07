<script setup lang="ts">
  const { data: sortedProjects } = await useAsyncData("projects", () => {
    // Order ensures projects are loaded in date order, else its alphabetical
    return queryCollection("projects").order("timestamp", "DESC").all()
  })
  useHead({
    title: "Home"
  })
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Home",
  components: {},
  methods: {
    async testClick() {
      const body = await useFetch("/api/123/abc", {
        method: "POST",
        body: {
          "hello": "world"
        }
      })
      console.log(body)
      let { data: result } = await useFetch("/api/rrm/session/fetch", {
        method: "POST",
        body: {
          "channel": {"id": "11374265", "name": "Ramiiii~"}
        }
      })
      console.log(result)
      this.$refs.testBox.innerText = JSON.stringify(result, undefined, 2)
    }
  },
  async mounted() {
  }
})
</script>

<template>
  <div id="Home" class="flex flex-col mx-20 mt-20 items-center gap-12">
    <div ref="WelcomeText" class="font-jetbrains text-8xl text-white flex flex-col gap-4 my-20 bg-neutral-950 px-12 py-4">
      <div class="">Hello there. </div>
      <div class="">Welcome! </div>
      <div class="pl-24 w-fit">...<span class="text-neutral-950 bg-primary">I'm Louis</span><span class="animation-blinker">_</span></div>
    </div>

    <button @click="testClick" class="bg-red-700 text-red-400 p-2 text-2xl">TEST</button>
    <div ref="testBox" class="w-full min-h-40 bg-gray-400 font-thin text-black rounded-lg border-2 border-black">

    </div>

    <div ref="SkillTable" class="w-full" >
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> What I do <span class="animation-blinker">_</span></div>
      <div class="flex flex-row justify-center gap-4">
        <skill-card title="Unreal Engine" icon="file-icons:unrealscript">Extremely proficient in blueprinting. Including Replication, Interfaces, Components and more.</skill-card>
        <skill-card title="Blender & Substance Painter" icon="file-icons:blender">Experienced with the 3D asset pipeline, High/Low Poly baking, Rigging, Texturing etc.</skill-card>
        <skill-card title="VCS & Web" icon="mdi:git">Actively learning Version Control Software and Web Development.</skill-card>
      </div>
    </div>
    <div ref="Projects" id="Projects" class="w-full">
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> My projects <span class="animation-blinker">_</span></div>
      <div class="flex flex-col justify-center items-center gap-4">
        <banner-image ref="FeaturedProject" class="w-2/3" image="/images/projects/nebula_chat/day2_config.png" link="/projects/nebula_chat" title="Newly Featured">
          <span class="text-secondary font-bold text-xl">Nebula Chat System</span>  - A recreation of the advanced chat system found in Space Station 13, including telecommunications.
        </banner-image>
        <div ref="ProjectTable" class="flex flex-row  justify-center gap-4 flex-wrap mt-4">
          <projects-card v-for="project in sortedProjects"
                         :title="project.title"
                         :description="project.description"
                         :link="project.path"
                         :thumbnail="project.thumbnail"
                         :project-tags="project.tags"
          />
          <projects-card title="Ramiris' Heresy" thumbnail="/images/projects/external/ramiris_heresy.png" link="https://steamcommunity.com/sharedfiles/filedetails/?id=2167631151">Custom Warhammer 40k Weapons and armour for Arma 3</projects-card>
          <projects-card title="FLAGS Mod" thumbnail="/images/projects/external/flags_mod.png" link="https://ficsit.app/mod/XLuK6Ci158x4G">Functionally Lacking And Great Style - Satisfactory Modding</projects-card>
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