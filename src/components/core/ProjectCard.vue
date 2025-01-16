<script lang="ts">
import {defineComponent, getCurrentInstance} from 'vue'
import ProjectTag from "./ProjectTag.vue";
import fm from "front-matter";

export default defineComponent({
  name: "ProjectCard",
  components: {ProjectTag},
  props: {
    title: String,
    link: String,
    thumbnail: String,
    projectLink: String,
  },
  mounted: async function() {
    if (this.projectLink) {
      const sourceLink = String("./../../"+this.projectLink+".md").replace("projects/","markdown/");
      const sourceFile = await fetch(sourceLink)
      const markdown = fm(await sourceFile.text());
      const data = markdown.attributes
      this.$refs.Thumbnail.src = data.thumbnail
      this.$refs.Link.href = this.projectLink
      this.$refs.Title.textContent = data.title
      this.$refs.Description.textContent = data.description
      this.$data.projectTags = data.tags
      // for (let tag of data.tags) {
      //   this.$refs.Tags.textContent += tag
      // }
    } else {
      this.$refs.Thumbnail.src = this.thumbnail
      this.$refs.Title.textContent = this.title
    }
  },
  data(vm) {
      return {
        projectTags: []
      }
  },
})
</script>

<template>
  <div v-if="link === undefined && projectLink=== undefined" ref="Link" class="relative flex flex-col max-w-80 min-h-40 text-pretty outline outline-0 rounded-md overflow-clip outline-neutral-700 hover:outline-2 bg-neutral-900 transition-all duration-100 ease-in-out">
    <div class="w-full h-40 object-cover overflow-hidden rounded-t-lg">
      <img ref="Thumbnail" class="w-full h-full">
    </div>

    <div ref="Title" class="text-xl border-b-2 border-b-secondary border-t-2 border-t-neutral-700 text-secondary font-bold px-2 mb-2 py-1 stripes"/>
    <div ref="Description" class="px-2"><slot/></div>
    <div ref="Tags" class="flex flex-row flex-wrap w-full h-fit p-2 grow items-end gap-2">
      <ProjectTag :tag="tag"  v-for="tag of projectTags"/>
    </div>
  </div>
  <a v-else ref="Link" class="relative flex flex-col max-w-80 min-h-40 text-pretty outline outline-0 rounded-md overflow-clip outline-primary hover:outline-2 bg-neutral-900 transition-all duration-100 ease-in-out">
    <div class="w-full h-40 object-cover overflow-hidden rounded-t-lg">
      <img ref="Thumbnail" class="w-full h-full">
    </div>

    <div ref="Title" class="text-xl border-b-2 border-b-secondary border-t-2 border-t-neutral-700 text-secondary font-bold px-2 mb-2 py-1 stripes"/>
    <div ref="Description" class="px-2"><slot/></div>
    <div ref="Tags" class="flex flex-row flex-wrap w-full h-fit p-2 grow items-end gap-2">
      <ProjectTag :tag="tag" v-for="tag of projectTags">{{tag}}</ProjectTag>
    </div>
  </a>
</template>