<template>
  <div
    class="array-bar"
    :style="{
      width: '20px',
      height: `${el.barHeight}px`,
      backgroundColor: el.barColor
    }"
  >
    {{ el.number }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { sortArrayElement } from "@/types/sortingAlgo";

export default defineComponent({
  name: "Bar",
  props: {
    el: {
      type: Object,
      required: true
    }
  }
});
</script>

<style scoped>
.array-bar {
  text-align: center;
  color: white;
  margin: 0 0.1rem;
}
</style>
