const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();


suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.validate(puzzleString);
        assert.isNull(result, "Check total character is 81");
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
        const puzzleString = "..S..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.validate(puzzleString);
        assert.equal(result, "Invalid characters in puzzle");
    });
    test("Logic handles a puzzle string that is not 81 characters in length", () => {
        const puzzleStringLessThan81 = "9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const puzzleStringGreaterThan = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...";
        assert.equal(solver.validate(puzzleStringLessThan81), "Expected puzzle to be 81 characters long");
        assert.equal(solver.validate(puzzleStringGreaterThan), "Expected puzzle to be 81 characters long");
    });
    test("Logic handles a valid row placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkRowPlacement(puzzleString, 1, 1, 8);
        assert.isTrue(result);
    });
    test("Logic handles an invalid row placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkRowPlacement(puzzleString, 1, 2, 9);
        assert.isNotTrue(result);
    });
    test("Logic handles a valid column placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkColPlacement(puzzleString, 2, 1, 8);
        assert.isTrue(result);
    });
    test("Logic handles an invalid column placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkColPlacement(puzzleString, 2, 1, 6);
        assert.isNotTrue(result);
    });
    test("Logic handles a valid region (3x3 grid) placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkRegionPlacement(puzzleString, 9, 9, 8);
        assert.isTrue(result);
    });
    test("Logic handles an invalid region (3x3 grid) placement", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.checkRegionPlacement(puzzleString, 1, 1, 9);
        assert.isNotTrue(result);
    });
    test("Valid puzzle strings pass the solver", () => {
        const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.solve(puzzleString);
        assert.isNull(result.error);
    });
    test("Invalid puzzle strings fail the solver", () => {
        const puzzleString = "X.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        let result = solver.solve(puzzleString);
        assert.equal("Invalid characters in puzzle", result.error);
    });
    test("Solver returns the expected solution for an incomplete puzzle", () => {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const result = solver.solve(puzzleString);
        assert.equal("135762984946381257728459613694517832812936745357824196473298561581673429269145378", result.solution);
    });
});
