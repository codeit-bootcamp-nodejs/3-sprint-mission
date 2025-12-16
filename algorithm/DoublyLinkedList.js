/**
 * 이중 연결 리스트의 노드
 * - prev: 이전 노드 참조
 * - next: 다음 노드 참조
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * 이중 연결 리스트 (Doubly Linked List)
 * - head: 첫 번째 노드
 * - tail: 마지막 노드
 * - 양방향 탐색 가능 (prev, next)
 */
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // 리스트 맨 앞에 노드 추가
  addToHead(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  // 리스트 맨 뒤에 노드 추가
  addToTail(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
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
      newNode.prev = target;
      this.tail = newNode;
    } else {
      newNode.next = target.next;
      newNode.prev = target;
      target.next.prev = newNode;
      target.next = newNode;
    }
  }

  // 값으로 노드 삭제 (head, tail, 중간 모두 처리)
  removeNode(value) {
    const target = this.findNode(value);

    if (!target) return null;

    if (target === this.head && target === this.tail) {
      // 노드가 하나뿐인 경우
      this.head = null;
      this.tail = null;
    } else if (target === this.head) {
      // head 삭제
      target.next.prev = null;
      this.head = target.next;
    } else if (target === this.tail) {
      // tail 삭제
      target.prev.next = null;
      this.tail = target.prev;
    } else {
      // 중간 노드 삭제
      target.prev.next = target.next;
      target.next.prev = target.prev;
    }
  }

  // 리스트 전체 출력 (디버깅용)
  print() {
    const values = [];
    let iterator = this.head;

    while (iterator) {
      values.push(iterator.value);
      iterator = iterator.next;
    }

    console.log(values.join(" <-> ") || "빈 리스트");
  }
}

// ============ 테스트 코드 ============
const list = new DoublyLinkedList();

console.log("=== addToTail 테스트 ===");
list.addToTail(1);
list.addToTail(2);
list.addToTail(3);
list.print(); // 1 <-> 2 <-> 3

console.log("\n=== addToHead 테스트 ===");
list.addToHead(0);
list.print(); // 0 <-> 1 <-> 2 <-> 3

console.log("\n=== findNode 테스트 ===");
console.log("find(2):", list.findNode(2)?.value); // 2
console.log("find(99):", list.findNode(99)); // null

console.log("\n=== insertAfter(2, 99) 테스트 ===");
list.insertAfter(2, 99);
list.print(); // 0 <-> 1 <-> 2 <-> 99 <-> 3

console.log("\n=== removeNode(99) 테스트 (중간 삭제) ===");
list.removeNode(99);
list.print(); // 0 <-> 1 <-> 2 <-> 3

console.log("\n=== removeNode(0) 테스트 (head 삭제) ===");
list.removeNode(0);
list.print(); // 1 <-> 2 <-> 3
console.log("head:", list.head.value); // 1

console.log("\n=== removeNode(3) 테스트 (tail 삭제) ===");
list.removeNode(3);
list.print(); // 1 <-> 2
console.log("tail:", list.tail.value); // 2

console.log("\n=== 양방향 탐색 테스트 ===");
console.log("head에서 next:", list.head.value, "->", list.head.next.value); // 1 -> 2
console.log("tail에서 prev:", list.tail.value, "<-", list.tail.prev.value); // 2 <- 1
