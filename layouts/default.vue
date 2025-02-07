<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "default"
})
</script>

<template>
  <div class="min-h-screen h-fit relative flex flex-col gap-20 text-white">
    <page-header/>
    <div id="Content" class="relative h-fit w-full grow">
      <div ref="headerBlocker" v-if="!$route.meta.header" class="h-20"/>
      <slot />
    </div>
    <page-footer name="Louis Mayes"/>
  </div>
</template>

<style scoped>

</style>