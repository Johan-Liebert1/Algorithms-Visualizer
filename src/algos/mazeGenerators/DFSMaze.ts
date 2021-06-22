import { CellClass } from "@/types/pathFinders";

const DepthFirstSearchMaze = async (
  startNode: CellClass,
  endNode: CellClass,
  matrix: CellClass[][],
  makeWall: (cell: CellClass) => Promise<any>
) => {
  const openSet: CellClass[] = [matrix[0][0]];
  let currentCell: CellClass = openSet[0];

  while (currentCell.hasUnvisitedNeighbors()) {
    currentCell.isVisited = true;

    console.log("mze going on");

    for (const neighbor of currentCell.addNeighbors(matrix, false, 2)) {
      if (neighbor.isVisited || neighbor === startNode || neighbor === endNode) continue;
      openSet.push(neighbor);
    }

    currentCell = openSet.pop() as CellClass;

    const toMakeWall = openSet[Math.floor(Math.random() * openSet.length)];

    if (toMakeWall instanceof CellClass) await makeWall(currentCell);
  }
};

export default DepthFirstSearchMaze;
