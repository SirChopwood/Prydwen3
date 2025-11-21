<script setup lang="ts">
  useHead({
    title: "Home"
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
  const { data: sortedProjects } = await useAsyncData("projects", () => {
    // Order ensures projects are loaded in date order, else its alphabetical
    return queryCollection('projects')
        .where('hidden', "=", 'false')
        .order('timestamp', 'DESC')
        .all()
  })
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Home",
  components: {},
  methods: {},
  async mounted() {}
})
</script>

<template>
  <div id="Home" class="flex flex-col mx-4 md:mx-20 mt-4 md:mt-20 items-center gap-12">

    <div ref="WelcomeText" class="font-jetbrains text-2xl md:text-6xl text-white flex flex-col gap-0 md:gap-2 my-20 bg-neutral-950 px-4 md:px-10 py-0 md:py-2">
      <div class="">Hello there. </div>
      <div class="">Welcome! </div>
      <div class="pl-24 w-fit">...<span class="text-neutral-950 bg-primary">I'm Louis</span><span class="animation-blinker">_</span></div>
    </div>

    <div ref="DoSkillTable" class="w-full">
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> What I do <span class="animation-blinker">_</span></div>
      <div class="flex flex-row flex-wrap justify-center gap-4">
        <skill-card title="Game Development" icon="mdi:gamepad-variant">Designing and prototyping game features. Working in existing game engines to create user facing features.</skill-card>
        <skill-card title="Technical Art" icon="mdi:palette">Creating visual elements as well as improving the development experience for artists and coders in various fields including games.</skill-card>
      </div>
    </div>

    <div ref="UseSkillTable" class="w-full">
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> What I use <span class="animation-blinker">_</span></div>
      <div class="flex flex-row flex-wrap justify-center gap-4">
        <skill-card title="Unreal Engine" icon="file-icons:unrealscript">Extremely proficient in using Unreal & blueprinting. Including Replication, Interfaces and Components.</skill-card>
        <skill-card title="Programming Languages" icon="material-symbols:terminal">Able to dig in to whatever languages are required, with history using Lua, Python, C#, HTML/CSS/JS and more.</skill-card>
        <skill-card title="3D Asset Pipeline" icon="file-icons:blender">Experienced with tools such as Blender and Substance Painter, using High/Low Poly baking, Rigging, Texturing etc.</skill-card>
        <skill-card title="VCS & Management" icon="mdi:git">Proven knowledge of version control software for both small and large scale projects and documentation tools like Jira and Confluence.</skill-card>
      </div>
    </div>

    <div ref="Projects" id="Projects" class="w-full">
      <div class="font-jetbrains text-2xl text-white mb-2 bg-neutral-950 w-fit py-1 px-4">> My projects <span class="animation-blinker">_</span></div>
      <div class="flex flex-col justify-center items-center gap-4">
        <div ref="ProjectTable" class="flex flex-row  justify-center gap-4 flex-wrap mt-4">
          <projects-card v-for="project in sortedProjects"
                         :title="project.title"
                         :description="project.description"
                         :link="project.path"
                         :thumbnail="project.thumbnail"
                         :project-tags="project.tags"
          />
          <projects-card title="Rami's Request Manager"
                         thumbnail="/images/projects/external/rrm.png"
                         link="/rrm"
                         :project-tags="['External Link', 'Open Source', 'Solo', 'JS/Node']">
            A twitch panel and overlay for managing chat based interaction, such as song requests for DJs.
          </projects-card>
          <projects-card title="Ramiris' Heresy"
                         thumbnail="/images/projects/external/ramiris_heresy.png"
                         link="https://steamcommunity.com/sharedfiles/filedetails/?id=2167631151"
                         :project-tags="['External Link', 'Solo']">
            Custom Warhammer 40k Weapons and armour for Arma 3
          </projects-card>
          <projects-card title="FLAGS Mod"
                         thumbnail="/images/projects/external/flags_mod.png"
                         link="https://ficsit.app/mod/XLuK6Ci158x4G"
                         :project-tags="['External Link', 'Unreal Engine', 'Modelling', 'Solo']">
            Functionally Lacking And Great Style - Satisfactory Modding
          </projects-card>
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
