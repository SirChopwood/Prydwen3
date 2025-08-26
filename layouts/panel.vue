<script lang="ts">
import {defineComponent} from 'vue'
import ModalContainer from "~/components/rrm/panel/modal-container.vue";

export default defineComponent({
  name: "panel",
  components: {ModalContainer}
})
</script>

<template>
  <div id="Background" class="fixed top-0 bg-gradient-to-b from-neutral-950 to-neutral-800 w-screen h-screen -z-50">
    <!-- Background stuff here -->
  </div>
  <div class="relative min-h-screen flex flex-col text-white">
    <div id="Content" class="relative h-fit w-full">
      <slot />
    </div>
    <div class="grow min-h-2"></div>
    <page-footer name="Ramiris"/>
    <modal-container/>
  </div>
</template>

<style scoped>

</style>