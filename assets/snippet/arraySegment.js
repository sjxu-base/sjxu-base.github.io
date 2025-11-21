const { performance } = require("perf_hooks");
class IntensitySegments {
  constructor() {
    this.segString = [];
  }

  //Insert new Segment Points into segString
  _insert(pos) {
    if (this.segString.length === 0) {
      this.segString.push([pos, 0]);
      return;
    }
    //Search seg to find proper index of from poin
    let index = this.segString.length;
    for (let i = 0; i < this.segString.length; i++) {
      // Points already exist
      if (this.segString[i][0] === pos) return;
      // Find Points
      if (this.segString[i][0] > pos) {
        index = i;
        break;
      }
    }

    //Determine init val of the point
    if (index === 0) {
      this.segString.splice(index, 0, [pos, 0]);
    } else {
      //Use previous item val as init val
      this.segString.splice(index, 0, [pos, this.segString[index - 1][1]]);
    }
    return;
  }

  _merge(fromIndex, toIndex) {
    const newSeg = [];
    for (let i = 0; i < this.segString.length; i++) {
      if (i === 0 || this.segString[i][1] !== this.segString[i - 1][1]) {
        newSeg.push(this.segString[i]);
      }
    }
    while (newSeg.length && newSeg[0][1] == 0) {
      newSeg.shift();
    }
    this.segString = newSeg;
  }

  //Update val
  //Argument:
  // op:0, deliver set operation
  // op:1, deliver add operation
  _update(fromIndex, toIndex, val, op) {
    for (let i = fromIndex; i < toIndex; i++) {
      if (op === 0) {
        this.segString[i][1] = val;
      } else {
        this.segString[i][1] += val;
      }
    }
  }

  add(from, to, amount) {
    this._insert(from);
    this._insert(to);

    const fromIndex = this.segString.findIndex((i) => i[0] === from);
    const toIndex = this.segString.findIndex((i) => i[0] === to);

    this._update(fromIndex, toIndex, amount, 1); // Use 1:set op to update seg
    this._merge(fromIndex, toIndex);
  }

  set(from, to, amount) {
    this._insert(from);
    this._insert(to);

    const fromIndex = this.segString.findIndex((i) => i[0] === from);
    const toIndex = this.segString.findIndex((i) => i[0] === to);

    this._update(fromIndex, toIndex, amount, 0); // Use 0:set op to update seg
    this._merge(fromIndex, toIndex);
  }

  toString() {
    console.log(JSON.stringify(this.segString));
    return;
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
console.log(`Test case two run time is: ${dur} ms.\n`);

// Case 9: Performence Test
console.log("*** Case 9: Performence Test ***");
start = performance.now();
segments = new IntensitySegments();

// 1000 random value ops
for (let i = 0; i < 1000; i++) {
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
console.log(`1000 ops time: ${(end - start).toFixed(2)} ms`);
segments.toString();
