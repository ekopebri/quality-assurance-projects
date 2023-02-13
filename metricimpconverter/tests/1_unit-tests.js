const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
    test("should correctly read whole number input", function () {
        let result = convertHandler.getNum("2kg");
        assert.equal(2, result);
    });
    test("should correctly read a decimal number input", function () {
        let result = convertHandler.getNum("7.2kg");
        assert.equal(7.2, result);
    });
    test("should correctly read a fractional input", function () {
        let resultAdd = convertHandler.getNum("3+4kg");
        let resultSubtraction = convertHandler.getNum("3-4kg");
        let resultMultiple = convertHandler.getNum("3*4kg");
        let resultDivision = convertHandler.getNum("3/4kg");
        assert.equal(7, resultAdd);
        assert.equal(-1, resultSubtraction);
        assert.equal(12, resultMultiple);
        assert.equal(0.75, resultDivision);
    });
    test("should correctly read a fractional input with a decimal.", function () {
        let resultAdd = convertHandler.getNum("3+1.5kg");
        let resultSubtraction = convertHandler.getNum("3-1.5kg");
        let resultMultiple = convertHandler.getNum("3*1.5kg");
        let resultDivision = convertHandler.getNum("3/1.5kg");
        assert.equal(4.5, resultAdd);
        assert.equal(1.5, resultSubtraction);
        assert.equal(4.5, resultMultiple);
        assert.equal(2, resultDivision);
    });
    test("should correctly return an error on a double-fraction", function () {
        let resultError = convertHandler.getNum("3/1*1kg");
        assert.equal("invalid number", resultError);
    });
    test("should correctly default to a numerical input of 1 when no numerical input is provided.", function () {
        let result = convertHandler.getNum("kg");
        assert.equal(1, result);
    });
    test("should correctly read each valid input unit", function () {
        let resultKg = convertHandler.getUnit("1kg");
        let resultMi = convertHandler.getUnit("2mi");
        assert.equal('kg', resultKg);
        assert.equal('mi', resultMi);
    });
    test("should correctly read each valid input unit with uppercase or lowercase", function () {
        let resultKg = convertHandler.getUnit("1KG");
        let resultL = convertHandler.getUnit("2l");
        assert.equal('kg', resultKg);
        assert.equal('L', resultL);
    });
    test("should correctly return an error for an invalid input unit.", () => {
        let resultError = convertHandler.getUnit("1cm");
        assert.equal("invalid unit", resultError);
    });
    test("should return the correct return unit for each valid input unit.", () => {
        let result = convertHandler.getReturnUnit("L");
        assert.equal("gal", result);
    });
    test("should correctly return the spelled-out string unit for each valid input unit.", () => {
        assert.equal('liters', convertHandler.spellOutUnit('L'), "Correctly return liters as output unit for l input unit");
        assert.equal('gallons', convertHandler.spellOutUnit('gal'), "Correctly return gallons as output unit for GAL input unit");
    });
    test("should correctly convert gal to L", () => {
       let result = convertHandler.convert(1, 'gal');
       assert.equal(3.78541, result);
    });
    test("should correctly convert L to gal", () => {
        let result = convertHandler.convert(3.78541, 'L');
        assert.equal(1, result);
    });
    test("should correctly convert mi to km", () => {
        let result = convertHandler.convert(1, 'mi');
        assert.equal(1.60934, result);
    });
    test("should correctly convert km to mi", () => {
        let result = convertHandler.convert(1.60934, 'km');
        assert.equal(1, result);
    });
    test("should correctly convert lbs to kg", () => {
        let result = convertHandler.convert(1, 'lbs');
        assert.equal(0.45359, result);
    });
    test(" should correctly convert kg to lbs", () => {
        let result = convertHandler.convert(0.453592, 'kg');
        assert.equal(1, result);
    });
});