import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import TreeNode from "@/algos/dataStructures/TreeNode";
import {
  ARROW_TRIANGLE_RADIUS,
  headPointerColor,
  nodeHoverColor,
  nodeStrokeColor,
  NODE_SIZE,
  pointerColor2,
  textStrokeColor,
  transparent
} from "@/constants/dsAlgoConstants";
import { paperJsNode } from "@/types/dsAlgo";

export const putTextOnCanvas = (
  canvas: HTMLCanvasElement | undefined,
  canvasText: paper.PointText | undefined,
  text: string,
  x?: number,
  y?: number
) => {
  if (!canvas) return;

  if (!x) {
    x = 100;
  }

  if (!y) {
    y = canvas.height - 200;
  }

  if (canvasText) {
    canvasText.remove();
  }

  canvasText = new paper.PointText(new paper.Point(x, y));
  canvasText.content = text;
  canvasText.justification = "left";
  canvasText.fillColor = pointerColor2.paperColor;
  canvasText.scale(1.5);

  return canvasText;
};

export const drawArrow = (
  x1: number,
  y1: number,
  length: number,
  color?: paper.Color,
  textString?: string
): paper.Group => {
  if (!color) {
    color = nodeHoverColor.paperColor;
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
    text.fillColor = headPointerColor.paperColor;

    text.position.x -= text.handleBounds.width / 2;
    text.position.y += textY;

    // rotate the text again so that it counteracts the rotation of the group
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
};

/**
 * @param node LinkedListNode, TreeNode or Null. Value inside the node will be the value of the node if it exists, else will be 'NULL'
 * @param x x co-ordinate of the node
 * @param y y co-ordinate of the node
 */
export const drawNode = (
  node: llNodeNull | TreeNode,
  x: number,
  y: number
): paperJsNode => {
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

  rect.addChild(text);

  return { rect, text };
};

export const highlightNode = (
  node: paperJsNode,
  animationSpeed: number,
  color?: string | paper.Color
): Promise<void> => {
  if (!color) color = nodeHoverColor.paperColor;

  if (typeof color === "string") color = new paper.Color(color);

  node.rect.fillColor = color;
  node.text.bringToFront();

  return new Promise(r =>
    setTimeout(() => {
      node.rect.fillColor = transparent;
      r();
    }, animationSpeed)
  );
};

export const removePaperJsNode = (
  nodeToRemove: paperJsNode,
  objectsToRemove?: { [key: string]: paper.Path | paper.Group }
) => {
  nodeToRemove.rect.remove();
  nodeToRemove.text.remove();

  if (objectsToRemove)
    Object.values(objectsToRemove).forEach(paperObject => paperObject.remove());
};
