import { CellClass } from "@/types/pathFinders";

const DepthFirstSearchMaze = async (
  startNode: CellClass,
  endNode: CellClass,
  matrix: CellClass[][],
  makeWall: (cell: CellClass) => Promise<any>
) => {
  const openSet: CellClass[] = [matrix[0][0]];
  let currentCell: CellClass;

  while (openSet.length > 0) {
    currentCell = openSet.pop() as CellClass;

    currentCell.isVisited = true;

    console.log("mze going on");

    // const allNeighbors: CellClass[] = currentCell.addNeighbors(matrix);
    // let neighbor: CellClass = allNeighbors[Math.floor(Math.random() * allNeighbors.length)];

    for (const neighbor of currentCell.neighbors) {
      if (neighbor.isVisited || neighbor === startNode || neighbor === endNode) {
        continue;
      }

      openSet.push(neighbor);
      break;
    }

    // Math.floor(Math.random() * openSet.length)
    // const toMakeWall = openSet[openSet.length - 1];
    await makeWall(currentCell);
  }
};

export default DepthFirstSearchMaze;
