import { CellClass } from "@/types/pathFinders";

const DepthFirstSearch = async (
  startNode: CellClass,
  endNode: CellClass,
  highlightPath: (openCells: CellClass[], closedCells: CellClass[]) => Promise<any>,
  colorFinalPath: () => void
) => {
  console.log("calling dfs");

  const openSet: CellClass[] = [startNode];
  const closedSet: CellClass[] = [];

  while (openSet.length > 0) {
    const currentNode = openSet.pop();

    if (currentNode === endNode || !currentNode) {
      break;
    }

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

export default DepthFirstSearch;
