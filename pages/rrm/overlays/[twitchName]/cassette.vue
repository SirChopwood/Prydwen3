<script setup lang="ts">
import {useRequestListener} from "~/composables/rrm";
import RequestItem from "~/components/rrm/request-item.vue";

definePageMeta({
  title: "Rami Request Manager",
  layout: "blank"
})
useSeoMeta({
  title: "Cassette Overlay",
  ogTitle: "Cassette Overlay",
  description: "A overlay for showing requests, themed like a retro cassette player.",
  ogDescription: "A overlay for showing requests, themed like a retro cassette player.",
  ogImage: `https://louismayes.xyz/images/rrm/overlays/cassette/Player.png`,
  twitterImage: `https://louismayes.xyz/images/rrm/overlays/cassette/Player.png`,
  twitterCard: 'summary_large_image',
  author: "Rami Request Manager",
})

let RequestListener = useRequestListener()

onMounted(async () => {
  await RequestListener.onMounted()
})
let songList: ComputedRef<Array<Record<string, any>>> = computed(() => {
  return RequestListener.getRequestsByOrder || []
})
let screenDisplays: Array<{title: string, value: string}> = [
  {title: "ID: ", value: "code"},
  {title: "User: ", value: "user"}
]
let currentScreenDisplay = ref(0)
let getCurrentScreenDisplay = computed(() => {
  return screenDisplays[currentScreenDisplay.value % screenDisplays.length]
})
setInterval(() => {currentScreenDisplay.value += 1}, 10000)
</script>

<template>
<!--  <h1>RRM Overlay</h1>-->
<!--  <br>-->
<!--  TwitchName: {{RequestListener.channel}}-->
<!--  <br>-->
<!--  Requests:-->
<!--  <div ref="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">-->
<!--    <template v-if="RequestListener.getRequestsByOrder && RequestListener.getRequestsByOrder.length > 0">-->
<!--      <request-item v-for="requestItem of RequestListener.getRequestsByOrder" :request="requestItem"/>-->
<!--    </template>-->
<!--  </div>-->

  <div class="fixed bottom-0 left-0 w-1/5 h-fit">
    <div>
      <nuxt-img src="/images/rrm/overlays/cassette/Player.png" class=""></nuxt-img>
      <div v-if="songList.length > 0" class="right-2 bottom-10 absolute flex-col w-44 h-10 pr-1 pt-1 text-green-400 inconsolata leading-3 text-lg line text-nowrap">
        <div class="overflow-hidden flex flex-row h-8 ticker-tape-container">
          <div class="ticker-tape">{{songList[0].text}}</div>
          <div class="ticker-tape" aria-hidden="true">{{songList[0].text}}</div>
        </div>
        <div class="flex flex-row flex-nowrap">
          {{getCurrentScreenDisplay.title}}
          <div v-if="String(songList[0][getCurrentScreenDisplay.value]).length > 20"
               class="text-nowrap overflow-hidden flex flex-row flex-nowrap h-8 ticker-tape-container">
            <div class="ticker-tape" style="animation-duration: 10s">
              {{ songList[0][getCurrentScreenDisplay.value] }}
            </div>
            <div class="ticker-tape" style="animation-duration: 10s">
              {{ songList[0][getCurrentScreenDisplay.value] }}
            </div>
          </div>
          <div v-else class="text-ellipsis">
            {{ songList[0][getCurrentScreenDisplay.value] }}
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Sour+Gummy&display=swap');
.inconsolata {
  font-family: "Inconsolata", monospace;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
      "wdth" 100;
}
.sour-gummy {
  font-family: "Sour Gummy", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
      "wdth" 100;
}

.ticker-tape-container {
  overflow-x: hidden;
  display: flex;
}
.ticker-tape {
  --direction: normal;
  --duration: 15s;
  --delay: 0s;
  --iteration-count: infinite;
  --play: running;
  display: flex;
  gap: 1rem;
  padding-right: 1rem;
  flex: 0 0 auto;
  align-items: center;
  animation: marquee var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    30% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}
</style>