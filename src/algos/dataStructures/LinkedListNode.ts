import { numStr } from "@/types/global";

export type llNodeNull = LinkedListNode | null;

class LinkedListNode {
  value: numStr;
  next: llNodeNull;
  previous: llNodeNull;

  constructor(value: numStr) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

export default LinkedListNode;
