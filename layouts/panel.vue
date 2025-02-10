<script lang="ts">
import {defineComponent} from 'vue'
import {ModalsContainer} from "vue-final-modal";

export default defineComponent({
  name: "panel",
  components: {ModalsContainer}
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-white">
    <div id="Content" class="relative h-fit w-full">
      <slot />
    </div>
    <div class="grow min-h-2"></div>
    <page-footer name="Ramiris"/>
    <ModalsContainer/>
  </div>
</template>

<style scoped>

</style>