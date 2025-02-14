<script setup lang="ts">
import {useModal, VueFinalModal} from 'vue-final-modal'
import ControlButton from "~/components/rrm/control-button.vue";

const props = defineProps([
    "userSessionData",
    "sessionData"
])

const emit = defineEmits([
    "closeModal",
    "requestCreated",
])

let codeTextInput = useTemplateRef("CodeTextInput")

let submitButton = useTemplateRef("submitButton")
let submissionValid = ref(false)
async function checkSubmissionValid() {
  if (submitButton.value && codeTextInput.value) {
    if (codeTextInput.value.value !== "") {
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
      "request": codeTextInput.value!.value,
      "session": Number(props.sessionData.id),
      "forceAdd": true
    }
    let {data: newRequest} = await useFetch("/api/rrm/request/create", {
      method: "POST",
      body: requestBody,
    })
    console.log("New Request Created", newRequest.value)
    emit("requestCreated")
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
      <div class="">Add Request</div>
    </div>
    <div class="bg-neutral-900 rounded-b-md p-1 flex flex-col gap-2">
      <div class="flex flex-row w-full">
        <div class="basis-1/4">Request Code</div>
        <input ref="CodeTextInput" class="grow self-center h-fit top-1/2 bg-neutral-800 px-2 py-0 rounded-sm text-secondary hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150" placeholder="URL / Song ID / Text Message etc..." @input="checkSubmissionValid">
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