import { CellClass } from "@/types/pathFinders";

enum Direction {
  vertical,
  horizontal
}

interface Passage {
  [key: string]: boolean;
}

const csv = (r: number, c: number) => `${r},${c}`;

const anyNeighborPathCell = (
  cell: CellClass,
  passages: Passage,
  isHorizontal: boolean
): boolean => {
  const [row, col] = [cell.row, cell.col];

  if (!isHorizontal) {
    if (csv(row + 1, col) in passages) return true;
    else if (csv(row - 1, col) in passages) return true;
  } else {
    if (csv(row, col + 1) in passages) return true;
    else if (csv(row, col - 1) in passages) return true;
  }

  return false;
};

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

/**
 * @param matrix The grid matrix
 * @param width Number of columns in the matrix
 * @param height Number of rows in the matrix
 * @param startRow The row where to draw a horizontal wall
 * @param startCol The column where to draw a vertical wall
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

  // console.log("widht = ", width, "height = ", height);

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

  if (isHorizontal) {
    for (let i = startRow; i <= endRow; i += 2) {
      rowsArray.push(i);
    }
    drawAtRow = rowsArray[Math.floor(Math.random() * rowsArray.length)];
  } else {
    for (let i = startCol; i <= endCol; i += 2) {
      colsArray.push(i);
    }
    drawAtCol = colsArray[Math.floor(Math.random() * colsArray.length)];
  }

  // going left to right if horizontal, i.e. add to columns, and rows remain constant
  const colAdder = isHorizontal ? 1 : 0;

  // going top to down if vertical, i.e. add to rows and columns remain constant
  const rowAdder = isVertical ? 1 : 0;

  // this is the cell where a wall will not be drawn and this cell will connect two halves of the grid
  let pathCell: CellClass;

  if (isHorizontal) {
    // the path cell will be at matrix[drawAtRow][randomColumn]
    pathCell = matrix[drawAtRow][randNum(startCol, endCol)];
  } else {
    // the path cell will be at matrix[randomRow][drawAtCol]
    pathCell = matrix[randNum(startRow, endRow)][drawAtCol];
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
