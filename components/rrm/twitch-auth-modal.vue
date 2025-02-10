<script setup lang="ts">
import {useModal, VueFinalModal} from 'vue-final-modal'
import ControlButton from "~/components/rrm/control-button.vue";

const props = defineProps([
    "sessionData"
])

const emit = defineEmits([
    "closeModal",
    "login",
    "logout"
])

</script>

<template>
  <VueFinalModal
      class="flex justify-center items-center"
      content-class="text-neutral-200 font-cabin bg-neutral-950 p-2 rounded-md flex flex-col w-1/3 min-h-1/2 h-fit"
  >
    <div class="rounded-t-md p-1 stripes text-xl text-secondary font-bold">
      <div class="">Twitch Account Link</div>
    </div>
    <div class="bg-neutral-900 rounded-b-md p-1">
      Username: <div class="codeblock w-fit inline">{{sessionData ? sessionData.display_name : "N/A"}}</div>
      <div class="">Profile Picture:
        <nuxt-img v-if="sessionData" :src="sessionData.profile_image_url" class="size-12 rounded-sm inline-block" placeholder/>
        <icon v-if="!sessionData" name="mdi:twitch" class="size-12 align-middle inline-block text-neutral-700"/>
      </div>
    </div>
    <div class="bg-neutral-900 rounded-b-md py-1 px-2 stripes flex flex-row justify-between">
      <control-button icon="mdi:close-box-outline" colour="Blue" @button-clicked="emit('closeModal')">Close</control-button>
      <div class="grow"/>
      <control-button icon="mdi:logout" colour="Red" @button-clicked="emit('logout')">Log out</control-button>
      <control-button icon="mdi:twitch" colour="Purple" @button-clicked="emit('login')">Log in to Twitch</control-button>
    </div>

  </VueFinalModal>
</template>

<style scoped>

</style>