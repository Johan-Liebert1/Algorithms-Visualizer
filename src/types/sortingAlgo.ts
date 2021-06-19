export type sortingAlgoNames =
  | "bubbleSort"
  | "insertionSort"
  | "selectionSort"
  | "mergeSort"
  | "quickSort";

export interface heightAndColor {
  height: number;
  color: string;
}

export interface swaps {
  swap: number[];
  color: string;
}
