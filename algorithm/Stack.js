/**
 * push(value): 스택의 맨 위에 값을 추가
 * pop(): 스택의 맨 위 값을 제거하고 그 값을 리턴
 * peek(): 스택의 맨 위 값을 제거하지 않고 그 값을 리턴
 * isEmpty(): 스택이 비어 있는지 불린형으로 리턴
 */

class Stack {

  constructor() {
    this.list = []
  }

  push(value) { // 가장 위에 추가
    this.list.push(value);
  }

  pop() {
    // stack에 원소가 없는 경우
    if (this.list.length === 0) {
      console.log("Stack이 비어있습니다.")
      return null;
    }
    // 원소가 하나라도 있으면 맨 위 원소 반환 후 list에서 제거
    return this.list.pop();
  }

  peek() {
    // stack에 원소가 없는 경우
    if (this.list.length === 0) {
      console.log("stack이 비어있습니다.")
      return null
    }
    // 원소가 하나라도 있으면 해당 값 반환 (제거하지 않음)
    return this.list[this.list.length - 1];
  }

  // stack이 비어있으면 true, 아닌 경우 false 리턴
  isEmpty() {
    return this.list.length === 0;
  }
}

// --- 실행 예시 코드 ---
console.log("--- Stack 실행 예시 시작 ---");

const stack = new Stack();

console.log("\n1. 스택에 요소 추가 (push)");
stack.push(1);
stack.push(2);
stack.push(3);
console.log("현재 스택 (bottom -> top):", stack.list); // 결과: [1, 2, 3]

console.log("\n2. 스택의 맨 위 요소 확인 (peek)");
console.log("peek:", stack.peek()); // 결과: 3
console.log("현재 스택 (bottom -> top):", stack.list); // 결과: [1, 2, 3]

console.log("\n3. 스택에서 요소 제거 (pop)");
console.log("pop:", stack.pop()); // 결과: 3
console.log("현재 스택 (bottom -> top):", stack.list); // 결과: [1, 2]

console.log("pop:", stack.pop()); // 결과: 2
console.log("현재 스택 (bottom -> top):", stack.list); // 결과: [1]

console.log("\n4. 스택이 비어 있는지 확인 (isEmpty)");
console.log("스택이 비어있는가?", stack.isEmpty()); // 결과: false

console.log("pop:", stack.pop()); // 결과: 1
console.log("현재 스택 (bottom -> top):", stack.list); // 결과: []

console.log("스택이 비어있는가?", stack.isEmpty()); // 결과: true
console.log("비어있는 스택에서 pop 시도:");
console.log("pop:", stack.pop()); // "Stack이 비어있습니다." 메시지 출력, 결과: null

console.log("\n--- Stack 실행 예시 종료 ---");