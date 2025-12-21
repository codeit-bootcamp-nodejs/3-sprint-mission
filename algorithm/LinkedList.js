class node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
class LinkedList {
  constructor(data) {
    this.head = null;
    this.tail = null;
  }
  append(data) {
    const newNode = new node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    } else {
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

    newNode.next = targetNode.next;
    targetNode.next = newNode;

    if (this.tail === targetNode) {
      this.tail = newNode;
    }
  }

  removeAfter(targetData) {
    const targetNode = this.findNode(targetData);
    if (!targetNode) return;

    const removedNode = targetNode.next;
    if (!removedNode) return;

    targetNode.next = removedNode.next;

    if (this.tail === removedNode) {
      this.tail = targetNode;
    }
  }
}