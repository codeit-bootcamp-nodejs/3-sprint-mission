/**
 * @file Queue.js
 * @description Queue 자료구조 구현 클래스(FIFO 방식)
 */

export class Queue {
  constructor() {
    /**
     * @type {any[]}
     */
    this.items = [];
  }

  /**
   * 값을 큐의 맨 뒤에 추가합니다.
   * 
   * @param {any} value - 추가할 값
   * @returns {void} 
   */
    enqueue(value) {
      this.items.push(value);
    }

    /**
     * 큐의 맨 앞 값을 제거하고 반환합니다.
     * 
     * @returns {any | null} 제거된 값, 큐가 비어 있으면 null 
     */
    dequeue() {
      return this.items.length ? this.items.shift() : null;
    }

    /**
     * 큐의 맨 앞 값을 제거하지 않고 반환합니다.
     * 
     * @returns  
     */
    peek() {
      return this.items.length ? this.items[0] : null;
    }

    /**
     * 큐가 비어있는지 여부를 반환합니다.
     * 
     * @returns {boolean} 비어 있으면 true, 아니면 false
     */
    isEmpty() {
      return this.items.length === 0;
    }
}
