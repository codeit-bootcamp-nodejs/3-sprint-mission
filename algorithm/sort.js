testCase = [3, 2, 18, 14, 11, 15, 14, 17, 8, 4, 3, 6, 7, 9, 3, 5, 2, 1, 0];

//선택 정렬
const selectionSort = (list) => {
  for (let i = 0; i < list.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < list.length; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      let temp = list[i];
      list[i] = list[minIndex];
      list[minIndex] = temp;
    }
  }

  return list;
}

//삽입 정렬
const insertionSort = (list) => {
  for (let i = 1; i < list.length; i++) {
    let key = list[i];
    let j = i - 1;

    while (j >= 0 && list[j] > key) {
      list[j + 1] = list[j];
      j = j - 1;
    }
    list[j + 1] = key;
  }
  return list;
}

//병합 정렬(분할)
const mergeSort = (list) => {
  if (list.length <= 1) return list;

  const middle = Math.floor(list.length / 2);
  const left = mergeSort(list.slice(0, middle));
  const right = mergeSort(list.slice(middle));

  return merge(left, right);
}

//병합 정렬(병합 및 정렬)
const merge = (left, right) => {
  if (left[left.length - 1] <= right[0]) return left.concat(right);
  if (right[right.length - 1] <= left[0]) return right.concat(left);

  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    result.push(left[i] < right[j] ? left[i++] : right[j++]);
  }

  return result.concat(left.slice(i), right.slice(j));
};

//퀵 정렬
const quickSort = (list) => {
  if (list.length <= 1) return list;

  const first = list[0];
  const mid = list[Math.floor(list.length / 2)];
  const last = list[list.length - 1];
  const pivot = [first, mid, last].sort((a, b) => a - b)[1];

  const left = [];
  const right = [];
  const middle = [];

  for (const num of list) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else middle.push(num);
  }

  return quickSort(left).concat(middle, quickSort(right));
};