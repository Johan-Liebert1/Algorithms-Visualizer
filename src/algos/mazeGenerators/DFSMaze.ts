import { CellClass } from "@/types/pathFinders";

const turnAlternateCellsToWalls = (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<any>
) => {
  for (let row = 0; row < matrix.length; row += 2) {
    for (let col = 0; col < matrix[0].length; col += 2) {
      for (const cell of matrix[row][col].addNeighbors(matrix)) {
        if (cell !== startNode && cell !== endNode) makeWall(cell);
      }
    }
  }
};

const DepthFirstSearchMaze = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<any>,
  clearWall: (cell: CellClass) => Promise<any>
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
      clearWall(wallRemoved);
    } else if (openSet.length > 0) {
      console.log("pop");
      currentCell = openSet.pop() as CellClass;
    } else {
      break;
    }
  }
};

export default DepthFirstSearchMaze;
