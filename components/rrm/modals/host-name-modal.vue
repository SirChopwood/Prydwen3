<script setup lang="ts">
import ModalTemplate from "~/components/rrm/panel/modal-template.vue";
import ControlButton from "~/components/rrm/panel/control-button.vue";

const props = defineProps({
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

let hostName = ref("")
if (props.modalManager.requestManager.hostName) {
  hostName.value = props.modalManager.requestManager.hostName.value
}

async function submit() {
  props.modalManager.requestManager.hostName.value = hostName.value
  await props.modalManager.hideModal(props.name)
}
</script>

<template>
  <modal-template title="Set Host Name" :name="name" :modal-manager="modalManager" >
    This will be saved between sessions locally and can be changed at any time.
    <input type="text" v-model="hostName" class="w-full rounded-md bg-neutral-950 p-2 border-2 border-opacity-0 focus:border-opacity-100 border-neutral-700 !outline-none" placeholder="Enter how you want to appear here."/>
    <template v-slot:footer>
      <control-button icon="mdi:send-check" colour="Green" @button-clicked="submit" :disabled='hostName === ""'>Submit</control-button>
    </template>
  </modal-template>
</template>

<style scoped>

</style>