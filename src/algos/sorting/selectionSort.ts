import { swap } from "./swap";

const selectionSort = (list: number[]) => {
  for (let i = 0; i < list.length; i++) {
    let min = Infinity,
      idx = -1;

    for (let j = i; j < list.length; j++) {
      console.log(i, j);
      if (list[j] < min) {
        idx = j;
        min = list[j];
      }
    }

    swap(list, i, idx);
    console.log(list);
  }
};

export default selectionSort;
