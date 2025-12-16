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
- 기본 요구사항은 모두 충족하였으며, 추가 구현한 내용을 아래에 기재합니다.

### Hash Table
- 문자열 해시 함수
- Chaining 방식 충돌 처리
- `put / get / remove / has` 포함

### Graph
- 인접 리스트 기반
- 단방향 / 양방향 간선 추가, 정점 조회 기능 포함

### BFS / DFS
- 인접 리스트를 대상으로 하는 기본 탐색 알고리즘

### CI
- `Vitest` 테스트 코드를 작성했습니다.
  - 테스트 케이스는 아래와 같습니다.
    - `sort.test.ts`(3): HeapSort 추가
    - `datastructures.test`(12): LinkedList, DoublyLinkedList, Queue, Stack, BinarySearchTree
    - `extra-datastructures.test.js`(10): HashTable, Graph, BFS, DFS
