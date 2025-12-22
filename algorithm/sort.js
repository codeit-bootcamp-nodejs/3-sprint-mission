/**
 * 선택 정렬 (Selection sort)
 * 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
 */

const selectionSort = (arr) => {
  for (let j = 0; j < arr.length - 1; j++){  // 마지막 바로 전까지 위치를 찾으면 마지막은 자동으로 제 위치가 되므로 -1
    let min_index = j;
    let min_value = arr[j];
    let i = j + 1;
    // 최소 값 인덱스와 값 구하기
    for ( ; i < arr.length; i++){
      if (min_value > arr[i]){
        min_value = arr[i];
        min_index = i;
      }
    }
    // 현재 위치의 값과 최소 위치의 값 변경
    const temp = arr[j];
    arr[j] = min_value;
    arr[min_index] = temp;
  }
}


const select_nums = [3, 1, 2, 6, 5];
console.log('selection sort 전 : ', select_nums); // [3, 1, 2, 6, 5]

selectionSort(select_nums);
console.log('selection sort 후 : ', select_nums); // [1, 2, 3, 5, 6]
console.log('');

// ============================================================

/*
* 삽입 정렬 (Insertion sort)
* 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
*/
const insertionSort = (arr) => {
  // 1번 인덱스부터 비교 (0번하고 1번하고 비교하는게 시작)
  for (let end = 1; end < arr.length; end++) {
    // 삽입할 값 가져오기
    let key = arr[end];
    // 마지막 부터 arr[i-1]이 key보다 큰 경우 뒤로 당기기
    let i = end;
    while (i > 0 && arr[i - 1] > key) {
      arr[i] = arr[i - 1];
      i--;
    }
    // 가장 처음이거나 중간에 key가 큰 경우 while 탈출
    // 나머지 값들은 뒤로 당겨졌으므로 i 위치가 key가 들어가야할 위치
    arr[i] = key;
  }
}

const insert_nums = [3, 1, 2, 6, 5];
console.log('insertion sort 전 : ', insert_nums); // [3, 1, 2, 6, 5]

insertionSort(insert_nums);
console.log('insertion sort 후 : ', insert_nums); // [1, 2, 3, 5, 6]
console.log('');

// ============================================================

/*
* 병합 정렬 (Merge sort)
* 숫자형 배열을 파라미터로 받고, 정렬된 새로운 배열을 리턴하도록 구현합니다.
*/
const mergeSort = (arr) => {
  // Base Condition
  if (arr.length <= 1){
    return arr
  }
  // Divide
  const end = arr.length
  const mid = Math.trunc(end / 2)
  
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid, end))
  let result = []
  
  let i = 0;
  let j = 0;
  // Conqure
  while (i <= left.length && j < right.length){ // 왼쪽이나 오른쪽 끝에 도달하면 정지
    if (left[i] < right[j])
      result.push(left[i++]);
    else
      result.push(right[j++]);
  }
  
  // 남은 원소가 있는 경우 전부 합치기
  if (i !== left.length){
    while (i !== left.length)
      result.push(left[i++])
  }
  else if (j !== right.length) {
    while (j !== right.length)
      result.push(right[j++])
  }
  
  // 배열 반환
  return result;
}


const merge_nums = [3, 1, 2, 5, 6];
console.log('merge sort 전 : ', merge_nums); // [3, 1, 2, 5, 6];
sorted_merge_nums = mergeSort(merge_nums);
console.log('merge sort로 반환된 배열 : ',sorted_merge_nums); // [1, 2, 3, 5, 6];
console.log('');

// ============================================================
/**
 * 퀵 정렬 (Quick sort)
 * 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
 */
const quickSort = (arr, start, end) => { // end는 배열의 마지막 인덱스
  // Base Condition
  if (start >= end) // 시작점이 끝점보다 뒤면 이미 정렬이 끝난것으로 봄
    return;

  // Divide
  const pivot = arr[end]; // 가장 마지막을 피벗으로 설정
  let small_partition_index = start -1;
  
  for (let i = start; i < end; i++){
    const element = arr[i];
    if (element <= pivot){
      small_partition_index++;
      arr[i] = arr[small_partition_index];
      arr[small_partition_index] = element
    }
  }
  
  const pivot_index = small_partition_index + 1
  arr[end] = arr[pivot_index]
  arr[pivot_index] = pivot
  
  // Conqure
  quickSort(arr, start, pivot_index -1)
  quickSort(arr, pivot_index + 1, end)
}


const quick_nums = [3, 1, 2, 5, 6, 0];
console.log('quick sort 전 : ', quick_nums); // [3, 1, 2, 6, 5];
quickSort(quick_nums, 0, quick_nums.length - 1);
console.log('quick sort 후 : ', quick_nums); // [1, 2, 3, 6, 5];
console.log('');

// ============================================================
/**
 * 힙 정렬 (Heap sort) 
 * 숫자형 배열을 받아서 받은 배열을 정렬된 상태로 수정
 */

// 특정 노드를 기준으로 해당 서브트리를 최대 힙으로 구성하는 함수
const heapify = (arr, i, n) => {
  let largest = i; // 현재 노드를 가장 큰 값으로 초기화
  const left = 2 * i + 1; // 왼쪽 자식
  const right = 2 * i + 2; // 오른쪽 자식

  // 왼쪽 자식이 존재하고, 현재 가장 큰 값보다 크면 largest 업데이트
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // 오른쪽 자식이 존재하고, 현재 가장 큰 값보다 크면 largest 업데이트
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // largest가 현재 노드가 아니라면 (자식 중 더 큰 값이 있다면)
  if (largest !== i) {
    // 두 노드의 값을 교환
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    // 교환된 노드를 기준으로 다시 heapify를 재귀적으로 호출
    heapify(arr,largest, n);
  }
}

const heapSort = (arr) => {
  const n = arr.length;

  // 1. 배열을 최대 힙으로 구성 (Max-Heap)
  // leaf 노드를 제외한 노드부터 시작하여 루트까지 진행 (leaf 노드는 하나밖에 없으므로 할 필요 x)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, i, n);
  }

  // 2. 힙 정렬 실행 (Sort)
  // 힙의 루트(최대값)를 배열의 끝으로 이동시키고, 힙 크기를 줄여가며 반복
  for (let i = n - 1; i > 0; i--) {
    // 현재 루트(최대값)와 배열의 마지막 요소를 교환
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // 크기가 줄어든 힙에 대해 heapify를 호출하여 최대 힙 속성 유지
    heapify(arr, 0, i);
  }
}

const heap_nums = [12, 11, 13, 5, 6, 7];
console.log("heap sort 전:", heap_nums); // 결과: [12, 11, 13, 5, 6, 7]
heapSort(heap_nums);
console.log("heap sort 후:", heap_nums); // 결과: [5, 6, 7, 11, 12, 13]