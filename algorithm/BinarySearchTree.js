class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.leftChild = null;
    this.rightChild = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(data) {
    const newNode = new Node(data);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let currentNode = this.root;
    while (currentNode) {
      if (currentNode.data < newNode.data) {
        if (!currentNode.rightChild) {
          newNode.parent = currentNode;
          currentNode.rightChild = newNode;
          return;
        } else {
          currentNode = currentNode.rightChild;
        }
      } else {
        if (!currentNode.leftChild) {
          newNode.parent = currentNode;
          currentNode.leftChild = newNode;
          return;
        } else {
          currentNode = currentNode.leftChild;
        }
      }
    }
  }

  find(data) {
    let currentNode = this.root;

    while (currentNode) {
      if (currentNode.data === data) {
        return currentNode;
      } else if (data < currentNode.data) {
        currentNode = currentNode.leftChild;
      } else {
        currentNode = currentNode.rightChild;
      }
    }

    return null;
  }

  remove(data) {
    const nodeToRemove = this.find(data);
    if (!nodeToRemove) return;
    const { parent, leftChild, rightChild } = nodeToRemove;

    if (!leftChild && !rightChild) {
      if (parent) {
        if (parent.leftChild === nodeToRemove) {
          parent.leftChild = null;
        } else {
          parent.rightChild = null;
        }
      } else {
        this.root = null;
      }
    } else if (leftChild && !rightChild) {
      if (parent) {
        if (parent.leftChild === nodeToRemove) {
          parent.leftChild = leftChild;
        } else {
          parent.rightChild = leftChild;
        }
        leftChild.parent = parent;
      } else {
        this.root = leftChild;
        leftChild.parent = null;
      }
    } else if (!leftChild && rightChild) {
      if (parent) {
        if (parent.leftChild === nodeToRemove) {
          parent.leftChild = rightChild;
        } else {
          parent.rightChild = rightChild;
        }
        rightChild.parent = parent;
      } else {
        this.root = rightChild;
        rightChild.parent = null;
      }
    } else {
      let successor = rightChild;
      while (successor.leftChild) {
        successor = successor.leftChild;
      }
      nodeToRemove.data = successor.data;
      
      if (successor.parent === nodeToRemove) {
        nodeToRemove.rightChild = successor.rightChild;
      } else {
        successor.parent.leftChild = successor.rightChild;
      }
      
      if (successor.rightChild) {
        successor.rightChild.parent = successor.parent;
      }
    }
  }
}
