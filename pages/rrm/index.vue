<script setup lang="ts">
import ToolbarButton from "~/components/rrm/toolbar-button.vue";
import ControlCategory from "~/components/rrm/control-category.vue";
import ControlButton from "~/components/rrm/control-button.vue";
import RequestItem from "~/components/rrm/request-item.vue";
import {useRequestManager} from "~/composables/rrm";
import NewSelect from "~/components/rrm/new-select.vue";
import {useModalManager} from "#imports";
import CreateSessionModal from "~/components/rrm/modals/create-session-modal.vue";
import TwitchAuthModal from "~/components/rrm/modals/twitch-auth-modal.vue";

useHead({
  title: "Rami Request Manager",
  titleTemplate: "%s",
  script: [{src: "https://player.twitch.tv/js/embed/v1.js"}]
})
definePageMeta({
  title: "Rami Request Manager",
  layout: "panel"
})
useSeoMeta({
  title: "Rami Request Manager",
  ogTitle: "Rami Request Manager",
  description: "A twitch panel and overlay for managing chat based interaction, such as song requests for DJs.",
  ogDescription: "A twitch panel and overlay for managing chat based interaction, such as song requests for DJs.",
  ogImage: `https://louismayes.xyz/images/projects/external/rrm.png`,
  twitterImage: `https://louismayes.xyz/images/projects/external/rrm.png`,
  twitterCard: 'summary_large_image',
  author: "Ramiris"
})

let twitchPlayer: any;
let RamiRequestManager = useRequestManager()
let modalManager = useModalManager(RamiRequestManager)

onMounted(async () => {
  await RamiRequestManager.onMounted()
  await modalManager.onMounted()
})
//
// const { open: openAuthModal, close: closeAuthModal } = useModal({
//   component: TwitchAuthModal,
//   attrs: {
//     userSessionData: RamiRequestManager.getUserProfile,
//     onCloseModal() {
//       closeAuthModal()
//     },
//     onLogin() {
//       if (!RamiRequestManager.getUserSessionValid) {
//         navigateTo('/api/v1/rrm/twitch/auth', {external: true})
//       }
//     },
//     onLogout() {
//       if (RamiRequestManager.getUserSessionValid) {
//         RamiRequestManager.clearUserSession()
//       }
//     }
//   },
// })
//
// const { open: openCreateSessionModal, close: closeCreateSessionModal } = useModal({
//   component: CreateSessionModal,
//   attrs: {
//     userSessionData: RamiRequestManager.getUserProfile,
//     moddedChannels: RamiRequestManager.getModdedChannels,
//     onCloseModal() {
//       closeCreateSessionModal()
//     }
//   },
// })
//
// async function openCreateRequestModalWithContext() {
//   patchCreateRequestModal({
//     attrs: {
//       userSessionData: RamiRequestManager.getUserProfile,
//       sessionData: RamiRequestManager.getCurrentSession,
//     }
//   })
//   RamiRequestManager.refreshTimerPaused.value = true
//   await openCreateRequestModal()
// }
// const { open: openCreateRequestModal, close: closeCreateRequestModal, patchOptions: patchCreateRequestModal } = useModal({
//   component: CreateRequestModal,
//   attrs: {
//     userSessionData: RamiRequestManager.getUserProfile,
//     sessionData: RamiRequestManager.getCurrentSession,
//     onCloseModal() {
//       RamiRequestManager.refreshTimerPaused.value = false
//       closeCreateRequestModal()
//     },
//     async onRequestCreated() {
//       //await RamiRequestManager.refreshSessions()
//       await closeCreateSessionModal()
//     }
//   },
// })

async function onChannelSelected(selection: string) {
  if (selection === "No Stream") {
    console.log(`Channel selection cleared.`)
  } else {
    console.log(`Channel ${selection} selected.`)
    if (twitchPlayer) {
      twitchPlayer.setChannel(selection)
    } else {
      let TwitchOptions = {
        width: "100%",
        height: window.screen.height * 0.6,
        channel: selection,
        autoplay: true,
        muted: true,
        parent: ["louismayes.xyz", "localhost"]
      };
      // @ts-ignore
      twitchPlayer = new Twitch.Player("EmbeddedTwitchPlayer", TwitchOptions)
    }
  }
}
</script>

<template>
<div>
  <div ref="Toolbar" class="w-full h-fit mt-0 drop-shadow-md flex flex-col divide-y-2 divide-neutral-900 stripes">
    <fieldset ref="ToolbarRow1" class="w-full h-fit flex flex-row divide-x divide-neutral-700  drop-shadow-md">
      <!--PANEL CONTROLS-->
      <toolbar-button class="text-primary font-bold" disabled>
        Rami Request Manager
      </toolbar-button>
      <toolbar-button ref="AuthButton" @button-clicked="modalManager.showModal('twitchAuth', TwitchAuthModal)">
        <div class="relative w-fit h-fit inline-block mr-2 ">
          <div class="bg-purple-900 rounded-full animate-ping absolute align-middle inset-0"/>
          <icon v-if="!RamiRequestManager.getUserSessionValid" name="mdi:twitch" class="size-6 align-middle"/>
        </div>
        <nuxt-img v-if="RamiRequestManager.getUserSessionValid" :src="RamiRequestManager.getUserProfile!.profile_image_url" class="size-6 rounded-sm inline-block mr-2 align-middle" placeholder/>
        {{RamiRequestManager.getUserSessionValid ? RamiRequestManager.getUserProfile!.display_name : "Login to Twitch"}}
      </toolbar-button>
      <new-select default="None" :options="RamiRequestManager.getActiveSessionOptions" @update:model-value="async ($event) => (await RamiRequestManager.setCurrentSession(Number($event)))">
        Session:
      </new-select>
      <toolbar-button ref="CreateSessionButton" @button-clicked="modalManager.showModal('createSession', CreateSessionModal)" :disabled="!RamiRequestManager.getUserSessionValid" class="hover:bg-red-900 hover:text-red-300 bg-red-950 text-red-400">
        Create Session
      </toolbar-button>
      <toolbar-button ref="HostButton">
        Host: <span ref="HostButtonName">The DJ Fry</span>
      </toolbar-button>
      <!--MID BAR GAP-->
      <div class="grow"/>
      <!--RIGHT SIDE CONTROLS-->
      <toolbar-button ref="HelpButton">
        Help
      </toolbar-button>
      <toolbar-button disabled>
        Ping: <span ref="PingText" class="codeblock ml-1 min-w-24 inline-block">{{RamiRequestManager.refreshTimerPaused ? "PAUSED" : RamiRequestManager.pingInterval.value}}</span>
      </toolbar-button>
    </fieldset>
    <fieldset :disabled="!RamiRequestManager.getUserSessionValid" ref="ToolbarRow2" class="w-full h-fit flex flex-row divide-x divide-neutral-700">
      <!--SESSION CONTROLS-->
      <new-select default="No Stream" :options="RamiRequestManager.getCurrentSessionChannelOptions" @update:model-value="$event => (onChannelSelected($event))">
        Twitch Channel:
      </new-select>
      <toolbar-button class="" disabled>
        Uptime: <span ref="UptimeText" class="codeblock min-w-20 inline-block">{{RamiRequestManager.uptime.value}}</span>
      </toolbar-button>
      <toolbar-button ref="OverlayButton">
        Open Overlay
      </toolbar-button>
    </fieldset>
  </div>
  <div class="w-full flex flex-row gap-4 p-4">
    <div class="rounded-md bg-neutral-900 p-2 grow relative">
      <div class="h-fit w-full rounded-md bg-neutral-950 border-purple-950 border-2">
        <icon v-if="!twitchPlayer" name="mdi:twitch" class="size-1/3 text-purple-950 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse -z-50" />
        <div id="EmbeddedTwitchPlayer"/>
      </div>
    </div>
    <fieldset ref="Controls" :disabled="!RamiRequestManager.getUserSessionValid" class="basis-2/5 flex flex-col gap-4 no-scrollbar" style="scrollbar-color: #404040 #171717">
      <!--SESSION CONTROLS-->
      <control-category title="Session Controls" subtitle="This is how you set if people can make requests.">
        <ul class="list-disc pl-6">
          <li>You can only have one Session open at a time for a given twitch channel.</li>
          <li>If you wish to pause the entering of requests, Lock the queue and reopen it when you're ready.</li>
          <li>Closing the Session will end it and allow that channel to open a new one or be added to another existing Session.</li>
        </ul>
        <control-button ref="SessionQueueOpen" icon="material-symbols:lock-open-right-outline" colour="Green">Unlock</control-button>
        <control-button ref="SessionQueueLock" icon="material-symbols:lock-outline" colour="Yellow">Lock</control-button>
        <control-button ref="SessionQueueClose" icon="mdi:close-box-outline" colour="Red">Close</control-button>
      </control-category>

      <!--OVERLAY CONTROLS-->
      <control-category title="Overlay Controls" subtitle="Control how the Queue is displayed on the Overlay.">
        <textarea ref="NotificationMessageText" class="w-full rounded-md bg-neutral-950 p-2 border-2 border-opacity-0 focus:border-opacity-100 border-neutral-700 !outline-none" placeholder="This is the message that will display when the queue is paused."></textarea>
        <control-button ref="OverlayMessageWelcome" colour="Blue">Welcome</control-button>
        <control-button ref="OverlayMessagePause" colour="Blue">Pause</control-button>
        <control-button ref="OverlayMessageCustom" icon="material-symbols:drive-file-rename-outline" colour="Yellow">Custom Message</control-button>
        <control-button ref="OverlayMessageRemove" icon="material-symbols:file-copy-off-outline" colour="Red">Remove Message</control-button>
      </control-category>

      <!--REQUEST QUEUE-->
      <control-category title="Request Queue" subtitle="You can view and rearrange the queue below. Rearranging is currently not working.">
        <control-button ref="RequestQueuePrevious" icon="material-symbols:fast-rewind-rounded" colour="Blue">Previous</control-button>
        <control-button ref="RequestQueueNext" icon="material-symbols:fast-forward-rounded" colour="Blue">Next</control-button>
<!--        <control-button ref="RequestQueueAdd" icon="material-symbols:add-2-rounded" colour="Green" @button-clicked="openCreateRequestModalWithContext">Add</control-button>-->
        <div ref="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">
          <template v-if="RamiRequestManager.getRequestsByOrder && RamiRequestManager.getRequestsByOrder.length > 0">
            <request-item v-for="requestItem of RamiRequestManager.getRequestsByOrder" :request="requestItem"/>
          </template>
        </div>
      </control-category>
    </fieldset>
  </div>
</div>
</template>

<style scoped>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>