<template>
  <div>
    <p>Array</p>
    <div class="bar-container">
      <Bar
        v-for="(number, index) in array"
        :key="index"
        :num="number"
        :barColor="heightAndColor[index].color"
        :barHeight="heightAndColor[index].height"
      />
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
import { sortingAlgoNames, heightAndColor, swaps } from "@/types/sortingAlgo";
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
      array: [] as number[],
      heightAndColor: [] as heightAndColor[],
      barHeight: null as null | string,
      maxHeight: 300
    };
  },

  methods: {
    sortArray(sortingAlgo: sortingAlgoNames) {
      bubbleSort([...this.array], this.bubbleSortCallback);
    },

    randomValueAssign() {
      const index: number = Math.floor(Math.random() * this.array.length);
      this.array[index] = Math.floor(Math.random() * 100);
    },

    /**
     * @param {i} number to be swapped
     */
    bubbleSortCallback(swaps: swaps[]) {
      console.log("swaps = ", swaps);

      let index = 0;

      const interval = setInterval(() => {
        const {
          swap: [i, j],
          color
        } = swaps[index];

        this.heightAndColor[i].color = color;
        this.heightAndColor[j].color = color;

        swap(this.array, i, j);
        swap(this.heightAndColor, i, j);

        this.heightAndColor[i].color = baseBarColor;

        index++;

        if (index === swaps.length) {
          // array is sorted so turn every bar green
          this.heightAndColor = this.heightAndColor.map(e => ({
            ...e,
            color: sortedBarColor
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

      return val;
    });

    // map the element in a range between 0px and maxHeight px

    for (let element of this.array) {
      this.heightAndColor.push({
        color: baseBarColor,
        height: Math.floor(this.maxHeight * (element / max))
      });
    }
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
