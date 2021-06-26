import { CellClass } from "@/types/pathFinders";

enum Direction {
  vertical,
  horizontal
}

const chooseOrientation = (width: number, height: number): Direction => {
  if (width > height) {
    return Direction.vertical;
  } else if (height > width) {
    return Direction.horizontal;
  }

  return Math.random() > 0.5 ? Direction.vertical : Direction.horizontal;
};

/**
 * @param matrix The grid matrix
 * @param width Number of columns in the matrix
 * @param height Number of rows in the matrix
 * @param x The col where to draw a horizontal wall
 * @param y The row where to draw a vertical wall
 * @param startNode The start node, so that we don't draw a wall over it
 * @param endNode The target node, so that we don't draw a wall over it
 * @param makeWall Callback function to display the maze
 */
const recursiveDivisionMaze = async (
  matrix: CellClass[][],
  width: number,
  height: number,
  x: number,
  y: number,
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<any>
) => {
  if (width <= 3 || height <= 3 || y >= matrix.length || x >= matrix[0].length) return;

  const horizontal = chooseOrientation(width, height) === Direction.horizontal;

  // where will the wall be drawn from?
  // x - col, y - row
  let wallX = x + (horizontal ? 0 : Math.floor(Math.random() * (width / 2)));
  let wallY = y + (horizontal ? Math.floor(Math.random() * (height / 2)) : 0);

  // where will the passage through the wall exist?
  // if wall is horizontal, then we need passag on X
  // if wall is not horizontal, then we need passage on Y
  const passageX = wallX + (horizontal ? Math.floor(Math.random() * (width - 2)) : 0);
  const passageY = wallY + (horizontal ? 0 : Math.floor(Math.random() * (height - 2)));

  // how long will the wall be
  const wallLength: number = horizontal ? width : height;

  // move along the X axis, if horizontal wall, else move along the Y axis
  const dx = horizontal ? 1 : 0;
  const dy = horizontal ? 0 : 1;

  for (let i = 0; i < wallLength; i++) {
    if (!matrix[wallY][wallX]) console.log(wallY, wallX);

    const cell = matrix[wallY][wallX];

    if (
      cell !== startNode &&
      cell !== endNode &&
      (wallX !== passageX || wallY !== passageY)
    ) {
      await makeWall(cell);
    }

    wallX += dx;
    wallY += dy;
  }

  let [newX, newY] = horizontal ? [x, wallY + 1] : [wallX + 1, y];

  const [newWidth, newHeight] = horizontal
    ? [width, wallY - y + 1]
    : [wallX - x + 1, height];

  recursiveDivisionMaze(
    matrix,
    newWidth,
    newHeight,
    newX,
    newY,
    startNode,
    endNode,
    makeWall
  );

  newX = x;
  newY = y;

  recursiveDivisionMaze(
    matrix,
    newWidth,
    newHeight,
    newX,
    newY,
    startNode,
    endNode,
    makeWall
  );
};

export default recursiveDivisionMaze;
