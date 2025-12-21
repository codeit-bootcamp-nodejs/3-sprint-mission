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

  addToHead(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  addToTail(data) {
    const newNode = new Node(data);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(data) {
    let iterator = this.head;

    while (iterator) {
      if (iterator.data === data) {
        return iterator;
      }
      iterator = iterator.next;
    }
    return null;
  }

  insertAfter(targetData, data) {
    const targetNode = this.findNode(targetData);
    if (!targetNode) return;
    const newNode = new Node(data);

    if (targetNode === this.tail) {
      this.addToTail(data);
      return;
    } else {
      newNode.next = targetNode.next;
      newNode.prev = targetNode;
      targetNode.next.prev = newNode;
      targetNode.next = newNode;
    }
  }

  removeNode(data) {
    const targetNode = this.findNode(data);
    if (!targetNode) return;

    if (targetNode === this.head) {
      this.head = targetNode.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      return;
    }

    if (targetNode === this.tail) {
      this.tail = targetNode.prev;
      this.tail.next = null;
      return;
    }

    targetNode.prev.next = targetNode.next;
    targetNode.next.prev = targetNode.prev;
  }

}
