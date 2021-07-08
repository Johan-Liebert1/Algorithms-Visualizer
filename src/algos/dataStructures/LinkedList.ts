import { numStr } from "@/types/global";
import LinkedListNode, { llNodeNull } from "./LinkedListNode";

class LinkedList {
  start: llNodeNull;
  length: number;

  constructor() {
    this.start = null;
    this.length = 0;
  }

  traverse(): string {
    let ptr = this.start;
    let str = "";

    while (ptr !== null) {
      str += ptr.value + " -> ";
      ptr = ptr.next;
    }

    return str.slice(0, str.length - 3);
  }

  insert(value: numStr): LinkedList {
    const newNode = new LinkedListNode(value);

    if (!this.start) {
      this.start = newNode;
      return this;
    }

    let ptr = this.start;

    while (ptr.next !== null) ptr = ptr.next;

    ptr.next = newNode;

    return this;
  }

  reverse() {
    let p1, p2, p3;

    p1 = this.start as LinkedListNode;
    p2 = p1.next as LinkedListNode;
    p3 = p2.next as LinkedListNode;

    for (;;) {
      p2.next = p1;

      if (!p2 || !p3) break;

      p1 = p2;
      p2 = p3;
      p3 = p3.next;
    }

    (this.start as LinkedListNode).next = null;
    this.start = p2;

    console.log(this.traverse());
  }
}

export default LinkedList;
