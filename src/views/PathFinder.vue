<template>
  <div class="outer-wrapper">
    <PathFinderNav :algorithmsList="pathFindingAlgorithms" :buttonsList="navbarButtons">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
        />
      </svg>
    </PathFinderNav>

    <div class="wrapper" ref="gridContainer">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cell from "@/components/pathFinders/Cell.vue";
import PathFinderNav from "@/components/pathFinders/PathFinderNav.vue";

import { CellClass } from "@/types/pathFinders";
import aStarAlgo from "@/algos/pathFinders/AStar";
import {
  closedCellColor,
  defaultCellColor,
  finalPathColor,
  openCellColor,
  pathFindingAlgorithms,
  wallCellColor
} from "@/constants/pathFindersConstants";

export default defineComponent({
  components: { Cell, PathFinderNav },

  data() {
    return {
      matrix: [] as CellClass[][],
      rows: 25,
      columns: 40,
      mouseDown: false,
      stopAlgo: false,
      algoRunning: false,
      startNode: new CellClass(0, 0, 0, 0),
      endNode: new CellClass(0, 0, 0, 0),
      pathFindingAlgorithms: Object.entries(pathFindingAlgorithms).map(
        ([key, value]) => value
      ),
      navbarButtons: [
        {
          text: "Start",
          class: "button is-success",
          handler: this.findShortestPath
        },
        {
          text: "Clear Board",
          class: "button is-warning",
          handler: this.initGrid
        }
      ]
    };
  },

  methods: {
    findShortestPath() {
      aStarAlgo(this.startNode, this.endNode, this.highlightGrid, this.colorFinalPath);
    },

    highlightGrid(openCells: CellClass[], closedCells: CellClass[]) {
      for (const cell of openCells) {
        this.matrix[cell.row][cell.col].color = openCellColor;
      }

      for (const cell of closedCells) {
        this.matrix[cell.row][cell.col].color = closedCellColor;
      }

      return new Promise(r => setTimeout(r, 250));
    },

    colorFinalPath() {
      let currentNode: CellClass = this.endNode;

      while (currentNode.previous !== null) {
        this.matrix[currentNode.row][currentNode.col].color = finalPathColor;
        currentNode = currentNode.previous;
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
          cell.addNeighbors(this.matrix, false);
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
.outer-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wrapper {
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
