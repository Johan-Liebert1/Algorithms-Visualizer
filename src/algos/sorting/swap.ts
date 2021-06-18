export const swap = (list: number[], a: number, b: number) => {
  const temp = list[a];
  list[a] = list[b];
  list[b] = temp;
};
