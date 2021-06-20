<template>
  <div
    class="cell"
    :style="{ width: `${dimension}px`, height: `${dimension}px`, backgroundColor }"
    @click="clickHandler"
    @mouseover="mouseOverHandler"
  ></div>
</template>

<script lang="ts">
import { CellClass } from "@/types/pathFinders";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    cell: {
      type: CellClass,
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
      this.$emit("clicked", this.cell.row, this.cell.col);
    },
    mouseOverHandler() {
      if (this.isMouseDown) this.$emit("clicked", this.cell.row, this.cell.col);
    }
  },

  computed: {
    backgroundColor(): string {
      return this.cell.isWall ? "black" : "white";
    }
  }
});
</script>

<style scoped>
.cell {
  border: 1px solid gray;
  background-color: white;
}
</style>
