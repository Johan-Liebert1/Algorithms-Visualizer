const bubbleSort = (list: number[]): number[] => {
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - 1; j++) {
      if (list[j] > list[i]) {
        const temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
    }
  }

  return list;
};

export default bubbleSort;
