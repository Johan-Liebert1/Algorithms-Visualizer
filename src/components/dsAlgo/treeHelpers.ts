import BinaryTree from "@/algos/dataStructures/BinaryTree";
import Heap from "@/algos/dataStructures/Heap";
import TreeNode from "@/algos/dataStructures/TreeNode";
import {
  ARROW_TRIANGLE_RADIUS,
  backgroundColor,
  headPointerColor,
  nodeStrokeColor,
  NODE_SIZE,
  TREE_ARROW_ANGLE,
  TREE_ARROW_LENGTH
} from "@/constants/dsAlgoConstants";
import { sleep } from "@/helpers/helper";
import { arrowName, binaryTreeNode, heapNode } from "@/types/dsAlgo";
import { drawArrow, drawNode } from "./globalHelpers";

export const drawBinaryTreeNode = (
  binaryTreeNodesList: { [uuid: string]: binaryTreeNode },
  heapNodesList: heapNode,
  parentNode: TreeNode | number,
  newNode: TreeNode | number,
  side: arrowName,
  depth: number
) => {
  let x = 0;
  let y = 0;

  // if parent node is a TreeNode then we're adding a Binary Tree Node,
  // else we're adding a heap node
  const isForTree = parentNode instanceof TreeNode;

  if (parentNode instanceof TreeNode) {
    // center of the new node is at the end of the tip of the arrow
    // of the parent node
    const { x: a, y: b } = binaryTreeNodesList[parentNode.uuid][
      side
    ].children[1].position;
    x = a;
    y = b;
    // make parent's arrow visible
    binaryTreeNodesList[parentNode.uuid][side].visible = true;
  } else {
    // it's a heap node
    const { x: a, y: b } = heapNodesList[parentNode][side].children[1].position;
    x = a;
    y = b;

    // make parent's arrow visible
    heapNodesList[parentNode][side].visible = true;
  }

  y += ARROW_TRIANGLE_RADIUS;

  if (side === "leftArrow") x -= NODE_SIZE;

  if (!(newNode instanceof TreeNode)) {
    newNode = new TreeNode(newNode);
  }

  const drawnNode = drawNode(newNode, x, y);

  const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
  const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

  const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH / depth);
  const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH / depth);

  if (isForTree) {
    binaryTreeNodesList[newNode.uuid] = {
      node: drawnNode,
      leftArrow,
      rightArrow
    };
  } else {
    const pNodeIdx = parentNode as number;
    const childNodeNum = side === "leftArrow" ? 2 * pNodeIdx : 2 * pNodeIdx + 1;

    heapNodesList[childNodeNum] = {
      treeNode: newNode,
      node: drawnNode,
      leftArrow,
      rightArrow
    };
  }

  leftArrow.rotate(TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(lx, ly));
  rightArrow.rotate(-TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(rx, ry));

  // hide the arrows and only show them once a child is added
  leftArrow.visible = false;
  rightArrow.visible = false;

  return { binaryTreeNodesList, heapNodesList };
};

/** Draw the root of a binary tree and/or a heap */
export const drawTreeRoot = (
  canvas: HTMLCanvasElement | undefined,
  binaryTreeNodesList: { [uuid: string]: binaryTreeNode },
  heapNodesList: heapNode,
  myBinaryTree: BinaryTree,
  myHeap: Heap,
  root: TreeNode | null,
  isTree = true,
  isHeap = false
) => {
  if (!canvas) return { binaryTreeNodesList, heapNodesList };

  const x = canvas.width / 2.5;
  const y = 50;

  const drawnNode = drawNode(root, x, y);

  const arrow = drawArrow(
    drawnNode.rect.handleBounds.topRight.x + 10,
    drawnNode.rect.handleBounds.topRight.y + NODE_SIZE / 2,
    40,
    headPointerColor.paperColor,
    "ROOT"
  );

  // if a root actually exists, draw it's arrows and value
  if (myBinaryTree.root || myHeap?.heap?.length > 0) {
    const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
    const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

    const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH);
    const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH);

    leftArrow.rotate(TREE_ARROW_ANGLE, new paper.Point(lx, ly));
    rightArrow.rotate(-TREE_ARROW_ANGLE, new paper.Point(rx, ry));

    leftArrow.visible = false;
    rightArrow.visible = false;

    if (isTree) {
      binaryTreeNodesList[(myBinaryTree.root as TreeNode).uuid] = {
        node: drawnNode,
        leftArrow,
        rightArrow
      };
    } else if (isHeap) {
      heapNodesList[1] = {
        treeNode: root,
        node: drawnNode,
        leftArrow,
        rightArrow
      };
    }
  }

  /*
    arrow is drawn with head pointing downwards. Bring the head to the center
    of the node and rotate the whole thing about its head
  */
  arrow.rotate(90, new paper.Point(arrow.position.x, arrow.position.y));

  // now the arrow is at the bottom of the node
  arrow.position.y = drawnNode.rect.handleBounds.center.y;
  arrow.position.x =
    drawnNode.rect.handleBounds.center.x + 30 + arrow.handleBounds.width / 2;

  arrow.children[2].rotate(90);

  return { binaryTreeNodesList, heapNodesList };
};

export const animateTreeNodeDeletion = async (
  childNode: binaryTreeNode,
  parentNode: binaryTreeNode,
  arrowToDelete: arrowName,
  animationSpeed: number
) => {
  /*  
    1. Delete the child node which will always be a leaf node
    2. Delete it's parent's arrow
  */

  // color the child node white to indicate it's going to be deleted
  childNode.node.rect.fillColor = nodeStrokeColor;
  childNode.node.text.strokeColor = backgroundColor.paperColor;
  childNode.node.text.bringToFront();

  await sleep(1500);

  const childGroup = new paper.Group([childNode.node.rect, childNode.node.text]);

  childGroup.tween({ opacity: 1 }, { opacity: 0 }, animationSpeed);
  parentNode[arrowToDelete].tween({ opacity: 1 }, { opacity: 0 }, animationSpeed);

  return new Promise(r => setTimeout(r, animationSpeed));
};
