<template>
  <div>
    <AlgoNavBar
      :algorithmsList="sortingAlgos"
      :selectedAlgo="sortAlgorithm"
      @algorithmChanged="setNewAlgorithm"
      :buttonsList="navbarButtons"
      v-model:algoSpeed.sync="sortSpeed"
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
    <div class="array-sort-container">
      <div class="algorithm-info has-text-centered">
        <div>
          <p class="has-text-weight-bold">Visualizing</p>
          <p>{{ sortAlgorithm }}</p>
        </div>

        <div>
          <p class="has-text-weight-bold">Algo Speed</p>
          <p>{{ sortSpeed }}</p>
        </div>

        <div>
          <div class="is-flex">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: arrayColors.base }"
            ></div>
            Initial Element
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: arrayColors.sorted }"
            ></div>
            Sorted Element
          </div>
        </div>

        <div>
          <div class="is-flex">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: arrayColors.swap }"
            ></div>
            Swap
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: arrayColors.iterating }"
            ></div>
            Iterating
          </div>
        </div>

        <div v-if="yellowBarLegend.show">
          <div class="is-flex">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: arrayColors.pivot }"
            ></div>
            {{ yellowBarLegend.text }}
          </div>
        </div>
      </div>
      <p>
        {{
          sortAlgorithm === allSortingAlgorithms.QUICK_SORT
            ? array[quickSort.pivotIdx]
            : ""
        }}
      </p>
      <div class="bar-container">
        <Bar v-for="(element, index) in array" :key="index" :arrayElement="element" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// types
import { sortArrayElement } from "@/types/sortingAlgo";
import { ButtonsArray } from "@/types/global";

// algorithms
import bubbleSort from "@/algos/sorting/bubbleSort";
import quickSort from "@/algos/sorting/quickSort";
import insertionSort from "@/algos/sorting/insertionSort";
import selectionSort from "@/algos/sorting/selectionSort";
import mergeSort from "@/algos/sorting/mergeSort";
import { swap } from "@/algos/sorting/swap";

// constants
import {
  baseBarColor,
  iteratingBarColor,
  pivotBarColor,
  sortedBarColor,
  sortingAlgorithms as allSortingAlgorithms,
  swapBarColor
} from "@/constants/sortingAlgoConstants";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import Bar from "@/components/sorting/Bar.vue";

export default defineComponent({
  name: "ArraySort",
  components: { Bar, AlgoNavBar },

  setup() {
    const ARRAY_SIZE = 35;
    return { ARRAY_SIZE };
  },

  data() {
    return {
      array: [] as sortArrayElement[],
      barHeight: null as null | string,
      maxHeight: 300,
      sortingAlgos: Object.values(allSortingAlgorithms),
      sortSpeed: 500,
      currentlySorting: false,
      stopSorting: false,
      sortAlgorithm: allSortingAlgorithms.INSERTION_SORT as string,
      allSortingAlgorithms,
      navbarButtons: [
        {
          text: "Sort",
          class: "button is-success",
          handler: this.sortArray
        },
        {
          text: "Stop",
          class: "button is-danger",
          handler: this.stopArraySort
        },
        {
          text: "Generate Random Array",
          class: "button is-info",
          handler: this.generateRandomArray
        }
      ] as ButtonsArray[],
      quickSort: {
        pivotIdx: 0
      }
    };
  },

  methods: {
    setNewAlgorithm(newAlgo: string) {
      this.sortAlgorithm = newAlgo;
    },

    stopArraySort() {
      this.stopSorting = true;
    },

    sortArray() {
      if (this.currentlySorting) return;

      switch (this.sortAlgorithm) {
        case allSortingAlgorithms.BUBBLE_SORT:
          bubbleSort(
            this.array.map(e => e.number),
            this.swapElements,
            this.colorElement
          );
          break;

        case allSortingAlgorithms.SELECTION_SORT:
          selectionSort(
            this.array.map(e => e.number),
            this.sortSpeed,
            this.iteratingOverElements,
            this.swapElements,
            this.colorElement
          );
          break;

        case allSortingAlgorithms.INSERTION_SORT:
          insertionSort(
            this.array.map(e => e.number),
            this.getArrayElement,
            this.setArrayElement,
            this.iteratingOverElements
          );
          break;

        case allSortingAlgorithms.QUICK_SORT:
          quickSort(
            this.array.map(e => e.number),
            0,
            this.array.length - 1,
            this.iteratingOverElements,
            this.swapElements,
            this.colorElement,
            this.setPivot
          );
          break;

        case allSortingAlgorithms.MERGE_SORT:
          mergeSort(
            this.array.map(e => e.number),
            0,
            this.array.length - 1
          );
          break;

        default:
          console.log(this.sortAlgorithm, "not implemented yet");
          break;
      }
    },

    setPivot(index: number) {
      this.colorElement(this.quickSort.pivotIdx, baseBarColor);
      this.quickSort.pivotIdx = index;
      this.colorElement(index, pivotBarColor);
    },

    getArrayElement(index: number): sortArrayElement {
      return this.array[index];
    },

    setArrayElement(
      index: number,
      index2: number,
      element?: sortArrayElement
    ): Promise<void> {
      return new Promise(r =>
        setTimeout(() => {
          if (!element) {
            this.array[index] = this.array[index2];
          } else {
            this.array[index] = element;
          }
          r();
        }, this.sortSpeed)
      );
    },

    /**
     * Will be called from the sorting function to animate the element swaps
     */
    swapElements(index1: number, index2: number, dontColorIdx = -1): Promise<void> {
      if (dontColorIdx !== index1) this.array[index1].barColor = swapBarColor;

      if (dontColorIdx !== index2) this.array[index2].barColor = swapBarColor;

      swap(this.array, index1, index2);

      return new Promise(r =>
        setTimeout(() => {
          if (dontColorIdx !== index1) this.array[index1].barColor = baseBarColor;
          if (dontColorIdx !== index2) this.array[index2].barColor = baseBarColor;
          r();
        }, this.sortSpeed)
      );
    },

    /**
     * Sets the color of a bar
     */
    colorElement(index: number, color: string = sortedBarColor) {
      if (!this.array[index])
        console.log("undefined = ", this.array[index], index, this.array.length, color);

      this.array[index].barColor = color;
    },

    /**
     * Visualize the itertion over elements between index1 and index2 (both inclusive)
     */
    iteratingOverElements(
      index1: number,
      index2: number,
      color: string = iteratingBarColor
    ): Promise<void> {
      let i = index1;
      const interval = 10;

      const int = setInterval(() => {
        if (i === index2) clearInterval(int);

        if (this.array[i].barColor !== sortedBarColor) {
          this.array[i].barColor = color;
        }
        i++;
      }, interval);

      return new Promise(r => setTimeout(r, Math.abs(index2 - index1) * interval));
    },

    generateRandomArray() {
      let max = -Infinity;

      const tempArr: sortArrayElement[] = [];
      let i = 0;
      for (; i < this.ARRAY_SIZE; ) {
        const val = Math.floor(Math.random() * 90) + 10;

        const element = { number: val, barColor: baseBarColor, barHeight: val };

        if (!tempArr.includes(element)) {
          if (val > max) max = val;
          tempArr.push(element);
          i++;
        }
      }

      // map the element's height in a range between 0px and maxHeight px
      this.array = tempArr.map(e => ({
        ...e,
        barHeight: Math.floor(this.maxHeight * (e.number / max))
      }));
    }
  },

  computed: {
    arrayColors() {
      return {
        base: baseBarColor,
        swap: swapBarColor,
        sorted: sortedBarColor,
        iterating: iteratingBarColor,
        pivot: pivotBarColor
      };
    },

    yellowBarLegend(): { show: boolean; text?: string } {
      switch (this.sortAlgorithm) {
        case allSortingAlgorithms.QUICK_SORT:
          return { show: true, text: "Pivot" };

        case allSortingAlgorithms.SELECTION_SORT:
          return { show: true, text: "Min Element" };

        default:
          break;
      }

      return { show: false };
    }
  },

  mounted() {
    this.generateRandomArray();
  }
});
</script>

<style scoped>
.array-sort-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-height: 90vh;
}

.bar-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 2rem auto;
}

.action-container {
  display: flex;
  width: 70%;
  justify-content: space-around;
  align-items: center;
}
</style>
