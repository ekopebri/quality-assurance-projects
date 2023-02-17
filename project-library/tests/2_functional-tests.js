/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');
const sinon = require('sinon');
const Book = require('../src/models/book');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    suite('Routing tests', function () {
        let sandbox;
        let book = {};

        after(function () {
            chai.request(server).get('/api')
        });

        suite('POST /api/books with title => create book object/expect book object', function () {
            beforeEach(() => {
                sandbox = sinon.createSandbox();
                book = {
                    "_id": "63ef30a430e9fb2b7d5ecc17",
                    "comments": [],
                    "title": "Android Programmer",
                    "commentcount": 0,
                    "__v": 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            afterEach(() => {
                sandbox.restore();
            });

            test('Test POST /api/books with title', function (done) {
                sandbox = sinon.stub(Book.prototype, 'save');
                sandbox.resolves(book);

                chai.request(server)
                    .post('/api/books')
                    .send({
                        title: "Android Programmer"
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        expect(res).to.be.json;
                        assert.property(res.body, "_id");
                        assert.equal(res.body.title, "Android Programmer");
                        done();
                    });
            });

            test('Test POST /api/books with no title given', function (done) {
                chai.request(server)
                    .post('/api/books')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "missing required field title");
                        done();
                    });
            });

        });

        suite('GET /api/books => array of books', function () {
            beforeEach(() => {
                sandbox = sinon.createSandbox();
                book = {
                    "_id": "63ef30a430e9fb2b7d5ecc17",
                    "comments": [],
                    "title": "Android Programmer",
                    "commentcount": 0,
                    "__v": 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            afterEach(() => {
                sandbox.restore();
            });

            test('Test GET /api/books', function (done) {
                sandbox = sinon.stub(Book, 'find');
                sandbox.resolves([book, book]);

                chai.request(server)
                    .get('/api/books')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        expect(res).to.be.json;
                        assert.isArray(res.body, 'response should be an array');
                        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                        assert.property(res.body[0], 'title', 'Books in array should contain title');
                        assert.property(res.body[0], '_id', 'Books in array should contain _id');
                        done();
                    });
            });

        });


        suite('GET /api/books/[id] => book object with [id]', function () {
            beforeEach(() => {
                sandbox = sinon.createSandbox();
                book = {
                    "_id": "63ef30a430e9fb2b7d5ecc17",
                    "comments": [],
                    "title": "Android Programmer",
                    "commentcount": 0,
                    "__v": 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            afterEach(() => {
                sandbox.restore();
            });

            test('Test GET /api/books/[id] with id not in db', function (done) {
                sandbox.stub(Book, 'findById').withArgs("13ef226f98da4d8473922719").resolves(null);

                chai.request(server)
                    .get('/api/books/13ef226f98da4d8473922719')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "no book exists");
                        done();
                    });
            });

            test('Test GET /api/books/[id] with valid id in db', function (done) {
                sandbox = sinon.stub(Book, 'findById');
                sandbox.resolves(book);

                chai.request(server)
                    .get('/api/books/63ef226f98da4d8473922719')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
                        assert.property(res.body, 'comments', 'Books in array should contain comments');
                        assert.property(res.body, 'title', 'Books in array should contain title');
                        assert.property(res.body, '_id', 'Books in array should contain _id');
                        done();
                    });
            });

        });


        suite('POST /api/books/[id] => add comment/expect book object with id', function () {
            beforeEach(() => {
                sandbox = sinon.createSandbox();
                book = {
                    "_id": "63ef30a430e9fb2b7d5ecc17",
                    "comments": [],
                    "title": "Android Programmer",
                    "commentcount": 0,
                    "__v": 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            afterEach(() => {
                sandbox.restore();
            });

            test('Test POST /api/books/[id] with comment', function (done) {
                sandbox.stub(Book, 'findById').resolves(book);
                sandbox.stub(Book, 'updateOne').resolves({ nModified: 1 });

                chai.request(server)
                    .post('/api/books/63ef226f98da4d8473922719')
                    .send({
                        comment: "Good Book!"
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
                        assert.property(res.body, 'comments', 'Books in array should contain comments');
                        assert.property(res.body, 'title', 'Books in array should contain title');
                        assert.property(res.body, '_id', 'Books in array should contain _id');
                        done();
                    });
            });

            test('Test POST /api/books/[id] without comment field', function (done) {
                chai.request(server)
                    .post('/api/books/63ef226f98da4d8473922719')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "missing required field comment");
                        done();
                    });
            });

            test('Test POST /api/books/[id] with comment, id not in db', function (done) {
                sandbox.stub(Book, 'findById').withArgs("13ef226f98da4d8473922719").resolves(null);

                chai.request(server)
                    .post('/api/books/13ef226f98da4d8473922719')
                    .send({
                        comment: "Good Book!"
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "no book exists");
                        done();
                    });
            });

        });

        suite('DELETE /api/books/[id] => delete book object id', function () {
            beforeEach(() => {
                sandbox = sinon.createSandbox();
                book = {
                    "_id": "63ef30a430e9fb2b7d5ecc17",
                    "comments": [],
                    "title": "Android Programmer",
                    "commentcount": 0,
                    "__v": 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            afterEach(() => {
                sandbox.restore();
            });

            test('Test DELETE /api/books/[id] with valid id in db', function (done) {
                sandbox.stub(Book, 'deleteOne').resolves({n: 1, deletedCount: 1});

                chai.request(server)
                    .delete('/api/books/63ef226f98da4d8473922719')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "delete successful");
                        done();
                    });
            });

            test('Test DELETE /api/books/[id] with  id not in db', function (done) {
                sandbox.stub(Book, 'deleteOne').resolves({n: 1, deletedCount: 0});

                chai.request(server)
                    .delete('/api/books/13ef226f98da4d8473922719')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isString(res.body, 'response should be text');
                        assert.equal(res.body, "no book exists");
                        done();
                    });
            });

        });

    });

});
