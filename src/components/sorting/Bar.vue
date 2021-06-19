<template>
  <div
    class="array-bar"
    :style="{ width: '20px', height: `${barHeight}px`, backgroundColor: barColor }"
  >
    {{ num }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Bar",
  props: {
    num: {
      type: Number,
      required: true
    },
    barHeight: {
      type: Number,
      required: true
    },
    barColor: {
      type: String,
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
