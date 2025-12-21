class node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class stack {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  push(data) {
    const newNode = new node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  pop() {
    if (!this.head) {
      return null;
    }

    const poppedNode = this.head;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    return poppedNode.data;
  }

  peek() {
    return this.head ? this.head.data : null;
  }

  isEmpty() {
    return this.head === null;
  }
}