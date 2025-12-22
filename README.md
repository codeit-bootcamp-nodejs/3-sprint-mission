# 스프린트 미션 12

## 미션 목표
- 자바스크립트로 정렬 알고리즘 구현하기

## 요구사항
다음 정렬 알고리즘을 각각 JavaScript 함수로 구현해 주세요.

### 선택 정렬 (Selection sort)
- [x] 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

### 삽입 정렬 (Insertion sort)
- [x] 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

### 병합 정렬 (Merge sort)
- [x] 숫자형 배열을 파라미터로 받고, 정렬된 새로운 배열을 리턴하도록 구현합니다.

### 퀵 정렬 (Quick sort)
- [x] 숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

### 함수 예시:
해당 배열을 직접 수정하는 예시
```js
const nums = [3, 1, 2];
console.log(nums); // [3, 1, 2];
selectionSort(nums);
console.log(nums); // [1, 2, 3]
```

### 제출 안내
`algorithm` 폴더를 만들고 `sorts.js` 파일에 구현한 함수들을 작성해 주세요.

---
# 스프린트 미션 13

## 미션 목표
- 자바스크립트로 자료 구조 구현하기
- 자바스크립트로 힙 정렬 구현하기

## 요구사항
다음 자료 구조를 구현해 `algorithm` 폴더에 저장해 주세요.

### 링크드 리스트 (Linked List)
- 파일 이름: `LinkedList.js`
- 클래스 이름: `LinkedList`
- 메서드:
  - [x] `addNode(value)`: 리스트의 끝에 새 노드를 추가
  - [x] `findNode(value)`: 주어진 값을 가지는 노드를 찾아 리턴
  - [x] `insertAfter(targetValue, newValue)`: 특정 값을 가진 노드 뒤에 새 노드 추가
  - [x] `removeAfter(targetValue)`: 특정 값을 가진 노드 뒤의 노드를 삭제

### 이중 링크드 리스트 (Doubly Linked List)
- 파일 이름: `DoublyLinkedList.js`
- 클래스 이름: `DoublyLinkedList`
- 메서드:
  - [x] `addToHead(value)`: 리스트의 앞쪽에 노드 추가
  - [x] `addToTail(value)`: 리스트의 뒤쪽에 노드 추가
  - [x] `insertAfter(targetValue, newValue)`: 특정 값을 가진 노드 뒤에 새 노드 추가
  - [x] `findNode(value)`: 값을 가진 노드를 찾아 반환합니다.
  - [x] `removeNode(value)`: 특정 값을 가진 노드 삭제

### 큐 (Queue)
- 파일 이름: `Queue.js`
- 클래스 이름: `Queue`
- 메서드:
  - [x] `enqueue(value)`: 큐의 맨 뒤에 값을 추가
  - [x] `dequeue()`: 큐의 앞에서 값을 제거하고 그 값을 리턴
  - [x] `peek()`: 큐의 앞에 있는 값을 제거하지 않고 리턴
  - [x] `isEmpty()`: 큐가 비어 있는지 불린형으로 리턴

### 스택 (Stack)
- 파일 이름: `Stack.js`
- 클래스 이름: `Stack`
- 메서드:
  - [x] `push(value)`: 스택의 맨 위에 값을 추가
  - [x] `pop()`: 스택의 맨 위 값을 제거하고 그 값을 리턴
  - [x] `peek()`: 스택의 맨 위 값을 제거하지 않고 그 값을 리턴
  - [x] `isEmpty()`: 스택이 비어 있는지 불린형으로 리턴

### 이진 탐색 트리 (Binary Search Tree)
- 파일 이름: `BinarySearchTree.js`
- 클래스 이름: `BinarySearchTree`
- 메서드:
  - [x] `insert(value)`: 트리에 값 추가
  - [x] `find(value)`: 주어진 값을 찾고 해당 노드를 리턴
  - [x] `remove(value)`: 트리에서 해당 값을 삭제

다음 알고리즘을 JavaScript로 구현해 `algorithm/sorts.js` 파일에 추가로 작성해 주세요.

### 힙 정렬
- [x] 함수 이름: `heapsort()`
- 숫자형 배열을 받아서 받은 배열을 정렬된 상태로 수정

### 제출 안내
`algorithm` 폴더를 만들고 그 아래에 만든 파일들을 저장해 주세요.

---

## 멘토에게
- 스프린트 미션 12에서 피드백 주신 const와 같은 변수 선언자가 누락된 부분을 수정하였습니다.
- LinkedList의 경우 head만 가지고 있는게 기본 형태이나, tail이 추가된 형태로 강의가 진행되어 해당 형태에 맞게 구현하였습니다.