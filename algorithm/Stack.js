/**
 * 스택의 노드
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * 스택 (Stack) - LIFO (Last In, First Out)
 * - top: 맨 위 노드 (push, pop 위치)
 * - size: 현재 노드 개수
 */
class Stack {
  constructor() {
    this.top = null;
    this.size = 0;
  }

  // 스택 맨 위에 추가
  push(value) {
    const newNode = new Node(value);
    newNode.next = this.top;
    this.top = newNode;
    this.size += 1;
  }

  // 스택 맨 위에서 제거하고 값 반환
  pop() {
    if (!this.top) return null;

    const target = this.top;
    this.top = target.next;
    this.size -= 1;

    return target.value;
  }

  // 맨 위 값 확인 (제거 안 함)
  peek() {
    if (!this.top) return null;
    return this.top.value;
  }

  // 스택이 비어있는지 확인
  isEmpty() {
    return this.size === 0;
  }

  // 스택 전체 출력 (디버깅용)
  print() {
    const values = [];
    let current = this.top;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    console.log("top → [" + values.join("] → [") + "]" || "빈 스택");
  }
}

// ============ 테스트 코드 ============
const stack = new Stack();

console.log("=== push 테스트 ===");
stack.push(1);
stack.push(2);
stack.push(3);
stack.print(); // top → [3] → [2] → [1]
console.log("size:", stack.size); // 3

console.log("\n=== peek 테스트 ===");
console.log("peek:", stack.peek()); // 3 (제거 안 됨)
stack.print(); // top → [3] → [2] → [1]

console.log("\n=== pop 테스트 ===");
console.log("pop:", stack.pop()); // 3
stack.print(); // top → [2] → [1]
console.log("size:", stack.size); // 2

console.log("\n=== isEmpty 테스트 ===");
console.log("isEmpty:", stack.isEmpty()); // false

console.log("\n=== 전부 pop 테스트 ===");
console.log("pop:", stack.pop()); // 2
console.log("pop:", stack.pop()); // 1
console.log("pop:", stack.pop()); // null (빈 스택)
console.log("isEmpty:", stack.isEmpty()); // true
console.log("size:", stack.size); // 0

console.log("\n=== LIFO 확인 테스트 ===");
stack.push("A");
stack.push("B");
stack.push("C");
console.log("넣은 순서: A → B → C");
console.log("나오는 순서:", stack.pop(), stack.pop(), stack.pop()); // C B A
