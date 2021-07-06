import { CellClass } from "@/types/pathFinders";

enum Direction {
  vertical,
  horizontal
}

interface Passage {
  [key: string]: boolean;
}

const csv = (r: number, c: number) => `${r},${c}`;

const chooseOrientation = (width: number, height: number): Direction => {
  if (width > height) {
    return Direction.vertical;
  } else if (height > width) {
    return Direction.horizontal;
  }

  return Math.random() > 0.5 ? Direction.vertical : Direction.horizontal;
};

/**
 * get number between Min and Max, both inclusive
 */
const randNum = (min: number, max: number): number =>
  min + Math.floor(Math.random() * (max - min + 1));

export const drawBorderWalls = (
  matrix: CellClass[][],
  makeWall: (cell: CellClass) => Promise<any>
) => {
  const rows = [0, matrix.length - 1];
  const cols = [0, matrix[0].length - 1];

  rows.forEach(row => {
    for (let i = cols[0]; i <= cols[1]; i++) makeWall(matrix[row][i]);
  });

  cols.forEach(col => {
    for (let i = rows[0]; i <= rows[1]; i++) makeWall(matrix[i][col]);
  });
};

/**
 * @param matrix The grid matrix
 * @param startRow The first row where we can draw a horizontal wall
 * @param startCol The first column where we can draw a vertical wall
 * @param endRow The last row where we can draw a horizontal wall
 * @param endCol The lst column where we can draw a vertical wall
 * @param startNode The start node, so that we don't draw a wall over it
 * @param endNode The target node, so that we don't draw a wall over it
 * @param makeWall Callback function to display the maze
 */
const recursiveDivisionMaze = async (
  matrix: CellClass[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<any>,
  pathCells: Passage = {}
) => {
  if (startRow > endRow || startCol > endCol) return;

  // whether we're drawing a horizontal wall or a vertical wall
  const isHorizontal =
    chooseOrientation(endCol - startCol, endRow - startRow) === Direction.horizontal;
  const isVertical = !isHorizontal;

  // console.log("is horizontal = ", isHorizontal);

  // get random row to fill with walls if horizontal
  let drawAtRow: number = startRow;
  const rowsArray: number[] = [];

  // get random column to fill with walls if vertical
  let drawAtCol: number = startCol;
  const colsArray: number[] = [];

  for (let i = startRow; i <= endRow; i += 2) {
    rowsArray.push(i);
  }

  for (let i = startCol; i <= endCol; i += 2) {
    colsArray.push(i);
  }

  if (isHorizontal) {
    drawAtRow = rowsArray[randNum(0, rowsArray.length - 1)];
  } else {
    drawAtCol = colsArray[randNum(0, colsArray.length - 1)];
  }

  // going left to right if horizontal, i.e. add to columns, and rows remain constant
  const colAdder = isHorizontal ? 1 : 0;

  // going top to down if vertical, i.e. add to rows and columns remain constant
  const rowAdder = isVertical ? 1 : 0;

  // this is the cell where a wall will not be drawn and this cell will connect two halves of the grid
  let pathCell: CellClass;

  if (isHorizontal) {
    const c = colsArray[randNum(0, colsArray.length - 1)];
    // the path cell will be at matrix[drawAtRow][randomColumn]
    pathCell = matrix[drawAtRow][c];
  } else {
    const r = rowsArray[randNum(0, rowsArray.length - 1)];
    // the path cell will be at matrix[randomRow][drawAtCol]
    pathCell = matrix[r][drawAtCol];
  }

  pathCells[csv(pathCell.row, pathCell.col)] = true;

  let row = drawAtRow;
  let col = drawAtCol;
  const length = isHorizontal ? endCol - startCol : endRow - startRow;

  // console.log("row = ", row, "col = ", col, "length = ", length);

  for (let i = 0; i <= length; i++) {
    const cell = matrix[row][col];

    // don't draw a wall if it's a startNode, endNode or if any of its neighbors
    // is a pathCell
    if (
      cell !== startNode &&
      cell !== endNode &&
      cell !== pathCell
      // !anyNeighborPathCell(cell, pathCells, isHorizontal)
    ) {
      await makeWall(cell);
    }

    row += rowAdder;
    col += colAdder;
  }

  if (isHorizontal) {
    // top area of the horizontal wall
    recursiveDivisionMaze(
      matrix,
      startRow,
      startCol,
      drawAtRow - 1,
      endCol,
      startNode,
      endNode,
      makeWall,
      pathCells
    );

    // bottom area of the horizontal wall
    recursiveDivisionMaze(
      matrix,
      drawAtRow + 2,
      startCol,
      endRow,
      endCol,
      startNode,
      endNode,
      makeWall,
      pathCells
    );
  } else {
    // left area of the vertical wall
    recursiveDivisionMaze(
      matrix,
      startRow,
      startCol,
      endRow,
      drawAtCol - 1,
      startNode,
      endNode,
      makeWall,
      pathCells
    );

    // right area of the vertical wall
    recursiveDivisionMaze(
      matrix,
      startRow,
      drawAtCol + 2,
      endRow,
      endCol,
      startNode,
      endNode,
      makeWall,
      pathCells
    );
  }
};

export default recursiveDivisionMaze;
