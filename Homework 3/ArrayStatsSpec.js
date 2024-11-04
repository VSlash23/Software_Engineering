// Import the ArrayStats class from ArrayStats.js
const ArrayStats = require('../ArrayStats');

describe("ArrayStats Tests", function() {
    // First test case: Given by the teacher (Array: [7, 11, 5, 14])
    it("should correctly calculate the average for the teacher's example", function() {
        let myArray = new ArrayStats(7, 11, 5, 14);
        expect(myArray.average()).toBeCloseTo(9.25);
    });

    it("should correctly calculate the standard deviation for the teacher's example", function() {
        let myArray = new ArrayStats(7, 11, 5, 14);
        expect(myArray.stdev()).toBeCloseTo(4.031128874149275);
    });

    // Second test case: Outside example (Array: [10, 20, 30, 40, 50])
    it("should correctly calculate the average for the outside example", function() {
        let myArray = new ArrayStats(10, 20, 30, 40, 50);
        expect(myArray.average()).toBeCloseTo(30);
    });

    it("should correctly calculate the standard deviation for the outside example", function() {
        let myArray = new ArrayStats(10, 20, 30, 40, 50);
        expect(myArray.stdev()).toBeCloseTo(15.811388300841896);
    });

    // Third test case: Example with zero and negative numbers (Array: [-5, 0, 5, 10, 15])
    it("should correctly calculate the average for the example with zero and negative numbers", function() {
        let myArray = new ArrayStats(-5, 0, 5, 10, 15);
        expect(myArray.average()).toBeCloseTo(5);
    });

    it("should correctly calculate the standard deviation for the example with zero and negative numbers", function() {
        let myArray = new ArrayStats(-5, 0, 5, 10, 15);
        expect(myArray.stdev()).toBeCloseTo(7.905694150420948);
    });
});
