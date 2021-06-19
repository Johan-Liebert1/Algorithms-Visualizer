import { sortedBarColor, swapBarColor } from "@/constants/sortingAlgoConstants";
import { swaps } from "@/types/sortingAlgo";
import { swap } from "./swap";

const selectionSort = (list: number[], callback: (a: swaps[]) => void) => {
  const swaps: swaps[] = [];

  for (let i = 0; i < list.length; i++) {
    let min = Infinity;
    let idx = 0;

    for (let j = i; j < list.length; j++) {
      if (list[j] < min) {
        idx = j;
        min = list[j];
      }
    }

    swaps.push({ swap: [idx, i], color: swapBarColor });
    swap(list, i, idx);

    swaps[i].color = sortedBarColor;
  }

  callback(swaps);
};

export default selectionSort;
