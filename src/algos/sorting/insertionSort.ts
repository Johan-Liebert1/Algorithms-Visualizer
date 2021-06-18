import { swap } from "./swap";

const insertionSort = (list: number[]) => {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i] > list[j]) {
        swap(list, i, j);
        console.log(list, list[i], list[j]);
      }
    }
  }
};

export default insertionSort;
