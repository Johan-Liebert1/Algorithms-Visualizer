export type sortingAlgoNames =
  | "bubbleSort"
  | "insertionSort"
  | "selectionSort"
  | "mergeSort"
  | "quickSort";

export interface sortArrayElement {
  number: number;
  barHeight: number;
  barColor: string;
}

export interface swaps {
  swap: number[];
  color: string;
}
