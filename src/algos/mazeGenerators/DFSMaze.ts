import { CellClass } from "@/types/pathFinders";
import { turnAlternateCellsToWalls } from "./mazeHelpers";

const DepthFirstSearchMaze = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<void>,
  clearWall: (cell: CellClass) => Promise<void>
): Promise<void> => {
  turnAlternateCellsToWalls(matrix, startNode, endNode, makeWall);

  const openSet: CellClass[] = [];
  let currentCell: CellClass = matrix[0][0];

  for (;;) {
    currentCell.isVisited = true;

    const allNeighbors: CellClass[] = currentCell.addNeighbors(matrix, false, 2);
    const neighbor: CellClass =
      allNeighbors[Math.floor(Math.random() * allNeighbors.length)];

    if (currentCell.hasUnvisitedNeighbors() || neighbor.isVisited) {
      console.log("hasUnvisitedNeighbors");

      neighbor.isVisited = true;
      openSet.push(neighbor);
      currentCell = neighbor;

      const wallRemoved: CellClass = currentCell.removeWalls(neighbor, matrix);
      await clearWall(wallRemoved);
    } else if (openSet.length > 0) {
      console.log("pop");
      currentCell = openSet.pop() as CellClass;
    } else {
      break;
    }
  }
};

export default DepthFirstSearchMaze;
