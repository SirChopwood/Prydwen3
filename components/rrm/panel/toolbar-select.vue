<script lang="ts">
import {defineComponent} from 'vue'
import ToolbarButton from "~/components/rrm/panel/toolbar-button.vue";

export default defineComponent({
  name: "toolbar-select",
  components: {ToolbarButton},
  props: {
    defaultSelect: {
      type: String,
      default: "None"
    }
  },
  data() {
    return {
      selectOptions: Array<{ value: string; label: string }>,
      showDefault: true
    }
  },
  methods: {
    async updateSelectOptions(options: Array<{ value: string; label: string }>, showDefault: boolean = true) {
      if (options.length === 0) {return}
      this.selectOptions = options
      this.showDefault = showDefault
      await nextTick()
      this.$refs.Select.value = options[0].value
      this.$emit('SelectChanged')
    },
    getSelectedOption() {
      return this.$refs.Select.options[this.$refs.Select.selectedIndex].value
    },
    getSelectedLabel() {
      return this.$refs.Select.options[this.$refs.Select.selectedIndex].label
    }
  },
  expose: ["Select", "updateSelectOptions", "SelectChanged", "getSelectedOption", "getSelectedLabel"],
})
</script>

<template>
  <toolbar-button class="bg-neutral-800" disabled>
    <slot/>
    <select ref="Select" @change="$emit('SelectChanged')" class="min-w-40 max-w-80 bg-neutral-800 px-2 py-1 rounded-sm text-secondary text-lg hover:bg-neutral-700 outline outline-0 focus:outline-1 outline-primary transition duration-150">
      <option v-if="showDefault" class="text-neutral-500 bg-neutral-900" value="none">{{defaultSelect}}</option>
      <option v-for="option in selectOptions" class="text-neutral-400 bg-neutral-900" :value="option.value">{{option.label}}</option>
    </select>
  </toolbar-button>
</template>

<style scoped>

</style>