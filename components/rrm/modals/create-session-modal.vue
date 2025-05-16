<script setup lang="ts">
import ModalTemplate from "~/components/rrm/modal-template.vue";
import ControlButton from "~/components/rrm/control-button.vue";

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

let submissionValid = false
let owningChannel = ref("")
let selectedSources = ref<Array<string>>([])
let selectedChannels = ref<Array<string>>([])
let requestType = ref("")
</script>

<template>
  <modal-template title="Create New RRM Session" :name="name" :modal-manager="modalManager" >
    <div class="bg-neutral-900 rounded-b-md p-1 flex flex-col gap-2">
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Owning Channel</div>
        <select class="grow bg-neutral-800 px-2 py-1 rounded-sm text-secondary hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150" v-model="owningChannel">
          <option v-for="channel of props.modalManager.requestManager.getModdedChannels" class="text-neutral-400 bg-neutral-900" :value="channel.id">{{channel.name}}</option>
        </select>
      </div>
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Additional Channels</div>
        <div class="grow bg-neutral-800 p-1 rounded-sm flex flex-col h-32">
<!--          <label v-for="channel of additionalChannelOptions" class="hover:bg-neutral-700 rounded-sm px-1 flex flex-row">-->
<!--            <input type="checkbox" :value="channel.id" v-model="selectedChannels" class="peer size-0 opacity-0" @change="console.log(selectedChannels)">-->
<!--            <icon name="mdi:close-thick" class="size-6 collapse peer-checked:visible text-secondary align-middle"/>-->
<!--            <icon name="mdi:plus-thick" class="size-6 peer-checked:hidden align-middle"/>-->
<!--            <span class="peer-checked:text-secondary">{{channel.name}}</span>-->
<!--          </label>-->
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Request Type</div>
        <select ref="sourceSelect" class="grow bg-neutral-800 px-2 py-1 rounded-sm text-secondary hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150" v-model="requestType">
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" selected>[VRC] PyPy Dance World</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>[VRC] VRDancing World</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>YouTube</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>Plain Text</option>
        </select>
      </div>
    </div>








    <template v-slot:footer>
      <control-button ref="submitButton" icon="mdi:send-check" colour="Green" :disabled="!submissionValid">Submit</control-button>
    </template>
  </modal-template>
</template>

<style scoped>

</style>