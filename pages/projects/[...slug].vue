<script lang="ts" setup>
  const route = useRoute()
  const { data: page } = await useAsyncData(route.path, () => {
    return queryCollection('projects').path(route.path).first()
  })
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "[...slug]"
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

<style scoped>

</style>