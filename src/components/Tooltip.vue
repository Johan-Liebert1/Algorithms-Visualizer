<template>
  <div
    style="position: relative; cursor: default; z-index: 1;"
    @mouseover="mouseOverHandler"
    @mouseleave="mouseLeaveHandler"
  >
    <div class="tooltip-container" ref="tooltipContainer" v-if="showTooltip">
      {{ tooltipMessage }}
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Tooltip",
  props: {
    tooltipMessage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showTooltip: false
    };
  },

  methods: {
    mouseOverHandler() {
      this.showTooltip = true;
    },

    mouseLeaveHandler() {
      const tooltipContainer = this.$refs.tooltipContainer as HTMLDivElement;
      tooltipContainer.style.transform = "scale(0, 0)";

      setTimeout(() => {
        this.showTooltip = false;
      }, 250);
    }
  }
});
</script>

<style scoped>
.tooltip-container {
  position: absolute;
  min-width: 200%;
  bottom: 100%;
  left: -50%;
  word-wrap: break-word;
  background-color: rgb(50, 50, 50, 0.9);
  padding: 0.5rem 0.2rem;
  border-radius: 5px;
  color: white;
  transition: transform 200ms linear;
  animation: grow 200ms linear;
}

@keyframes grow {
  0% {
    transform: scale(0, 0);
  }

  100% {
    transform: scale(1, 1);
  }
}
</style>
