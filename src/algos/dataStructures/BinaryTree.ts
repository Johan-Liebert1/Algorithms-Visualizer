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

  async inorderTraversal(array: number[], currentNode = this.root) {
    if (!currentNode) return;

    if (currentNode.leftChild) {
      this.inorderTraversal(array, currentNode.leftChild);
    }

    array.push(currentNode.value);

    if (currentNode.rightChild) {
      this.inorderTraversal(array, currentNode.rightChild);
    }

    return array;
  }

  async preorderTraversal(array: number[], currentNode = this.root) {
    if (!currentNode) return;

    array.push(currentNode.value);

    if (currentNode.leftChild) {
      this.preorderTraversal(array, currentNode.leftChild);
    }

    if (currentNode.rightChild) {
      this.preorderTraversal(array, currentNode.rightChild);
    }

    return array;
  }

  async postorderTraversal(array: number[], currentNode = this.root) {
    if (!currentNode) return;

    if (currentNode.leftChild) {
      this.postorderTraversal(array, currentNode.leftChild);
    }
    // array.push(currentNode.value);

    if (currentNode.rightChild) {
      this.postorderTraversal(array, currentNode.rightChild);
    }
    array.push(currentNode.value);

    return array;
  }
}

const bt = new BinaryTree();

bt.insert(3)
  .insert(1)
  .insert(2)
  .insert(5)
  .insert(-9)
  .insert(0)
  .insert(60)
  .insert(4)
  .insert(7)
  .insert(10)
  .insert(-12)
  .insert(-19)
  .insert(40)
  .insert(43);

// console.log(JSON.stringify(bt));
let a: number[] = [];
bt.inorderTraversal(a).then(r => console.log(r));
a = [];
bt.preorderTraversal(a).then(r => console.log(r));
a = [];
bt.postorderTraversal(a).then(r => console.log(r));

export default BinaryTree;
