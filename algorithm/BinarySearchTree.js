/**
 * 이진 탐색 트리의 노드
 * - left: 작은 값
 * - right: 큰 값
 */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * 이진 탐색 트리 (Binary Search Tree)
 * - 왼쪽 자식 < 부모 < 오른쪽 자식
 * - 탐색, 삽입, 삭제 평균 O(log n)
 */
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 값으로 노드 검색
  find(value) {
    return this._findNode(this.root, value);
  }

  _findNode(node, value) {
    if (node === null) return null;

    if (node.value === value) return node;

    if (node.value < value) {
      return this._findNode(node.right, value);
    } else return this._findNode(node.left, value);
  }

  // 값 삽입 (중복 무시)
  insert(value) {
    this.root = this._insertNode(this.root, value);
  }

  _insertNode(node, value) {
    if (node === null) return new Node(value);

    if (node.value < value) {
      node.right = this._insertNode(node.right, value);
    } else if (node.value > value) {
      node.left = this._insertNode(node.left, value);
    }
    return node;
  }

  // 값 삭제
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (node === null) return null;

    if (node.value > value) {
      node.left = this._removeNode(node.left, value);
    } else if (node.value < value) {
      node.right = this._removeNode(node.right, value);
    } else {
      // 자식이 없거나 하나인 경우
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      // 자식이 둘인 경우: 오른쪽 서브트리의 최소값으로 대체
      let successor = this._findMin(node.right);
      node.value = successor.value;
      node.right = this._removeNode(node.right, successor.value);
    }

    return node;
  }

  // 서브트리에서 최소값 노드 찾기
  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}

// ============ 테스트 코드 ============
const bst = new BinarySearchTree();

console.log("=== insert 테스트 ===");
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(1);
bst.insert(4);
console.log("삽입: 5, 3, 7, 1, 4");
console.log("root:", bst.root.value); // 5
console.log("root.left:", bst.root.left.value); // 3
console.log("root.right:", bst.root.right.value); // 7

console.log("\n=== find 테스트 ===");
console.log("find(3):", bst.find(3)?.value); // 3
console.log("find(99):", bst.find(99)); // null

console.log("\n=== remove 테스트 ===");
bst.remove(3);
console.log("remove(3) 후");
console.log("root.left:", bst.root.left.value); // 4 (successor로 대체)
