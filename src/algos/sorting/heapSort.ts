import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import { swap } from "./swap";

class Heap {
  heap: number[];
  list: number[];
  maxHeap: boolean;
  swapElements: (idx1: number, idx2: number) => Promise<void>;
  colorElement: (idx: number, color?: string) => void;

  constructor(
    list: number[],
    maxHeap: boolean,
    swapElements: (idx1: number, idx2: number) => Promise<void>,
    colorElement: (idx: number, color?: string) => void
  ) {
    this.list = list;
    this.heap = [];
    this.maxHeap = maxHeap;
    this.swapElements = swapElements;
    this.colorElement = colorElement;
  }

  getLeftChild = (index: number) => 2 * index;

  getRightChild = (index: number) => 2 * index + 1;

  getBothChildren = (index: number) => [
    this.getLeftChild(index),
    this.getRightChild(index)
  ];

  getParent = (index: number) => Math.floor(index / 2);

  bubbleUp = async (index: number) => {
    for (;;) {
      const parentIdx = this.getParent(index);
      if (parentIdx < 1) break;

      if (this.maxHeap) {
        // generating a max-heap
        if (this.heap[parentIdx] > this.heap[index]) break;
      } else {
        if (this.heap[parentIdx] < this.heap[index]) break;
      }

      swap(this.heap, parentIdx, index);
      await this.swapElements(parentIdx - 1, index - 1);

      index = parentIdx;
    }
  };

  deleteFromHeap = async (heapEnd: number) => {
    /*  
    1. Swap the root with the last leaf
    2. Bubble down to find the correct place for the new root
  */

    swap(this.heap, 1, heapEnd);
    await this.swapElements(0, heapEnd - 1);

    let index = 1;

    // decrease the heap end as we've deleted one element
    heapEnd--;

    for (;;) {
      // max-heap

      const [leftChildIdx, rightChildIdx] = this.getBothChildren(index);

      if (leftChildIdx >= heapEnd && rightChildIdx >= heapEnd) break;

      let childToTest;

      if (!this.heap[leftChildIdx]) {
        childToTest = rightChildIdx;
      } else if (!this.heap[rightChildIdx]) {
        childToTest = leftChildIdx;
      } else {
        const condition = this.maxHeap
          ? this.heap[leftChildIdx] > this.heap[rightChildIdx]
          : this.heap[leftChildIdx] < this.heap[rightChildIdx];

        childToTest = condition ? leftChildIdx : rightChildIdx;
      }

      if (this.maxHeap) {
        if (this.heap[childToTest] <= this.heap[index]) break;
      } else {
        if (this.heap[childToTest] >= this.heap[index]) break;
      }

      swap(this.heap, index, childToTest);
      await this.swapElements(index - 1, childToTest - 1);

      index = childToTest;
    }
  };

  heapify = async () => {
    this.heap = [0, this.list[0]];

    for (let i = 1; i < this.list.length; i++) {
      this.heap.push(this.list[i]);

      await this.bubbleUp(i);
    }

    // as we're indexing the heap from 1 onwards
    await this.bubbleUp(this.list.length);

    return this.heap;
  };

  heapSort = async () => {
    await this.heapify();

    for (let i = 1; i < this.heap.length; i++) {
      await this.deleteFromHeap(this.heap.length - i);
    }
  };
}

const heapSort = async (
  list: number[],
  maxHeap: boolean,
  swapElements: (idx1: number, idx2: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void,
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>
): Promise<void> => {
  const heap = new Heap(list, maxHeap, swapElements, colorElement);
  await heap.heapSort();

  iteratingOver(0, list.length - 1, sortedBarColor);
};

export default heapSort;
