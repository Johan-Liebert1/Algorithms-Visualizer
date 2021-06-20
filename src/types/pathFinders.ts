import { defaultCellColor } from "@/constants/pathFindersConstants";

export class CellClass {
  isWall: boolean;
  row: number;
  col: number;
  totalRows: number;
  totalCols: number;
  gScore: number;
  hScore: number;
  fScore: number;
  neighbors: CellClass[];
  previous: CellClass | null;
  color: string;

  constructor(row: number, col: number, totalRows: number, totalCols: number) {
    this.isWall = false;
    this.row = row;
    this.col = col;
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.gScore = 0;
    this.fScore = 0;
    this.hScore = 0;
    this.neighbors = [];
    this.previous = null;
    this.color = defaultCellColor;
  }

  addNeighbors(grid: CellClass[][], diagonalAllowed = true) {
    const rowAdders: number[] = [-1, 0, 1];

    const colAdders: number[][] = [];

    if (diagonalAllowed) {
      colAdders.push([-1, 0, 1], [-1, 1], [-1, 0, 1]);
    } else {
      colAdders.push([0], [-1, 1], [0]);
    }

    rowAdders.forEach((rAdder, rIndex) => {
      if (this.row + rAdder >= 0 && this.row + rAdder < this.totalRows) {
        colAdders[rIndex].forEach(cAdder => {
          if (this.col + cAdder >= 0 && this.col + cAdder < this.totalCols) {
            this.neighbors.push(grid[this.row + rAdder][this.col + cAdder]);
          }
        });
      }
    });
  }
}
