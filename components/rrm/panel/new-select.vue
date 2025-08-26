<script setup lang="ts">
import ToolbarButton from "~/components/rrm/panel/toolbar-button.vue";

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

const selectedOption = defineModel()
</script>

<template>
  <toolbar-button class="bg-neutral-800" disabled>
    <slot/>
    <select v-model="selectedOption" class="min-w-40 max-w-80 bg-neutral-800 px-2 py-1 rounded-sm text-secondary text-lg hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150">
      <option v-for="option in props.options" :selected="(props.options[0].value === option.value)" class="text-neutral-400 bg-neutral-900" :value="option.value">{{option.label}}</option>
    </select>
  </toolbar-button>
</template>

<style scoped>

</style>