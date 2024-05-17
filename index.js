const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const sortedArray = array.sort((a, b) => a - b);
    const uniqueArray = [...new Set(sortedArray)];
    function createBST(arr, start, end) {
      if (start > end) return null;
      let mid = Math.floor((start + end) / 2);
      let node = new Node(arr[mid]);
      node.left = createBST(arr, start, mid - 1);
      node.right = createBST(arr, mid + 1, end);
      return node;
    }
    return createBST(uniqueArray, 0, uniqueArray.length - 1);
  }

  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    } else {
      let current = this.root;
      while (true) {
        if (value < current.value) {
          if (!current.left) {
            current.left = newNode;
            return this;
          } else {
            current = current.left;
          }
        } else if (value > current.value) {
          if (!current.right) {
            current.right = newNode;
            return this;
          } else {
            current = current.right;
          }
        } else {
          console.log(`${value} is already in tree!`);
          return undefined;
        }
      }
    }
  }

  min(root) {
    if (!root.left) {
      return root.value;
    } else {
      return this.min(root.left);
    }
  }

  max(root) {
    if (!root.right) {
      return root.value;
    } else {
      return this.max(root.right);
    }
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(root, value) {
    if (!root) {
      return this.root;
    }
    if (value < root.value) {
      root.left = this.deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = this.deleteNode(root.right, value);
    } else {
      if (!root.left && !root.right) {
        return null;
      }
      if (!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }
      root.value = this.min(root.right);
      root.right = this.deleteNode(root.right, root.value);
    }
    return root;
  }

  find(value) {
    let current = this.root;
    if (!this.root) {
      return undefined;
    }
    while (true) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else if (value === current.value) {
        return current;
      } else {
        return undefined;
      }
    }
  }

  contains(value) {
    let current = this.root;
    while (true) {
      if (!current) {
        return false;
      }
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return true;
      }
    }
  }

  levelOrder(callback = this.nodesToValues) {
    let data = [];
    let queue = [];
    queue.push(this.root);
    while (queue.length) {
      let current = queue.shift();
      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
      data.push(current);
    }
    return callback(data);
  }

  preOrder(callback = this.nodesToValues) {
    let data = [];
    function traverse(node) {
      data.push(node);
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
    }
    traverse(this.root);
    return callback(data);
  }

  inOrder(callback = this.nodesToValues) {
    let data = [];
    function traverse(node) {
      if (node.left) traverse(node.left);
      data.push(node);
      if (node.right) traverse(node.right);
    }
    traverse(this.root);
    return callback(data);
  }

  postOrder(callback = this.nodesToValues) {
    let data = [];
    function traverse(node) {
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
      data.push(node);
    }
    traverse(this.root);
    return callback(data);
  }

  nodesToValues(nodes) {
    let array = [];
    nodes.forEach((node) => {
      array.push(node.value);
    });
    return array;
  }

  height(node) {
    if (!this.contains(node)) {
      return -1;
    } else {
      let leftHeight = this.height(node.left);
      let rightHeight = this.height(node.right);
      let currentHeight = Math.max(leftHeight, rightHeight) + 1;
      return currentHeight;
    }
  }

  depth(node) {
    if (!this.contains(node)) {
      return -1;
    } else {
      let depth = 0;
      let current = this.root;
      while (true) {
        if (node.value < current.value) {
          current = current.left;
          depth += 1;
        } else if (node.value > current.value) {
          current = current.right;
          depth += 1;
        } else {
          return depth;
        }
      }
    }
  }

  isBalanced(root = this.root) {
    let result = true;

    function getHeight(node) {
      if (!node) {
        return -1;
      } else {
        let leftHeight = getHeight(node.left);
        let rightHeight = getHeight(node.right);
        if (Math.abs(leftHeight - rightHeight) > 1) {
          result = false;
        }
        let currentHeight = Math.max(leftHeight, rightHeight) + 1;
        return currentHeight;
      }
    }
    getHeight(root);

    return result;
  }

  reBalance() {
    const sortedArray = this.inOrder();
    this.root = this.buildTree(sortedArray);
    return this.root;
  }

  unBalance() {
    let i = 0;
    while (i <= 3) {
      let number = Math.ceil(Math.random() * 100 + 1);
      if (!this.contains(number)) {
        console.log(`Adding ${number}`);
        this.insert(number);
        i++;
      }
    }
  }
}

function createRandomArray(size) {
  let array = [];
  let i = 0;
  while (i < size) {
    let number = Math.ceil(Math.random() * 100 + 1);
    array.push(number);
    i++;
  }
  return array;
}

console.log('Creating new tree...');
const arr = createRandomArray(20);
const t = new Tree(arr);
prettyPrint(t.root);
console.log('Balanced?', t.isBalanced());
console.log('Level Order:', t.levelOrder());
console.log('pre-Order:', t.preOrder());
console.log('in-Order', t.inOrder());
console.log('post-Order:', t.postOrder());
console.log('Unbalancing tree...');
t.unBalance();
prettyPrint(t.root);
console.log('Balanced?', t.isBalanced());
console.log('Rebalancing tree...');
t.reBalance();
prettyPrint(t.root);
console.log('Balanced?', t.isBalanced());
console.log('Level Order:', t.levelOrder());
console.log('pre-Order:', t.preOrder());
console.log('in-Order', t.inOrder());
console.log('post-Order:', t.postOrder());
