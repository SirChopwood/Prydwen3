<script setup lang="ts">
import ToolbarButton from "~/components/rrm/toolbar-button.vue";
import ToolbarSelect from "~/components/rrm/toolbar-select.vue";
import ControlCategory from "~/components/rrm/control-category.vue";
import ControlButton from "~/components/rrm/control-button.vue";
import RequestItem from "~/components/rrm/request-item.vue";
import TwitchAuthModal from "~/components/rrm/twitch-auth-modal.vue";
import type {User} from "#auth-utils";
import {useModal} from "vue-final-modal";

definePageMeta({
  title: "Rami Request Manager",
  layout: "panel"
})

const session = useUserSession()
const sessionValid = session.loggedIn.value
const sessionData = session.user.value as User
let songList = ref([] as Array<{name: string, songId: string, user: string}>)
const hostButtonName = useTemplateRef("HostButtonName")

onMounted(() => {
  songList.value.push({name:"Beep Beep I'm A Sheep", songId:"2232", user:"MrMimi"})
  songList.value.push({name:"Starships - Nicki Minaj", songId:"427", user:"MrMimi"})
  songList.value.push({name:"I WANT IT THAT WAY (Remix) by Backstreet Boys", songId:"871", user:"DJ_Fry"})
  songList.value.push({name:"READY OR NOT by: Momoland", songId:"1778", user:"ramiris_"})
  songList.value.push({name:"Wake Me Up", songId:"2232", user:"ASneakyNinja"})
  songList.value.push({name:"[KPOP] ASTRO - After Midnight", songId:"1234", user:"ASneakyNinja"})
  songList.value.push({name:"Beep Beep I'm A Sheep", songId:"2232", user:"MrMimi"})
})

const { open: openAuthModal, close } = useModal({
  component: TwitchAuthModal,
  attrs: {
    sessionData: sessionData,
    onCloseModal() {
      close()
    },
    onLogin() {
      if (!sessionValid) {
        navigateTo('/api/auth/twitch', {external: true})
      }
    },
    onLogout() {
      if (sessionValid) {
        session.clear().then((result) => {
          console.log("session logged out")
          reloadNuxtApp()
        })
      }
    }
  },
})

function authButton() {

  openAuthModal()

  // if (!sessionValid) {
  //   navigateTo('/api/auth/twitch', {external: true})
  // }
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
      <toolbar-button ref="AuthButton" @button-clicked="authButton">
        <div v-if="!sessionValid" class="absolute size-6 rounded-full top-0 left-0 animate-ping bg-purple-950"/>
        <icon v-if="!sessionValid" name="mdi:twitch" class="mr-2 size-6 align-middle"/>
        <nuxt-img v-if="sessionValid" :src="sessionData.profile_image_url" class="size-6 rounded-sm inline-block mr-2 align-middle" placeholder/>
        {{sessionValid ? sessionData.display_name : "Login to Twitch"}}
      </toolbar-button>
      <toolbar-select ref="SessionSelect">
        Session:
      </toolbar-select>
      <toolbar-button ref="SetupButton" class="hover:bg-red-900 hover:text-red-300 bg-red-950 text-red-400">
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
      <toolbar-button ref="PingText" disabled>
        Ping: <span class="codeblock min-w-10 inline-block"><000</span>
      </toolbar-button>
    </div>
    <div class="w-full h-fit flex flex-row divide-x divide-neutral-700">
      <!--SESSION CONTROLS-->
      <toolbar-select ref="ChannelSelect" default-select="No Stream">
        Twitch Channel:
      </toolbar-select>
      <toolbar-button ref="UptimeText" class="" disabled>
        Uptime: <span class="codeblock min-w-20 inline-block">00000</span>
      </toolbar-button>
      <toolbar-button ref="OverlayButton">
        Open Overlay
      </toolbar-button>
    </div>
  </div>
  <div ref="ToolbarRow2" class="w-full flex flex-row gap-4 p-4">
    <div class="rounded-md bg-neutral-900 p-2 grow relative">
      <div class="h-full w-full rounded-md bg-neutral-950 border-purple-950 border-2 -z-20">
        <icon name="mdi:twitch" class="size-1/3 text-purple-950 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse z-0" />
        <div id="EmbeddedTwitchPlayer" class="z-20"/>
      </div>
    </div>
    <div ref="Controls" class="basis-2/5 flex flex-col gap-4 no-scrollbar" style="scrollbar-color: #404040 #171717">
      <!--SESSION CONTROLS-->
      <control-category title="Session Controls" subtitle="This is how you set if people can make requests.">
        <ul class="list-disc pl-6">
          <li>You can only have one session open at a time for a given twitch channel.</li>
          <li>If you wish to pause requests, Lock the queue and reopen it when you're ready.</li>
          <li>Closing the session will end the session and allow that channel to open or be added to another.</li>
        </ul>
        <control-button ref="SessionQueueOpen" icon="material-symbols:lock-open-right-outline" colour="Green">Unlock</control-button>
        <control-button ref="SessionQueueLock" icon="material-symbols:lock-outline" colour="Yellow">Lock</control-button>
        <control-button ref="SessionQueueClose" icon="mdi:close-box-outline" colour="Red">Close</control-button>
      </control-category>

      <!--OVERLAY CONTROLS-->
      <control-category title="Overlay Controls" subtitle="Control how the Queue is displayed on the Overlay.">
        <textarea id="NotificationMessageText" class="w-full rounded-md bg-neutral-950 p-2 border-2 border-opacity-0 focus:border-opacity-100 border-neutral-700 !outline-none" placeholder="This is the message that will display when the queue is paused."></textarea>
        <control-button ref="OverlayMessagePause" colour="Blue">Welcome</control-button>
        <control-button ref="OverlayMessagePause" colour="Blue">Pause</control-button>
        <control-button ref="OverlayMessageCustom" icon="material-symbols:drive-file-rename-outline" colour="Yellow">Custom Message</control-button>
        <control-button ref="OverlayMessageRemove" icon="material-symbols:file-copy-off-outline" colour="Red">Remove Message</control-button>
      </control-category>

      <!--REQUEST QUEUE-->
      <control-category title="Request Queue" subtitle="You can view and rearrange the queue below.">
        <control-button ref="OverlayMessagePause" icon="material-symbols:fast-rewind-rounded" colour="Blue">Previous</control-button>
        <control-button ref="OverlayMessagePause" icon="material-symbols:fast-forward-rounded" colour="Blue">Next</control-button>
        <control-button ref="OverlayMessageRemove" icon="material-symbols:add-2-rounded" colour="Green">Add</control-button>
        <div id="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">
          <request-item v-for="song in songList" :name="song.name" :user="song.user" :song-id="song.songId"/>
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