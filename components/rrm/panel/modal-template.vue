<script setup lang="ts">
import ControlButton from "~/components/rrm/panel/control-button.vue";
const props = defineProps({
  title: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  modalManager: {
    type: Object as PropType<ModalManager>,
    default: {},
    required: true
  }
})
</script>

<template>
  <div class="text-neutral-200 font-cabin bg-neutral-950 p-2 rounded-md flex flex-col w-full h-full">
    <div class="rounded-t-md p-1 stripes text-xl text-secondary font-bold">
      <div class="">{{title}}</div>
    </div>
    <div class="bg-neutral-900 rounded-b-md p-1 flex flex-col">
      <slot name="default"/>
    </div>
    <div class="bg-neutral-900 rounded-b-md py-1 px-2 stripes flex flex-row justify-between">
      <control-button icon="mdi:close-box-outline" colour="Red" @button-clicked="() => {modalManager.hideModal(name)}">Close</control-button>
      <div class="grow"/>
      <slot name="footer"/>
    </div>
  </div>
</template>

<style scoped>

</style>