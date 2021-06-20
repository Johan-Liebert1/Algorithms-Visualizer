<template>
  <div
    :class="{ cell: true }"
    :style="{
      width: `${dimension}px`,
      height: `${dimension}px`,
      backgroundColor: cell.color,
      transition: 'background-color ease-in-out 300ms'
    }"
    @click="clickHandler"
    @mouseover="mouseOverHandler"
    @drop="dropOverCell"
    @dragenter="e => e.preventDefault()"
    @dragover="e => e.preventDefault()"
  >
    <div
      v-if="isStartNode"
      :draggable="true"
      class="target-node"
      @dragstart="dragStarted"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#2c3e50"
        class="bi bi-caret-right-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
        />
      </svg>
    </div>

    <div
      v-else-if="isEndNode"
      :draggable="true"
      class="target-node"
      @dragstart="dragStarted"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#2c3e50"
        class="bi bi-bullseye"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CellClass } from "@/types/pathFinders";

export default defineComponent({
  props: {
    cell: {
      type: CellClass,
      required: true
    },
    isStartNode: {
      type: Boolean,
      required: true
    },
    isEndNode: {
      type: Boolean,
      required: true
    },
    isMouseDown: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      dimension: 20
    };
  },

  methods: {
    clickHandler() {
      if (this.isStartNode || this.isEndNode) return;

      this.$emit("clicked", this.cell.row, this.cell.col);
    },

    mouseOverHandler() {
      if (this.isStartNode || this.isEndNode) return;

      if (this.isMouseDown) this.$emit("clicked", this.cell.row, this.cell.col);
    },

    dragStarted() {
      this.$emit("nodeDragStart", this.cell);
    },

    dropOverCell(event: Event) {
      event.preventDefault();

      this.$emit(`nodeDropped`, this.cell);
    }
  }
});
</script>

<style scoped>
.cell {
  border-right: solid #74b9ff;
  border-bottom: solid #74b9ff;
  border-width: thin;
}

.target-node {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
</style>
