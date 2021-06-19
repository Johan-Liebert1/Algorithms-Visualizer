<template>
  <div>
    <p>Array</p>
    <div class="bar-container">
      <Bar v-for="(element, index) in array" :key="index" :el="element" />
    </div>
    <button @click="sortArray">Sort</button>
    <button @click="randomValueAssign">change a value</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import bubbleSort from "@/algos/sorting/bubbleSort";
import quickSort from "@/algos/sorting/quickSort";
import insertionSort from "@/algos/sorting/insertionSort";
import selectionSort from "@/algos/sorting/selectionSort";
import Bar from "@/components/sorting/Bar.vue";
import { sortingAlgoNames, sortArrayElement, swaps } from "@/types/sortingAlgo";
import { swap } from "@/algos/sorting/swap";
import {
  baseBarColor,
  sortedBarColor,
  swapBarColor
} from "@/constants/sortingAlgoConstants";

export default defineComponent({
  name: "ArraySort",
  components: { Bar },
  data() {
    return {
      array: [] as sortArrayElement[],
      barHeight: null as null | string,
      maxHeight: 300
    };
  },

  methods: {
    sortArray(sortingAlgo: sortingAlgoNames) {
      bubbleSort(
        this.array.map(e => e.number),
        this.bubbleSortCallback
      );
    },

    /**
     * @param {i} number to be swapped
     */
    bubbleSortCallback(swaps: swaps[]) {
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

        if (index === swaps.length) {
          // array is sorted so turn every bar green
          this.array = this.array.map(e => ({
            ...e,
            barColor: sortedBarColor
          }));

          clearInterval(interval);
        }
      }, 500);
    }
  },

  watch: {
    array: {
      handler() {
        console.log("array changed");
      },
      deep: true
    }
  },

  mounted() {
    let max = -Infinity;

    this.array = new Array(10).fill(0).map(() => {
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
});
</script>

<style scoped>
.bar-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
</style>
