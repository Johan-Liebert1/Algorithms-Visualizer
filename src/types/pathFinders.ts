export class CellClass {
  isWall: boolean;
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.isWall = false;
    this.row = row;
    this.col = col;
  }
}
