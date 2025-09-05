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

function login() {
  navigateTo('/api/v1/rrm/twitch/auth', {external: true})
}

function logout() {
  if (props.modalManager.requestManager.getUserSessionValid) {
    props.modalManager.requestManager.clearUserSession()
  }
}

let userSessionData = props.modalManager.requestManager.getUserSession?.user
</script>

<template>
  <modal-template title="Twitch Account Link" :name="name" :modal-manager="modalManager" >
    <table v-if="modalManager.requestManager.getUserSessionValid">
      <tbody>
      <tr>
        <td class="py-1 text-right pr-2">Display Name</td>
        <td><span class="codeblock size-fit">{{userSessionData!.display_name}}</span></td>
      </tr>
      <tr>
        <td class="py-1 text-right pr-2">Profile Picture</td>
        <td><nuxt-img :src="userSessionData!.profile_image_url" class="size-12 rounded-sm" placeholder/></td>
      </tr>
      <tr>
        <td class="py-1 text-right pr-2">ID</td>
        <td><span class="codeblock size-fit">{{userSessionData!.id}}</span></td>
      </tr>
      <tr>
        <td class="py-1 text-right pr-2">Creation Date</td>
        <td>
          <span class="codeblock size-fit">{{userSessionData!.created_at.split("T")[0]}}</span>
          at
          <span class="codeblock size-fit">{{userSessionData!.created_at.split("T")[1].replace("Z","")}}</span>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-else>
      Please login to Twitch to see your account details.
    </div>
    <template v-slot:footer>
      <control-button icon="mdi:logout" colour="Blue" @button-clicked="logout" :disabled="!userSessionData">Log out</control-button>
      <control-button icon="mdi:twitch" colour="Purple" @button-clicked="login" :disabled="userSessionData">Log in to Twitch</control-button>
    </template>
  </modal-template>
</template>

<style scoped>

</style>