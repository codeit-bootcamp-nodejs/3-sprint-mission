/**
 * @file LinkedList.js
 * @description 단일 연결 리스트(Linked List) 구현 클래스
 */

/**
 * 단일 연결 리스트 노드 구조
 */
class Node {
  /**
   * @param {any} value - 노드에 저장할 값
   */
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/**
 * Linked List Class
 * @description head부터 시작하는 단일 연결 리스트를 제공합니다.
 */
export class LinkedList {
  /**
   * @type { Node | null}
   */
  constructor() {
    this.head = null;
  }

  /**
   * 리스트 끝에 새 노드를 추가합니다.
   * @param {any} value - 추가할 값
   * @returns {void}
   */
  addNode(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) current = current.next;

    current.next = newNode;
  }

  /**
   * HashTable용 append 메서드 추가
   */
  append(value) {
    this.addNode(value);
  }

  /**
   * 주어진 값을 가진 노드를 찾아 반환합니다.
   *
   * @param {any} value - 찾을 값
   * @returns {Node | null} 값을 찾을 노드 | 없으면 null
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
   * 특정 값을 가진 노드 뒤에 새 노드를 삽입합니다.
   *
   * @param {any} targetValue  - 삽입 기준 값
   * @param {any} newValue - 새로 삽입할 값
   * @returns {boolean} 성공 시 true | 실패(타깃 없음) 시 false
   */
  insertAfter(targetValue, newValue) {
    const target = this.findNode(targetValue);
    if (!target) return false;

    const newNode = new Node(newValue);
    newNode.next = target.next;
    target.next = newNode;

    return true;
  }

  /**
   * 특정 값을 가진 노드 뒤의 노드를 삭제합니다.
   *
   * @param {any} targetValue - 삭제 기준 값
   * @returns {boolean} 성공 시 true | 실패(타깃 없음) 시 false
   */
  removeAfter(targetValue) {
    const target = this.findNode(targetValue);
    if (!target || !target.next) return false; // !target?.next로 처리 가능하나 코드 구현 의도 표현을 위해 or 처리함.

    target.next = target.next.next;
    return true;
  }
}
