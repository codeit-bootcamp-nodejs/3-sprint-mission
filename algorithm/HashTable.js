/**
 * 해시 테이블 (Hash Table)
 * @description 해시 함수 + Chaining(연결 리스트) 기반 충돌 처리 방식
 */

import { LinkedList } from "./LinkedList";

/**
 * 기본 해시 함수
 * 문자열 key를 받아 해시 인덱스를 반환
 *
 * @param {string} key
 * @param {number} size - 배열 크기
 * @returns {number} 해시 인덱스
 */
const hashFunc = (key, size) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * 31) % size;
  }
  return hash;
};

export class HashTable {
  /**
   * @param {Number} size - 버킷 크기
   */
  constructor(size = 32) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => new LinkedList());
  }

  /**
   * 내부 버킷에서 key에 해당하는 노드를 찾는 함수
   *
   * @param {LinkedList} bucket
   * @param {string} key
   */
  _findNode(bucket, key) {
    let current = bucket.head;
    while (current) {
      if (current.value.key === key) return current;
      current = current.next;
    }
    return null;
  }

  /**
   * 값 삽입 / 갱신
   *
   * @param {string} key
   * @param {*} value
   */
  put(key, value) {
    const index = hashFunc(key, this.size);
    const bucket = this.buckets[index];

    const existingNode = this._findNode(bucket, key);

    if (existingNode) existingNode.value.value = value; // 갱신
    else bucket.append({ key, value }); // 삽입
  }

  /**
   * 값 조회
   *
   * @param {string} key
   * @returns {*} value | undefined
   */
  get(key) {
    const index = hashFunc(key, this.size);
    const bucket = this.buckets[index];

    const node = this._findNode(bucket, key);
    return node ? node.value.value : undefined;
  }

  /**
   * key 존재 여부 확인
   *
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * 값 삭제
   *
   * @param {string} key
   * @returns {boolean} 삭제 성공 여부
   */
  remove(key) {
    const index = hashFunc(key, this.size);
    const bucket = this.buckets[index];

    let current = bucket.head;
    let prev = null;

    while (current) {
      if (current.value.key === key) {
        // 삭제 처리
        if (prev) prev.next = current.next;
        else bucket.head = current.next;

        return true;
      }
      prev = current;
      current = current.next;
    }

    return false;
  }
}
