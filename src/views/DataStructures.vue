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
            v-if="isHeapSelected"
            class="is-flex"
            style="justify-content: center; margin-bottom: 1rem"
          >
            <label class="radio radio-label">
              <input
                type="radio"
                name="min-max-heap"
                checked
                @change="changeTypeOfHeap('Maximum')"
              />
              Max Heap
            </label>
            <label class="radio radio-label">
              <input
                type="radio"
                name="min-max-heap"
                @change="changeTypeOfHeap('Minimum')"
              />
              Min Heap
            </label>
          </div>
        </div>

        <div
          class="left-panel-algos"
          v-for="(algo, index) in navbarButtons[selectedMainDsAlgo.name]"
          :key="index"
          @click="algo.handler"
        >
          {{
            algo.name === "delete_from_heap"
              ? `Take out ${typeOfHeap} element`
              : algo.name
          }}
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
              <span class="is-size-4"><SVG :name="svgNames.plus"/></span>
            </button>
          </div>
        </div>

        <div v-if="!isHeapSelected" style="margin-top: 3rem">
          <p style="margin-left: 10%">Delete Node</p>
          <div class="is-flex" style="align-items: center; justify-content: space-evenly">
            <input
              type="text"
              v-model="deleteNodeValue"
              @keydown="$event.key === 'Enter' ? deleteNode() : ''"
            />
            <button class="button is-danger is-small" @click="deleteNode">
              <span class="is-size-4"><SVG :name="svgNames.delete"/></span>
            </button>
          </div>
        </div>

        <div class="legend">
          <h1 class="is-size-4" style="align-self: center">
            Legend
          </h1>
          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: nodeHoverColor.hex }"
            ></div>
            On this node
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: pointerColor1.hex }"
            ></div>
            Comparing Nodes
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: pointerColor2.hex }"
            ></div>
            Swapping Nodes
          </div>
        </div>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import paper from "paper";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import SVG from "@/components/Svg.vue";

import { drawArrow, drawNode, putTextOnCanvas } from "@/components/dsAlgo/globalHelpers";
import {
  animateLinkedListNodeDeletion,
  drawLinkedList,
  drawPointerOnNode,
  translatePointer
} from "@/components/dsAlgo/linkedListHelper";

// constants
import {
  allDsAlgosObject,
  ARROW_LENGTH,
  ARROW_NODE_MARGIN,
  ARROW_TRIANGLE_RADIUS,
  backgroundColor,
  headPointerColor,
  nodeDeleteColor,
  nodeHoverColor,
  nodeStrokeColor,
  NODE_SIZE,
  pointerColor1,
  pointerColor2,
  pointerColor3,
  textStrokeColor,
  transparent,
  treeTraversalTypes,
  TREE_ARROW_ANGLE,
  TREE_ARROW_LENGTH
} from "@/constants/dsAlgoConstants";

// dataStructures
import LinkedList from "@/algos/dataStructures/LinkedList";
import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import BinaryTree from "@/algos/dataStructures/BinaryTree";
import TreeNode from "@/algos/dataStructures/TreeNode";
import Heap from "@/algos/dataStructures/Heap";

// types
import { svgNames } from "@/constants/globalConstants";
import { numStr } from "@/types/global";
import {
  binaryTreeNode,
  heapNode,
  linkedListNodesList,
  typeLinkedListStartPointer,
  paperJsNode
} from "@/types/dsAlgo";

// helpers
import { sleep } from "@/helpers/helper";

export default defineComponent({
  components: { AlgoNavBar, SVG },

  setup() {
    const allMainDsAlgos = Object.values(allDsAlgosObject).map(v => v.name);

    const nullNode: paperJsNode = {} as paperJsNode;
    const canvas = ref<HTMLCanvasElement>();
    const canvasText = ref<paper.PointText>();

    // for linked lists
    const linkedListNodes: linkedListNodesList[] = [];

    const linkedListStartPointer = {} as typeLinkedListStartPointer;
    let myLinkedList: LinkedList = {} as LinkedList;

    // for trees
    const binaryTreeNodesList: {
      // uuid will be used to hightlight the node
      [uuid: string]: binaryTreeNode;
    } = {};

    const myBinaryTree: BinaryTree = {} as BinaryTree;

    // for heaps
    const heapNodesList: heapNode = {} as heapNode;

    const myHeap: Heap = {} as Heap;

    return {
      allDsAlgosObject,
      allMainDsAlgos,

      // linked list
      linkedListNodes,
      linkedListStartPointer,
      myLinkedList,
      // trees
      binaryTreeNodesList,
      myBinaryTree,
      // heaps
      heapNodesList,
      myHeap,

      nullNode,
      svgNames,
      canvas,
      canvasText,

      // colors
      headPointerColor,
      nodeHoverColor,
      pointerColor1,
      pointerColor2,
      pointerColor3
    };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.LINKED_LIST,
      addNewNodeValue: 0 as numStr,
      deleteNodeValue: 0 as numStr,
      animationSpeed: 500,
      typeOfHeap: "Maximum" as "Minimum" | "Maximum",
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
        ],
        [allDsAlgosObject.HEAP.name]: [
          {
            name: "delete_from_heap",
            handler: () => this.deleteFromHeap()
          }
        ]
      }
    };
  },

  methods: {
    algorithmChanged(value: string) {
      switch (value) {
        case allDsAlgosObject.LINKED_LIST.name:
          this.selectedMainDsAlgo = allDsAlgosObject.LINKED_LIST;
          break;

        case allDsAlgosObject.BINARY_TREES.name:
          this.selectedMainDsAlgo = allDsAlgosObject.BINARY_TREES;
          break;

        case allDsAlgosObject.HEAP.name:
          this.selectedMainDsAlgo = allDsAlgosObject.HEAP;
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
          this.addNodeToHeap();
          break;

        default:
          break;
      }
    },

    deleteNode() {
      switch (this.selectedMainDsAlgo.name) {
        case allDsAlgosObject.BINARY_TREES.name:
          this.myBinaryTree.deleteNode(Number(this.deleteNodeValue));
          break;

        case allDsAlgosObject.LINKED_LIST.name:
          this.myLinkedList.delete(this.deleteNodeValue);
          break;

        default:
          break;
      }
    },

    // ================================= GLOBAL DRAWING STUFF ========================
    clearCanvas() {
      if (this.linkedListStartPointer.pointer instanceof paper.Group) {
        this.linkedListStartPointer.pointer.remove();
      }

      this.linkedListStartPointer = {} as { pointer: paper.Group; index: number };

      if (this.nullNode instanceof paper.Path) {
        this.nullNode.remove();
      }

      for (const obj of this.linkedListNodes) {
        obj.node.rect.remove();
        obj.node.text.remove();
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
      rect.fillColor = backgroundColor.paperColor;
    },

    // ================== LINKED LISTS START ==========================

    createNewLinkedList() {
      this.myLinkedList = new LinkedList(
        this.drawPointerOnNode,
        this.translatePointer,
        this.rotateArrow,
        this.toggleArrowVisibility,
        this.animateLinkedListNodeDeletion
      );

      this.drawLinkedList(this.myLinkedList.start);
    },

    drawPointerOnNode(
      index: number,
      color?: paper.Color,
      top?: boolean,
      add?: boolean,
      textString?: string
    ) {
      const { linkedListStartPointer, linkedListNodes, nullNode } = drawPointerOnNode(
        this.linkedListNodes,
        this.nullNode,
        index,
        this.linkedListStartPointer,
        color,
        top,
        add,
        textString
      );

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;
    },

    async translatePointer(
      fromIdx: number,
      toIdx: number,
      startPointer?: boolean | undefined
    ) {
      const {
        linkedListNodes,
        nullNode,
        linkedListStartPointer
      } = await translatePointer(
        this.linkedListNodes,
        this.nullNode,
        this.linkedListStartPointer,
        fromIdx,
        toIdx,
        this.animationSpeed,
        startPointer
      );

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;
    },

    addNodeToLinkedList() {
      let array;

      if (
        typeof this.addNewNodeValue === "string" &&
        this.addNewNodeValue.includes(",")
      ) {
        array = this.addNewNodeValue.split(",").map(Number);
      } else {
        array = [this.addNewNodeValue];
      }

      array.forEach(element => {
        this.myLinkedList.insert(element);
        this.clearCanvas();

        this.drawLinkedList(this.myLinkedList.start);
      });
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

    async animateLinkedListNodeDeletion(indexToDelete: number): Promise<void> {
      const {
        linkedListNodes,
        linkedListStartPointer,
        nullNode
      } = await animateLinkedListNodeDeletion(
        this.linkedListNodes,
        this.nullNode,
        indexToDelete,
        this.animationSpeed
      );

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
    },

    drawLinkedList(startPtr: llNodeNull) {
      const { linkedListNodes, linkedListStartPointer, nullNode } = drawLinkedList(
        startPtr,
        this.myLinkedList,
        this.linkedListNodes,
        this.nullNode
      );

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
    },

    // ============================== TREES START ================================

    traverseBinaryTree(traversalType: treeTraversalTypes) {
      const list: number[] = [];
      this.myBinaryTree.treeTraversal(list, traversalType);
    },

    createNewBinaryTree() {
      this.myBinaryTree = new BinaryTree(
        this.highlightNode,
        this.drawBinaryTreeNode,
        (text: string, x?: number, y?: number) => {
          this.canvasText = putTextOnCanvas(this.canvas, this.canvasText, text, x, y);
        }
      );
      this.drawBinaryTreeRoot(this.myBinaryTree.root);
    },

    addNodeToBinaryTree() {
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
        this.drawBinaryTreeRoot(this.myBinaryTree.root);
      }
    },

    highlightNode(uuid: string | number, color?: string | paper.Color): Promise<void> {
      if (!color) color = nodeHoverColor.paperColor;

      if (typeof color === "string") color = new paper.Color(color);

      let node: paperJsNode;

      if (typeof uuid === "string") {
        // binary tree is stored as an object
        node = this.binaryTreeNodesList[uuid].node;
      } else {
        // heap is stored as an array
        node = this.heapNodesList[uuid].node;
      }

      node.rect.fillColor = color;
      node.text.bringToFront();

      return new Promise(r =>
        setTimeout(() => {
          node.rect.fillColor = transparent;
          r();
        }, this.animationSpeed)
      );
    },

    checkNodeHit() {
      for (const object of Object.values(this.binaryTreeNodesList)) {
        for (const object2 of Object.values(this.binaryTreeNodesList)) {
          if (object.node.rect.intersects(object2.node.rect)) console.log("intersect");
        }
      }
    },

    drawBinaryTreeNode(
      parentNode: TreeNode | number,
      newNode: TreeNode | number,
      side: "leftArrow" | "rightArrow",
      depth: number
    ) {
      let x = 0;
      let y = 0;

      // if parent node is a TreeNode then we're adding a Binary Tree Node,
      // else we're adding a heap node
      const isForTree = parentNode instanceof TreeNode;

      if (parentNode instanceof TreeNode) {
        // center of the new node is at the end of the tip of the arrow
        // of the parent node
        const { x: a, y: b } = this.binaryTreeNodesList[parentNode.uuid][
          side
        ].children[1].position;
        x = a;
        y = b;
        // make parent's arrow visible
        this.binaryTreeNodesList[parentNode.uuid][side].visible = true;
      } else {
        // it's a heap node
        const { x: a, y: b } = this.heapNodesList[parentNode][side].children[1].position;
        x = a;
        y = b;

        // make parent's arrow visible
        this.heapNodesList[parentNode][side].visible = true;
      }

      y += ARROW_TRIANGLE_RADIUS;

      if (side === "leftArrow") x -= NODE_SIZE;

      if (!(newNode instanceof TreeNode)) {
        newNode = new TreeNode(newNode);
      }

      const drawnNode = drawNode(newNode, x, y);

      const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
      const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

      const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH / depth);
      const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH / depth);

      if (isForTree) {
        this.binaryTreeNodesList[newNode.uuid] = {
          node: drawnNode,
          leftArrow,
          rightArrow
        };
      } else {
        const pNodeIdx = parentNode as number;
        const childNodeNum = side === "leftArrow" ? 2 * pNodeIdx : 2 * pNodeIdx + 1;
        // console.log("adding a new node to heap", { childNodeNum });

        this.heapNodesList[childNodeNum] = {
          treeNode: newNode,
          node: drawnNode,
          leftArrow,
          rightArrow
        };
      }

      leftArrow.rotate(TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(lx, ly));
      rightArrow.rotate(-TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(rx, ry));

      // hide the arrows and only show them once a child is added
      leftArrow.visible = false;
      rightArrow.visible = false;

      this.checkNodeHit();
    },

    /**
     * Draws the root node for a heap or a binary tree
     */
    drawBinaryTreeRoot(root: TreeNode | null, isTree = true, isHeap = false) {
      if (!this.canvas) return;

      let x = this.canvas.width / 2.5;
      let y = 50;

      const drawnNode = drawNode(root, x, y);

      const arrow = drawArrow(
        drawnNode.rect.handleBounds.topRight.x + 10,
        drawnNode.rect.handleBounds.topRight.y + NODE_SIZE / 2,
        40,
        headPointerColor.paperColor,
        "ROOT"
      );

      // if a root actually exists, draw it's arrows and value
      // console.log(this.myHeap.heap);
      if (this.myBinaryTree.root || this.myHeap?.heap?.length > 0) {
        // console.log("INSIDE IF");
        const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
        const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

        const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH);
        const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH);

        leftArrow.rotate(TREE_ARROW_ANGLE, new paper.Point(lx, ly));
        rightArrow.rotate(-TREE_ARROW_ANGLE, new paper.Point(rx, ry));

        leftArrow.visible = false;
        rightArrow.visible = false;

        if (isTree) {
          // console.log("is tree pushing");

          this.binaryTreeNodesList[(this.myBinaryTree.root as TreeNode).uuid] = {
            node: drawnNode,
            leftArrow,
            rightArrow
          };
        } else if (isHeap) {
          // console.log("is heap pushing");
          this.heapNodesList[1] = {
            treeNode: root,
            node: drawnNode,
            leftArrow,
            rightArrow
          };
        }
      }

      /*
        arrow is drawn with head pointing downwards. Bring the head to the center
        of the node and rotate the whole thing about its head
      */
      arrow.rotate(90, new paper.Point(arrow.position.x, arrow.position.y));

      // now the arrow is at the bottom of the node
      arrow.position.y = drawnNode.rect.handleBounds.center.y;
      arrow.position.x =
        drawnNode.rect.handleBounds.center.x + 30 + arrow.handleBounds.width / 2;

      arrow.children[2].rotate(90);
    },

    // ============================== HEAPS START =================================
    changeTypeOfHeap(minMax: "Minimum" | "Maximum") {
      this.typeOfHeap = minMax;
      this.clearCanvas();
      this.createNewHeap();
    },

    async swapNodes(i: number, j: number): Promise<void> {
      i++; // heap index starts from 1, but we send the swap index by decrementing by 1
      j++; // heap index starts from 1, but we send the swap index by decrementing by 1

      // console.log("swap nodes, ", i, j, { heapNodesList: this.heapNodesList });
      /*
        1. Highlight nodes to be swapped
        2. Swap nodes in heap array
        3. Swap the values of node's text for displaying as the state is not reactive
      */

      const node1 = this.heapNodesList[i];
      const node2 = this.heapNodesList[j];

      node1.node.rect.fillColor = pointerColor1.paperColor;
      node1.node.text.bringToFront();

      node2.node.rect.fillColor = pointerColor1.paperColor;
      node2.node.text.bringToFront();

      await sleep(1000);

      node1.node.rect.fillColor = pointerColor2.paperColor;
      node1.node.text.bringToFront();

      node2.node.rect.fillColor = pointerColor2.paperColor;
      node2.node.text.bringToFront();

      return new Promise(r =>
        setTimeout(() => {
          const temp = node1.treeNode?.value as number;
          (node1.treeNode as TreeNode).value = node2.treeNode?.value as number;
          (node2.treeNode as TreeNode).value = temp;

          node1.node.text.content = (node1.treeNode as TreeNode).value.toString();
          node2.node.text.content = (node2.treeNode as TreeNode).value.toString();

          node1.node.rect.fillColor = transparent;
          node1.node.text.bringToFront();

          node2.node.rect.fillColor = transparent;
          node2.node.text.bringToFront();

          r();
        }, this.animationSpeed)
      );
    },

    async addNodeToHeap() {
      // console.log("this.heapNodesList", this.heapNodesList);
      if (!this.heapNodesList[1]) {
        this.myHeap.heap.push(Infinity, Number(this.addNewNodeValue));
        this.clearCanvas();
        this.drawBinaryTreeRoot(new TreeNode(Number(this.addNewNodeValue)), false, true);
        return;
      }

      // adding multiple heap nodes at once
      if (this.addNewNodeValue.toString().includes(",")) {
        this.addNewNodeValue
          .toString()
          .split(",")
          .forEach((spl, idx) => {
            const parentNodeIndex = Math.floor(
              (Object.keys(this.heapNodesList).length + idx) / 2
            );
            const side = this.heapNodesList[parentNodeIndex * 2]
              ? "rightArrow"
              : "leftArrow";

            this.drawBinaryTreeNode(parentNodeIndex, Number(spl), side, 3);

            this.myHeap.insert(Number(spl));
          });
      } else {
        const end = Object.keys(this.heapNodesList).length + 1;

        const parentNodeIndex = Math.floor(end / 2);

        const side = this.heapNodesList[parentNodeIndex * 2] ? "rightArrow" : "leftArrow";

        this.drawBinaryTreeNode(parentNodeIndex, Number(this.addNewNodeValue), side, 3);

        await this.myHeap.insert(Number(this.addNewNodeValue));
      }
    },

    deleteFromHeap() {
      if (!this.myHeap || this.myHeap.heap.length < 1) return;

      this.myHeap.deleteFromHeap(this.myHeap.heap.length - 1);
    },

    createNewHeap() {
      this.myHeap = new Heap(
        [],
        this.typeOfHeap === "Maximum",
        this.swapNodes,
        this.highlightNode
      );
      this.drawBinaryTreeRoot(null, false, true);
    },

    runOnMount(newSelectionValue: { name: string; algos: string[] } | undefined) {
      if (!newSelectionValue) newSelectionValue = this.selectedMainDsAlgo;

      this.clearCanvas();

      this.myHeap = {} as Heap;
      this.myBinaryTree = {} as BinaryTree;
      this.myLinkedList = {} as LinkedList;

      switch (newSelectionValue.name) {
        case this.allDsAlgosObject.LINKED_LIST.name:
          this.createNewLinkedList();
          break;

        case this.allDsAlgosObject.BINARY_TREES.name:
          this.createNewBinaryTree();
          break;

        case this.allDsAlgosObject.HEAP.name:
          this.createNewHeap();
          break;

        default:
          break;
      }
    }
  },

  watch: {
    selectedMainDsAlgo(newSelection: { name: string; algos: string[] }) {
      this.runOnMount(newSelection);
    }
  },

  computed: {
    isLinkedListSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.LINKED_LIST.name;
    },
    isTreeSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.BINARY_TREES.name;
    },
    isHeapSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.HEAP.name;
    }
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
    rect.fillColor = backgroundColor.paperColor;

    this.runOnMount(undefined);
  },

  created() {
    paper.install(window);
  }
});
</script>

<style scoped>
#canvas {
  height: 93vh !important;
  width: 80vw;
}

.algo-container {
  display: flex;
  align-items: center;
  height: 93vh;
  width: 100vw;
}

.algo-container .left-panel {
  height: 100%;
  width: 20vw;
  background-color: #02203c;
}

.left-panel-algos {
  padding: 1rem;
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
  color: #02203c;
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

.legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 2rem;
  padding-left: 1rem;
}

.radio-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
