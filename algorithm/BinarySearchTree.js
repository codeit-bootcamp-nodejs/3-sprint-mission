/**
 * insert(value): 트리에 값 추가
 * find(value): 주어진 값을 찾고 해당 노드를 리턴
 * remove(value): 트리에서 해당 값을 삭제
 */

class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.leftChild = null;
    this.rightChild = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
    } else {
      let currentNode = this.root;
      while (true) {
        if (value < currentNode.data) {
          if (currentNode.leftChild === null) {
            currentNode.leftChild = newNode;
            newNode.parent = currentNode;
            return;
          }
          currentNode = currentNode.leftChild;
        } else if (value > currentNode.data) {
          if (currentNode.rightChild === null) {
            currentNode.rightChild = newNode;
            newNode.parent = currentNode;
            return;
          }
          currentNode = currentNode.rightChild;
        } else { // 중복 값은 삽입하지 않음
          return;
        }
      }
    }
  }

  find(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (value === currentNode.data) {
        return currentNode;
      } else if (value < currentNode.data) {
        currentNode = currentNode.leftChild;
      } else {
        currentNode = currentNode.rightChild;
      }
    }
    return null; // 값을 찾지 못함
  }

  remove(value) {
    const nodeToRemove = this.find(value);
    if (!nodeToRemove) {
      console.log("삭제할 노드를 찾을 수 없습니다:", value);
      return;
    }

    // Case 1: 노드가 자식이 없는 경우 (Leaf Node)
    if (nodeToRemove.leftChild === null && nodeToRemove.rightChild === null) {
      if (nodeToRemove === this.root) {
        this.root = null;
      } else {
        if (nodeToRemove.parent.leftChild === nodeToRemove) {
          nodeToRemove.parent.leftChild = null;
        } else {
          nodeToRemove.parent.rightChild = null;
        }
      }
    }
    // Case 2: 노드가 하나의 자식을 가지는 경우
    else if (nodeToRemove.leftChild === null) { // 오른쪽 자식만 있는 경우
      if (nodeToRemove === this.root) {
        this.root = nodeToRemove.rightChild;
        this.root.parent = null;
      } else {
        if (nodeToRemove.parent.leftChild === nodeToRemove) {
          nodeToRemove.parent.leftChild = nodeToRemove.rightChild;
        } else {
          nodeToRemove.parent.rightChild = nodeToRemove.rightChild;
        }
        nodeToRemove.rightChild.parent = nodeToRemove.parent;
      }
    } else if (nodeToRemove.rightChild === null) { // 왼쪽 자식만 있는 경우
      if (nodeToRemove === this.root) {
        this.root = nodeToRemove.leftChild;
        this.root.parent = null;
      } else {
        if (nodeToRemove.parent.leftChild === nodeToRemove) {
          nodeToRemove.parent.leftChild = nodeToRemove.leftChild;
        } else {
          nodeToRemove.parent.rightChild = nodeToRemove.leftChild;
        }
        nodeToRemove.leftChild.parent = nodeToRemove.parent;
      }
    }
    // Case 3: 노드가 두 개의 자식을 가지는 경우
    else {
      // 오른쪽 서브트리에서 가장 작은 값을 가진 노드 (successor)를 찾음
      let successor = nodeToRemove.rightChild;
      while (successor.leftChild !== null) {
        successor = successor.leftChild;
      }

      // successor의 데이터를 삭제할 노드로 복사
      nodeToRemove.data = successor.data;

      // successor 노드를 제거 (successor는 자식이 없거나 오른쪽 자식 하나만 가짐)
      if (successor.parent.leftChild === successor) {
        successor.parent.leftChild = successor.rightChild;
      } else {
        successor.parent.rightChild = successor.rightChild;
      }
      if (successor.rightChild !== null) {
        successor.rightChild.parent = successor.parent;
      }
    }
    console.log("노드 삭제 완료:", value);
  }

  // 중위 순회 (In-order traversal)
  _inOrderTraverse(node, callback) {
    if (node !== null) {
      this._inOrderTraverse(node.leftChild, callback);
      callback(node.data);
      this._inOrderTraverse(node.rightChild, callback);
    }
  }

  printInOrder() {
    const result = [];
    this._inOrderTraverse(this.root, (data) => result.push(data));
    console.log("In-order traversal:", result.join(" "));
  }
}

// --- 실행 예시 코드 ---
console.log("--- BinarySearchTree 실행 예시 시작 ---");

const bst = new BinarySearchTree();

console.log("\n1. 노드 삽입 (insert)");
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);
bst.printInOrder(); // 결과: 3 5 7 10 12 15 18

console.log("\n2. 노드 찾기 (find)");
let foundNode = bst.find(7);
console.log("7을 찾았습니다:", foundNode ? foundNode.data : "찾을 수 없음"); // 결과: 7
foundNode = bst.find(99);
console.log("99를 찾았습니다:", foundNode ? foundNode.data : "찾을 수 없음"); // 결과: 찾을 수 없음

console.log("\n3. 노드 삭제 (remove)");
console.log("리프 노드 (3) 삭제:");
bst.remove(3);
bst.printInOrder(); // 결과: 5 7 10 12 15 18

console.log("하나의 자식을 가진 노드 (15) 삭제:");
bst.remove(15); // 15는 18이라는 하나의 자식만 가짐
bst.printInOrder(); // 결과: 5 7 10 12 18

console.log("두 자식을 가진 노드 (10) 삭제:");
bst.remove(10); // 10은 두 자식 (5, 12)을 가짐
bst.printInOrder(); // 결과: 5 7 12 18 (successor 12로 교체)

console.log("루트 노드 (5) 삭제:");
bst.remove(5);
bst.printInOrder(); // 결과: 7 12 18

console.log("\n--- BinarySearchTree 실행 예시 종료 ---");