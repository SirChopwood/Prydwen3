<script lang="ts">
import {defineComponent} from 'vue'

const Tags = {
  "Solo": "red", //  `<div class="bg-red-950 hover:bg-red-900 outline-red-600 text-red-100">`
  "Unreal Engine": "blue", //  `<div class="bg-blue-950 hover:bg-blue-900 outline-blue-600 text-blue-100">`
  "Open Source": "pink", //  `<div class="bg-pink-950 hover:bg-pink-900 outline-pink-600 text-pink-100">`
  "Teamwork": "teal", //  `<div class="bg-teal-950 hover:bg-teal-900 outline-teal-600 text-teal-100">`
  "Modelling": "orange", //  `<div class="bg-orange-950 hover:bg-orange-900 outline-orange-600 text-orange-100">`
  "JS/Node": "green", //  `<div class="bg-green-950 hover:bg-green-900 outline-green-600 text-green-100">`
  "Godot": "sky", //  `<div class="bg-sky-950 hover:bg-sky-900 outline-sky-600 text-sky-100">`
  "C#": "fuchsia", //  `<div class="bg-fuchsia-950 hover:bg-fuchsia-900 outline-fuchsia-600 text-fuchsia-100">`
  "Work-In-Progress": "yellow", //  `<div class="bg-yellow-950 hover:bg-yellow-900 outline-yellow-600 text-yellow-100">`
  "External Link": "purple", //  `<div class="bg-purple-950 hover:bg-purple-900 outline-purple-600 text-purple-100">`
}

export default defineComponent({
  name: "tag",
  props: {
    tag: String
  },
  mounted() {
    if (Tags[this.tag]) {
      let colour = Tags[this.tag]
      this.$refs.Tag.textContent = this.tag
      this.$refs.Tag.classList.replace(`bg-neutral-950`,`bg-${colour}-950`)
      this.$refs.Tag.classList.replace(`hover:bg-neutral-900`,`hover:bg-${colour}-900`)
      this.$refs.Tag.classList.replace(`outline-neutral-600`,`outline-${colour}-600`)
      this.$refs.Tag.classList.replace(`text-neutral-100`,`text-${colour}-100`)
    }
  },
})
</script>

<template>
  <div ref="Tag" class="bg-neutral-950 hover:bg-neutral-900 outline outline-1 outline-neutral-600 text-neutral-100 rounded-md px-2 text-sm h-fit w-fit">
    <slot/>
  </div>
</template>

<style scoped>

</style>