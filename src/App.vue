<template>
  <ArraySort />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ArraySort from "@/views/ArraySort.vue";
export default defineComponent({
  name: "App",
  components: { ArraySort }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #02203a;
  color: rgb(200, 200, 200);
  width: 90%;
  margin: 0 auto;
}
</style>
