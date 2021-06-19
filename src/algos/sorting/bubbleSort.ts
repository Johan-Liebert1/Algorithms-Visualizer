import { sortedBarColor, swapBarColor } from "@/constants/sortingAlgoConstants";
import { swaps } from "@/types/sortingAlgo";
import { swap } from "./swap";

const bubbleSort = (list: number[], callback: (a: swaps[]) => void): swaps[] => {
  const swaps: swaps[] = [];

  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - 1; j++) {
      if (list[j] > list[j + 1]) {
        swaps.push({ swap: [j, j + 1], color: swapBarColor });
        swap(list, j, j + 1);
      }
    }
    swaps[swaps.length - 1].color = sortedBarColor;
  }

  callback(swaps);

  return swaps;
};

export default bubbleSort;
