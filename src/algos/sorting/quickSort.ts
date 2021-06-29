import { swap } from "./swap";

const quickSort = (list: number[], low: number, high: number): number[] | undefined => {
  if (low >= high) return;

  const pivot = list[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (list[j] < pivot) {
      i++;
      swap(list, i, j);
    }
  }

  swap(list, i + 1, high);

  quickSort(list, low, i);
  quickSort(list, i + 2, high);

  return list;
};

export default quickSort;
