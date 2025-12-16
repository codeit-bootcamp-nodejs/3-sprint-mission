import { describe, it, expect } from "vitest";

import { LinkedList } from "../algorithm/LinkedList";
import { DoublyLinkedList } from "../algorithm/DoublyLinkedList";
import { Queue } from "../algorithm/Queue";
import { Stack } from "../algorithm/Stack";
import { BinarySearchTree } from "../algorithm/BinarySearchTree";


/**
 * LinkedList
 */
describe("LinkedList 테스트", () => {
  it("노드 추가 및 탐색", () => {
    const list = new LinkedList();
    list.addNode(1);
    list.addNode(2);
    list.addNode(3);

    expect(list.findNode(2).value).toBe(2);
    expect(list.findNode(4)).toBe(null);
  });

  it("노드 삽입 (insertAfter)", () => {
    const list = new LinkedList();
    list.addNode(1);
    list.addNode(2);

    list.insertAfter(1, 10);

    expect(list.findNode(10).value).toBe(10);
    expect(list.findNode(2).value).toBe(2);
  });

  it("노드 삭제 (removeAfter)", () => {
    const list = new LinkedList();
    list.addNode(1);
    list.addNode(2);
    list.addNode(3);

    list.removeAfter(1);

    expect(list.findNode(2)).toBe(null);
    expect(list.findNode(3).value).toBe(3);
  });
});

/**
 * DoublyLinkedList
 */
describe('DoublyLinkedList 테스트', () => {
  it('head/tail 추가', () => {
    const list = new DoublyLinkedList();
    list.addToHead(2);
    list.addToHead(3);
    list.addToHead(1);

    expect(list.head.value).toBe(1);
    expect(list.tail.value).toBe(2);
  });

  it('노드 삽입 (insertAfter)', () => {
    const list = new DoublyLinkedList();
    list.addToHead(1);
    list.addToHead(2);

    list.insertAfter(1, 10);
    expect(list.findNode(10).value).toBe(10);
  })

  it('노드 삭제 (removeNode)', () => {
    const list = new DoublyLinkedList();
    list.addToHead(1);
    list.addToHead(2);
    list.addToHead(3);

    list.removeNode(2);

    expect(list.findNode(2)).toBe(null);
    expect(list.findNode(3).value).toBe(3);
  });
});

/**
 * Queue
 */
describe('Queue 테스트', () => {
  it('enqueue/dequeue 동작 확인', () => {
    const q = new Queue();

    q.enqueue(1);
    q.enqueue(2);

    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(null);
  });

  it('peek/isEmpty 동작 확인', () => {
    const q = new Queue();

    q.enqueue(10);
    expect(q.peek()).toBe(10);
    expect(q.isEmpty()).toBe(false);

    q.dequeue();
    expect(q.isEmpty()).toBe(true);
  });
})

/**
 * Stack
 */
describe('Stack 테스트', () => {
  it('push/pop 동작 확인', () => {
    const s = new Stack();

    s.push(1);
    s.push(2);

    expect(s.pop()).toBe(2);
    expect(s.pop()).toBe(1);
    expect(s.pop()).toBe(null);
  })

  it('peek/isEmpty 동작 확인', () => {
    const s = new Stack();
    s.push(5)

    expect(s.peek()).toBe(5);
    expect(s.isEmpty()).toBe(false);

    s.pop();
    expect(s.isEmpty()).toBe(true);
  })
})

/**
 * BST
 */
describe('BinarySearchTree 테스트', () => {
  it('삽입 및 탐색', () => {
    const bst = new BinarySearchTree();

    bst.insert(5);
    bst.insert(3);
    bst.insert(7);

    expect(bst.find(3)?.value).toBe(3);
    expect(bst.find(999)).toBe(null);
  });

  it('노드 삭제 (leaf/단일 자식/두 자식)', () => {
    const bst = new BinarySearchTree();

    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    bst.insert(6);
    bst.insert(8);

    bst.remove(8);
    expect(bst.find(8)).toBe(null);

    bst.remove(7);
    expect(bst.find(7)).toBe(null);

    bst.insert(4);
    bst.remove(3); // 3은 4를 child로 가짐
    expect(bst.find(3)).toBe(null);
    expect(bst.find(4)?.value).toBe(4);
  })
})
