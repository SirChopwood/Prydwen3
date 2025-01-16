<script lang="ts">
import {defineComponent} from 'vue'
import HeaderButton from "../core/HeaderButton.vue";

export default defineComponent({
  name: "NotFound",
  components: {HeaderButton}
})
</script>

<template>
  <div class="flex flex-col w-full items-center gap-4 text-center">
    <div class="codeblock text-9xl w-fit text-white stripes-warning">404</div>
    <div class="text-primary font-bold text-3xl">Page Not Found</div>
    <div>
      Oops, looks like the page you're looking for doesnt exist or cannot be accessed.
      <br>
      Please try again later or use the button below to return.
    </div>
    <HeaderButton link="/">
      <span class="text-secondary">return</span> <span class="text-primary">Home</span>
    </HeaderButton>
  </div>
</template>