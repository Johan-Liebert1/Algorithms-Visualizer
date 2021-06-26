import { CellClass } from "@/types/pathFinders";
import { setAllCellsAsWall } from "./mazeHelpers";

const primsMazeGenerator = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => void,
  clearWall: (a: CellClass) => Promise<any>
) => {
  setAllCellsAsWall(matrix, startNode, endNode, makeWall);

  const numberOfCells = matrix.length * matrix[0].length;
  const visitedVertices: CellClass[] = [];

  let currentCell: CellClass = matrix[0][0];
  let previousCell: CellClass = currentCell;

  while (visitedVertices.length < numberOfCells) {
    currentCell.addNeighbors(matrix, false, 2);

    const randNeighbor =
      currentCell.neighbors[Math.floor(Math.random() * currentCell.neighbors.length)];

    if (!randNeighbor.hasUnvisitedNeighbors()) {
      currentCell = previousCell;
      continue;
    }

    const cellInBetween = currentCell.getCellInBetween(matrix, randNeighbor);

    if (cellInBetween) {
      await clearWall(cellInBetween);
    }

    currentCell.isVisited = true;
    visitedVertices.push(currentCell);

    previousCell = currentCell;
    currentCell = randNeighbor;
  }
};

export default primsMazeGenerator;
