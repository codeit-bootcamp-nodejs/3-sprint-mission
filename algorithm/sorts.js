/**
 * 선택 정렬(Selection Sort)
 * @description 배열에서 최솟값을 찾아 앞으로 이동시키며 정렬합니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
const SelectionSort = (arr) => {
  // 1. 배열의 처음부터 끝까지 순회
  for (let i = 0; i < arr.length; i++) {
    // 2. 현재 위치를 최솟값 인덱스로 설정
    let smallest = i;
    // 3. 현재 위치 이후의 요소들 중 최솟값 찾기
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[smallest]) {
        smallest = j;
      }
    }
    // 4. 최솟값이 현재 위치가 아니면 교환
    if (smallest !== i) {
      [arr[i], arr[smallest]] = [arr[smallest], arr[i]];
    }
  }
  return arr;
};
const arr = [3, 6, 7, 2, 1, 9];
console.log(SelectionSort(arr));

/**
 * 삽입 정렬(Insertion Sort)
 * @description 정렬된 부분에 새 요소를 적절한 위치에 삽입하며 정렬합니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
const InsertionSort = (arr) => {
  // 1. 두 번째 요소부터 순회 (첫 번째는 이미 정렬된 상태로 간주)
  for (let i = 1; i < arr.length; i++) {
    // 2. 현재 삽입할 값을 key에 저장
    let key = arr[i];
    let j = i - 1;
    // 3. key보다 큰 요소들을 오른쪽으로 이동
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    // 4. key를 올바른 위치에 삽입
    arr[j + 1] = key;
  }
  return arr;
};
const arr2 = [5, 4, 3, 2, 1];
console.log(InsertionSort(arr2));

/**
 * 병합 정렬(Merge Sort)
 * @description 배열을 분할 후 병합하며 정렬합니다. (분할 정복)
 *
 * @param {number[]} arr - 정렬할 배열
 * @returns {number[]} 정렬된 새 배열
 */
const MergeSort = (arr) => {
  // 1. 기저 조건: 배열 길이가 1 이하면 그대로 반환
  if (arr.length <= 1) {
    return arr;
  }
  // 2. 배열을 절반으로 분할
  const mid = Math.floor(arr.length / 2);
  // 3. 왼쪽, 오른쪽 배열을 재귀적으로 정렬
  let left = MergeSort(arr.slice(0, mid));
  let right = MergeSort(arr.slice(mid));

  // 4. 정렬된 두 배열을 병합할 결과 배열
  let sortedList = [];

  let i = 0;
  let j = 0;
  // 5. 두 배열을 비교하며 작은 값부터 결과 배열에 추가
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      sortedList.push(left[i]);
      i += 1;
    } else {
      sortedList.push(right[j]);
      j += 1;
    }
  }
  // 6. 남은 요소들을 결과 배열에 추가
  sortedList.push(...left.slice(i));
  sortedList.push(...right.slice(j));

  return sortedList;
};
const arr3 = [15, 14, 13, 12, 1];
console.log(MergeSort(arr3));

/**
 * 퀵 정렬(Quick Sort)
 * @description 피벗을 기준으로 분할하여 정렬합니다. (분할 정복)
 *
 * @param {number[]} arr - 정렬할 배열
 * @param {number} start - 시작 인덱스
 * @param {number|null} end - 끝 인덱스
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
const QuickSort = (arr, start = 0, end = null) => {
  // 1. 초기 호출 시 end를 배열의 마지막 인덱스로 설정
  if (end === null) {
    end = arr.length - 1;
  }
  // 2. 기저 조건: 정렬할 범위가 없으면 반환
  if (start >= end) {
    return arr;
  }

  // 3. 피벗을 마지막 요소로 선택
  let pivot = arr[end];
  let smallerIndex = start - 1;
  // 4. 피벗보다 작은 요소들을 왼쪽으로 이동
  for (let i = start; i < end; i++) {
    if (arr[i] < pivot) {
      smallerIndex += 1;
      [arr[smallerIndex], arr[i]] = [arr[i], arr[smallerIndex]];
    }
  }
  // 5. 피벗을 올바른 위치에 배치
  let pivotIndex = smallerIndex + 1;
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];

  // 6. 피벗 기준 좌우 부분 배열을 재귀적으로 정렬
  QuickSort(arr, start, pivotIndex - 1);
  QuickSort(arr, pivotIndex + 1, end);

  return arr;
};
const arr4 = [25, 44, 33, 12, 1];
console.log(QuickSort(arr4));
