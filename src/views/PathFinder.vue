<template>
  <div class="wrapper" ref="gridContainer">
    <div class="action-container">
      <div class="select is-primary">
        <select>
          <option>
            A* algo
          </option>
        </select>
      </div>

      <!-- <div class="slidecontainer">
        <p>Sort Speed: {{ sortSpeed }}ms</p>
        <input
          type="range"
          min="50"
          max="15000"
          step="50"
          class="slider"
          v-model="sortSpeed"
        />
      </div> -->

      <button class="button is-success is-outlined" @click="findShortestPath">
        Find Path
      </button>
      <button
        class="button is-danger is-outlined"
        :disabled="algoRunning"
        @click="stopAlgo = true"
      >
        Stop
      </button>

      <button
        class="button is-warning is-outlined"
        :disabled="algoRunning"
        @click="initGrid"
      >
        Clear Board
      </button>
    </div>

    <div class="grid-container">
      <div v-for="(row, index) in matrix" :key="index" class="is-flex">
        <Cell
          v-for="(col, idx) in row"
          :key="`${index}-${idx}`"
          :cell="matrix[index][idx]"
          :isStartNode="matrix[index][idx] === startNode"
          :isEndNode="matrix[index][idx] === endNode"
          @clicked="cellClick"
          :isMouseDown="mouseDown"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cell from "@/components/pathFinders/Cell.vue";

import { CellClass } from "@/types/pathFinders";
import aStarAlgo from "@/algos/pathFinders/AStar";
import {
  closedCellColor,
  defaultCellColor,
  openCellColor,
  wallCellColor
} from "@/constants/pathFindersConstants";

export default defineComponent({
  components: { Cell },

  data() {
    return {
      matrix: [] as CellClass[][],
      rows: 25,
      columns: 40,
      mouseDown: false,
      stopAlgo: false,
      algoRunning: false,
      startNode: new CellClass(0, 0, 0, 0),
      endNode: new CellClass(0, 0, 0, 0)
    };
  },

  methods: {
    findShortestPath() {
      aStarAlgo(this.startNode, this.endNode, this.highlightGrid);
    },

    highlightGrid(openCells: CellClass[], closedCells: CellClass[]) {
      for (const cell of openCells) {
        this.matrix[cell.row][cell.col].color = openCellColor;
      }

      for (const cell of closedCells) {
        this.matrix[cell.row][cell.col].color = openCellColor;
      }
    },

    initGrid() {
      this.matrix = new Array(this.rows).fill(0).map((t, row) =>
        new Array(this.columns).fill(0).map((v, col) => {
          return new CellClass(row, col, this.rows, this.columns);
        })
      );

      this.startNode = this.matrix[0][0];
      this.endNode = this.matrix[15][15];

      for (let row of this.matrix) {
        for (let cell of row) {
          cell.addNeighbors(this.matrix);
        }
      }
    },

    cellClick(row: number, col: number) {
      this.matrix[row][col].isWall = !this.matrix[row][col].isWall;
      this.matrix[row][col].color = this.matrix[row][col].isWall
        ? wallCellColor
        : defaultCellColor;
    },

    mouseDownEventHandler() {
      this.mouseDown = true;
    },

    mouseUpEventHandler() {
      this.mouseDown = false;
    }
  },

  mounted() {
    this.initGrid();

    const gridRef = this.$refs.gridContainer as HTMLDivElement;

    gridRef.addEventListener("mousedown", this.mouseDownEventHandler);
    gridRef.addEventListener("mouseup", this.mouseUpEventHandler);
  }

  // unmounted() {
  //   const gridRef = this.$refs.gridContainer as HTMLDivElement;

  //   gridRef.removeEventListener("mousedown", this.mouseDownEventHandler);
  //   gridRef.removeEventListener("mouseup", this.mouseUpEventHandler);
  // }
});
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.action-container {
  display: flex;
  width: 70%;
  justify-content: space-around;
  align-items: center;
}
</style>
