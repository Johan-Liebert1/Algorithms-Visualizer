import { treeTraversalTypes } from "@/constants/dsAlgoConstants";
import { numStr } from "@/types/global";
import TreeNode from "./TreeNode";

class BinaryTree {
  root: TreeNode | null;
  highlightNode: (uuid: string) => Promise<void>;
  drawBinaryTreeNode: (
    parentNode: TreeNode,
    newNode: TreeNode,
    side: "leftArrow" | "rightArrow",
    depth: number
  ) => void;

  constructor(
    highlightNode: (uuid: string) => Promise<void>,
    drawBinaryTreeNode: (
      parentNode: TreeNode,
      newNode: TreeNode,
      side: "leftArrow" | "rightArrow",
      depth: number
    ) => void
  ) {
    this.root = null;
    this.highlightNode = highlightNode;
    this.drawBinaryTreeNode = drawBinaryTreeNode;
  }

  insert(value: number, currentNode = this.root, depth = 2): BinaryTree {
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
      this.drawBinaryTreeNode(currentNode, newNode, "leftArrow", depth);
    } else if (!currentNode.rightChild && value >= currentNode.value) {
      const newNode = new TreeNode(value);
      currentNode.rightChild = newNode;
      this.drawBinaryTreeNode(currentNode, newNode, "rightArrow", depth);
    } else {
      this.insert(value, nextNode, depth + 1);
    }
    return this;
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
    }

    if (currentNode.leftChild) {
      await this.treeTraversal(array, traversalType, currentNode.leftChild);
    }

    if (traversalType === "inorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
    }

    if (currentNode.rightChild) {
      await this.treeTraversal(array, traversalType, currentNode.rightChild);
    }

    if (traversalType === "postorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
    }

    return array;
  }
}

export default BinaryTree;
