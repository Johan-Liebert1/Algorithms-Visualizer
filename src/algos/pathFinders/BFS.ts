import { CellClass } from "@/types/pathFinders";

const BreadthFirstSearch = async (
  startNode: CellClass,
  endNode: CellClass,
  highlightPath: (openCells: CellClass[], closedCells: CellClass[]) => Promise<any>,
  colorFinalPath: () => void
) => {
  console.log("calling bfs");
  const openSet: CellClass[] = [startNode];
  const closedSet: CellClass[] = [];

  while (openSet.length > 0) {
    const currentNode = openSet[0];

    if (currentNode === endNode) {
      break;
    }

    openSet.shift();
    closedSet.push(currentNode);

    currentNode.isVisited = true;

    for (const neighbor of currentNode.neighbors) {
      if (neighbor.isVisited || neighbor.isWall) {
        continue;
      }

      openSet.push(neighbor);
      neighbor.isVisited = true;
      neighbor.previous = currentNode;
    }
    await highlightPath(openSet, closedSet);
  }
  colorFinalPath();
};

export default BreadthFirstSearch;
