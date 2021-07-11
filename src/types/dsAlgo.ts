import LinkedListNode from "@/algos/dataStructures/LinkedListNode";
import TreeNode from "@/algos/dataStructures/TreeNode";

export type node = LinkedListNode | null;

export type paperJsNode = {
  rect: paper.Path.Rectangle;
  text: paper.PointText;
};

export type heapNode = {
  [index: number]: {
    // tree node could've been a number, but in order to use the same function that draws a binary tree
    // it's type is TreeNode | null
    treeNode: TreeNode | null;
    node: paperJsNode;
    leftArrow: paper.Group;
    rightArrow: paper.Group;
  };
};

export type binaryTreeNode = {
  node: paperJsNode;
  leftArrow: paper.Group;
  rightArrow: paper.Group;
};

export type linkedListNodesList = {
  node: paperJsNode;
  arrowNext: paper.Group;
  pointers: paper.Group[];
};
