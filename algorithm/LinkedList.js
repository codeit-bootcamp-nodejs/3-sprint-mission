/**
* addNode(value): 리스트의 끝에 새 노드를 추가
* findNode(value): 주어진 값을 가지는 노드를 찾아 리턴
* insertAfter(targetValue, newValue): 특정 값을 가진 노드 뒤에 새 노드 추가
* removeAfter(targetValue): 특정 값을 가진 노드 뒤의 노드를 삭제
 */

class Node {
  constructor(data) {
    this.data = data
    this.next = null;
  }
};

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addNode(value) {
    // 들어온 값으로 노드 생성
    const newNode = new Node(value)
    // 노드가 없을 경우, head와 tail에 모두 연결
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }
    else { // 하나라도 있는 경우 tail 뒤에 추가하고 tail 갱신
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(value) {
    let it = this.head;
    // iterator가 끝이 아닐때까지 반복
    while (it) {
      // 만약 iterator가 보고 있는 노드의 값과 찾고자 하는 값이 같으면 자기 자신 리턴
      if (it.data === value) {
        return it
      }
      it = it.next; // 다음 노드로 이동
    }
    return null; // 못찾았을 경우 null 리턴
  }

  insertAfter(targetValue, newValue) {
    // 삽입할 위치 전의 노드 찾기
    let beforeNode = this.findNode(targetValue);

    // 타겟 값이 없는 경우
    if (!beforeNode) {
      console.error("삽입할 위치를 찾지 못하였습니다.")
      return
    }

    // 새 노드 생성
    const newNode = new Node(newValue)

    // 새 노드 연결
    if (beforeNode === this.tail) { // 가장 마지막이였을 경우 tail도 업데이트
      this.tail.next = newNode
      this.tail = newNode
    }
    else { // 그 외의 경우는 앞 노드의 정보 업데이트 및 뒤 노드와 연결
      newNode.next = beforeNode.next
      beforeNode.next = newNode
    }
  }

  removeAfter(targetValue) {
    // targetValue를 가진 노드 찾기
    const beforeNode = this.findNode(targetValue);

    // 타겟 노드가 없는 경우
    if (!beforeNode) {
      console.error("삭제할 위치의 이전 노드를 찾지 못하였습니다.")
      return
    }

    // 삭제할 노드 지정
    const nodeToRemove = beforeNode.next;

    // 삭제할 노드가 없는 경우 (beforeNode가 마지막 노드인 경우)
    if (!nodeToRemove) {
      console.log("마지막 노드이므로 다음 노드가 없습니다");
      return;
    }

    // 삭제할 노드가 마지막 노드였을 경우 tail 업데이트
    if (nodeToRemove === this.tail) {
      this.tail = beforeNode;
    }

    // 이전 노드와 삭제할 노드의 다음 노드를 연결
    beforeNode.next = nodeToRemove.next;
  }

  print() {
    let it = this.head;
    const nodes = [];
    while (it) {
      nodes.push(it.data);
      it = it.next;
    }
    console.log("Current List:", nodes.join(" -> "));
  }
}

// --- 실행 예시 ---

console.log("--- LinkedList 실행 예시 ---");

const list = new LinkedList();

console.log("\n1. 노드 추가 (addNode)");
list.addNode(1);
list.addNode(3);
list.addNode(2);
list.addNode(4);
list.print(); // 현재 리스트: 1 -> 3 -> 2 -> 4

console.log("\n2. 노드 찾기 (findNode)");
let foundNode = list.findNode(2);
console.log("2를 찾았습니다:", foundNode ? foundNode.data : "찾을 수 없음");
foundNode = list.findNode(5);
console.log("5를 찾았습니다:", foundNode ? foundNode.data : "찾을 수 없음");

console.log("\n3. 노드 삽입 (insertAfter)");
list.insertAfter(2, 6); // 2 뒤에 6 삽입
console.log("2 뒤에 6 삽입 후:");
list.print(); // 현재 리스트: 1 -> 3 -> 2 -> 6 -> 4

list.insertAfter(4, 6); // 마지막 노드(4) 뒤에 6 삽입
console.log("4 뒤에 6 삽입 후:");
list.print(); // 현재 리스트: 1 -> 3 -> 2 -> 6 -> 4 -> 6

console.log("\n4. 노드 삭제 (removeAfter)");
console.log("3 뒤의 노드(2) 삭제:");
list.removeAfter(3);
list.print(); // 현재 리스트: 1 -> 3 -> 6 -> 4 -> 6

console.log("4 뒤의 노드(6) 삭제:");
list.removeAfter(4);
list.print(); // 현재 리스트: 1 -> 3 -> 6 -> 4

console.log("마지막 노드(4) 뒤의 노드 삭제 시도:");
list.removeAfter(4); // 마지막 노드이므로 다음 노드가 없다는 메시지 출력
list.print(); // 변화 없음

console.log("\n--- LinkedList 실행 예시 종료 ---");