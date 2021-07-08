<template>
  <div>
    <AlgoNavBar
      :algorithmsList="allMainDsAlgos"
      :buttonsList="navbarButtons"
      :selectedAlgo="selectedMainDsAlgo"
      v-model:algoSpeed.sync="animationSpeed"
    />
    <div class="algo-container">
      <div class="left-panel">Left panel</div>
      <canvas id="canvas" style="height: 100%; width: 80vw;"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import paper from "paper";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";

// constants
import {
  allDsAlgosObject,
  ARROW_LENGTH,
  ARROW_NODE_MARGIN,
  headPointerColor,
  nodeHoverColor,
  nodeStrokeColor,
  NODE_SIZE,
  pointerColor1,
  textStrokeColor,
  transparent
} from "@/constants/dsAlgoConstants";

// types
import { ButtonsArray } from "@/types/global";
import { node } from "@/types/dsAlgo";
import LinkedList from "@/algos/dataStructures/LinkedList";
import LinkedListNode, { llNodeNull } from "@/algos/dataStructures/LinkedListNode";

export default defineComponent({
  components: { AlgoNavBar },

  setup() {
    const allMainDsAlgos = Object.values(allDsAlgosObject).map(v => v.name);

    const linkedListNodes: {
      node: paper.Path.Rectangle;
      arrowNext: paper.Group;
      pointers: paper.Group[];
    }[] = [];

    const linkedListStartPointer = {} as { pointer: paper.Group; index: number };

    let myLinkedList: LinkedList = {} as LinkedList;

    const nullNode: paper.Path.Rectangle = {} as paper.Path.Rectangle;

    return {
      allDsAlgosObject,
      allMainDsAlgos,
      linkedListNodes,
      linkedListStartPointer,
      myLinkedList,
      nullNode
    };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.LINKED_LIST.name,
      animationSpeed: 500,
      navbarButtons: [
        {
          text: "Start",
          class: "button is-success",
          handler: () => this.reverseLinkedList()
        },
        {
          text: "Clear Path",
          class: "button is-warning",
          handler: () => {
            console.log("hi");
          }
        },
        {
          text: "Reset Board",
          class: "button is-danger",
          handler: () => {
            console.log("hi");
          }
        }
      ] as ButtonsArray[]
    };
  },

  methods: {
    reverseLinkedList() {
      console.log(this.myLinkedList);
      this.myLinkedList.reverse();
    },

    drawArrow(
      x1: number,
      y1: number,
      length: number,
      color?: paper.Color,
      text?: string
    ): paper.Group {
      if (!color) {
        color = nodeHoverColor;
      }

      const line = new paper.Path.Line(
        new paper.Point(x1, y1),
        new paper.Point(x1, y1 + length)
      );
      line.strokeWidth = 3;

      const triangle = new paper.Path.RegularPolygon(
        new paper.Point(x1, y1 + length),
        3, // number of sides
        7 // radius
      );
      triangle.rotate(180);

      const group = new paper.Group([line, triangle]);
      group.fillColor = color;
      group.strokeColor = color;

      return group;
    },

    toggleArrowVisibility(index: number, show?: boolean) {
      if (show === undefined) {
        this.linkedListNodes[index].arrowNext.visible = !this.linkedListNodes[index]
          .arrowNext.visible;
      } else this.linkedListNodes[index].arrowNext.visible = show;
    },

    rotateArrow(index: number, animate = true): Promise<void> {
      if (index >= this.linkedListNodes.length) return new Promise(r => r());

      let dTheta = 1;
      const arrow = this.linkedListNodes[index].arrowNext;
      let i = 0;

      if (animate) {
        const time = this.animationSpeed / 50;
        const interval = setInterval(() => {
          if (i >= 180) clearInterval(interval);

          arrow.rotate(dTheta);
          i++;
        }, time);
        return new Promise(r => setTimeout(r, time * 2 * 180));
      } else {
        arrow.rotate(180);
      }
      return new Promise(r => r());
    },

    drawNode(node: llNodeNull, x: number, y: number): paper.Path.Rectangle {
      const startingPoint = new paper.Point(x, y);
      const endingPoint = new paper.Point(x + NODE_SIZE, y + NODE_SIZE);
      const middlePoint = new paper.Point(
        (startingPoint.x + endingPoint.x) / 2,
        startingPoint.y
      );

      const textContent = node ? node.repr() : "NULL";

      const text = new paper.PointText(middlePoint);
      text.justification = "center";
      text.fillColor = textStrokeColor;
      text.content = textContent;
      text.scale(1.2);

      const temp = new paper.Rectangle(startingPoint, endingPoint);

      const rect = new paper.Path.Rectangle(temp, new paper.Size(5, 5));
      rect.strokeColor = nodeStrokeColor;

      text.position.y += NODE_SIZE / 2 + text.handleBounds.height / 4;

      return rect;
    },

    drawPointerOnNode(index: number, color?: paper.Color, top = false, add = true): void {
      if (!color) color = pointerColor1;

      const { node } = this.linkedListNodes[index];

      const getValuesFrom = top
        ? node.handleBounds.topRight
        : node.handleBounds.bottomRight;

      const { x, y } = getValuesFrom;

      const arrow = this.drawArrow(x, y, 30, color);

      arrow.position.x -= NODE_SIZE / 2;

      if (!top) {
        arrow.position.y +=
          ARROW_NODE_MARGIN + this.linkedListNodes[index].pointers.length * ARROW_LENGTH;
        arrow.rotate(180);
      } else {
        arrow.position.y -= arrow.handleBounds.height + ARROW_NODE_MARGIN;
      }

      if (!this.linkedListNodes[index].pointers) {
        this.linkedListNodes[index].pointers = [];
      }

      // we won't be adding the start pointer to a node's pointers list
      if (add) {
        this.linkedListNodes[index].pointers.push(arrow);
      } else {
        // it's a start pointer
        this.linkedListStartPointer = {
          pointer: arrow,
          index
        };
      }
    },

    removePointersFromNode(index: number) {
      this.linkedListNodes[index].pointers?.forEach(ptr => ptr.remove());
    },

    translatePointer(
      fromIdx: number,
      toIdx: number,
      startPointer = false
    ): Promise<void> {
      let pointer: paper.Group;

      if (!startPointer) {
        pointer = this.linkedListNodes[fromIdx].pointers[0];
      } else {
        pointer = this.linkedListStartPointer.pointer;
      }

      const { x: fromX, y: fromY } = pointer.position;

      let toX: number,
        withinBounds = toIdx < this.linkedListNodes.length;

      if (!withinBounds) {
        toX = this.nullNode.handleBounds.center.x;
      } else {
        toX = this.linkedListNodes[toIdx].node.handleBounds.center.x;
      }

      let toY = pointer.position.y;

      // if (!startPointer) {
      //   toY += this.linkedListNodes[toIdx].pointers.length * ARROW_LENGTH;
      // }

      const intervals = 100;

      const dx = (toX - fromX) / intervals;
      const dy = (toY - fromY) / intervals;
      let i = 0;

      const time = this.animationSpeed / 50;

      const sInterval = setInterval(() => {
        if (i === intervals) clearInterval(sInterval);

        pointer.position.x += dx;
        pointer.position.y += dy;

        i++;
      }, time);

      if (withinBounds) {
        this.linkedListNodes[fromIdx].pointers.shift();
        this.linkedListNodes[toIdx].pointers.push(pointer);
      }

      return new Promise(r => setTimeout(r, time * 2 * intervals));
    },

    drawLinkedList(startPtr: llNodeNull) {
      let ptr = startPtr;
      let x = 100,
        y = 300;

      let drawnNode: paper.Path.Rectangle;

      do {
        drawnNode = this.drawNode(ptr, x, y);

        const mouseEnter = () => {
          drawnNode.strokeColor = nodeHoverColor;
          drawnNode.fillColor = nodeHoverColor;
          // text.bringToFront();
        };

        const mouseLeave = () => {
          drawnNode.strokeColor = nodeStrokeColor;
          drawnNode.fillColor = transparent;
          // text.bringToFront();
        };

        drawnNode.onMouseEnter = mouseEnter;
        drawnNode.onMouseLeave = mouseLeave;

        x += drawnNode.handleBounds.width + ARROW_LENGTH + 20;

        const { x: x2, y: y2 } = drawnNode.handleBounds.bottomRight;

        let arrow: paper.Group;

        arrow = this.drawArrow(x2 + 5, y2, ARROW_LENGTH);
        arrow.rotate(-90, new paper.Point(x2 + 5, y2));
        arrow.position.y -= NODE_SIZE / 2;

        this.linkedListNodes.push({
          node: drawnNode,
          arrowNext: arrow,
          pointers: []
        });

        if (ptr) ptr = ptr.next;
      } while (ptr !== null);

      this.nullNode = this.drawNode(null, x, y);

      this.drawPointerOnNode(0, headPointerColor, true, false);
    }
  },

  mounted() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    canvas.height = window.innerHeight * 0.93;
    canvas.width = window.innerWidth * 0.8;

    paper.setup(canvas);

    const rect = new paper.Path.Rectangle(
      new paper.Point(0, 0),
      new paper.Size(canvas.width, canvas.height)
    );
    rect.fillColor = new paper.Color(0);

    this.myLinkedList = new LinkedList(
      this.drawPointerOnNode,
      this.translatePointer,
      this.rotateArrow,
      this.toggleArrowVisibility
    );

    this.myLinkedList
      .insert(5)
      .insert(50)
      .insert(43)
      .insert(15)
      .insert(58)
      .insert(438)
      .insert(200);

    this.drawLinkedList(this.myLinkedList.start);
  },

  created() {
    paper.install(window);
  }
});
</script>

<style scoped>
.algo-container {
  display: flex;
  align-items: center;
  height: 93vh;
  width: 100vw;
}

.algo-container .left-panel {
  height: 100%;
  width: 20vw;
}
</style>
