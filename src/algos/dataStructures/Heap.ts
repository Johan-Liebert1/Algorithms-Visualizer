import TreeNode from "./TreeNode";

class HeapImplemented {
  heap: TreeNode[];
  isMaxHeap: boolean;
  highlightNode: (uuid: string) => Promise<void>;
  drawBinaryTreeNode: (
    parentNode: TreeNode,
    newNode: TreeNode,
    side: "leftArrow" | "rightArrow",
    depth: number
  ) => void;

  constructor(
    isMaxHeap: boolean,
    highlightNode: (uuid: string) => Promise<void>,
    drawBinaryTreeNode: (
      parentNode: TreeNode,
      newNode: TreeNode,
      side: "leftArrow" | "rightArrow",
      depth: number
    ) => void
  ) {
    this.heap = [];
    this.isMaxHeap = isMaxHeap;
    this.highlightNode = highlightNode;
    this.drawBinaryTreeNode = drawBinaryTreeNode;
  }

  async insert(value: number): Promise<HeapImplemented> {
    return this;
  }
}

export default HeapImplemented;
