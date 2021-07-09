<template>
  <div>
    <AlgoNavBar
      :algorithmsList="allMainDsAlgos"
      :buttonsList="[]"
      :selectedAlgo="selectedMainDsAlgo.name"
      v-model:algoSpeed.sync="animationSpeed"
    />
    <div class="algo-container">
      <div class="left-panel">
        <div>
          <h1 class="is-size-3" style="margin: 1rem 0; text-align: center">
            {{ selectedMainDsAlgo.name }} Algorithms
          </h1>
          <div
            class="left-panel-algos"
            v-for="(algo, index) in navbarButtons[selectedMainDsAlgo.name]"
            :key="index"
            @click="algo.handler"
          >
            {{ algo.name }}
            <!-- <SVG :name="svgNames.downArrow" /> -->
          </div>
        </div>

        <div style="margin-top: 3rem">
          <p style="margin-left: 10%">Add New Node</p>
          <div class="is-flex" style="align-items: center; justify-content: space-evenly">
            <input
              type="text"
              v-model="addNewNodeValue"
              @keydown="constrainValue($event.target.value, -999, 999)"
            />
            <button class="button is-success is-small" @click="addNodeToLinkedList">
              <span class="is-size-4">+</span>
            </button>
          </div>
        </div>
      </div>
      <canvas id="canvas" style="height: 100%; width: 80vw;"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
import LinkedList from "@/algos/dataStructures/LinkedList";
import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import SVG from "@/components/Svg.vue";
import { svgNames } from "@/constants/globalConstants";

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
      nullNode,
      svgNames
    };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.LINKED_LIST,
      addNewNodeValue: 0 as number | string,
      animationSpeed: 500,
      navbarButtons: {
        [allDsAlgosObject.LINKED_LIST.name]: [
          {
            name: "Reversing a Linked List",
            handler: this.reverseLinkedList
          }
        ]
      }
    };
  },

  methods: {
    addNodeToLinkedList() {
      this.myLinkedList.insert(this.addNewNodeValue);
      this.addNewNodeValue = "";
      this.clearCanvas();

      this.drawLinkedList(this.myLinkedList.start);
    },

    clearCanvas() {
      this.linkedListStartPointer.pointer.remove();
      this.linkedListStartPointer = {} as { pointer: paper.Group; index: number };

      console.log("linkedListNodes = ", this.linkedListNodes);

      if (this.nullNode instanceof paper.Path) {
        this.nullNode.remove();
      }

      for (const obj of this.linkedListNodes) {
        obj.node.remove();
        obj.arrowNext.remove();

        for (const ptr of obj.pointers) {
          ptr.remove();
        }
      }

      this.linkedListNodes = [];

      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const rect = new paper.Path.Rectangle(
        new paper.Point(0, 0),
        new paper.Size(canvas.width, canvas.height)
      );
      rect.fillColor = new paper.Color(0);
    },

    constrainValue(min: number, max: number) {
      // console.log(value, isNaN(value));
      // if (isNaN(value)) {
      //   this.addNewNodeValue = 0;
      //   return;
      // }
      // value = parseInt(value);
      // if (value < min || value > max) return;
      // this.addNewNodeValue = value;
    },

    reverseLinkedList() {
      this.myLinkedList.reverse();
    },

    drawArrow(
      x1: number,
      y1: number,
      length: number,
      color?: paper.Color,
      textString?: string
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

      let text;

      if (textString) {
        const textY = textString === "START" ? -10 : -20;

        text = new paper.PointText(new paper.Point(x1, y1));
        text.content = textString;
        text.fillColor = headPointerColor;

        text.position.x -= text.handleBounds.width / 2;
        text.position.y += textY;

        // rotate the text again so that
        textString !== "START" && text.rotate(180);
      }

      const groupArray = text ? [line, triangle, text] : [line, triangle];

      const group = new paper.Group(groupArray);
      group.fillColor = color;
      group.strokeColor = color;

      if (text && textString !== "START") {
        group.position.y += 30;
      } else if (text) {
        group.position.y += 10;
      }

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

    /**
     * @param index index of the node on which to draw the pointer
     * @param color color of the pointer
     * @param top whether to put draw pointer on top of the node or at the bottom
     * @param add whether to add the new pointer's paper object to the node's list of pointers
     * @param textString text to show above or below the pointer
     */
    drawPointerOnNode(
      index: number,
      color?: paper.Color,
      top = false,
      add = true,
      textString?: string
    ): void {
      if (!color) color = pointerColor1;

      const { node } = this.linkedListNodes[index];

      const getValuesFrom = top
        ? node.handleBounds.topRight
        : node.handleBounds.bottomRight;

      const { x, y } = getValuesFrom;

      const arrow = this.drawArrow(x, y, 30, color, textString);

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

    /**
     * @param fromIdx Pointer of the node to be translated
     * @param toIdx Translate pointer to which node
     * @param startPointer if it's a start pointer, draw it on the top
     */
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

      let toX: number;
      let withinBounds = toIdx < this.linkedListNodes.length;

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

        // don't show any arrows to next node if linked list is empty
        if (this.myLinkedList.length === 0) arrow.visible = false;

        this.linkedListNodes.push({
          node: drawnNode,
          arrowNext: arrow,
          pointers: []
        });

        if (ptr) ptr = ptr.next;
      } while (ptr !== null);

      // draw a NULL node
      if (this.myLinkedList.length > 0) this.nullNode = this.drawNode(null, x, y);

      // draw the start pointer
      this.drawPointerOnNode(0, headPointerColor, true, false, "START");
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
  background-color: #222f3e;
}

.left-panel-algos {
  padding: 1rem 0;
  width: 100%;
  border-top: 1px solid #4eb380;
  border-bottom: 1px solid #4eb380;
  text-transform: uppercase;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.left-panel-algos:hover {
  background-color: #4eb380;
  color: #222f3e;
  cursor: pointer;
}

input {
  background-color: transparent;
  color: #4eb380;
  font-size: 1.1rem;
  padding: 0.5rem;
  border: 2px solid white;
  border-radius: 5px;
  outline: none;
  width: 60%;
}
</style>
