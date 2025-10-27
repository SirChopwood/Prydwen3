<script setup lang="ts">
import ModalTemplate from "~/components/rrm/panel/modal-template.vue";
import ControlButton from "~/components/rrm/panel/control-button.vue";
import NewMultiselect from "~/components/rrm/panel/new-multiselect.vue";

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

let submissionValid = computed(() => {
  return Boolean(selectedTypes.value.length > 0
      && owningChannel.value)
})
let owningChannel: Ref<number | null> = ref(null)
function getOwningChannel() {
  return props.modalManager.requestManager.getModdedChannels!.filter((channel) => {
    return channel.id === owningChannel.value
  })[0]
}

// REQUEST TYPE
let selectedRequestTypes = ref<Record<string, boolean>>({})
const requestTypeOptions = [
  {label: "[VRC] PyPy Dance World", value: "PyPy"},
  {label: "[VRC] VRDancing World (NOT IMPLEMENTED)", value: "VRDancing"},
  {label: "YouTube Links", value: "YouTube"},
  {label: "Plain Text", value: "PlainText"},
]
// convert true/false to list of types
let selectedTypes = computed(() => {
  let newList: Array<String> = []
  Object.keys(selectedRequestTypes.value).forEach(type => {
    if (selectedRequestTypes.value[type]) {
      newList.push(type)
    }
  })

  return newList
})

// ADDITIONAL CHANNELS
let selectedChannelIds = ref<Record<string, boolean>>({})
// get options for select
let additionalChannelOptions = computed(() => {
  let newList: Array<{label: string, value: string}> = []
  if (owningChannel) {
    props.modalManager.requestManager.getModdedChannels?.forEach((channel) => {
      if (!(channel.id === owningChannel.value)) {
        newList.push({label: channel.name, value: String(channel.id)})
      }
    })
  }
  return newList
})
// Reset list if owner changed
watch(owningChannel, async (newChannel) => {
  Object.keys(selectedChannelIds.value).forEach(channelId => {
    selectedChannelIds.value[channelId] = false
  })
})
// convert true/false list to list of channels
let selectedChannels = computed(() => {
  return props.modalManager.requestManager.getModdedChannels!.filter((channel) => {
    return (Object.keys(selectedChannelIds.value).includes(String(channel.id)))
        && (selectedChannelIds.value[String(channel.id)])
        && (channel.id !== owningChannel.value)
  })
})

async function submit() {
  if (submissionValid) {
    let requestBody = {
      "user": props.modalManager.requestManager.hostName.value,
      "owner": getOwningChannel(),
      "channels": selectedChannels.value,
      "sources": selectedTypes.value
    }
    let {data: newSession} = await useFetch("/api/v1/rrm/session/create", {
      method: "POST",
      body: requestBody,
    })
    if (newSession.value) {
      console.log("New Session Created", newSession.value)
      await props.modalManager.requestManager.refreshSessions(true)
    } else {
      console.log("Error", newSession)
    }

    await props.modalManager.hideModal(props.name)
  } else {
    console.log("How did you even prompt this to enable?")
  }
}
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
        <new-multiselect :options="additionalChannelOptions" v-model="selectedChannelIds"/>
      </div>
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Request Types</div>
        <new-multiselect :options="requestTypeOptions" v-model="selectedRequestTypes"/>
      </div>
    </div>
    <template v-slot:footer>
      <control-button icon="mdi:send-check" colour="Green" @button-clicked="submit" :disabled="!submissionValid">Submit</control-button>
    </template>
  </modal-template>
</template>

<style scoped>

</style>