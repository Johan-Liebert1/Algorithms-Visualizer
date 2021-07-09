class TreeNode {
  value: number;
  leftChild: TreeNode | null;
  rightChild: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.leftChild = null;
    this.rightChild = null;
  }
}

export default TreeNode;
