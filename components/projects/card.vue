<!--suppress HtmlUnknownTarget -->
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "card",
  components: {},
  props: {
    "title": String,
    "link": String,
    "thumbnail": String,
    "description": String,
    "projectTags": Array<string>,
  },
  mounted() {
    if (this.projectTags) {
      this.$data.compiledTags = this.projectTags.sort()
    } else {
      this.$data.compiledTags = ["External Link"]
    }
  },
  data() {
    return {
      compiledTags: [] as Array<string>
    }
  },
})
</script>

<template>
  <NuxtLink :to="link" class="relative flex flex-col max-w-80 min-h-40 text-pretty outline outline-0 rounded-md overflow-clip outline-primary hover:outline-2 hover:-translate-y-2 hover:scale-110 hover:z-10 bg-neutral-900 transition-all duration-200 ease-in-out">
    <div class="w-full h-40 object-cover overflow-hidden rounded-t-lg">
      <nuxt-img class="w-full h-full" :src="thumbnail" placeholder/>
    </div>

    <div class="text-xl border-b-2 border-b-secondary border-t-2 border-t-neutral-700 text-secondary font-bold px-2 mb-2 py-1 stripes">{{title}}</div>
    <div class="px-2"><span v-if="description">{{description}}</span><slot/></div>
    <div class="flex flex-row flex-wrap w-full h-fit p-2 grow items-end gap-2 content-end ">
      <projects-tag :tag="tag" v-for="tag of compiledTags">{{tag}}</projects-tag>
    </div>
  </NuxtLink>
</template>

<style scoped>

</style>