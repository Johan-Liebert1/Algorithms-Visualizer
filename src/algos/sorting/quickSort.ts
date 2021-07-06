import {
  baseBarColor,
  pivotBarColor,
  sortedBarColor
} from "@/constants/sortingAlgoConstants";
import { swap } from "./swap";

const partition = async (
  list: number[],
  low: number,
  high: number,
  iteratingOver: (idx1: number, idx2: number) => Promise<void>,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void,
  setPivot: (idx: number) => void
) => {
  const pivot = list[low];
  let left = low + 1;
  let right = high;

  setPivot(low);

  while (left <= right) {
    while (list[left] <= pivot) left++;
    while (list[right] > pivot) right--;

    if (left < right) {
      swap(list, left, right);
      await swapElements(left, right, low);
    }
  }

  swap(list, low, right);
  await swapElements(low, right, low);

  setPivot(right);

  return right;
};

const quickSort = async (
  list: number[],
  low: number,
  high: number,
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void,
  setPivot: (idx: number) => void
) => {
  if (low > high) return;

  // await iteratingOver(low, high);

  const pIndex = await partition(
    list,
    low,
    high,
    iteratingOver,
    swapElements,
    colorElement,
    setPivot
  );

  quickSort(list, low, pIndex - 1, iteratingOver, swapElements, colorElement, setPivot);
  quickSort(list, pIndex + 1, high, iteratingOver, swapElements, colorElement, setPivot);

  // await iteratingOver(low, high, sortedBarColor);

  return list;
};

export default quickSort;
