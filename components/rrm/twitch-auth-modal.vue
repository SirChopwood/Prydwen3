<script setup lang="ts">
import {useModal, VueFinalModal} from 'vue-final-modal'
import ControlButton from "~/components/rrm/control-button.vue";

const props = defineProps([
    "userSessionData"
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
    <div class="bg-neutral-900 rounded-b-md p-1 flex flex-col">
      <table v-if="userSessionData">
        <tbody>
          <tr>
            <td class="py-1 text-right pr-2">Display Name</td>
            <td><span class="codeblock size-fit">{{userSessionData.display_name}}</span></td>
          </tr>
          <tr>
            <td class="py-1 text-right pr-2">Profile Picture</td>
            <td><nuxt-img :src="userSessionData.profile_image_url" class="size-12 rounded-sm" placeholder/></td>
          </tr>
          <tr>
            <td class="py-1 text-right pr-2">ID</td>
            <td><span class="codeblock size-fit">{{userSessionData.id}}</span></td>
          </tr>
          <tr>
            <td class="py-1 text-right pr-2">Creation Date</td>
            <td>
              <span class="codeblock size-fit">{{userSessionData.created_at.split("T")[0]}}</span>
            at
              <span class="codeblock size-fit">{{userSessionData.created_at.split("T")[1].replace("Z","")}}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        Please login to Twitch to see your account details.
      </div>
    </div>
    <div class="bg-neutral-900 rounded-b-md py-1 px-2 stripes flex flex-row justify-between">
      <control-button icon="mdi:close-box-outline" colour="Blue" @button-clicked="emit('closeModal')">Close</control-button>
      <div class="grow"/>
      <control-button icon="mdi:logout" colour="Red" @button-clicked="emit('logout')" :disabled="!userSessionData">Log out</control-button>
      <control-button icon="mdi:twitch" colour="Purple" @button-clicked="emit('login')" :disabled="userSessionData">Log in to Twitch</control-button>
    </div>

  </VueFinalModal>
</template>

<style scoped>

</style>