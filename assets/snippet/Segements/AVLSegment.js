const { performance } = require("perf_hooks");
class Node {
  constructor(pos, val) {
    this.position = pos;
    this.value = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class IntensitySegments {
  constructor() {
    this.root = null;
  }

  _getHeight(node) {
    return node ? node.height : 0;
  }

  _updateHeight(node) {
    node.height =
      Math.max(this._getHeight(node.left), this._getHeight(node.right)) + 1;
  }

  // Calculate the Balance Factor
  _getFactor(node) {
    return node ? this._getHeight(node.left) - this._getHeight(node.right) : 0;
  }

  // Balance the LL type unbalanced node
  _rightRotate(node) {
    const x = node.left;
    const x1 = x.right;
    x.right = node;
    node.left = x1;
    this._updateHeight(node);
    this._updateHeight(x);
    return x;
  }

  // Balance the RR type unblanced node
  _leftRotate(node) {
    const y = node.right;
    const y1 = y.left;
    y.left = node;
    node.right = y1;
    this._updateHeight(node);
    this._updateHeight(y);
    return y;
  }

  // Add a new node into the AVL tree
  _nodeInsert(root, pos, val) {
    if (!root) return new Node(pos, val);

    if (pos < root.position) {
      // New value < root value, search the left node.
      root.left = this._nodeInsert(root.left, pos, val);
    } else if (pos > root.position) {
      // New value > root value, search the right node.
      root.right = this._nodeInsert(root.right, pos, val);
    } else {
      // Node already exist
      return root;
    }

    // Re-balance the updated tree
    this._updateHeight(root);
    const factor = this._getFactor(root);
    if (factor > 1 && pos < root.left.position) {
      // LL Type
      return this._rightRotate(root);
    } else if (factor < -1 && pos > root.right.position) {
      // RR Type
      return this._leftRotate(root);
    } else if (factor > 1 && pos > root.left.position) {
      // LR Type
      root.left = this._leftRotate(root.left);
      return this._rightRotate(root);
    } else if (factor < -1 && pos < root.right.position) {
      // RL Type
      root.right = this._rightRotate(root.right);
      return this._leftRotate(root);
    } else {
      return root;
    }
  }

  // Delete position node from tree
  _nodeDelete(root, position) {
    if (!root) return null;

    let newRoot = root;
    if (position < root.position) {
      root.left = this._nodeDelete(root.left, position);
    } else if (position > root.position) {
      root.right = this._nodeDelete(root.right, position);
    } else {
      if (!root.left || !root.right) {
        // Signle son root node will use the only son as new root
        newRoot = root.left || root.right;
      } else {
        // Double son root node will use the right son(smaller son) as new root
        let son = root.right;
        while (son.left) son = son.left;
        root.position = son.position;
        root.value = son.value;
        root.right = this._nodeDelete(root.right, son.position);
      }
    }

    if (!newRoot) return null;

    // Re-balance the new Root
    this._updateHeight(newRoot);
    const factor = this._getFactor(newRoot);

    // LL Type
    if (factor > 1 && this._getFactor(newRoot.left) >= 0) {
      return this._rightRotate(newRoot);
    }

    // LR Type
    if (factor > 1 && this._getFactor(newRoot.left) < 0) {
      newRoot.left = this._leftRotate(newRoot.left);
      return this._rightRotate(newRoot);
    }

    // RR Type
    if (factor < -1 && this._getFactor(newRoot.right) <= 0) {
      return this._leftRotate(newRoot);
    }

    // RL Type
    if (factor < -1 && this._getFactor(newRoot.right) > 0) {
      newRoot.right = this._rightRotate(newRoot.right);
      return this._leftRotate(newRoot);
    }
    return newRoot;
  }

  // push node in to result array by inOrder order
  _inOrderTravel(root, result) {
    if (!root) return;
    this._inOrderTravel(root.left, result);
    result.push(root);
    this._inOrderTravel(root.right, result);
  }

  // find the neighbor on the tree,
  // which have the max positon less than current position
  _findPrevNode(pos) {
    let curr = this.root;
    let prev = null;

    while (curr) {
      if (curr.position < pos) {
        prev = curr;
        curr = curr.right;
      } else {
        curr = curr.left;
      }
    }
    return prev;
  }

  _insert(pos) {
    const prev = this._findPrevNode(pos);
    if (!prev) {
      this.root = this._nodeInsert(this.root, pos, 0);
    } else {
      if (prev.position != pos) {
        // when the pos not exist in the tree
        this.root = this._nodeInsert(this.root, pos, prev.value);
      }
    }
  }

  _delete(pos) {
    this.root = this._nodeDelete(this.root, pos);
  }

  _getRange(from, to) {
    const result = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      if (node.position >= from && node.position < to) result.push(node);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  _merge() {
    const nodes = [];
    this._inOrderTravel(this.root, nodes);
    if (nodes.length < 2){
      this.root=null;
      return;
    }
    const toMergeNodes = [];

    // Remove 0-value head nodes
    if (nodes[0].value === 0) {
      toMergeNodes.push(nodes[0].position);
    }
    // Remove consecutive nodes of the same value
    for (let i = 0; i < nodes.length - 1; i++) {
      const curr = nodes[i];
      const next = nodes[i + 1];
      if (curr.value === next.value) {
        toMergeNodes.push(next.position);
      }
    }

    // Delete the selected nodes
    for (const pos of toMergeNodes) {
      this.root = this._nodeDelete(this.root, pos);
    }
  }

  add(from, to, amount) {
    this._insert(from);
    this._insert(to);
    let rangeNode = this._getRange(from, to);
    for (let i = 0; i < rangeNode.length; i++) {
      rangeNode[i].value += amount;
    }
    this._merge();
  }

  set(from, to, amount) {
    this._insert(from);
    this._insert(to);
    let rangeNode = this._getRange(from, to);
    for (let i = 0; i < rangeNode.length; i++) {
      rangeNode[i].value = amount;
    }
    this._merge();
  }

  toString() {
    const nodes = [];
    this._inOrderTravel(this.root, nodes);
    console.log(
      JSON.stringify(nodes.map((node) => [node.position, node.value]))
    );
  }
}

// Here is an example sequence:
// (data stored as an array of start point and value for each segment.)
let start = performance.now();
let segments = new IntensitySegments();
segments.toString(); // Should be "[]"
segments.add(10, 30, 1);
segments.toString(); // Should be: "[[10,1],[30,0]]"
segments.add(20, 40, 1);
segments.toString(); // Should be: "[[10,1],[20,2],[30,1],[40,0]]"
segments.add(10, 40, -2);
segments.toString(); // Should be: "[[10,-1],[20,0],[30,-1],[40,0]]"
let end = performance.now();
let dur = end - start;
console.log(`Test case one run time is: ${dur} ms.\n`);

// Another example sequence:
start = performance.now();
segments = new IntensitySegments();
segments.toString(); // Should be "[]"
segments.add(10, 30, 1);
segments.toString(); // Should be "[[10,1],[30,0]]"
segments.add(20, 40, 1);
segments.toString(); // Should be "[[10,1],[20,2],[30,1],[40,0]]"
segments.add(10, 40, -1);
segments.toString(); // Should be "[[20,1],[30,0]]"
segments.add(10, 40, -1);
segments.toString(); // Should be "[[10,-1],[20,0],[30,-1],[40,0]]"
end = performance.now();
dur = end - start;
console.log(`Test case two run time is: ${dur} ms.`);

// Case 1: Add Function
console.log("\n*** Case 1: Add Function ***");
segments = new IntensitySegments();
segments.add(0, 10, 5);
segments.toString(); // Should be [[0,5],[10,0]]
segments.add(5, 15, 3);
segments.toString(); // Should be [[0,5],[5,8],[10,3],[15,0]]

// Case 2: Set Function
console.log("\n*** Case 2: Set Function ***");
segments = new IntensitySegments();
segments.add(0, 20, 2);
segments.toString(); // Should be [[0,2],[20,0]]
segments.set(5, 15, 7);
segments.toString(); // Should be [[0,2],[5,7],[15,2],[20,0]]

// Case 3: Regions Covered
console.log("\n*** Case 3: Regions Covered ***");
segments = new IntensitySegments();
segments.add(0, 10, 1);
segments.add(5, 15, 1);
segments.add(7, 12, 1);
segments.toString(); // Should be [[0,1],[5,2],[7,3],[10,2],[12,1],[15,0]]

// Case 4: Negative Value
console.log("\n*** Case 4: Negative Value ***");
segments = new IntensitySegments();
segments.add(0, 10, 5);
segments.toString(); // Should be [[0,5],[10,0]]
segments.add(3, 8, -3);
segments.toString(); // Should be [[0,5],[3,2],[8,5],[10,0]]

// Case 5: Edge Merge
console.log("\n*** Case 5: Edge Merge ***");
segments = new IntensitySegments();
segments.add(0, 10, 2);
segments.add(10, 20, 2);
segments.toString(); // Should be [[0,2],[20,0]]

// Case 6: [Error Input] Single Point
console.log("\n*** Case 6: [Error Input] Single Point ***");
segments = new IntensitySegments();
segments.toString(); // Should be []
segments.add(5, 5, 10);
segments.toString(); // Should be []
segments.set(5, 5, 10);
segments.toString(); // Should be []

// Case 7: Merge Case
console.log("\n*** Case 7: Merge Case ***");
segments = new IntensitySegments();
segments.add(0, 10, 1);
segments.add(10, 20, 1);
segments.add(20, 30, 1);
segments.toString(); // Should be [[0,1],[30,0]]

// Case 8: Big Value
console.log("\n*** Case 8: Big Value ***");
segments = new IntensitySegments();
segments.add(1000, 2000, 100);
segments.add(1500, 2500, 50);
segments.toString(); // Should be [[1000,100],[1500,150],[2000,50],[2500,0]]

// Case 9: Performence Test
console.log("\n*** Case 9: Performence Test ***");
start = performance.now();
segments = new IntensitySegments();

// 10000 random value ops
for (let i = 0; i < 10000; i++) {
    let from = Math.floor(Math.random() * 1000);
    let to = from + Math.floor(Math.random() * 100) + 1;
    let value = Math.floor(Math.random() * 10) - 5;
    
    if (Math.random() > 0.5) {  // Keep set and add ops 1:1 under enough big test times
        segments.add(from, to, value);
    } else {
        segments.set(from, to, value);
    }
}

end = performance.now();
console.log(`10000 ops time: ${(end - start).toFixed(2)} ms`);
segments.toString();

// Case 10: Empty Result
console.log("\n*** Case 10: Empty Result ***");
segments = new IntensitySegments();
segments.add(0, 10, 5);
segments.toString(); // Should be [[0,5],[10,0]]
segments.add(0, 10, -5);
segments.toString(); // Should be []

// Case 11: Nested Range
console.log("\n*** Case 11: Nested Range ***");
segments = new IntensitySegments();
segments.add(0, 100, 1);
segments.add(10, 20, 2);
segments.add(15, 25, 3);
segments.toString(); // Should be [[0,1],[10,3],[15,6],[20,4],[25,1],[100,0]]
