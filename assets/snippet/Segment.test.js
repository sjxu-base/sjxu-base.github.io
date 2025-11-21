const { performance } = require("perf_hooks");

const IntensitySegments = require('../AVLSegmen.js'); 
// const IntensitySegments = require('../arraySegment.js'); 

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
console.log(`Test case one run time is: ${dur} ms.`);

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