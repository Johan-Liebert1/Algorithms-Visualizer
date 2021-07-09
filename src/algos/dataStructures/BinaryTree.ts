import { treeTraversalTypes } from "@/constants/dsAlgoConstants";
import TreeNode from "./TreeNode";

class BinaryTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number, currentNode = this.root): BinaryTree {
    if (!this.root) {
      this.root = new TreeNode(value);
      return this;
    }

    if (!currentNode) return this;

    const nextNode =
      value >= currentNode.value ? currentNode.rightChild : currentNode.leftChild;

    if (!currentNode.leftChild && value < currentNode.value) {
      currentNode.leftChild = new TreeNode(value);
    } else if (!currentNode.rightChild && value >= currentNode.value) {
      currentNode.rightChild = new TreeNode(value);
    } else {
      this.insert(value, nextNode);
    }
    return this;
  }

  async treeTraversal(
    array: number[],
    currentNode = this.root,
    traversalType: treeTraversalTypes = "inorder"
  ) {
    if (!currentNode) return;

    if (traversalType === "preorder") array.push(currentNode.value);

    if (currentNode.leftChild) {
      this.treeTraversal(array, currentNode.leftChild);
    }

    if (traversalType === "inorder") array.push(currentNode.value);

    if (currentNode.rightChild) {
      this.treeTraversal(array, currentNode.rightChild);
    }

    if (traversalType === "postorder") array.push(currentNode.value);

    return array;
  }
}

export default BinaryTree;
