<script setup lang="ts">
console.log("Loading WS")

let messages: Ref<Array<String>> = ref([])
let ws: WebSocket | null = null

onMounted(async () => {
  ws = new WebSocket("/api/v1/rrm/events/websocket")
  ws.addEventListener("open", async (event) => {
    console.log("WS Ready")
    messages.value.push(`WS Ready`)
    ws!.send("first")
  })
  ws.addEventListener("message", async (event) => {
    console.log(event.data)
    messages.value.push(`${event.data}`)
  })
  ws.addEventListener("close", async (event) => {
    console.log("WS Closed")
    messages.value.push(`WS Closed`)
  })
  ws.addEventListener("error", async (event) => {
    console.log(`WS Error: ${event}`)
    messages.value.push(`WS Error: ${event}`)
  })
})

onUnmounted(() => {
  ws!.close()
})
</script>

<template>
  <div class="bg-neutral-800 rounded-lg border-primary border-2 m-8 flex flex-col w-full h-fit max-h-full overflow-scroll">
    <div v-for="message of messages">{{message}}</div>
  </div>
</template>

<style scoped>

</style>