import {
  cellBorderColor,
  defaultCellColor,
  wallCellColor
} from "@/constants/pathFindersConstants";

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
  next: CellClass | null;
  color: string;
  isVisited: boolean;
  drawBorder: boolean;
  borderColor: string;
  djikstraScore: number;
  ellersSet: string;

  constructor(
    row: number,
    col: number,
    totalRows: number,
    totalCols: number,
    isWall = false
  ) {
    this.isWall = isWall;
    this.row = row;
    this.col = col;
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.gScore = 0;
    this.fScore = 0;
    this.hScore = 0;
    this.neighbors = [];
    this.previous = null;
    this.next = null;
    this.color = isWall ? wallCellColor : defaultCellColor;
    this.isVisited = false;
    this.drawBorder = !isWall;
    this.borderColor = cellBorderColor;
    this.djikstraScore = Infinity;
    this.ellersSet = Math.random()
      .toString(36)
      .substring(2);
  }

  addNeighbors(
    grid: CellClass[][],
    diagonalAllowed = true,
    neighborDist = 1
  ): CellClass[] {
    // if (this.neighbors.length > 0) return this.neighbors;

    const rowAdders: number[] = [-neighborDist, 0, neighborDist];

    const colAdders: number[][] = [];

    if (diagonalAllowed) {
      colAdders.push(
        [-neighborDist, 0, neighborDist],
        [-neighborDist, neighborDist],
        [-neighborDist, 0, neighborDist]
      );
    } else {
      colAdders.push([0], [-neighborDist, neighborDist], [0]);
    }

    rowAdders.forEach((rAdder, rIndex) => {
      if (this.row + rAdder >= 0 && this.row + rAdder < this.totalRows) {
        colAdders[rIndex].forEach(cAdder => {
          if (this.col + cAdder >= 0 && this.col + cAdder < this.totalCols) {
            const potentialNeighbor = grid[this.row + rAdder][this.col + cAdder];

            if (!potentialNeighbor.isWall) {
              this.neighbors.push(potentialNeighbor);
            }
          }
        });
      }
    });

    return this.neighbors;
  }

  hasUnvisitedNeighbors(): boolean {
    let hasUnvisitedNeighbors = false;

    for (const n of this.neighbors) {
      if (!n.isVisited) {
        hasUnvisitedNeighbors = true;
        break;
      }
    }

    return hasUnvisitedNeighbors;
  }

  /**
   * @param anotherCell
   * @returns a cell between the currentCell and anotherCell if it exists, else null
   */
  getCellInBetween(matrix: CellClass[][], anotherCell: CellClass): CellClass | null {
    if (this.row === anotherCell.row) {
      if (this.col < anotherCell.col) return matrix[this.row][this.col + 1];
      else return matrix[this.row][this.col - 1];
    }

    if (this.col === anotherCell.col) {
      if (this.row < anotherCell.row) return matrix[this.row + 1][this.col];
      else return matrix[this.row - 1][this.col];
    }

    return null;
  }
}
