/**
 * 선택 정렬(Selection Sort)
 * @description 배열을 직접 수정하여 오름차순으로 정렬합니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
export const selectionSort = (arr) => {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // swap
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
};

/**
 * 삽입 정렬 (Insertion Sort)
 * @description 배열을 직접 수정하여 오름차순으로 정렬합니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @@returns {number[]} 정렬된 배열(원본 수정)
 */
export const insertionSort = (arr) => {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // key 위치 탐색
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }
  return arr;
};

/**
 * Merge Sort의 파티션 함수
 * @description 두 정렬된 배열을 병합하여 새로운 정렬 배열을 생성합니다.
 *
 * @param {number[]} left - 정렬된 왼쪽 배열
 * @param {number[]} right - 정렬된 오른쪽 배열
 * @returns {number[]} 병합된 새 배열
 */
const merge = (left, right) => {
  const result = [];
  let [i, j] = [0, 0];

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
};

/**
 * 병합 정렬 (Merge Sort)
 * 새로운 배열을 반환하며 원본 배열은 변경하지 않습니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @returns {number[]} 정렬된 새로운 배열
 */
export const mergeSort = (arr) => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
};

/**
 * QuickSort의 파티션 함수
 * @description pivot을 기준으로 배열을 분할하고 pivot의 최종 위치를 반환합니다.
 *
 * @param {number[]} arr
 * @param {number} left
 * @param {number} right
 * @returns {number} pivot의 최종 인덱스
 */
const partition = (arr, left, right) => {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];

  return i;
};

/**
 * 퀵 정렬 (Quick Sort)
 * 배열을 직접 수정해 정렬합니다.
 *
 * @param {number[]} arr - 정렬할 배열
 * @param {number} [left=0]
 * @param {number} [right=arr.length - 1]
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
export const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left >= right) return arr;

  const pivotIndex = partition(arr, left, right);

  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
};

/** ----------------------------------------------
 * Tree Sort (추가 구현)
 * Binary Search Tree 기반 정렬
 * 새로운 배열 반환
 * ----------------------------------------------*/
/**
 * BST 노드 구조
 */
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * BST 삽입 함수
 *
 * @param {TreeNode|null} root - 루트 노드
 * @param {number} value - 삽입할 값
 * @returns {TreeNode}
 */
const insertNode = (root, value) => {
  if (root === null) return new TreeNode(value);

  if (value < root.value) root.left = insertNode(root.left, value);
  else root.right = insertNode(root.right, value);

  return root;
};

/**
 * 중위 순회로 트리의 값을 오름차순 배열에 삽입하는 함수
 *
 * @param {TreeNode|null} node
 * @param {number[]} res
 */
const inorderTraversal = (node, res) => {
  if (!node) return;
  inorderTraversal(node.left, res);
  res.push(node.value);
  inorderTraversal(node.right, res);
};

/**
 * 트리 정렬 (Tree Sort)
 * BST를 이용해 새로운 정렬된 배열을 반환합니다.
 *
 * @param {number[]} arr
 * @returns {number[]} 정렬된 새 배열
 */
export const treeSort = (arr) => {
  let root = null;

  for (const value of arr) {
    root = insertNode(root, value);
  }

  const res = [];
  inorderTraversal(root, res);
  return res;
};

/**
 * 힙 부모-자식 관계를 유지하는 헬퍼 함수
 * 
 * @param {number[]} arr - 힙 구성 배열
 * @param {number} length - 힙의 현재 유효 길이
 * @param {number} i - 부모 노드 인덱스
 */
const heapify = (arr, length, i) => {
  let largest = i;
  const left = i * 2 + 1;
  const right = i * 2 + 2;;

  // 왼쪽 자식이 부모보다 큰 경우
  if (left < length && arr[left] > arr[largest]) largest = left;

  //오른쪽 자식이 최대값보다 큰 경우
  if (right < length && arr[right] > arr[largest]) largest = right;

  // 부모가 최대값이 아니면 교환 → 재귀 호출
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, length, largest);
  }
}

/**
 * 힙 정렬 (Heap Sort)
 * 배열을 최대 힙으로 구성한 뒤 하나씩 꺼내며 정렬합니다.
 * 원본 배열을 수정합니다.
 * 
 * @param {number[]} arr - 정렬할 배열 
 * @returns {number[]} 정렬된 배열(원본 수정)
 */
export const heapSort = (arr) => {
  const length = arr.length;

  // 최대 힙 구성
  for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
    heapify(arr, length, i);
  }

  // 루트를 끝으로 보내고 → 힙 크기 줄여가며 재정렬
  for (let i = length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // 줄어든 것만 heapify
    heapify(arr, i, 0);
  }

  return arr;
}