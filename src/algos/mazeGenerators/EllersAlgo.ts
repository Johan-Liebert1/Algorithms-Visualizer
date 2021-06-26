import { CellClass } from "@/types/pathFinders";
import { setAllCellsAsWall } from "./mazeHelpers";

interface setToCellsMapInterface {
  [key: string]: CellClass[];
}

const ellersMaze = (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => void,
  clearWall: (a: CellClass) => Promise<any>
) => {
  let setToCellsMap: setToCellsMapInterface = {};

  setAllCellsAsWall(matrix, startNode, endNode, makeWall);

  let row = 0;

  while (row < matrix.length - 1) {
    for (let col = 0; col < matrix[0].length - 2; col += 1) {
      /* 
        check if the current cell and the cell 2 places right to it are not in the same 
        ellers set. And if they're not, randomly remove the wall between them
      */

      const currentCell = matrix[row][col];
      const nextCell = matrix[row][col + 2];

      if (currentCell.ellersSet !== nextCell.ellersSet) {
        if (Math.random() > 0.15) {
          const setId = currentCell.ellersSet;
          clearWall(matrix[row][col + 1]);

          // now the two cells are in the same set
          nextCell.ellersSet = setId;

          // add these two cells to map
          if (!setToCellsMap[setId]) {
            setToCellsMap[setId] = [currentCell, nextCell];
          } else {
            setToCellsMap[setId].push(currentCell, nextCell);
          }
        }
      }
    }

    for (const [key, value] of Object.entries(setToCellsMap)) {
      let amount = 0;
      for (const cell of value) {
        if (Math.random() > 0.3) {
          matrix[cell.row + 1][cell.col].ellersSet = key;
          amount++;
        }
      }
    }

    setToCellsMap = {};

    row++;
  }
};

export default ellersMaze;
