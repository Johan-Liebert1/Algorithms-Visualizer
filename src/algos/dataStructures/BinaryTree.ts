import { treeTraversalTypes } from "@/constants/dsAlgoConstants";
import { arrayToListRepr } from "@/helpers/helper";
import TreeNode from "./TreeNode";

// 75,100,60,25,12,30

// 8,12,1,9,11,18

class BinaryTree {
  root: TreeNode | null;
  highlightNode: (uuid: string) => Promise<void>;
  drawBinaryTreeNode: (
    parentNode: TreeNode,
    newNode: TreeNode,
    side: "leftArrow" | "rightArrow",
    depth: number
  ) => void;
  putTextOnCanvas: (text: string, x?: number, y?: number) => void;

  constructor(
    highlightNode: (uuid: string) => Promise<void>,
    drawBinaryTreeNode: (
      parentNode: TreeNode,
      newNode: TreeNode,
      side: "leftArrow" | "rightArrow",
      depth: number
    ) => void,
    putTextOnCanvas: (text: string, x?: number, y?: number) => void
  ) {
    this.root = null;
    this.highlightNode = highlightNode;
    this.drawBinaryTreeNode = drawBinaryTreeNode;
    this.putTextOnCanvas = putTextOnCanvas;
  }

  search(value: number, currentNode = this.root): TreeNode | null {
    if (!currentNode) return null;

    if (currentNode.value === value) return currentNode;

    const nextNode =
      value < currentNode.value ? currentNode.leftChild : currentNode.rightChild;

    this.search(value, nextNode);

    return null;
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
      this.root = new TreeNode(value);
      return this;
    }

    if (!currentNode) return this;

    const nextNode =
      value >= currentNode.value ? currentNode.rightChild : currentNode.leftChild;

    if (!currentNode.leftChild && value < currentNode.value) {
      const newNode = new TreeNode(value);
      currentNode.leftChild = newNode;

      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "leftArrow", depth);
    } else if (!currentNode.rightChild && value >= currentNode.value) {
      const newNode = new TreeNode(value);
      currentNode.rightChild = newNode;

      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "rightArrow", depth);
    } else {
      await this.highlightNode(currentNode.uuid);
      this.insert(value, nextNode, depth + 1);
    }
    return this;
  }

  deleteNode(value: number) {
    const nodeToDelete = this.search(value);

    console.log({ nodeToDelete }, nodeToDelete?.value);

    if (!nodeToDelete) return null;

    // the largestLeftChild will be larger than all numbers to the left of the nodeToDelete
    // and will be smaller than all the numbers to the right of the nodeToDelete
    const largestLeftChild = this.findLargestLeftChild(nodeToDelete);

    console.log({ largestLeftChild }, largestLeftChild.value);

    // swap the nodeToDelete with the largestLeftChild, then delete the largestLeftChild
    // will be easy as it's a leaf node

    const temp = nodeToDelete.value;
    largestLeftChild.value = temp;
    nodeToDelete.value = temp;

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
}

export default BinaryTree;
