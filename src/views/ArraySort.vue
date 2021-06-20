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
      Algo - {{ sortAlgorithm }} <br />
      Speed - {{ sortSpeed }}
      <div class="bar-container">
        <Bar v-for="(element, index) in array" :key="index" :arrayElement="element" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// types
import { sortArrayElement, swaps } from "@/types/sortingAlgo";
import { ButtonsArray } from "@/types/global";

// algorithms
import bubbleSort from "@/algos/sorting/bubbleSort";
import quickSort from "@/algos/sorting/quickSort";
import insertionSort from "@/algos/sorting/insertionSort";
import selectionSort from "@/algos/sorting/selectionSort";
import { swap } from "@/algos/sorting/swap";

// constants
import {
  baseBarColor,
  iteratingBarColor,
  sortedBarColor,
  sortingAlgorithms,
  swapBarColor
} from "@/constants/sortingAlgoConstants";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import Bar from "@/components/sorting/Bar.vue";

export default defineComponent({
  name: "ArraySort",
  components: { Bar, AlgoNavBar },
  data() {
    return {
      array: [] as sortArrayElement[],
      barHeight: null as null | string,
      maxHeight: 300,
      sortingAlgos: Object.entries(sortingAlgorithms).map(([key, value]) => value),
      sortSpeed: 500,
      currentlySorting: false,
      stopSorting: false,
      sortAlgorithm: sortingAlgorithms.BUBBLE_SORT as string,
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
      ] as ButtonsArray[]
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
        case sortingAlgorithms.BUBBLE_SORT:
          bubbleSort(
            this.array.map(e => e.number),
            this.bubbleSortCallback
          );
          break;

        case sortingAlgorithms.SELECTION_SORT:
          selectionSort(
            this.array.map(e => e.number),
            this.selectionSortCallback
          );
          break;

        default:
          console.log(this.sortAlgorithm, "not implemented yet");
          break;
      }
    },

    bubbleSortCallback(swaps: swaps[]) {
      this.currentlySorting = true;
      this.stopSorting = false;

      let index = 0;

      const interval = setInterval(() => {
        const {
          swap: [i, j],
          color
        } = swaps[index];

        this.array[i].barColor = color;
        this.array[j].barColor = color;

        swap(this.array, i, j);

        this.array[i].barColor = baseBarColor;

        index++;

        if (index === swaps.length || (this.currentlySorting && this.stopSorting)) {
          if (index === swaps.length) {
            // array is sorted so turn every bar green
            this.array = this.array.map(e => ({
              ...e,
              barColor: sortedBarColor
            }));
          }
          this.currentlySorting = false;
          clearInterval(interval);
        }
      }, this.sortSpeed);
    },

    selectionSortCallback(swaps: swaps[]) {
      this.currentlySorting = true;
      this.stopSorting = false;

      let index = 0;

      const interval = setInterval(() => {
        const {
          swap: [i, j],
          color
        } = swaps[index];

        this.array[i].barColor = color;
        this.array[j].barColor = color;

        swap(this.array, i, j);

        // go from i to the end
        this.array = this.array.map((el, newIdx) => {
          const color = newIdx < j ? sortedBarColor : iteratingBarColor;
          return {
            ...el,
            barColor: color
          };
        });

        index++;

        if (index === swaps.length || (this.currentlySorting && this.stopSorting)) {
          if (index === swaps.length) {
            // array is sorted so turn every bar green
            this.array = this.array.map(e => ({
              ...e,
              barColor: sortedBarColor
            }));
          }
          this.currentlySorting = false;
          clearInterval(interval);
        }
      }, this.sortSpeed);
    },

    generateRandomArray() {
      let max = -Infinity;

      this.array = new Array(30).fill(0).map(() => {
        const val = Math.floor(Math.random() * 90) + 10;

        if (val > max) max = val;

        return { number: val, barColor: baseBarColor, barHeight: val };
      });

      // map the element in a range between 0px and maxHeight px
      this.array = this.array.map(e => ({
        ...e,
        barHeight: Math.floor(this.maxHeight * (e.number / max))
      }));
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
