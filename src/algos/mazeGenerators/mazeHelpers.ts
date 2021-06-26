import { CellClass } from "@/types/pathFinders";

export const setAllCellsAsWall = (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => void
) => {
  for (const row of matrix) {
    for (const col of row) {
      if (col !== startNode && col !== endNode) {
        makeWall(col);
      }
    }
  }
};
