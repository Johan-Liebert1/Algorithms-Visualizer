import { randomId } from "@/helpers/helper";

class TreeNode {
  value: number;
  leftChild: TreeNode | null;
  rightChild: TreeNode | null;
  uuid: string;

  constructor(value: number) {
    this.value = value;
    this.leftChild = null;
    this.rightChild = null;
    this.uuid = randomId();
  }
}

export default TreeNode;
