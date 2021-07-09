<template>
  <div>
    <AlgoNavBar
      :algorithmsList="allMainDsAlgos"
      :buttonsList="[]"
      :selectedAlgo="selectedMainDsAlgo.name"
      @algorithmChanged="algorithmChanged"
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
              @keydown="$event.key === 'Enter' ? addNode() : ''"
            />
            <button class="button is-success is-small" @click="addNode">
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
import { defineComponent, ref } from "vue";
import paper from "paper";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";

// constants
import {
  allDsAlgosObject,
  ARROW_LENGTH,
  ARROW_NODE_MARGIN,
  ARROW_TRIANGLE_RADIUS,
  headPointerColor,
  nodeHoverColor,
  nodeStrokeColor,
  NODE_SIZE,
  pointerColor1,
  textStrokeColor,
  transparent,
  treeTraversalTypes,
  TREE_ARROW_ANGLE,
  TREE_ARROW_LENGTH
} from "@/constants/dsAlgoConstants";

// types
import LinkedList from "@/algos/dataStructures/LinkedList";
import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import SVG from "@/components/Svg.vue";
import { svgNames } from "@/constants/globalConstants";
import BinaryTree from "@/algos/dataStructures/BinaryTree";
import { numStr } from "@/types/global";
import TreeNode from "@/algos/dataStructures/TreeNode";

export default defineComponent({
  components: { AlgoNavBar },

  setup() {
    const allMainDsAlgos = Object.values(allDsAlgosObject).map(v => v.name);

    const nullNode: paper.Path.Rectangle = {} as paper.Path.Rectangle;
    const canvas = ref<HTMLCanvasElement>();

    // for linked lists
    const linkedListNodes: {
      node: paper.Path.Rectangle;
      arrowNext: paper.Group;
      pointers: paper.Group[];
    }[] = [];

    const linkedListStartPointer = {} as { pointer: paper.Group; index: number };
    let myLinkedList: LinkedList = {} as LinkedList;

    // for trees
    const binaryTreeNodesList: {
      // uuid will be used to hightlight the node
      [uuid: string]: {
        node: paper.Path.Rectangle;
        leftArrow: paper.Group;
        rightArrow: paper.Group;
      };
    } = {};

    const myBinaryTree: BinaryTree = {} as BinaryTree;

    return {
      allDsAlgosObject,
      allMainDsAlgos,
      linkedListNodes,
      linkedListStartPointer,
      myLinkedList,
      nullNode,
      svgNames,
      binaryTreeNodesList,
      canvas,
      myBinaryTree
    };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.BINARY_TREES,
      addNewNodeValue: 0 as numStr,
      animationSpeed: 500,
      navbarButtons: {
        [allDsAlgosObject.LINKED_LIST.name]: [
          {
            name: "Reversing a Linked List",
            handler: this.reverseLinkedList
          }
        ],
        [allDsAlgosObject.BINARY_TREES.name]: [
          {
            name: "Inorder Traversal",
            handler: () => this.traverseBinaryTree("inorder")
          },
          {
            name: "Preorder Traversal",
            handler: () => this.traverseBinaryTree("preorder")
          },
          {
            name: "Postorder Traversal",
            handler: () => this.traverseBinaryTree("postorder")
          }
        ]
      }
    };
  },

  methods: {
    algorithmChanged(value: string) {
      this.clearCanvas();

      switch (value) {
        case allDsAlgosObject.LINKED_LIST.name:
          this.selectedMainDsAlgo = allDsAlgosObject.LINKED_LIST;
          this.createNewLinkedList();
          console.log("linkedlist selected");
          break;

        case allDsAlgosObject.BINARY_TREES.name:
          this.selectedMainDsAlgo = allDsAlgosObject.BINARY_TREES;
          this.createNewBinaryTree();
          break;

        case allDsAlgosObject.HEAP.name:
          this.selectedMainDsAlgo = allDsAlgosObject.HEAP;
          console.log("HEAP selected");
          break;

        default:
          break;
      }
    },

    addNode() {
      switch (this.selectedMainDsAlgo.name) {
        case allDsAlgosObject.LINKED_LIST.name:
          this.addNodeToLinkedList();
          break;

        case allDsAlgosObject.BINARY_TREES.name:
          this.addNodeToBinaryTree();
          break;

        case allDsAlgosObject.HEAP.name:
          this.selectedMainDsAlgo = allDsAlgosObject.HEAP;
          console.log("HEAP selected");
          break;

        default:
          break;
      }
    },

    // ================================= GLOBAL DRAWING STUFF ========================
    clearCanvas() {
      if (this.linkedListStartPointer.pointer instanceof paper.Group)
        this.linkedListStartPointer.pointer.remove();
      this.linkedListStartPointer = {} as { pointer: paper.Group; index: number };

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
        ARROW_TRIANGLE_RADIUS // radius
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

    /**
     * @param node LinkedListNode, TreeNode or Null. Value inside the node will be the value of the node if it exists, else will be 'NULL'
     * @param x x co-ordinate of the node
     * @param y y co-ordinate of the node
     */
    drawNode(node: llNodeNull | TreeNode, x: number, y: number): paper.Path.Rectangle {
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

      // if (!rect.children) rect.children = [];

      rect.addChild(text);

      console.log("rect = ", rect);

      return rect;
    },

    // ================== LINKED LISTS START ==========================

    createNewLinkedList() {
      this.myLinkedList = new LinkedList(
        this.drawPointerOnNode,
        this.translatePointer,
        this.rotateArrow,
        this.toggleArrowVisibility
      );

      this.drawLinkedList(this.myLinkedList.start);
    },

    addNodeToLinkedList() {
      this.myLinkedList.insert(this.addNewNodeValue);
      this.clearCanvas();

      this.drawLinkedList(this.myLinkedList.start);
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
    },

    // ============================== TREES START ================================

    traverseBinaryTree(traversalType: treeTraversalTypes) {
      const list: number[] = [];
      this.myBinaryTree.treeTraversal(list, traversalType);
    },

    createNewBinaryTree() {
      this.myBinaryTree = new BinaryTree(this.highlightNode, this.drawBinaryTreeNode);
      this.drawBinaryTreeRoot();
    },

    addNodeToBinaryTree() {
      // 75,100,60,25,12,30
      if (this.addNewNodeValue.toString().includes(",")) {
        this.addNewNodeValue
          .toString()
          .split(",")
          .forEach(spl => this.myBinaryTree.insert(Number(spl)));
      } else {
        this.myBinaryTree.insert(Number(this.addNewNodeValue));
      }

      if (!this.myBinaryTree.root?.leftChild && !this.myBinaryTree.root?.rightChild) {
        this.clearCanvas();
        this.drawBinaryTreeRoot();
      }
    },

    highlightNode(uuid: string): Promise<void> {
      const node = this.binaryTreeNodesList[uuid].node;

      node.fillColor = nodeHoverColor;

      return new Promise(r =>
        setTimeout(() => {
          node.fillColor = transparent;
          r();
        }, 500)
      );
    },

    checkNodeHit() {
      for (const object of Object.values(this.binaryTreeNodesList)) {
        for (const object2 of Object.values(this.binaryTreeNodesList)) {
          if (object.node.intersects(object2.node)) console.log("intersect");
        }
      }
    },

    drawBinaryTreeNode(
      parentNode: TreeNode,
      newNode: TreeNode,
      side: "leftArrow" | "rightArrow",
      depth: number
    ) {
      // center of the new node is that the end of the tip of the arrow
      // of the parent node
      let { x, y } = this.binaryTreeNodesList[parentNode.uuid][side].children[1].position;

      // make parent's arrow visible
      this.binaryTreeNodesList[parentNode.uuid][side].visible = true;

      y += ARROW_TRIANGLE_RADIUS;

      if (side === "leftArrow") x -= NODE_SIZE;

      const drawnNode = this.drawNode(newNode, x, y);

      const { x: lx, y: ly } = drawnNode.handleBounds.bottomLeft;
      const { x: rx, y: ry } = drawnNode.handleBounds.bottomRight;

      const leftArrow = this.drawArrow(lx, ly, TREE_ARROW_LENGTH / depth);
      const rightArrow = this.drawArrow(rx, ry, TREE_ARROW_LENGTH / depth);

      this.binaryTreeNodesList[newNode.uuid] = {
        node: drawnNode,
        leftArrow,
        rightArrow
      };

      leftArrow.rotate(TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(lx, ly));
      rightArrow.rotate(-TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(rx, ry));

      // hide the arrows and only show them once a child is added
      leftArrow.visible = false;
      rightArrow.visible = false;

      this.checkNodeHit();
    },

    drawBinaryTreeRoot() {
      if (!this.canvas) return;

      let x = this.canvas.width / 2.5;
      let y = 50;

      const drawnNode = this.drawNode(this.myBinaryTree.root, x, y);

      const arrow = this.drawArrow(
        drawnNode.handleBounds.topRight.x + 10,
        drawnNode.handleBounds.topRight.y + 25,
        40,
        headPointerColor,
        "ROOT"
      );

      if (this.myBinaryTree.root) {
        const { x: lx, y: ly } = drawnNode.handleBounds.bottomLeft;
        const { x: rx, y: ry } = drawnNode.handleBounds.bottomRight;

        const leftArrow = this.drawArrow(lx, ly, TREE_ARROW_LENGTH);
        const rightArrow = this.drawArrow(rx, ry, TREE_ARROW_LENGTH);

        leftArrow.rotate(TREE_ARROW_ANGLE, new paper.Point(lx, ly));
        rightArrow.rotate(-TREE_ARROW_ANGLE, new paper.Point(rx, ry));

        this.binaryTreeNodesList[this.myBinaryTree.root.uuid] = {
          node: drawnNode,
          leftArrow,
          rightArrow
        };
      }

      /*
        arrow is drawn with head pointing downwards. Bring the head to the center
        of the node and rotate the whole thing about its head
      */
      arrow.rotate(90, new paper.Point(arrow.position.x, arrow.position.y));

      // now the arrow is at the bottom of the node
      arrow.position.y = drawnNode.handleBounds.center.y;
      arrow.position.x =
        drawnNode.handleBounds.center.x + 30 + arrow.handleBounds.width / 2;

      arrow.children[2].rotate(90);
    }

    // ============================== HEAPS START =================================
  },

  mounted() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    this.canvas = canvas;

    canvas.height = window.innerHeight * 0.93;
    canvas.width = window.innerWidth * 0.8;

    paper.setup(canvas);

    const rect = new paper.Path.Rectangle(
      new paper.Point(0, 0),
      new paper.Size(canvas.width, canvas.height)
    );
    rect.fillColor = new paper.Color(0);

    this.createNewBinaryTree();
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
