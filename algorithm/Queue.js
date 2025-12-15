/**
 * 큐의 노드
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * 큐 (Queue) - FIFO (First In, First Out)
 * - front: 맨 앞 노드 (dequeue 위치)
 * - rear: 맨 뒤 노드 (enqueue 위치)
 * - size: 현재 노드 개수
 */
class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  // 큐 뒤에 추가
  enqueue(value) {
    const newNode = new Node(value);

    if (this.rear === null) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.size += 1;
  }

  // 큐 앞에서 제거하고 값 반환
  dequeue() {
    const target = this.front;

    if (!target) return null;

    if (target === this.rear) {
      this.front = null;
      this.rear = null;
    } else {
      this.front = target.next;
    }
    this.size -= 1;

    return target.value;
  }

  // 맨 앞 값 확인 (제거 안 함)
  peek() {
    if (this.front === null) return null;
    return this.front.value;
  }

  // 큐가 비어있는지 확인
  isEmpty() {
    return this.size === 0;
  }

  // 큐 전체 출력 (디버깅용)
  print() {
    const values = [];
    let current = this.front;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    console.log("front [" + values.join(" → ") + "] rear" || "빈 큐");
  }
}

// ============ 테스트 코드 ============
const queue = new Queue();

console.log("=== enqueue 테스트 ===");
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print(); // front [1 → 2 → 3] rear
console.log("size:", queue.size); // 3

console.log("\n=== peek 테스트 ===");
console.log("peek:", queue.peek()); // 1 (제거 안 됨)
queue.print(); // front [1 → 2 → 3] rear

console.log("\n=== dequeue 테스트 ===");
console.log("dequeue:", queue.dequeue()); // 1
queue.print(); // front [2 → 3] rear
console.log("size:", queue.size); // 2

console.log("\n=== isEmpty 테스트 ===");
console.log("isEmpty:", queue.isEmpty()); // false

console.log("\n=== 전부 dequeue 테스트 ===");
console.log("dequeue:", queue.dequeue()); // 2
console.log("dequeue:", queue.dequeue()); // 3
console.log("dequeue:", queue.dequeue()); // null (빈 큐)
console.log("isEmpty:", queue.isEmpty()); // true
console.log("size:", queue.size); // 0
