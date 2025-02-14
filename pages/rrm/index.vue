<script setup lang="ts">
import ToolbarButton from "~/components/rrm/toolbar-button.vue";
import ToolbarSelect from "~/components/rrm/toolbar-select.vue";
import ControlCategory from "~/components/rrm/control-category.vue";
import ControlButton from "~/components/rrm/control-button.vue";
import RequestItem from "~/components/rrm/request-item.vue";
import TwitchAuthModal from "~/components/rrm/twitch-auth-modal.vue";
import type {User} from "#auth-utils";
import type {RRM_Request, RRM_Session, RRM_TwitchChannel} from "@prisma/client";
import {useModal} from "vue-final-modal";
import CreateSessionModal from "~/components/rrm/create-session-modal.vue";

useHead({
  title: "Rami Request Manager",
  titleTemplate: "%s",
  script: [{src: "https://player.twitch.tv/js/embed/v1.js"}]
})
definePageMeta({
  title: "Rami Request Manager",
  layout: "panel"
})

type FullSession = RRM_Session & {owner: RRM_TwitchChannel, joinedChannels: Array<RRM_TwitchChannel>}
let userSession = useUserSession()
let userSessionValid = ref(userSession.loggedIn.value)
let userSessionData = ref(userSession.user.value as User)
let {data: moddedChannels} = await useFetch("/api/rrm/twitch/moderated", {method: "POST",})
let requestList = ref({} as Record<string, RRM_Request>)
let activeSessions = ref([] as Array<FullSession>)
let currentSession = ref<FullSession | null>(null)
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
let twitchPlayer = ref()

onMounted(async () => {
  await refreshActiveSessions()
  setInterval(updateTimers, 1000)
})

watch(userSessionData, async (newUser) => {
  if (userSessionValid.value) {
    console.log("Logged into twitch.")
    await refreshActiveSessions()
  } else {
    console.log("Logged out of twitch!")
  }
}, {immediate: true})

watch(currentSession, async (newSession) => {
  let {data: requests} = await useFetch<Record<string, RRM_Request>>("/api/rrm/request/fetch", {method: "POST", body: {
    session: newSession?.id
  }})
  if (requests.value) {
    requestList.value = requests.value
  }
  if (newSession && references.ChannelSelect.value) {
    let channelOptions: Array<{value: string, label: string}> = []

    channelOptions.push({value: newSession.owner.name, label: newSession.owner.name})
    for (let channel of newSession.joinedChannels) {
      channelOptions.push({value: channel.name, label: channel.name})
    }
    await references.ChannelSelect.value.updateSelectOptions(channelOptions, false)
  }
})

async function refreshActiveSessions() {
  let {data: sessions} = await useFetch<Array<FullSession>>("/api/rrm/session/fetch", {method: "POST", body: {}})
  if (sessions.value && references.SessionSelect.value) {
    activeSessions.value = sessions.value

    let sessionOptions: Array<{value: string, label: string}> = []
    for (let session of activeSessions.value) {
      sessionOptions.push({value: String(session.id), label: `${session.id} (${session.owner.name})`})
    }
    await references.SessionSelect.value.updateSelectOptions(sessionOptions)
  }
}

const { open: openAuthModal, close: closeAuthModal } = useModal({
  component: TwitchAuthModal,
  attrs: {
    userSessionData: userSessionData.value,
    onCloseModal() {
      closeAuthModal()
    },
    onLogin() {
      if (!userSessionValid.value) {
        navigateTo('/api/auth/twitch', {external: true})
      }
    },
    onLogout() {
      if (userSessionValid.value) {
        userSession.clear().then((result) => {
          console.log("session logged out")
          reloadNuxtApp()
        })
      }
    }
  },
})

const { open: openCreateSessionModal, close: closeCreateSessionModal } = useModal({
  component: CreateSessionModal,
  attrs: {
    userSessionData: userSessionData.value,
    moddedChannels: moddedChannels.value,
    onCloseModal() {
      closeCreateSessionModal()
    },
    async onSessionCreated() {
      await refreshActiveSessions()
      await closeCreateSessionModal()
    }
  },
})

async function updateTimers() {
  if (references.UptimeText.value) {
    if (currentSession.value) {
      let sessionStartDate = new Date(currentSession.value.startTime)
      let milliseconds = Math.floor(Date.now() - sessionStartDate.getTime())
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      minutes = minutes - (hours * 60);
      seconds = seconds - (((hours * 60) + minutes) * 60)
      references.UptimeText.value.innerText = `${hours}h ${minutes}m ${seconds}s`
    } else {
      references.UptimeText.value.innerText = `N/A`
    }
  }
  if (references.PingText.value) {
    let pingStartTime = Date.now()
    await $fetch("/api/ping")
    let pingEndTime = Date.now()
    references.PingText.value.innerText = `${Math.floor(pingEndTime - pingStartTime)}ms`
  }
}

async function selectSession() {
  let selection = references.SessionSelect.value!.getSelectedOption()
  if (selection === "none") {
    currentSession.value = null
    console.log(`Session selection cleared.`)
  } else {
    for (let session of activeSessions.value) {
      if (String(session.id) === String(selection)) {
        currentSession.value = session
        console.log(`Session ${selection} selected.`)
      }
    }
  }
}

async function selectChannel() {
  let selection = references.ChannelSelect.value!.getSelectedOption()
  if (selection === "none") {
    console.log(`Channel selection cleared.`)
  } else {
    console.log(`Channel ${selection} selected.`)
    if (twitchPlayer.value) {
      twitchPlayer.value.setChannel(selection)
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
      twitchPlayer.value = new Twitch.Player("EmbeddedTwitchPlayer", TwitchOptions)
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
          <icon v-if="!userSessionValid" name="mdi:twitch" class="size-6 align-middle"/>
        </div>
        <nuxt-img v-if="userSessionValid" :src="userSessionData.profile_image_url" class="size-6 rounded-sm inline-block mr-2 align-middle" placeholder/>
        {{userSessionValid ? userSessionData.display_name : "Login to Twitch"}}
      </toolbar-button>
      <toolbar-select ref="SessionSelect" @select-changed="selectSession">
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
      <toolbar-button ref="HelpButton" @button-clicked="refreshActiveSessions">
        Help
      </toolbar-button>
      <toolbar-button disabled>
        Ping: <span ref="PingText" class="codeblock min-w-10 inline-block"><000</span>
      </toolbar-button>
    </div>
    <div ref="ToolbarRow2" class="w-full h-fit flex flex-row divide-x divide-neutral-700">
      <!--SESSION CONTROLS-->
      <toolbar-select ref="ChannelSelect" @select-changed="selectChannel" default-select="No Stream">
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
        <icon v-if="!twitchPlayer" name="mdi:twitch" class="size-1/3 text-purple-950 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
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
        <control-button ref="RequestQueueAdd" icon="material-symbols:add-2-rounded" colour="Green">Add</control-button>
        aaa {{requestList.value}}
        bbb {{currentSession?.requests}}
        <div ref="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">
          <request-item v-if="(requestList && currentSession)"
                        v-for="requestIndex in JSON.parse(currentSession.requests)"
                        :text="requestList[String(requestIndex)].text"
                        :user="requestList[String(requestIndex)].user"
                        :code="requestList[String(requestIndex)].code"
          />
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