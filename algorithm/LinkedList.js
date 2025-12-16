/**
 * 단일 연결 리스트의 노드
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * 단일 연결 리스트 (Singly Linked List)
 * - head: 첫 번째 노드
 * - tail: 마지막 노드
 */
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // 리스트 맨 뒤에 노드 추가
  addNode(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  // 값으로 노드 검색, 없으면 null 반환
  findNode(value) {
    let iterator = this.head;

    while (iterator) {
      if (iterator.value === value) return iterator;
      iterator = iterator.next;
    }

    return null;
  }

  // targetValue 노드 뒤에 newValue 노드 삽입
  insertAfter(targetValue, newValue) {
    const target = this.findNode(targetValue);

    if (!target) return null;
    const newNode = new Node(newValue);

    if (target.next === null) {
      target.next = newNode;
      this.tail = newNode;
    } else {
      newNode.next = target.next;
      target.next = newNode;
    }
  }

  // targetValue 노드 다음 노드 삭제, 삭제된 값 반환
  removeAfter(targetValue) {
    const target = this.findNode(targetValue);

    if (!target || !target.next) return null;

    const removed = target.next;
    target.next = removed.next;

    if (removed === this.tail) {
      this.tail = target;
    }

    return removed.value;
  }

  // 리스트 전체 출력 (디버깅용)
  print() {
    const values = [];
    let iterator = this.head;

    while (iterator) {
      values.push(iterator.value);
      iterator = iterator.next;
    }

    console.log(values.join(" -> ") || "빈 리스트");
  }
}

// ============ 테스트 코드 ============
const list = new LinkedList();

console.log("=== addNode 테스트 ===");
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.print(); // 1 -> 2 -> 3

console.log("\n=== findNode 테스트 ===");
console.log("find(2):", list.findNode(2)?.value); // 2
console.log("find(99):", list.findNode(99)); // null

console.log("\n=== insertAfter(2, 99) 테스트 ===");
list.insertAfter(2, 99);
list.print(); // 1 -> 2 -> 99 -> 3

console.log("\n=== removeAfter(2) 테스트 ===");
const removed = list.removeAfter(2);
console.log("삭제된 값:", removed); // 99
list.print(); // 1 -> 2 -> 3

console.log("\n=== tail 테스트 ===");
list.insertAfter(3, 100);
list.print(); // 1 -> 2 -> 3 -> 100
console.log("tail:", list.tail.value); // 100
