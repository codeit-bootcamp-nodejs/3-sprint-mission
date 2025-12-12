/**
 * @file Stack.js
 * @description Stack 자료구조 구현 클래스 (LIFO 방식)
 */

/**
 * Stack 클래스
 * @description 배열 기반의 LIFO 스택 구조
 */
export class Stack {
  constructor() {
    /**
     * @type {any[]}
     */
    this.items = [];
  }

  /**
   * 값을 스택의 맨 위에 추가합니다.
   * 
   * @param {any} value - 추가할 값
   * @returns {void}
   */
  push(value) {
    this.items.push(value)
  }

  /**
   * 스택의 맨 위 값을 제거하고 반환합니다.
   * 
   * @returns {any | null} 제거된 값, 스택이 비어 있으면 null
   */
  pop() {
    return this.items.length ? this.items.pop() : null;
  }

  /**
   * 스택의 맨 위 값을 제거하지 않고 반환합니다
   * 
   * @returns {any | null} 맨 위에 있는 값, 없으면 null
   */
  peek() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }

  /**
   * 스택이 비어있는지 여부를 반환합니다.
   * 
   * @returns {boolean} 비어 있으면 true, 아니면 null
   */
  isEmpty() {
    return this.items.length === 0;
  }
}
