import { animateTreeNodeDeletion } from "@/components/dsAlgo/treeHelpers";
import { treeTraversalTypes } from "@/constants/dsAlgoConstants";
import { arrayToListRepr } from "@/helpers/helper";
import { arrowName } from "@/types/dsAlgo";
import TreeNode from "./TreeNode";

// 75,100,60,25,12,30

// 8,12,1,9,11,18

class BinaryTree {
  root: TreeNode | null;
  highlightNode: (uuid: string) => Promise<void>;
  drawBinaryTreeNode: (
    parentNode: TreeNode,
    newNode: TreeNode,
    side: arrowName,
    depth: number
  ) => void;
  putTextOnCanvas: (text: string, x?: number, y?: number) => void;
  swapNodes: (id1: string, id2: string) => Promise<void>;
  deleteNodeFromBinaryTree: (nodeToDeleteId: string, parentUuid: string) => Promise<void>;
  animateBinaryTreeInversion: (id1: string, id2: string) => Promise<void>;

  constructor(
    highlightNode: (uuid: string) => Promise<void>,
    drawBinaryTreeNode: (
      parentNode: TreeNode,
      newNode: TreeNode,
      side: arrowName,
      depth: number
    ) => void,
    putTextOnCanvas: (text: string, x?: number, y?: number) => void,
    swapNodes: (id1: string, id2: string) => Promise<void>,
    deleteNodeFromBinaryTree: (
      nodeToDeleteId: string,
      parentUuid: string
    ) => Promise<void>,
    animateBinaryTreeInversion: (id1: string, id2: string) => Promise<void>
  ) {
    this.root = null;
    this.highlightNode = highlightNode;
    this.drawBinaryTreeNode = drawBinaryTreeNode;
    this.putTextOnCanvas = putTextOnCanvas;
    this.swapNodes = swapNodes;
    this.deleteNodeFromBinaryTree = deleteNodeFromBinaryTree;
    this.animateBinaryTreeInversion = animateBinaryTreeInversion;
  }

  search(value: number, currentNode = this.root): TreeNode | null {
    if (!currentNode) return null;

    if (currentNode.value == value) return currentNode;

    const nextNode =
      value < currentNode.value ? currentNode.leftChild : currentNode.rightChild;

    return this.search(value, nextNode);
  }

  findLargestLeftChild(node: TreeNode): TreeNode {
    // find the rightmost node of the left sub-tree
    let currentNode = node.leftChild;

    for (;;) {
      // node is leaf node
      if (!currentNode || (!currentNode.leftChild && !currentNode.rightChild)) break;

      if (currentNode.rightChild) currentNode = currentNode.rightChild;
      else if (currentNode.leftChild) currentNode = currentNode.leftChild;
    }

    return currentNode || node;
  }

  async insert(value: number, currentNode = this.root, depth = 2): Promise<BinaryTree> {
    if (!this.root) {
      this.root = new TreeNode(value, 1);
      return this;
    }

    if (!currentNode) return this;

    const nextNode =
      value >= currentNode.value ? currentNode.rightChild : currentNode.leftChild;

    if (!currentNode.leftChild && value < currentNode.value) {
      const newNode = new TreeNode(value, depth);
      currentNode.leftChild = newNode;
      newNode.parent = currentNode;
      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "leftArrow", depth);
    } else if (!currentNode.rightChild && value >= currentNode.value) {
      const newNode = new TreeNode(value, depth);
      currentNode.rightChild = newNode;
      newNode.parent = currentNode;

      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "rightArrow", depth);
    } else {
      await this.highlightNode(currentNode.uuid);
      this.insert(value, nextNode, depth + 1);
    }
    return this;
  }

  async deleteNode(value: number) {
    const nodeToDelete = this.search(value);

    if (!nodeToDelete) return null;

    // the largestLeftChild will be larger than all numbers to the left of the nodeToDelete
    // and will be smaller than all the numbers to the right of the nodeToDelete
    const largestLeftChild = this.findLargestLeftChild(nodeToDelete);

    // swap the nodeToDelete with the largestLeftChild, then delete the largestLeftChild
    // will be easy as it's a leaf node
    const temp = nodeToDelete.value;
    nodeToDelete.value = largestLeftChild.value;
    largestLeftChild.value = temp;

    await this.swapNodes(nodeToDelete.uuid, largestLeftChild.uuid);

    await this.deleteNodeFromBinaryTree(
      largestLeftChild.uuid,
      (largestLeftChild.parent as TreeNode).uuid
    );

    // break the connection between the largestLeftChild and it's parentNode
    if (largestLeftChild.parent?.leftChild === largestLeftChild) {
      largestLeftChild.parent.leftChild = null;
    }

    if (largestLeftChild.parent?.rightChild === largestLeftChild) {
      largestLeftChild.parent.rightChild = null;
    }

    console.log(this);
  }

  async treeTraversal(
    array: number[],
    traversalType: treeTraversalTypes = "inorder",
    currentNode = this.root
  ) {
    if (!currentNode) return;

    if (traversalType === "preorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    if (currentNode.leftChild) {
      await this.treeTraversal(array, traversalType, currentNode.leftChild);
    }

    if (traversalType === "inorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    if (currentNode.rightChild) {
      await this.treeTraversal(array, traversalType, currentNode.rightChild);
    }

    if (traversalType === "postorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    return array;
  }

  async invertBinaryTree(currentNode = this.root) {
    if (!currentNode || (!currentNode.leftChild && !currentNode.rightChild)) return;

    if (currentNode.leftChild && !currentNode.rightChild) {
      this.insert(currentNode.leftChild.value, currentNode, currentNode.depth + 1);
    }

    if (currentNode.rightChild && !currentNode.leftChild) {
      this.insert(currentNode.rightChild.value, currentNode, currentNode.depth + 1);
    }

    // swap nodes
    const temp = currentNode.leftChild;
    currentNode.leftChild = currentNode.rightChild;
    currentNode.rightChild = temp;

    await this.animateBinaryTreeInversion(
      <string>currentNode.leftChild?.uuid,
      <string>currentNode.rightChild?.uuid
    );

    await this.invertBinaryTree(currentNode.leftChild);
    await this.invertBinaryTree(currentNode.rightChild);
  }
}

export default BinaryTree;
