<script setup lang="ts">
const props = defineProps({
  "default": {
    type: String,
    default: 'None'
  },
  options: {
    type: Array<{label: string; value: string}>,
    default: {},
    required: true
  }
})

const selectedOptions = defineModel({
  default: {} as Record<string, boolean>
})
</script>

<template>
  <div class="grow bg-neutral-800 p-1 rounded-sm flex flex-col h-32  overflow-y-scroll">
    <label v-for="option of props.options" class="hover:bg-neutral-700 rounded-sm px-1 flex flex-row ">
      <input type="checkbox" :value="option.value" v-model="selectedOptions[option.value]" class="peer size-0 opacity-0 disabled:text-neutral-400">
      <icon name="mdi:close-thick" class="size-6 collapse peer-checked:visible text-secondary align-middle peer-disabled:text-neutral-400"/>
      <icon name="mdi:plus-thick" class="size-6 peer-checked:hidden align-middle peer-disabled:text-neutral-400"/>
      <span class="peer-checked:text-secondary peer-disabled:text-neutral-400">{{option.label}}</span>
    </label>
  </div>
</template>

<style scoped>

</style>