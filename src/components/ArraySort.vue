<template>
  <div>
    <p>Array</p>
    <span v-for="(number, index) in array" :key="index">{{ number }}, </span>
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

export default defineComponent({
  name: "ArraySort",
  data() {
    return {
      array: [5, 4, 0, -2, 10, 11, -2, 1, 3] as number[]
    };
  },

  methods: {
    sortArray() {
      // const newArray = quickSort([...this.array], 0, this.array.length - 1);

      // if (newArray) {
      //   this.array = newArray;
      // }
      selectionSort([...this.array]);
    },

    randomValueAssign() {
      const index: number = Math.floor(Math.random() * this.array.length);
      this.array[index] = Math.floor(Math.random() * 100);
    }
  },

  watch: {
    array: {
      handler() {
        console.log("array changed");
      },
      deep: true
    }
  }
});
</script>

<style scoped></style>
