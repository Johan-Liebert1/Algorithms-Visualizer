import { CellClass } from "@/types/pathFinders";

enum Direction {
  vertical,
  horizontal
}

/**
 * @param matrix The grid matrix
 * @param width Number of columns in the matrix
 * @param height Number of rows in the matrix
 * @param row The row where to draw a horizontal wall
 * @param col The col where to draw a vertical wall
 * @param startNode The start node, so that we don't draw a wall over it
 * @param endNode The target node, so that we don't draw a wall over it
 * @param makeWall Callback function to display the maze
 */
const recursiveDivisionMaze = async (
  matrix: CellClass[][],
  width: number,
  height: number,
  row: number,
  col: number,
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<any>
) => {
  console.log("width = ", width, "height = ", height);
  if (width < 1 || height < 1 || row < 0 || col < 0) return;

  const direction =
    Math.floor(Math.random() * (width + height)) < width
      ? Direction.horizontal
      : Direction.vertical;

  if (direction === Direction.vertical) {
    // draw a wall from top to bottom starting from the row and ending at height
    for (let i = row; i < height; i++) {
      if (
        matrix[i][col] !== startNode &&
        matrix[i][col] !== endNode &&
        Math.random() < 0.95
      ) {
        await makeWall(matrix[i][col]);
      }
    }
  } else if (direction === Direction.horizontal) {
    // draw a wall from right to left starting from the col and ending at width
    for (let j = col; j < width; j++) {
      if (
        matrix[row][j] !== startNode &&
        matrix[row][j] !== endNode &&
        Math.random() < 0.95
      ) {
        await makeWall(matrix[row][j]);
      }
    }
  }

  const newWidth = Math.floor(width / 2);
  const newHeight = Math.floor(height / 2);

  const rowAdders = [newHeight, newHeight, -newHeight, -newHeight];
  const colAdders = [-newWidth, newWidth, -newWidth, newWidth];

  for (let a = 0; a < 4; a++) {
    recursiveDivisionMaze(
      matrix,
      newWidth,
      newHeight,
      row + rowAdders[a],
      col + colAdders[a],
      startNode,
      endNode,
      makeWall
    );
  }
};

export default recursiveDivisionMaze;

/*  
This is a fast algorithm that differs from other maze generating routines in that it builds walls, rather than breaking through them.

Choose an area to be divided (highlighted in blue). Initially, the only available area will be the entire board.

Divide the chosen area by constructing a wall though it. The placement of the wall, as well as its direction, is random. However, in this particular implementation of the algorithm, the decision to build a vertical or horizontal wall is weighted based on the shape of the area being divided. In particular, if the area has width w and height h, a random integer from 0 to w+h is chosen. If the value is less than w, the division is vertical. This ensures that a wider area is more likely to be divided by a vertical wall, and a narrow area is more likely to be cut horizontally. This is purely for aesthetics.

Choose a random location in the wall to build a single gap. This ensures the maze will be fully connected.

If the divided portions of the area are large enough (width and height greater than 1 cell), they are both added to the stack of eligible areas to divide.

The process ends when no areas remain with width and height greater than 1.

This algorithm can be easily modified to change the overall appearance or size of the maze.
*/
