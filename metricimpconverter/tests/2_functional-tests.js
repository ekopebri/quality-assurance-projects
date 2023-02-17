const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // put this in your functional test suite
    after(function() {
        chai.request(server).get('/api')
    });

    test('Convert a valid input L to gal', function (done) {
        chai
            .request(server)
            .get('/api/convert?input=10L')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.initNum, 10);
                assert.equal(res.body.initUnit, "L");
                assert.equal(res.body.returnNum, 2.64172);
                assert.equal(res.body.returnUnit, "gal");
                assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");
                done();
            });
    });
    test("Convert an invalid input g", (done) => {
        chai
            .request(server)
            .get('/api/convert?input=32g')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body, "invalid unit");
                done();
            });
    });
    test("Convert an invalid number", (done) => {
        chai
            .request(server)
            .get('/api/convert?input=3/7.2/4kg')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body, "invalid number");
                done();
            });
    });
    test("Convert an invalid number AND unit such", (done) => {
        chai
            .request(server)
            .get('/api/convert?input=3/7.2/4kg')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body, "invalid number");
                done();
            });
    });
    test("Convert with no number", (done) => {
        chai
            .request(server)
            .get('/api/convert?input=kg')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.initNum, 1);
                assert.equal(res.body.initUnit, "kg");
                assert.equal(res.body.returnNum, 2.20462);
                assert.equal(res.body.returnUnit, "lbs");
                assert.equal(res.body.string, "1 kilograms converts to 2.20462 pounds");
                done();
            });
    });
});
