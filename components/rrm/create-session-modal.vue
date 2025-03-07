<script setup lang="ts">
import {VueFinalModal} from 'vue-final-modal'
import ControlButton from "~/components/rrm/control-button.vue";

const props = defineProps([
    "userSessionData",
    "moddedChannels"
])

const emit = defineEmits([
    "closeModal",
])
let submitButton = useTemplateRef("submitButton")

let selectedChannels = ref<Array<string>>([])
let owningChannel = ref("")
let additionalChannelOptions = ref<Array<{id: number, name: string}>>([])
watch(owningChannel, async (newChannel, oldChannel) => {
  if (props.moddedChannels) {
    additionalChannelOptions.value = props.moddedChannels.filter((v) => {
      return newChannel !== v.id
    })
  }
  selectedChannels.value = []
  await checkSubmissionValid()
})

let requestType = ref("")
watch(requestType, checkSubmissionValid)

let submissionValid = ref(false)
async function checkSubmissionValid() {
  if (submitButton.value) {
    if (owningChannel.value && requestType.value) {
      submissionValid.value = true
    } else {
      submissionValid.value = false
    }
  }
}

async function submit() {
  if (submissionValid) {
    let requestBody = {
      "user": props.userSessionData.display_name,
      "owner": props.moddedChannels.filter((v) => {
        return owningChannel.value === v.id
      })[0],
      "channels": props.moddedChannels.filter((v) => {
        return selectedChannels.value.includes(v.id)
      })
    }
    requestBody.owner.id = Number(requestBody.owner.id)
    for (let channel in requestBody.channels) {
      requestBody.channels[channel].id = Number(requestBody.channels[channel].id)
    }
    console.log(props.moddedChannels, props.userSessionData)
    let {data: newSession} = await useFetch("/api/v1/rrm/session/create", {
      method: "POST",
      body: requestBody,
    })
    if (newSession.value) {
      console.log("New Session Created", newSession.value)
    } else {
      console.log("Error", newSession)
    }
    emit('closeModal')
  } else {
    console.log("How did you even prompt this to enable?")
  }
}
</script>

<template>
  <VueFinalModal
      class="flex justify-center items-center"
      content-class="text-neutral-200 font-cabin bg-neutral-950 p-2 rounded-md flex flex-col w-1/3 min-h-1/2 h-fit"
  >
    <div class="rounded-t-md p-1 stripes text-xl text-secondary font-bold">
      <div class="">Create New RRM Session</div>
    </div>
    <div class="bg-neutral-900 rounded-b-md p-1 flex flex-col gap-2">
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Owning Channel</div>
        <select class="grow bg-neutral-800 px-2 py-1 rounded-sm text-secondary hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150" v-model="owningChannel">
          <option v-for="channel of props.moddedChannels" class="text-neutral-400 bg-neutral-900" :value="channel.id">{{channel.name}}</option>
        </select>
      </div>
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Additional Channels</div>
        <div class="grow bg-neutral-800 p-1 rounded-sm flex flex-col h-32">
          <label v-for="channel of additionalChannelOptions" class="hover:bg-neutral-700 rounded-sm px-1 flex flex-row">
            <input type="checkbox" :value="channel.id" v-model="selectedChannels" class="peer size-0 opacity-0" @change="console.log(selectedChannels)">
            <icon name="mdi:close-thick" class="size-6 collapse peer-checked:visible text-secondary align-middle"/>
            <icon name="mdi:plus-thick" class="size-6 peer-checked:hidden align-middle"/>
            <span class="peer-checked:text-secondary">{{channel.name}}</span>
          </label>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Request Type</div>
        <select class="grow bg-neutral-800 px-2 py-1 rounded-sm text-secondary hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150" v-model="requestType">
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" selected>[VRC] PyPy Dance World</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>[VRC] VRDancing World</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>YouTube</option>
          <option class="text-neutral-400 bg-neutral-900" value="PyPy" disabled>Plain Text</option>
        </select>
      </div>
    </div>
    <div class="bg-neutral-900 rounded-b-md py-1 px-2 stripes flex flex-row justify-between">
      <control-button icon="mdi:close-box-outline" colour="Blue" @button-clicked="emit('closeModal')">Close</control-button>
      <div class="grow"/>
      <control-button ref="submitButton" icon="mdi:send-check" colour="Green" @button-clicked="submit" :disabled="!submissionValid">Submit</control-button>
    </div>

  </VueFinalModal>
</template>

<style scoped>

</style>