<template>
  <div class="outer-wrapper">
    <AlgoNavBar
      :algorithmsList="pathFindingAlgorithms"
      :buttonsList="navbarButtons"
      :selectedAlgo="selectedPathFindingAlgorithm"
      @algorithmChanged="setNewPathFindingAlgo"
      v-model:algoSpeed.sync="algorithmSpeed"
      :showMazeDropdown="true"
      :mazeGenAlgorithmsList="mazeGenerationAlgorithms"
      @mazeGenerationAlgoSelected="setNewMazeGenAlgo"
    >
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
    </AlgoNavBar>

    <div class="wrapper" ref="gridContainer">
      <div class="algorithm-info has-text-centered">
        <div class="is-flex">
          <div
            class="cell-info-div checkbox"
            :style="{ backgroundColor: cellColors.default }"
            @click="setIsDiagonalMovementAllowed"
          >
            <svg
              v-if="diagonalMovementAllowed"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="green"
              class="bi bi-check-lg"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"
              />
            </svg>
          </div>
          Allow Diagonal Movement
        </div>

        <Tooltip :tooltipMessage="'The algorithm to visualize'">
          <p class="has-text-weight-bold">Visualizing</p>
          <p>{{ selectedPathFindingAlgorithm }}</p>
        </Tooltip>

        <Tooltip :tooltipMessage="'Speed of the animation in milliseconds'">
          <p class="has-text-weight-bold">Algo Speed</p>
          <p>{{ algorithmSpeed }}</p>
        </Tooltip>

        <div>
          <Tooltip :tooltipMessage="'Nodes that have not been visited by the algorithm'">
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: cellColors.default }"
              ></div>
              Unvisited Node
            </div>
          </Tooltip>

          <Tooltip :tooltipMessage="'Nodes that are walls and cannot be passed through'">
            <div class="is-flex" style="margin-top: 5px;">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: cellColors.wall }"
              ></div>
              Wall Node
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip :tooltipMessage="'Nodes that can still be expanded'">
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: cellColors.open }"
              ></div>
              Open Node
            </div>
          </Tooltip>

          <Tooltip
            :tooltipMessage="
              'Nodes that are unfit for further expansion and have been marked as closed by the algorithm'
            "
          >
            <div class="is-flex" style="margin-top: 5px;">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: cellColors.closed }"
              ></div>
              Closed Node
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip
            :tooltipMessage="
              'Nodes that are part of the final path chosen by the algorithm'
            "
          >
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: cellColors.path }"
              ></div>
              Final Path
            </div>
          </Tooltip>
        </div>
      </div>

      <div class="grid-container" @dragover="nodeDragOver">
        <div v-for="(row, index) in matrix" :key="index" class="is-flex">
          <Cell
            v-for="(col, idx) in row"
            :key="`${index}-${idx}`"
            :cell="matrix[index][idx]"
            :isStartNode="matrix[index][idx] === startNode"
            :isEndNode="matrix[index][idx] === endNode"
            @clicked="cellClick"
            @nodeDropped="nodeDropped"
            @nodeDragStart="nodeDragStart"
            :isMouseDown="mouseDown"
          />
        </div>
      </div>

      <!-- <input type="text" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// types
import { CellClass } from "@/types/pathFinders";
import { ButtonsArray } from "@/types/global";

// algorithms - path finders
import aStarAlgo from "@/algos/pathFinders/AStar";
import BreadthFirstSearch from "@/algos/pathFinders/BFS";
import DepthFirstSearch from "@/algos/pathFinders/DFS";
import dijkstrasAlgorithm from "@/algos/pathFinders/Djikstras";

// algorithms - maze generators
import DepthFirstSearchMazeGen from "@/algos/mazeGenerators/DFSMaze";
import randomMaze from "@/algos/mazeGenerators/randomMaze";
import recursiveDivisionMaze from "@/algos/mazeGenerators/RecursiveDivision";
import ellersMaze from "@/algos/mazeGenerators/EllersAlgo";
import primsMazeGenerator from "@/algos/mazeGenerators/PrimsAlgo";

// constants
import {
  CELL_SIZE,
  closedCellColor,
  defaultCellColor,
  finalPathColor,
  openCellColor,
  pathFindingAlgorithms,
  secondaryCellBorderColor,
  wallCellColor
} from "@/constants/pathFindersConstants";
import { mazeGenerationAlgorithms } from "@/constants/mazeConstants";

// components
import Cell from "@/components/pathFinders/Cell.vue";
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import Tooltip from "@/components/Tooltip.vue";

export default defineComponent({
  components: { Cell, AlgoNavBar, Tooltip },

  setup() {
    const currentlyDraggingCell = ref<CellClass | null>(null);
    return { currentlyDraggingCell };
  },

  data() {
    return {
      matrix: [] as CellClass[][],
      rows: 21,
      columns: 40,
      mouseDown: false,
      stopAlgo: false,
      algoRunning: false,
      startNode: new CellClass(0, 0, 0, 0),
      endNode: new CellClass(0, 0, 0, 0),
      selectedPathFindingAlgorithm: pathFindingAlgorithms.A_STAR,
      algorithmSpeed: 500,
      pathFindingAlgorithms: Object.entries(pathFindingAlgorithms).map(
        ([key, value]) => value
      ),
      mazeGenerationAlgorithms: Object.entries(mazeGenerationAlgorithms).map(
        ([key, value]) => value
      ),
      selectedMazeGenerationAlgorithm: mazeGenerationAlgorithms.RANDOMIZED_DFS,
      navbarButtons: [
        {
          text: "Start",
          class: "button is-success",
          handler: this.findShortestPath
        },
        {
          text: "Clear Path",
          class: "button is-warning",
          handler: () => this.initGrid(false)
        },
        {
          text: "Reset Board",
          class: "button is-danger",
          handler: this.initGrid
        }
      ] as ButtonsArray[],
      diagonalMovementAllowed: false
    };
  },

  methods: {
    setNewPathFindingAlgo(value: string) {
      this.selectedPathFindingAlgorithm = value;
    },

    setNewMazeGenAlgo(value: string) {
      this.selectedMazeGenerationAlgorithm = value;
      this.generateMaze();
    },

    generateMaze() {
      switch (this.selectedMazeGenerationAlgorithm) {
        case mazeGenerationAlgorithms.RANDOMIZED_DFS:
          DepthFirstSearchMazeGen(
            this.startNode,
            this.endNode,
            this.matrix,
            this.makeWall
          );
          break;

        case mazeGenerationAlgorithms.RANDOM_MAZE:
          randomMaze(this.startNode, this.endNode, this.matrix, this.makeWall);
          break;

        case mazeGenerationAlgorithms.RECURSIVE_DIVISION:
          console.log(this.columns, this.rows);
          recursiveDivisionMaze(
            this.matrix,
            this.columns,
            this.rows,
            0,
            0,
            this.startNode,
            this.endNode,
            this.makeWall
          );
          break;

        case mazeGenerationAlgorithms.PRIMS_ALGORITHM:
          primsMazeGenerator(
            this.matrix,
            this.startNode,
            this.endNode,
            this.makeWall,
            this.clearWall
          );
          break;

        case mazeGenerationAlgorithms.ELLERS_ALGORITHM:
          ellersMaze(
            this.matrix,
            this.startNode,
            this.endNode,
            this.makeWall,
            this.clearWall
          );
          break;

        default:
          break;
      }
    },

    findShortestPath() {
      switch (this.selectedPathFindingAlgorithm) {
        case pathFindingAlgorithms.A_STAR:
          aStarAlgo(
            this.startNode,
            this.endNode,
            this.highlightGrid,
            this.colorFinalPath
          );
          break;

        case pathFindingAlgorithms.BREADTH_FIRST_SEARCH:
          BreadthFirstSearch(
            this.startNode,
            this.endNode,
            this.highlightGrid,
            this.colorFinalPath
          );
          break;

        case pathFindingAlgorithms.DEPTH_FIRST_SEARCH:
          DepthFirstSearch(
            this.startNode,
            this.endNode,
            this.highlightGrid,
            this.colorFinalPath
          );
          break;

        case pathFindingAlgorithms.DIJKSTRA:
          dijkstrasAlgorithm(
            this.startNode,
            this.endNode,
            this.highlightGrid,
            this.colorFinalPath
          );
          break;

        default:
          console.log(this.selectedPathFindingAlgorithm, "not yet implemented");
          break;
      }
    },

    makeWall(c: CellClass) {
      this.matrix[c.row][c.col].isWall = true;
      this.matrix[c.row][c.col].color = wallCellColor;
      this.matrix[c.row][c.col].drawBorder = false;
      return new Promise(r => setTimeout(r, 15));
    },

    clearWall(c: CellClass) {
      this.matrix[c.row][c.col].isWall = false;
      this.matrix[c.row][c.col].color = defaultCellColor;
      this.matrix[c.row][c.col].drawBorder = true;
      return new Promise(r => setTimeout(r, 150));
    },

    highlightGrid(openCells: CellClass[], closedCells: CellClass[]) {
      for (const cell of openCells) {
        this.matrix[cell.row][cell.col].color = openCellColor;
        this.matrix[cell.row][cell.col].borderColor = secondaryCellBorderColor;
      }

      for (const cell of closedCells) {
        this.matrix[cell.row][cell.col].color = closedCellColor;
        this.matrix[cell.row][cell.col].borderColor = secondaryCellBorderColor;
      }

      return new Promise(r => setTimeout(r, this.algorithmSpeed / 50));
    },

    colorFinalPath() {
      let currentNode: CellClass = this.endNode;

      while (currentNode.previous !== null) {
        this.matrix[currentNode.row][currentNode.col].color = finalPathColor;
        this.matrix[currentNode.row][currentNode.col].drawBorder = false;
        currentNode = currentNode.previous;
      }

      this.startNode.color = finalPathColor;
      this.startNode.drawBorder = false;
    },

    setIsDiagonalMovementAllowed() {
      this.diagonalMovementAllowed = !this.diagonalMovementAllowed;
      this.setCellNeighbors();
    },

    setCellNeighbors() {
      for (let row of this.matrix) {
        for (let cell of row) {
          cell.addNeighbors(this.matrix, this.diagonalMovementAllowed);
        }
      }
    },

    clearBoard() {
      for (let row of this.matrix) {
        for (let col of row) {
          if (col.isWall) continue;
          col.color = defaultCellColor;
        }
      }
    },

    initGrid(reset = true) {
      const prevStartNode = this.startNode;
      const prevEndNode = this.endNode;

      this.matrix = new Array(this.rows).fill(0).map((t, row) =>
        new Array(this.columns).fill(0).map((v, col) => {
          return new CellClass(
            row,
            col,
            this.rows,
            this.columns,
            reset ? false : this.matrix[row][col].isWall
          );
        })
      );

      if (reset) {
        const middleRow = Math.floor(this.rows / 2);
        const startCol = Math.floor(this.columns / 4);
        const endCol = Math.floor((this.columns * 3) / 4);

        this.startNode = this.matrix[middleRow][startCol];
        this.endNode = this.matrix[middleRow][endCol];
      } else {
        this.startNode = this.matrix[prevStartNode.row][prevStartNode.col];
        this.endNode = this.matrix[prevEndNode.row][prevEndNode.col];
      }

      this.setCellNeighbors();
    },

    cellClick(row: number, col: number) {
      if (this.startNode.row === row && this.startNode.col === col) return;
      if (this.endNode.row === row && this.endNode.col === col) return;

      this.matrix[row][col].isWall = !this.matrix[row][col].isWall;
      this.matrix[row][col].color = this.matrix[row][col].isWall
        ? wallCellColor
        : defaultCellColor;
      this.matrix[row][col].drawBorder = !this.matrix[row][col].isWall;
    },

    nodeDragOver(e: Event) {
      const target = e.target as HTMLDivElement;

      const [cell, row, col] = target.id.split("-");

      if (cell === "cell") {
        if (this.currentlyDraggingCell === this.startNode) {
          this.startNode = this.matrix[parseInt(row)][parseInt(col)];
          this.currentlyDraggingCell = this.startNode;
        } else if (this.currentlyDraggingCell === this.endNode) {
          this.endNode = this.matrix[parseInt(row)][parseInt(col)];
          this.currentlyDraggingCell = this.endNode;
        }
      } else {
        if (this.currentlyDraggingCell === this.startNode) {
          this.startNode = this.currentlyDraggingCell;
        } else if (this.currentlyDraggingCell === this.endNode) {
          this.endNode = this.currentlyDraggingCell;
        }
      }
    },

    nodeDragStart(cell: CellClass) {
      this.currentlyDraggingCell = cell;
    },

    nodeDropped() {
      this.currentlyDraggingCell = null;
    },

    mouseDownEventHandler(e: Event) {
      const target = e.target as HTMLDivElement;
      if (target.tagName !== "DIV") return;

      this.mouseDown = true;
    },

    mouseUpEventHandler(e: Event) {
      const target = e.target as HTMLDivElement;
      if (target.tagName !== "DIV") return;

      this.mouseDown = false;
    }
  },

  computed: {
    cellColors() {
      return {
        default: defaultCellColor,
        wall: wallCellColor,
        path: finalPathColor,
        open: openCellColor,
        closed: closedCellColor
      };
    }
  },

  mounted() {
    const randCols = Math.floor((window.innerWidth - 20) / CELL_SIZE);

    this.columns = randCols % 2 === 0 ? randCols - 1 : randCols;

    this.initGrid();

    const gridRef = this.$refs.gridContainer as HTMLDivElement;

    gridRef.addEventListener("mousedown", this.mouseDownEventHandler);
    gridRef.addEventListener("mouseup", this.mouseUpEventHandler);
  }
});
</script>

<style scoped>
.checkbox {
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox:hover {
  opacity: 0.9;
  cursor: pointer;
}

.outer-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 1.5rem;
}

.grid-container {
  justify-self: flex-end;
}

.action-container {
  display: flex;
  width: 70%;
  justify-content: space-around;
  align-items: center;
}
</style>

<style>
.cell-info-div {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.algorithm-info {
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
