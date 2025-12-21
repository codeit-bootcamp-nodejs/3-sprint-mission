class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  dequeue() {
    if (!this.head) {
      return null;
    }

    const dequeuedNode = this.head;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    return dequeuedNode.data;
  }

  peek() {
    return this.head ? this.head.data : null;
  }

  isEmpty() {
    return this.head === null;
  }
}