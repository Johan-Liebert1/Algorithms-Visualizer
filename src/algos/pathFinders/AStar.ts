import { CellClass } from "@/types/pathFinders";

const heuristic = (start: CellClass, end: CellClass) =>
  Math.sqrt(Math.pow(start.row - end.row, 2) + Math.pow(start.col - end.col, 2));

const getLowestFScoreNode = (array: CellClass[]): [number, CellClass] => {
  let minNode: CellClass = array[0];
  let index = 0;

  for (let i = 0; i < array.length; i++) {
    if (array[i].fScore < minNode.fScore) {
      minNode = array[i];
      index = i;
    }
  }

  return [index, minNode];
};

const aStarAlgo = async (
  startNode: CellClass,
  endNode: CellClass,
  highlightGrid: (a: CellClass[], b: CellClass[]) => Promise<any>,
  colorFinalPath: () => void
): Promise<any> => {
  let openSet: CellClass[] = [startNode];
  const closedSet: CellClass[] = [];

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
  startNode.gScore = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how short a path from start to finish can be if it goes through n.
  startNode.fScore = startNode.gScore + heuristic(startNode, endNode);

  while (openSet.length > 0) {
    const [index, currentNode] = getLowestFScoreNode(openSet);

    if (currentNode === endNode) {
      break;
    }

    openSet = openSet.slice(0, index).concat(openSet.slice(index + 1));
    closedSet.push(currentNode);

    for (const neighbor of currentNode.neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      const tempG: number = neighbor.gScore + heuristic(currentNode, neighbor);

      if (!openSet.includes(neighbor)) {
        neighbor.gScore = tempG;
        openSet.push(neighbor);
      } else if (tempG > neighbor.fScore) {
        continue;
      }

      neighbor.previous = currentNode;
      neighbor.gScore = tempG;

      if (neighbor.hScore === 0) {
        neighbor.hScore = heuristic(neighbor, endNode);
      }

      neighbor.fScore = neighbor.gScore + neighbor.hScore;

      // call the callback here
      await highlightGrid(openSet, closedSet);
    }
  }

  colorFinalPath();
};

export default aStarAlgo;
