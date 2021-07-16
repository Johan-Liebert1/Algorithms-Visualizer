import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import { sleep } from "@/helpers/helper";

class BogoSort {
  list: number[];
  maxElement: number;
  setArray: (newArray: number[], maxElement: number) => Promise<void>;
  iteratingOverElements: (
    index1: number,
    index2: number,
    color?: string
  ) => Promise<void>;

  constructor(
    list: number[],
    setArray: (newArray: number[], maxElement: number) => Promise<void>,
    iteratingOverElements: (
      index1: number,
      index2: number,
      color?: string
    ) => Promise<void>
  ) {
    this.list = list;
    this.maxElement = -Infinity;
    this.setArray = setArray;
    this.iteratingOverElements = iteratingOverElements;
  }

  shuffleArray = () => {
    const newList: number[] = [];
    let elementsShuffled = 0;

    while (elementsShuffled < this.list.length) {
      const randIndex = Math.floor(Math.random() * this.list.length);
      const element = this.list[randIndex];

      if (!newList.includes(element)) {
        newList.push(element);
        if (element > this.maxElement) {
          this.maxElement = element;
        }
        elementsShuffled++;
      }
    }
    this.list = Object.values(newList);
  };

  isArraySorted = (): boolean => {
    // check the monotonocity of the array, either strictly increasing or strictly decreasing
    // since numbers for vizualization are all different, don't have to check for equal numbers

    const isIncreasing = this.list[0] < this.list[1];

    if (isIncreasing) {
      for (let i = 0; i < this.list.length - 1; i++) {
        if (this.list[i + 1] < this.list[i]) return false;
      }
    } else {
      for (let i = 0; i < this.list.length - 1; i++) {
        if (this.list[i + 1] > this.list[i]) return false;
      }
    }

    return true;
  };

  bogoSort = async () => {
    for (;;) {
      this.shuffleArray();

      await this.setArray(this.list, this.maxElement);

      if (this.isArraySorted()) break;
    }

    this.iteratingOverElements(0, this.list.length - 1, sortedBarColor);
  };
}

const bogoSort = (
  array: number[],
  setArray: (newArray: number[], maxElement: number) => Promise<void>,
  iteratingOverElements: (index1: number, index2: number, color?: string) => Promise<void>
) => {
  const sorter = new BogoSort(array, setArray, iteratingOverElements);
  sorter.bogoSort();
};

export default bogoSort;
