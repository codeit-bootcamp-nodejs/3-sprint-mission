/**
 * addToHead(value): 리스트의 앞쪽에 노드 추가
 * addToTail(value): 리스트의 뒤쪽에 노드 추가
 * insertAfter(targetValue, newValue): 특정 값을 가진 노드 뒤에 새 노드 추가
 * findNode(value): 값을 가진 노드를 찾아 반환합니다.
 * removeNode(value): 특정 값을 가진 노드 삭제
 */

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  addToHead(value) {
    // 새 노드 생성
    const newNode = new Node(value);
    // LinkedList가 비어있는 경우, head와 tail 모두 업데이트
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }
    // 그 외에는 head와 newNode 연결 
    else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
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
    const beforeNode = this.findNode(targetValue);
    // 타겟 값이 없는 경우
    if (!beforeNode) {
      console.error("삽입할 위치의 노드를 찾지 못하였습니다.");
      return;
    }

    // 타겟 노드가 마지막 노드일 경우
    if (beforeNode === this.tail) {
      this.addToTail(newValue);
    }
    // 그 외 중간인 경우
    else {
      // 노드 생성
      const newNode = new Node(newValue);
      const nextNode = beforeNode.next;

      // 이전 노드와 연결 업데이트
      beforeNode.next = newNode;
      newNode.prev = beforeNode;

      // 이후 노드와 연결 업데이트
      newNode.next = nextNode;
      nextNode.prev = newNode;
    }
  }

  removeNode(value) {
    // 삭제할 위치 전의 노드 찾기
    const nodeToRemove = this.findNode(value);

    // 타겟 값이 없는 경우
    if (!nodeToRemove) {
      console.error("삭제할 노드를 찾지 못하였습니다.");
      return;
    }

    // head를 삭제하는 경우
    if (nodeToRemove === this.head) {
      this.head = nodeToRemove.next;
      if (this.head) {
        this.head.prev = null;
      }
      else { // 노드가 하나뿐이었을 경우
        this.tail = null;
      }
      return;
    }

    // tail을 삭제하는 경우
    if (nodeToRemove === this.tail) {
      this.tail = nodeToRemove.prev;
      this.tail.next = null;
      return;
    }

    // 중간 노드를 삭제하는 경우
    const prevNode = nodeToRemove.prev;
    const nextNode = nodeToRemove.next;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  // head부터 출력하는 메소드
  print() {
    const nodes = [];
    let it = this.head;
    while (it) {
      nodes.push(it.data);
      it = it.next;
    }
    console.log("Forward:", nodes.join(" <-> "));
  }

  // tail부터 역방향으로 출력하는 메소드
  printReverse() {
    const nodes = [];
    let it = this.tail;
    while (it) {
      nodes.push(it.data);
      it = it.prev;
    }
    console.log("Reverse:", nodes.join(" <-> "));
  }
}

// --- 실행 예시 코드 ---
console.log("--- DoublyLinkedList 실행 예시 시작 ---");

const DDL = new DoublyLinkedList();

console.log("\n1. 노드 추가 (addToTail, addToHead)");
DDL.addToTail(2);
DDL.addToTail(3);
DDL.addToHead(1);
DDL.print(); // 결과: 1 <-> 2 <-> 3
DDL.printReverse(); // 결과: 3 <-> 2 <-> 1

console.log("\n2. 노드 삽입 (insertAfter)");
DDL.insertAfter(2, 5);
DDL.print(); // 결과: 1 <-> 2 <-> 5 <-> 3

console.log("\n3. 노드 삭제 (removeNode)");
DDL.removeNode(2);
DDL.print(); // 결과: 1 <-> 5 <-> 3
DDL.printReverse(); // 결과: 3 <-> 5 <-> 1

DDL.removeNode(1); // head 삭제
DDL.print(); // 결과: 5 <-> 3

DDL.addToHead(7);
DDL.removeNode(3); // tail 삭제
DDL.print(); // 결과: 7 <-> 5

console.log("\n--- DoublyLinkedList 실행 예시 종료 ---");