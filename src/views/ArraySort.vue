<template>
  <div class="array-sort-container">
    <div class="action-container">
      <div class="select is-primary">
        <select v-model="sortAlgorithm">
          <option v-for="algo in sortingAlgos" :key="algo" :value="algo">{{
            algo
          }}</option>
        </select>
      </div>

      <div class="slidecontainer">
        <p>Sort Speed: {{ sortSpeed }}ms</p>
        <input
          type="range"
          min="50"
          max="15000"
          step="50"
          class="slider"
          v-model="sortSpeed"
        />
      </div>

      <button class="button is-success is-outlined" @click="sortArray">Sort</button>
      <button class="button is-danger is-outlined" @click="stopSorting = true">
        Stop
      </button>
      <button class="button is-info is-outlined" @click="generateRandomArray">
        Random Array
      </button>
    </div>

    <div class="bar-container">
      <Bar v-for="(element, index) in array" :key="index" :arrayElement="element" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bar from "@/components/sorting/Bar.vue";

import bubbleSort from "@/algos/sorting/bubbleSort";
import quickSort from "@/algos/sorting/quickSort";
import insertionSort from "@/algos/sorting/insertionSort";
import selectionSort from "@/algos/sorting/selectionSort";

import { sortArrayElement, swaps } from "@/types/sortingAlgo";
import { swap } from "@/algos/sorting/swap";
import {
  baseBarColor,
  iteratingBarColor,
  sortedBarColor,
  sortingAlgorithms,
  swapBarColor
} from "@/constants/sortingAlgoConstants";

export default defineComponent({
  name: "ArraySort",
  components: { Bar },
  data() {
    return {
      array: [] as sortArrayElement[],
      barHeight: null as null | string,
      maxHeight: 300,
      sortingAlgos: Object.keys(sortingAlgorithms).map(
        (key: string, index: number) => Object.values(sortingAlgorithms)[index]
      ),
      sortSpeed: 500,
      currentlySorting: false,
      stopSorting: false,
      sortAlgorithm: sortingAlgorithms.BUBBLE_SORT
    };
  },

  methods: {
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

  watch: {
    sortSpeed() {
      console.log(this.sortSpeed);
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
