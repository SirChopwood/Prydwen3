<script setup lang="ts">
const props = defineProps(["song"])

let randomLabel: Ref<string> = ref("")
let randomHue: Ref<string> = ref("")

onMounted(async () => {
  updateRefs(props.song)
  watch(() => props.song, (newSong, oldSong) => {
    if (newSong.code !== oldSong.code) {
      updateRefs(newSong)
    }
  })
})

function updateRefs(song: any) {
  randomLabel.value = `/images/rrm/overlays/cassette/Label${Math.ceil((song.text.length % 4) + 1)}.png`
  randomHue.value = `filter: hue-rotate(${(song.text.length * 123) % 360}deg)`
}
</script>

<template>
  <div class="relative">
    <div class="text-sm relative sour-gummy w-44 h-auto shrink-0">
      <nuxt-img src="/images/rrm/overlays/cassette/TapeBase.png" class="static" :style="randomHue"/>
      <div class="absolute right-[4%] w-[18%] top-[32%]">
        <nuxt-img :src="song.metadata.Thumbnail" class="object-cover h-full w-full"/>
      </div>
      <nuxt-img :src="randomLabel" class="absolute top-0"/>
      <div class="absolute inset-x-[6%] top-[16%] h-14 text-nowrap overflow-clip overflow-ellipsis">
        <div class="absolute text-left top-0 text-md text-black leading-[0.9]">{{ song.text }}</div>
        <div class="absolute bottom-0.5 flex flex-row gap-2">
          <div class="text-xs text-black">{{ song.user }}</div>
          <div class="text-right text-xs text-black grow self-center">{{ song.code }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=&family=Sour+Gummy&display=swap');
.sour-gummy {
  font-family: "Sour Gummy", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
      "wdth" 100;
}
</style>