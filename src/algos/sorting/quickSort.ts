import { baseBarColor, sortedBarColor } from "@/constants/sortingAlgoConstants";
import { swap } from "./swap";

const partition = async (
  list: number[],
  low: number,
  high: number,
  iteratingOver: (idx1: number, idx2: number) => void,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void
) => {
  const pivot = list[low];
  let left = low + 1;
  let right = high;

  colorElement(low, "#000");

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

  colorElement(right, "#000");

  return right;
};

const quickSort = async (
  list: number[],
  low: number,
  high: number,
  iteratingOver: (idx1: number, idx2: number, color?: string) => void,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void
) => {
  if (low > high) return;

  // iteratingOver(0, list.length - 1);

  const pIndex = await partition(
    list,
    low,
    high,
    iteratingOver,
    swapElements,
    colorElement
  );

  quickSort(list, low, pIndex - 1, iteratingOver, swapElements, colorElement);
  quickSort(list, pIndex + 1, high, iteratingOver, swapElements, colorElement);

  return list;
};

export default quickSort;
