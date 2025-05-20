<script setup lang="ts">
import {useRequestListener} from "~/composables/rrm";
import RequestItem from "~/components/rrm/request-item.vue";

definePageMeta({
  title: "Rami Request Manager",
  layout: "blank"
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

let RequestListener = useRequestListener()

onMounted(async () => {
  await RequestListener.onMounted()
})
</script>

<template>
  <h1>RRM Overlay</h1>
  <br>
  TwitchName: {{RequestListener.channel}}
  <br>
  Requests:
  <div ref="RequestQueue" class="h-40 resize-y overflow-y-scroll overflow-x-clip text-pretty min-h-20 w-full rounded-md bg-neutral-950 flex flex-col">
    <template v-if="RequestListener.getRequestsByOrder && RequestListener.getRequestsByOrder.length > 0">
      <request-item v-for="requestItem of RequestListener.getRequestsByOrder" :request="requestItem"/>
    </template>
  </div>


</template>

<style scoped>

</style>