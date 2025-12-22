/**
 * enqueue(value): 큐의 맨 뒤에 값을 추가
 * dequeue(): 큐의 앞에서 값을 제거하고 그 값을 리턴
 * peek(): 큐의 앞에 있는 값을 제거하지 않고 리턴
 * isEmpty(): 큐가 비어 있는지 불린형으로 리턴
 */

class Queue {

  constructor() {
    this.list = []
  }

  enqueue(value) { // 가장 끝에 값을 추가
    this.list.push(value);
  }

  dequeue() {
    // 큐에 원소가 없는 경우
    if (this.list.length === 0) {
      console.log("큐가 비어있습니다.")
      return null;
    }
    // 가장 앞 원소 반환 후 list에서 제거
    return this.list.shift();
  }

  peek() {
    // 큐에 원소가 없는 경우
    if (this.list.length === 0) {
      console.log("큐가 비어있습니다.")
      return null
    }
    // 원소가 하나라도 있으면 해당 값 반환
    return this.list[0];
  }

  isEmpty() {
    return this.list.length === 0;
  }
}

console.log("--- Queue 실행 예시 시작 ---");

const queue = new Queue();

console.log("\n1. 큐에 요소 추가 (enqueue)");
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log("현재 큐:", queue.list); // 결과: [1, 2, 3]

console.log("\n2. 큐의 맨 앞 요소 확인 (peek)");
console.log("peek:", queue.peek()); // 결과: 1
console.log("현재 큐:", queue.list); // 결과: [1, 2, 3]

console.log("\n3. 큐에서 요소 제거 (dequeue)");
console.log("dequeue:", queue.dequeue()); // 결과: 1
console.log("현재 큐:", queue.list); // 결과: [2, 3]

console.log("dequeue:", queue.dequeue()); // 결과: 2
console.log("현재 큐:", queue.list); // 결과: [3]

console.log("\n4. 큐가 비어 있는지 확인 (isEmpty)");
console.log("큐가 비어있는가?", queue.isEmpty()); // 결과: false

console.log("dequeue:", queue.dequeue()); // 결과: 3
console.log("현재 큐:", queue.list); // 결과: []

console.log("큐가 비어있는가?", queue.isEmpty()); // 결과: true
console.log("비어있는 큐에서 dequeue 시도:");
console.log("dequeue:", queue.dequeue()); // "큐가 비어있습니다." 메시지 출력, 결과: null

console.log("\n--- Queue 실행 예시 종료 ---");