/**
 * @file DoublyLinkedList.js
 * @description 이중 연결 리스트(Doubly Linked List) 구현 클래스
 */

/**
 * 이중 연결 리스트 노드 구조
 */
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * Doubly Linked List Class
 * @description head ↔ tail 양방향으로 이동 가능한 연결 리스트
 */
export class DoublyLinkedList {
  constructor() {
    /**
     * @type { Node | null}
     */
    this.head = null;

    /**
     * @type { Node | null}
     */
    this.tail = null;
  }

  /**
   * head에 새 노드를 추가합니다.
   * 
   * @param {any} value - 추가할 값 
   * @returns {void}
   */
  addToHead(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  /**
   * tail에 새 노드를 추가합니다.
   * 
   * @param {any} value - 추가할 값
   * @returns {void}
   */
  addToTail(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  /**
   * 특정 값을 가진 노드 뒤에 새 노드를 삽입합니다.
   * 
   * @param {any} targetValue - 삽입 기준 값
   * @param {any} newValue - 새로 삽입할 값
   * @returns {boolean} 성공 시 true, 실패 시 false
   */
  insertAfter(targetValue, newValue) {
    let current = this.head;

    while (current) {
      if (current.value === targetValue) break;
      current = current.next;
    }
    if (!current) return false;

    const newNode = new Node(newValue);
    newNode.prev = current;
    newNode.next = current.next;

    if (current.next) {
      current.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    current.next = newNode;
    return true;
  }

  /**
   * 값을 가진 노드를 찾아 반환합니다.
   * 
   * @param {any} value - 찾을 값 
   * @returns {Node | null} 찾은 노드, 없으면 null
   */
  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  /**
   * 특정 값을 가진 노드를 삭제합니다.
   * 
   * @param {any} value - 삭제할 값 
   * @returns {boolean} 성공 시 true, 실패 시 false
   */
  removeNode(value) {
    let current = this.head;

    while (current && current.value !== value) current = current.next;
    if (!current) return false;

    // head 제거
    if (current.prev) {
      current.prev.next = current.next;
    } else {
      this.head = current.next;
    }

    // tail 제거
    if (current.next) {
      current.next.prev = current.prev;
    } else {
      this.tail = current.prev;
    }

    return true;
  }
}
