<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "HeaderButton",
  props: {
    link: String
  },
  methods: {
    buttonClicked() {
      window.location.href = this.$props.link
    }
  }
})
</script>

<template>
  <button type="button" class="codeblock hover:outline-primary hover:text-neutral-200 transition-all duration-100 ease-in-out" @click="buttonClicked">
    <slot/>
  </button>

</template>

<style scoped>

</style>