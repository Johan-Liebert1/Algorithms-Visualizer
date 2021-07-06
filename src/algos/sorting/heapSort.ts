import { swap } from "./swap";

const getLeftChild = (index: number) => 2 * index;
const getRightChild = (index: number) => 2 * index + 1;
const getBothChildren = (index: number) => [getLeftChild(index), getRightChild(index)];
const getParent = (index: number) => Math.floor(index / 2);

const bubbleUp = (heap: number[], index: number) => {
  for (;;) {
    let parentIdx = getParent(index);
    if (parentIdx < 1) break;

    // generating a max-heap
    if (heap[parentIdx] > heap[index]) break;

    swap(heap, parentIdx, index);

    index = parentIdx;
  }
};

const deleteFromHeap = (heap: number[], heapEnd: number) => {
  /*  
    1. Swap the root with the last leaf
    2. Bubble down to find the correct place for the new root
  */

  swap(heap, 1, heapEnd);
  let index = 1;

  // decrease the heap end as we've deleted one element
  heapEnd--;

  for (;;) {
    // max-heap

    const [leftChildIdx, rightChildIdx] = getBothChildren(index);

    if (leftChildIdx >= heapEnd && rightChildIdx >= heapEnd) break;

    let greaterChild;

    if (!heap[leftChildIdx]) {
      greaterChild = rightChildIdx;
    } else if (!heap[rightChildIdx]) {
      greaterChild = leftChildIdx;
    } else {
      greaterChild =
        heap[leftChildIdx] > heap[rightChildIdx] ? leftChildIdx : rightChildIdx;
    }

    if (heap[greaterChild] <= heap[index]) break;

    swap(heap, index, greaterChild);

    index = greaterChild;
  }
};

const heapify = (list: number[]) => {
  const heap = [0, list[0]];

  for (let i = 1; i < list.length; i++) {
    heap.push(list[i]);

    bubbleUp(heap, i);
  }

  // as we're indexing the heap from 1 onwards
  bubbleUp(heap, list.length);

  return heap;
};

const heapSort = (list: number[]) => {
  const heap = heapify(list);

  for (let i = 1; i < heap.length; i++) {
    deleteFromHeap(heap, heap.length - i);
  }

  return heap;
};

// prettier-ignore
const l = [61, 72, 99, 37, 38, 91, 63, 93, 14, 19, 35, 83, 55, 47, 98, 61, 35, 84, 32, 73]

console.log(heapSort(l));
