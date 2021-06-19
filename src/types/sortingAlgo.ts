export type sortingAlgoNames =
  | "bubbleSort"
  | "insertionSort"
  | "selectionSort"
  | "mergeSort"
  | "quickSort";

export interface heightAndColor {
  height: Number;
  color: String;
}

export interface swaps {
  swap: number[];
  color: string;
}
