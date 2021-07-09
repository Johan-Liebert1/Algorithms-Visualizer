import paperCore from "paper/dist/paper-core";

export const allDsAlgosObject = Object.freeze({
  LINKED_LIST: {
    name: "Linked Lists",
    algos: ["Reversing a Linked List"]
  },
  BINARY_TREES: {
    name: "Binary Trees",
    algos: ["Reversing a Tree"]
  },
  HEAP: {
    name: "Heaps",
    algos: ["Reversing a Heap"]
  }
});

export type treeTraversalTypes = "inorder" | "preorder" | "postorder";

export const NODE_SIZE = 50;
export const ARROW_LENGTH = 40;
export const ARROW_NODE_MARGIN = 10;
export const ARROW_TRIANGLE_RADIUS = 7;

export const TREE_ARROW_ANGLE = 75;
export const TREE_ARROW_LENGTH = 175;

export const transparent = new paperCore.Color(1, 1, 1, 0);

export const nodeStrokeColor = new paperCore.Color("#fff");
export const textStrokeColor = new paperCore.Color("#fff");
export const nodeHoverColor = new paperCore.Color("#3498db");

export const headPointerColor = new paperCore.Color("#8e44ad");
export const pointerColor1 = new paperCore.Color("#e74c3c");
export const pointerColor2 = new paperCore.Color("#27ae60");
export const pointerColor3 = new paperCore.Color("#f1c40f");