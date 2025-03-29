<script setup lang="ts">
import ToolbarButton from "~/components/rrm/toolbar-button.vue";
import ToolbarSelect from "~/components/rrm/toolbar-select.vue";
import ControlCategory from "~/components/rrm/control-category.vue";
import ControlButton from "~/components/rrm/control-button.vue";
import RequestItem from "~/components/rrm/request-item.vue";
import TwitchAuthModal from "~/components/rrm/twitch-auth-modal.vue";
import {useModal} from "vue-final-modal";
import CreateSessionModal from "~/components/rrm/create-session-modal.vue";
import CreateRequestModal from "~/components/rrm/create-request-modal.vue";
import {useSessionManager} from "~/composables/rrm";

useHead({
  title: "Rami Request Manager",
  titleTemplate: "%s",
  script: [{src: "https://player.twitch.tv/js/embed/v1.js"}]
})
definePageMeta({
  title: "Rami Request Manager",
  layout: "panel"
})

let twitchPlayer: any;
let references = {
  Toolbar: useTemplateRef("Toolbar"),
  ToolbarRow1: useTemplateRef("ToolbarRow1"),
  AuthButton: useTemplateRef("AuthButton"),
  SessionSelect: useTemplateRef("SessionSelect"),
  CreateSessionButton: useTemplateRef("CreateSessionButton"),
  HostButton: useTemplateRef("HostButton"),
  HostButtonName: useTemplateRef("HostButtonName"),
  HelpButton: useTemplateRef("HelpButton"),
  PingText: useTemplateRef("PingText"),
  ToolbarRow2: useTemplateRef("ToolbarRow2"),
  ChannelSelect: useTemplateRef("ChannelSelect"),
  UptimeText: useTemplateRef("UptimeText"),
  OverlayButton: useTemplateRef("OverlayButton"),
  Controls: useTemplateRef("Controls"),
  SessionQueueOpen: useTemplateRef("SessionQueueOpen"),
  SessionQueueLock: useTemplateRef("SessionQueueLock"),
  SessionQueueClose: useTemplateRef("SessionQueueClose"),
  NotificationMessageText: useTemplateRef("NotificationMessageText"),
  OverlayMessageWelcome: useTemplateRef("OverlayMessageWelcome"),
  OverlayMessagePause: useTemplateRef("OverlayMessagePause"),
  OverlayMessageCustom: useTemplateRef("OverlayMessageCustom"),
  OverlayMessageRemove: useTemplateRef("OverlayMessageRemove"),
  RequestQueuePrevious: useTemplateRef("RequestQueuePrevious"),
  RequestQueueNext: useTemplateRef("RequestQueueNext"),
  RequestQueueAdd: useTemplateRef("RequestQueueAdd"),
  RequestQueue: useTemplateRef("RequestQueue")
}
let RamiRequestManager = useSessionManager()

onMounted(async () => {
  await RamiRequestManager.onMounted()
  await references.SessionSelect.value?.updateSelectOptions(await RamiRequestManager.getSessionsSelectOptions())
})

watch(RamiRequestManager.timeSinceStart, (newValue, oldValue) => {
  if (references.UptimeText.value) {
    references.UptimeText.value.innerText = newValue.text
  }
})

async function onSessionSelected () {
  await RamiRequestManager.setSession(Number(references.SessionSelect.value?.getSelectedOption()))
  await references.ChannelSelect.value?.updateSelectOptions(RamiRequestManager.getChannelSelectOptions(), true)
}

const { open: openAuthModal, close: closeAuthModal } = useModal({
  component: TwitchAuthModal,
  attrs: {
    userSessionData: RamiRequestManager.getUserSession(),
    onCloseModal() {
      closeAuthModal()
    },
    onLogin() {
      if (!RamiRequestManager.isUserSessionValid()) {
        navigateTo('/api/v1/rrm/twitch/auth', {external: true})
      }
    },
    onLogout() {
      if (RamiRequestManager.isUserSessionValid()) {
        RamiRequestManager.clearUserSession()
      }
    }
  },
})

const { open: openCreateSessionModal, close: closeCreateSessionModal } = useModal({
  component: CreateSessionModal,
  attrs: {
    userSessionData: RamiRequestManager.getUserSession(),
    moddedChannels: await RamiRequestManager.getModdedChannels(),
    onCloseModal() {
      closeCreateSessionModal()
    }
  },
})

async function openCreateRequestModalWithContext() {
  patchCreateRequestModal({
    attrs: {
      userSessionData: RamiRequestManager.getUserSession(),
      sessionData: RamiRequestManager.getSession(),
    }
  })
  await openCreateRequestModal()
}
const { open: openCreateRequestModal, close: closeCreateRequestModal, patchOptions: patchCreateRequestModal } = useModal({
  component: CreateRequestModal,
  attrs: {
    userSessionData: RamiRequestManager.getUserSession(),
    sessionData: RamiRequestManager.getSession(),
    onCloseModal() {
      closeCreateRequestModal()
    },
    async onRequestCreated() {
      await closeCreateSessionModal()
    }
  },
})

async function onChannelSelected() {
  let selection = references.ChannelSelect.value!.getSelectedLabel()
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
    <div ref="ToolbarRow1" class="w-full h-fit flex flex-row divide-x divide-neutral-700  drop-shadow-md">
      <!--PANEL CONTROLS-->
      <toolbar-button class="text-primary font-bold" disabled>
        Rami Request Manager
      </toolbar-button>
      <toolbar-button ref="AuthButton" @button-clicked="openAuthModal">
        <div class="relative w-fit h-fit inline-block mr-2 ">
          <div class="bg-purple-900 rounded-full animate-ping absolute align-middle inset-0"/>
          <icon v-if="!RamiRequestManager.isUserSessionValid()" name="mdi:twitch" class="size-6 align-middle"/>
        </div>
        <nuxt-img v-if="RamiRequestManager.isUserSessionValid()" :src="RamiRequestManager.getUserSession()!.profile_image_url" class="size-6 rounded-sm inline-block mr-2 align-middle" placeholder/>
        {{RamiRequestManager.isUserSessionValid() ? RamiRequestManager.getUserSession()!.display_name : "Login to Twitch"}}
      </toolbar-button>
      <toolbar-select ref="SessionSelect" @select-changed="onSessionSelected">
        Session:
      </toolbar-select>
      <toolbar-button ref="CreateSessionButton" @button-clicked="openCreateSessionModal" class="hover:bg-red-900 hover:text-red-300 bg-red-950 text-red-400">
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
        Ping: <span ref="PingText" class="codeblock min-w-10 inline-block"><000</span>
      </toolbar-button>
    </div>
    <div ref="ToolbarRow2" class="w-full h-fit flex flex-row divide-x divide-neutral-700">
      <!--SESSION CONTROLS-->
      <toolbar-select ref="ChannelSelect" default-select="No Stream" @select-changed="onChannelSelected">
        Twitch Channel:
      </toolbar-select>
      <toolbar-button class="" disabled>
        Uptime: <span ref="UptimeText" class="codeblock min-w-20 inline-block">00000</span>
      </toolbar-button>
      <toolbar-button ref="OverlayButton">
        Open Overlay
      </toolbar-button>
    </div>
  </div>
  <div class="w-full flex flex-row gap-4 p-4">
    <div class="rounded-md bg-neutral-900 p-2 grow relative">
      <div class="h-fit w-full rounded-md bg-neutral-950 border-purple-950 border-2">
        <icon v-if="!twitchPlayer" name="mdi:twitch" class="size-1/3 text-purple-950 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse -z-50" />
        <div id="EmbeddedTwitchPlayer"/>
      </div>
    </div>
    <div ref="Controls" class="basis-2/5 flex flex-col gap-4 no-scrollbar" style="scrollbar-color: #404040 #171717">
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
      <control-category title="Request Queue" subtitle="You can view and rearrange the queue below.">
        <control-button ref="RequestQueuePrevious" icon="material-symbols:fast-rewind-rounded" colour="Blue">Previous</control-button>
        <control-button ref="RequestQueueNext" icon="material-symbols:fast-forward-rounded" colour="Blue">Next</control-button>
        <control-button ref="RequestQueueAdd" icon="material-symbols:add-2-rounded" colour="Green" @button-clicked="openCreateRequestModalWithContext">Add</control-button>
        <div ref="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">
          <request-item v-for="requestItem of RamiRequestManager.requestListOrdered.value" :request="requestItem"/>
        </div>
      </control-category>
    </div>
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