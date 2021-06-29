const merge = (list: number[], low: number, middle: number, high: number): number[] => {
  const sorted: number[] = [];

  const list1 = list.slice(low, middle + 1);
  const list2 = list.slice(middle);

  let first = 0;
  let second = 0;

  for (;;) {
    if (first === list1.length && second < list2.length) {
      sorted.push(...list2.slice(second));
      break;
    }

    if (second === list2.length && first < list1.length) {
      sorted.push(...list1.slice(first));
      break;
    }

    if (list1[first] < list2[second]) {
      sorted.push(list1[first]);
      first++;
    } else if (list2[second] < list1[first]) {
      sorted.push(list2[second]);
      second++;
    } else {
      sorted.push(list1[first], list2[second]);
      first++;
      second++;
    }
  }

  return sorted;
};

const mergeSort = (list: number[], low: number, high: number): number[] => {
  if (high <= low) return [list[high]];

  const middle = Math.floor((high - low) / 2);

  mergeSort(list, low, middle);
  mergeSort(list, middle + 1, high);

  list = merge(list, low, middle, high);

  console.log(list);

  return list;
};

export default mergeSort;
