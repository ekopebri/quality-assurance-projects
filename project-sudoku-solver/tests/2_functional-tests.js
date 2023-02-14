const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string', function (done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
                done();
            });
    });
    test("Solve a puzzle with missing puzzle string", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: ""
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Required field missing");
                done();
            });
    });
    test("Solve a puzzle with invalid characters", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "Z.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });
    test("Solve a puzzle with incorrect length less than 81", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
    });
    test("Solve a puzzle with incorrect length or grater than 81", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914......"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
    });
    test("Solve a puzzle that cannot be solved", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71..9......1945....4.37.4.3..6..."
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Puzzle cannot be solved");
                done();
            });
    });
    test("Check a puzzle placement with all fields", (done) => {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
                done();
            });
    });
    test("Check a puzzle placement with single placement conflict", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "7"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            });
    });
    test("Check a puzzle placement with multiple placement conflicts", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "6"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            });
    });
    test("Check a puzzle placement with all placement conflicts", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "A1",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                value: "5"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            });
    });
    test("Check a puzzle placement with missing required fields", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: ""
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            });
    });
    test("Check a puzzle placement with invalid characters", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.X..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "1"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });
    test("Check a puzzle placement with incorrect length", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.5..2.4..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "1"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
    });
    test("Check a puzzle placement with invalid placement coordinate", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "X1",
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "1"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            });
    });
    test("Check a puzzle placement with invalid placement value", done => {
        chai
            .request(server)
            .post('/api/check')
            .send({
                coordinate: "B1",
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                value: "10"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid value");
                done();
            });
    });
});

