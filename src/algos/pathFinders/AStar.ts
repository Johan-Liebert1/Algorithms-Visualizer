import { CellClass } from "@/types/pathFinders";

const heuristic = (start: CellClass, end: CellClass) =>
  Math.sqrt(Math.pow(start.row - end.row, 2) + Math.pow(start.col - end.col, 2));

const aStarAlgo = (
  startNode: CellClass,
  endNode: CellClass,
  highlightGrid: (a: CellClass[], b: CellClass[]) => void
): void => {
  console.log("start node = ", startNode, "end node = ", endNode);
  const openSet: CellClass[] = [startNode];
  const closedSet: CellClass[] = [];

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
  startNode.gScore = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how short a path from start to finish can be if it goes through n.
  startNode.fScore = startNode.gScore + heuristic(startNode, endNode);

  while (openSet.length > 0) {
    const currentNode = openSet[0];

    if (currentNode === endNode) {
      break;
    }

    openSet.shift();
    closedSet.push(currentNode);

    for (const neighbor of currentNode.neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      const tempG: number = neighbor.gScore + heuristic(currentNode, neighbor);

      if (!openSet.includes(neighbor)) {
        neighbor.gScore = tempG;
        openSet.push(neighbor);
      } else if (tempG > neighbor.gScore) {
        continue;
      }

      neighbor.previous = currentNode;
      neighbor.gScore = tempG;

      if (neighbor.hScore === 0) {
        neighbor.hScore = heuristic(neighbor, endNode);
      }

      neighbor.fScore = neighbor.gScore + neighbor.hScore;

      // call the callback here
      highlightGrid(openSet, closedSet);
    }
  }
};

export default aStarAlgo;
