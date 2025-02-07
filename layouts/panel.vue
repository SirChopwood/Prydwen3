<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "panel"
})
</script>

<template>
  <div class="min-h-screen h-fit relative flex flex-col gap-20 text-white">
    <div id="Content" class="relative h-fit w-full grow">
      <slot />
    </div>
    <page-footer name="Ramiris"/>
  </div>
</template>

<style scoped>

</style>