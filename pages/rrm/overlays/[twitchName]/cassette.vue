<script setup lang="ts">
import {useRequestListener} from "~/composables/rrm";
import Cassette_tape from "~/components/rrm/overlays/cassette_tape.vue";

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
onUnmounted(async () => {
  await RequestListener.onUnmounted()
})
let songList: ComputedRef<Array<Record<string, any>>> = computed(() => {
  return RequestListener.getRequestsByOrder || []
})
let currentSong: ComputedRef<number> = computed(() => {
  return RequestListener.getCurrentRequest
})
let screenDisplays: Array<{title: string, value: string}> = [
  {title: "ID: ", value: "code"},
  {title: "User: ", value: "user"},
  {title: "Total: ", value: "total"},
  {title: "Status: ", value: "status"},
  {title: "Host: ", value: "host"}
]
let currentScreenDisplay = ref(0)
let getCurrentScreenDisplay: ComputedRef<{title: string, value: string}> = computed(() => {
  const current = screenDisplays[currentScreenDisplay.value % screenDisplays.length]
  switch (current.value) {
    case "code":
      return {title: "ID: ", value: String(songList.value[currentSong.value].code)}
    case "user":
      return {title: "User: ", value: String(songList.value[currentSong.value].user)}
    case "total":
      return {title: "Songs in Queue: ", value: String(songList.value.length - (currentSong.value + 1))}
    case "status":
      return {title: "Status: ", value: String(RequestListener.getSessionStatus)}
    case "host":
      return {title: "DJ: ", value: String(RequestListener.getHost)}
  }
  return {title: "", value: ""}
})
let tapeRowValues = computed(() => {
  const indexes = [1,2,3,4,5]
  let list = []
  for (let i of indexes) {
    if (songList.value[currentSong.value + i]) {
      list.push(songList.value[currentSong.value + i])
    }
  }
  return list
})
setInterval(() => {currentScreenDisplay.value += 1}, 4000)
</script>

<template>
  <div class="fixed bottom-0 -left-4 w-96 h-fit">
    <div class="relative">
      <nuxt-img src="/images/rrm/overlays/cassette/PlayerOverlay.png" class="absolute w-full z-20"></nuxt-img>
      <div v-if="songList[currentSong]">
        <div v-if="songList.length > 0" class="absolute size-28 left-16 top-10 -ml-1 -mt-1 z-10 overflow-clip rounded-full ">
          <img v-if="Object.keys(songList[currentSong].metadata).includes('Thumbnail')" :src="songList[currentSong].metadata.Thumbnail" class="record"/>
        </div>

        <div class="absolute right-2.5 top-6 -z-10">
          <cassette_tape :song="songList[currentSong]" class=""></cassette_tape>
        </div>

        <div class="right-2 bottom-10 absolute flex-col w-44 h-10 pr-1 pt-1 text-green-400 inconsolata leading-3 text-lg line text-nowrap z-10">
          <div class="overflow-hidden flex flex-row h-8 ticker-tape-container">
            <div class="ticker-tape">{{songList[currentSong].text}}</div>
            <div class="ticker-tape" aria-hidden="true">{{songList[currentSong].text}}</div>
          </div>
          <div class="flex flex-row flex-nowrap">
            {{getCurrentScreenDisplay.title}}
            <div v-if="getCurrentScreenDisplay.value.length > 20"
                 class="text-nowrap overflow-hidden flex flex-row flex-nowrap h-8 ticker-tape-container">
              <div class="ticker-tape" style="animation-duration: 10s">
                {{ getCurrentScreenDisplay.value }}
              </div>
              <div class="ticker-tape" style="animation-duration: 10s">
                {{ getCurrentScreenDisplay.value }}
              </div>
            </div>
            <div v-else class="text-ellipsis">
              {{ getCurrentScreenDisplay.value }}
            </div>
          </div>
        </div>
      </div>
      <nuxt-img src="/images/rrm/overlays/cassette/Player.png" class="w-full z-0"></nuxt-img>
      <div class="absolute bottom-4 left-14 w-36 h-12 -mb-1 -ml-2 pl-1 pt-2 flex flex-row justify-evenly">
        <div class="size-8">
          <nuxt-img src="/images/rrm/overlays/cassette/PlayerButton1.png" class="object-fill opacity-70"/>
        </div>
        <div class="size-8">
          <nuxt-img src="/images/rrm/overlays/cassette/PlayerButton2.png" class="object-fill opacity-70"/>
        </div>
        <div class="size-8">
          <nuxt-img src="/images/rrm/overlays/cassette/PlayerButton3.png" class="object-fill opacity-70"/>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed inset-x-96 -bottom-12 h-32 flex flex-row overflow-visible justify-center">
    <cassette_tape v-for="song of tapeRowValues" :song="song" class="-mx-2" :style="`rotate: ${((song.text.length%20)-10)*1.2}deg`"/>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap');
.inconsolata {
  font-family: "Inconsolata", monospace;
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
  padding-right: 2rem;
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

.record {
  object-fit: cover;
  width: 100%;
  height: 100%;
  animation: record-spin 5s linear 0s infinite;
  @keyframes record-spin {
    0% {
      transform: rotate(0deg) scale(130%);
    }
    100% {
      transform: rotate(360deg) scale(130%);
    }
  }
}

.tape-row-enter-active {
  --direction: normal;
  --duration: 1s;
  --delay: 0s;
  --iteration-count: 1;
  --play: running;
  animation: tape-appear-anim var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
  animation-fill-mode: forwards;

  @keyframes tape-appear-anim {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>