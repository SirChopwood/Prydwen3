<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "index",
  async beforeCreate() {
    await navigateTo("/#Projects")
  }
})
</script>

<template>

</template>

<style scoped>

</style>