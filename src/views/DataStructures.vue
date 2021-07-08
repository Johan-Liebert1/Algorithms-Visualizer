<template>
  <div>
    <AlgoNavBar
      :algorithmsList="allMainDsAlgos"
      :buttonsList="navbarButtons"
      :selectedAlgo="selectedMainDsAlgo"
    />
    <div class="algo-container">
      <div class="left-panel">Left panel</div>
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

    return { allDsAlgosObject, allMainDsAlgos };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.LINKED_LIST.name,
      navbarButtons: [
        {
          text: "Start",
          class: "button is-success",
          handler: () => {
            console.log("hi");
          }
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
      ] as ButtonsArray[],
      linkedListNodes: [] as { node: paper.Path.Rectangle; arrow: paper.Group }[]
    };
  },

  methods: {
    drawArrow(x1: number, y1: number, length: number, color?: paper.Color): paper.Group {
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

    drawNode(node: node, x: number, y: number): paper.Path.Rectangle | void {
      if (!node) return;

      const startingPoint = new paper.Point(x, y);
      const endingPoint = new paper.Point(x + NODE_SIZE, y + NODE_SIZE);
      const middlePoint = new paper.Point(
        (startingPoint.x + endingPoint.x) / 2,
        startingPoint.y
      );

      const text = new paper.PointText(middlePoint);
      text.justification = "center";
      text.fillColor = textStrokeColor;
      text.content = node.repr();
      text.scale(1.2);

      const temp = new paper.Rectangle(startingPoint, endingPoint);

      const rect = new paper.Path.Rectangle(temp, new paper.Size(5, 5));
      rect.strokeColor = nodeStrokeColor;

      text.position.y += NODE_SIZE / 2 + text.handleBounds.height / 4;

      return rect;
    },

    drawArrowBelowNode(index: number) {
      const { node } = this.linkedListNodes[index];

      const { x, y } = node.handleBounds.bottomRight;

      const arrow = this.drawArrow(x, y, 30, pointerColor1);

      arrow.position.x -= NODE_SIZE / 2;
      arrow.position.y += 10;

      arrow.rotate(180);
    },

    drawLinkedList(startPtr: llNodeNull) {
      let ptr = startPtr;
      let x = 100,
        y = 300;

      while (ptr !== null) {
        const drawnNode = this.drawNode(ptr, x, y);

        if (drawnNode) {
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

          if (ptr.next) {
            const arrow = this.drawArrow(x2 + 5, y2, ARROW_LENGTH);
            arrow.rotate(-90, new paper.Point(x2 + 5, y2));
            arrow.position.y -= NODE_SIZE / 2;

            this.linkedListNodes.push({ node: drawnNode, arrow });
          }
        }

        ptr = ptr.next;
      }
      this.drawArrowBelowNode(3);
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

    const ll = new LinkedList();

    ll.insert(5)
      .insert(50)
      .insert(43)
      .insert(15)
      .insert(58)
      .insert(438)
      .insert(200);

    this.drawLinkedList(ll.start);
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
