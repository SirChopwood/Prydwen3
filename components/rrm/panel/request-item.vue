<script lang="ts">
import {defineComponent} from 'vue'
import type { RRM_Request } from '~/server/utils/drizzle';

export default defineComponent({
  name: "request-item",
  props: {
    request: {
      type: Object as PropType<RRM_Request>,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    }
  },
  mounted() {
    this.$refs.Button.addEventListener("click", () => {
      navigator.clipboard.writeText(this.request.code)
    })
  }
})
</script>

<template>
  <div class="group w-full mb-1 flex flex-row gap-2 has-[:hover]:bg-neutral-800 rounded-md relative" :style="current ? 'border: dashed rgb(37 99 235)' : ''">
    <div class="SongQueueEntryHandle self-stretch w-6 mx-2 cursor-move *:fill-neutral-700 *:group-hover:fill-neutral-400 *:hover:!fill-primary flex justify-center items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="size-4">
        <path fill-rule="evenodd" d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 4.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="text-4xl group-hover:text-primary justify-center items-center content-center pr-2 font-jetbrains" :style="current ? 'color: rgb(37 99 235)' : ''">
      <div>{{index+1}}</div>
    </div>
    <div class="flex grow flex-col py-1 mb-1">
      <div class="group-hover:text-primary text-neutral-200 text-lg truncate whitespace-pre-wrap">{{ request.text }}</div>
      <div class="group-hover:text-primary flex flex-row items-center">
        <button ref="Button" class="codeblock hover:outline-primary hover:text-neutral-200 truncate whitespace-pre-wrap">
          {{ request.code }}
        </button>
        <div class="pl-2 text-sm"> by {{ request.user }}</div>
      </div>
    </div>
    <div class="absolute top-0 right-0 flex flex-row">
      <button class="has-tooltip">
        <span class="tooltip">Metadata {{request.metadata}}</span>
        <icon name="mdi:database-search-outline" class="size-6 m-2 text-neutral-700 hover:text-neutral-400"/>
      </button>
      <button class="has-tooltip">
        <span class="tooltip">Remove</span>
        <icon name="mdi:trash-can-outline" class="size-6 m-2 text-neutral-700 hover:text-neutral-400"/>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>