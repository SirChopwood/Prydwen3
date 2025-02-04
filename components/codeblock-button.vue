<!--suppress HtmlUnknownTarget -->
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "header-button",
  props: {
    link: String
  }
})
</script>

<template>
  <nuxt-link :to="link">
    <div class="codeblock *:align-middle hover:outline-primary hover:text-neutral-200 transition-all duration-100 ease-in-out">
      <slot/>
    </div>
  </nuxt-link>
</template>

<style scoped>

</style>