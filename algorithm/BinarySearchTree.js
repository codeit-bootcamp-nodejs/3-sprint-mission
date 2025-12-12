/**
 * @file BinarySearchTree.js
 * @description BST(이진 탐색 트리) 구현 클래스
 * 
 * @details
 * - 왼쪽 서브트리는 항상 작은 값
 * - 오른쪽 서브트리는 항상 큰 값
 * - 탐색, 삽입, 삭제가 평균 O(log n) 시간에 수행됨
 */

/**
 * BST 노드 구조
 */
class TreeNode {
  /**
   * @param {number} value - 노드에 저장할 값
   */
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

/**
 * BST 트리
 */
export class BinarySearchTree {
  constructor() {
    /**
     * @type {TreeNode | null}
     */
    this.root = null;
  }
  /**
   * 값을 트리에 삽입합니다.
   * 
   * @param {number} value - 삽입할 값
   * @returns {void}
   */
  insert(value) {
    this.root = this.#insertNode(this.root, value);
  }

  /**
   * 내부 재귀용 삽입 함수
   * 
   * @private
   * @param {TreeNode | null} node 
   * @param {number} value 
   * @returns {TreeNode}
   */
  #insertNode(node, value) {
    if (node === null) return new TreeNode(value);

    if (value < node.value) {
      node.left = this.#insertNode(node.left, value);
    } else {
      node.right = this.#insertNode(node.right, value);
    }

    return node;
  }

  /**
   * 값을 가진 노드를 탐색해 반환합니다.
   * 
   * @param {number} value - 찾을 값 
   * @returns {TreeNode | null} 찾은 노드, 없으면 null
   */
  find(value) {
    return this.#findNode(this.root, value);
  }

  /**
   * 내부 재귀용 탐색 함수
   * 
   * @private
   * @param {TreeNode | null} node
   * @param {number} value 
   * @returns {TreeNode | null}
   */
  #findNode(node, value) {
    if (node === null) return null;

    if (value === node.value) return node;
    if (value < node.value) return this.#findNode(node.left, value);

    return this.#findNode(node.right, value);
  }

  /**
   * 값을 가진 노드를 트리에서 삭제합니다.
   * 
   * @param {number} value - 삭제할 값
   * @returns {void}
   */
  remove(value) {
    this.root = this.#removeNode(this.root, value);
  }

  /**
   * 내부 재귀용 삭제 함수
   * 
   * @private
   * @param {TreeNode | null} node
   * @param {number} value
   * @returns {TreeNode | null}
   */
  #removeNode(node, value) {
    if (node === null) return null;

    // 삭제 대상 값 탐색
    if (value < node.value) {
      node.left = this.#removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.#removeNode(node.right, value);
      return node;
    }

    // 일치 노드 발견 → 삭제 처리 시작
    // 1. 자식 없음 (리프 노드)
    if (!node.left && !node.right) return null;

    // 2. 자식이 하나 (좌 or 우)
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    // 3. 자식이 둘 다 있음
    // - 오른쪽 서브트리 min 값을 찾아 교체
    const successor = this.#findMin(node.right);
    node.value = successor.value;
    node.right = this.#removeNode(node.right, successor.value);

    return node;
  }

  /**
   * 오른쪽 서브트리에서 min 노드룰 찾는 함수
   * 
   * @private
   * @param {TreeNode} node 
   * @returns {TreeNode}
   */
  #findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}
