import { randomId } from "@/helpers/helper";

class TreeNode {
  value: number;
  leftChild: TreeNode | null;
  rightChild: TreeNode | null;
  parent: TreeNode | null;
  uuid: string;

  constructor(value: number) {
    this.value = value;
    this.leftChild = null;
    this.rightChild = null;
    this.parent = null;
    this.uuid = randomId();
  }

  repr(): string {
    return this.value.toString();
  }
}

export default TreeNode;
