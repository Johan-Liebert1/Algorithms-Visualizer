import { pointerColor1, pointerColor2, pointerColor3 } from "@/constants/dsAlgoConstants";
import { sleep } from "@/helpers/helper";
import { numStr } from "@/types/global";
import LinkedListNode, { llNodeNull } from "./LinkedListNode";

class LinkedList {
  start: llNodeNull;
  length: number;
  drawPointerOnNode: (
    index: number,
    color?: paper.Color,
    top?: boolean,
    add?: boolean,
    textString?: string
  ) => void;
  translatePointer: (
    fromIdx: number,
    toIdx: number,
    startPointer?: boolean
  ) => Promise<void>;
  rotateArrow: (index: number, animate?: boolean) => Promise<void>;
  toggleArrowVisibility: (index: number, show?: boolean) => void;

  constructor(
    drawPointerOnNode: (
      index: number,
      color?: paper.Color,
      top?: boolean,
      add?: boolean,
      textString?: string
    ) => void,
    translatePointer: (
      fromIdx: number,
      toIdx: number,
      startPointer?: boolean
    ) => Promise<void>,
    rotateArrow: (index: number, animate?: boolean) => Promise<void>,
    toggleArrowVisibility: (index: number, show?: boolean) => void
  ) {
    this.start = null;
    this.length = 0;
    this.drawPointerOnNode = drawPointerOnNode;
    this.translatePointer = translatePointer;
    this.rotateArrow = rotateArrow;
    this.toggleArrowVisibility = toggleArrowVisibility;
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
    this.length++;

    const newNode = new LinkedListNode(value);

    if (!this.start) {
      newNode.index = 0;
      this.start = newNode;
      return this;
    }

    let ptr = this.start;

    while (ptr.next !== null) ptr = ptr.next;

    newNode.index = ptr.index + 1;
    ptr.next = newNode;

    return this;
  }

  async reverse(): Promise<void> {
    let p1, p2, p3;

    p1 = this.start as LinkedListNode;
    p2 = p1.next as LinkedListNode;
    p3 = p2.next as LinkedListNode;

    this.drawPointerOnNode(0, pointerColor1, false, true, "ptr 1");
    this.drawPointerOnNode(1, pointerColor2, false, true, "ptr 2");
    this.drawPointerOnNode(2, pointerColor3, false, true, "ptr 3");

    await sleep(1000);

    for (;;) {
      p2.next = p1;

      this.toggleArrowVisibility(p2.index, false);
      await this.rotateArrow(p1.index, false);
      this.toggleArrowVisibility(p1.index, true);

      if (p3) await this.translatePointer(p1.index, p1.index + 1);

      await this.translatePointer(p2.index, p2.index + 1);

      if (p3) await this.translatePointer(p3.index, p3.index + 1);

      if (!p2 || !p3) break;

      p1 = p2;
      p2 = p3;
      p3 = p3.next;
    }

    (this.start as LinkedListNode).next = null;
    this.start = p2;

    this.translatePointer(0, p2.index, true);
  }
}

export default LinkedList;
