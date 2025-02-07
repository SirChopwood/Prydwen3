<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "default"
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-white">
    <page-header/>
    <div id="Content" class="relative h-fit w-full">
      <div ref="headerBlocker" v-if="!$route.meta.header" class="h-20"/>
      <slot />
    </div>
    <div class="grow min-h-2"></div>
    <page-footer name="Louis Mayes"/>
  </div>
</template>

<style scoped>

</style>