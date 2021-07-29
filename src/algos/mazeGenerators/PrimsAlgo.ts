import { sleep } from "@/helpers/helper";
import { CellClass } from "@/types/pathFinders";
import { csv, setAllCellsAsWall, turnAlternateCellsToWalls } from "./mazeHelpers";

const primsMazeGenerator = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => Promise<void>,
  clearWall: (a: CellClass) => Promise<any>
) => {
  turnAlternateCellsToWalls(matrix, startNode, endNode, makeWall);

  await sleep(1000);

  const numberOfCells = Math.floor((matrix.length / 2) * (matrix[0].length / 2));

  let currentCell: CellClass = matrix[0][0];

  const frontierCells: CellClass[] = [];

  const partOfTheMaze: { [key: string]: string } = {};

  while (Object.keys(partOfTheMaze).length < numberOfCells) {
    currentCell.isVisited = true;

    partOfTheMaze[csv(currentCell.row, currentCell.col)] = "";

    frontierCells.push(...currentCell.addNeighbors(matrix, false, 2));

    const neighbor: CellClass =
      frontierCells[Math.floor(Math.random() * frontierCells.length)];

    // we need a neighbor that is part of a maze
    // while (!(csv(neighbor.row, neighbor.col) in partOfTheMaze)) {
    //   neighbor = frontierCells[Math.floor(Math.random() * frontierCells.length)];
    // }

    neighbor.isVisited = true;
    partOfTheMaze[csv(neighbor.row, neighbor.col)] = "";

    const wallRemoved: CellClass = currentCell.removeWalls(neighbor, matrix);

    // frontierCells = frontierCells.filter(
    //   cell => !(csv(cell.row, cell.col) in partOfTheMaze)
    // );

    currentCell = neighbor;

    await clearWall(wallRemoved);
  }
};

export default primsMazeGenerator;
