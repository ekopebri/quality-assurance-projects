const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');
const sinon = require('sinon');
const Issue = require('../src/models/Issue');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('Integration tests with chai-http', function () {
        let sandbox;
        let issue = {};

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            issue = {
                issue_title: 'Fix error in posting data',
                issue_text: 'When we post data it has an error.',
                created_by: 'Doni',
                assigned_to: 'Eko',
                status_text: 'In QA',
                open: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        afterEach(() => {
            sandbox.restore();
        });

        after(function() {
            chai.request(server).get('/api')
        });

        test("Create an issue with every field", (done) => {
            sandbox = sinon.stub(Issue.prototype, 'save');
            sandbox.resolves(issue);

            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: "Fix error in posting data",
                    issue_text: "When we post data it has an error.",
                    created_by: "Doni",
                    assigned_to: "Eko",
                    status_text: "In QA"
                })
                .end((err, res) => {
                    expect(sandbox.calledOnce).to.be.true;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.assigned_to).to.equal('Eko');
                    expect(res.body.created_by).to.equal('Doni');
                    expect(res.body.issue_text).to.equal('When we post data it has an error.');
                    expect(res.body.issue_title).to.equal('Fix error in posting data');
                    expect(res.body.open).to.be.true;
                    expect(res.body.status_text).to.equal('In QA');
                    expect(res.body.created_on).to.exist;
                    expect(res.body.updated_on).to.exist;
                    done();
                });
        });

        test("Create an issue with only required fields", done => {
            sandbox = sinon.stub(Issue.prototype, 'save');
            sandbox.resolves({
                ...issue,
                assigned_to: '',
                status_text: ''
            });

            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: "Fix error in posting data",
                    issue_text: "When we post data it has an error.",
                    created_by: "Doni",
                    assigned_to: "",
                    status_text: ""
                })
                .end((err, res) => {
                    expect(sandbox.calledOnce).to.be.true;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.assigned_to).to.equal('');
                    expect(res.body.created_by).to.equal('Doni');
                    expect(res.body.issue_text).to.equal('When we post data it has an error.');
                    expect(res.body.issue_title).to.equal('Fix error in posting data');
                    expect(res.body.open).to.be.true;
                    expect(res.body.status_text).to.equal('');
                    expect(res.body.created_on).to.exist;
                    expect(res.body.updated_on).to.exist;
                    done();
                });
        });
        test("Create an issue with missing required fields", done => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({})
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal("application/json");
                    expect(res.body.error).to.equal("required field(s) missing");
                    done();
                });
        });
        test("View issues on a project", done => {
            sandbox = sinon.stub(Issue, 'find').returns({
                exec: sinon.stub().resolves([issue, issue])
            });

            chai.request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    expect(sandbox.calledOnce).to.be.true;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal("application/json");
                    expect(res.body).to.be.an("array").with.lengthOf(2);
                    done();
                });
        });
        test("View issues on a project with one filter", done => {
            sandbox = sinon.stub(Issue, 'find').returns({
                exec: sinon.stub().resolves([issue, issue])
            });

            chai
                .request(server)
                .get('/api/issues/apitest?open=true')
                .end((err, res) => {
                    expect(sandbox.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array').that.is.not.empty;
                    expect(res.body).to.be.an("array").with.lengthOf(2);
                    expect(res.body[0].open).to.be.true;
                    done();
                });
        });
        test("View issues on a project with multiple filters", done => {
            issue = {
                ...issue,
                assigned_to: 'Eko',
                status_text: ''
            }
            sandbox = sinon.stub(Issue, 'find').returns({
                exec: sinon.stub().resolves([issue, issue])
            });

            chai
                .request(server)
                .get('/api/issues/apitest?open=true&assigned_to=Eko')
                .end((err, res) => {
                    expect(sandbox.calledOnce).to.be.true;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array').that.is.not.empty;
                    expect(res.body).to.be.an("array").with.lengthOf(2);
                    expect(res.body[0].open).to.be.true;
                    expect(res.body[0].assigned_to).to.equal("Eko");
                    done();
                });
        });
        test("Update one field on an issue", done => {
            issue = {
                ...issue,
                _id: '63ed9b943ae0eb24f467f4f9',
            }

            sandbox.stub(Issue, 'findById').resolves(issue);
            sandbox.stub(Issue, 'updateOne').resolves({ nModified: 1 });

            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: issue._id,
                    issue_title: "Updated title"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    assert.deepEqual(res.body, {
                        result: 'successfully updated',
                        _id: issue._id
                    });
                    done();
                });
        });
        test("Update multiple fields on an issue", done => {
            issue = {
                ...issue,
                _id: '63ed9b943ae0eb24f467f4f9',
            }

            sandbox.stub(Issue, 'findById').resolves(issue);
            sandbox.stub(Issue, 'updateOne').resolves({ nModified: 1 });

            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: issue._id,
                    issue_title: "Fix error in posting datas",
                    issue_tex: "When Eko post data it has an error.",
                    assigned_to: "Messi",
                    created_by: "Ronaldo"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    assert.deepEqual(res.body, {
                        result: 'successfully updated',
                        _id: issue._id
                    });
                    done();
                });
        });
        test("Update an issue with missing _id", done => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: "Fix error in posting datas",
                    issue_tex: "When Eko post data it has an error.",
                    assigned_to: "Messi",
                    created_by: "Ronaldo"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.error).to.equal('missing _id');
                    done();
                });
        });
        test("Update an issue with no fields to update", done => {
            issue = {
                ...issue,
                _id: '63ed9b943ae0eb24f467f4f9',
            }

            sandbox.stub(Issue, 'findById').resolves(issue);
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: issue._id
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    assert.deepEqual(res.body, {
                        error: 'no update field(s) sent',
                        _id: issue._id
                    });
                    done();
                });
        });
        test("Update an issue with an invalid _id", done => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "63ed9b943ae0eb24f467f47XX"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    assert.deepEqual(res.body, {
                        error: 'could not update',
                        _id: '63ed9b943ae0eb24f467f47XX'
                    });
                    done();
                });
        });
        test("Delete an issue", done => {
            sandbox.stub(Issue, 'deleteOne').resolves({ n: 1, deletedCount: 1 });

            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: "63ed9f408654591561b47e26"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, "application/json")
                    assert.equal(res.body.result, "successfully deleted");
                    assert.equal(res.body._id, "63ed9f408654591561b47e26");
                    done();
                });
        });
        test("Delete an issue with an invalid _id", done => {
            sandbox.stub(Issue, 'deleteOne').rejects({
                name: "CastError",
                kind: "ObjectId",
                value: "63ed9b943ae0eb24f467f4f9XX",
                path: "_id",
                reason: {}
            });
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: "63ed9b943ae0eb24f467f4f9XX"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, "application/json")
                    assert.equal(res.body.error, "could not delete");
                    assert.equal(res.body._id, "63ed9b943ae0eb24f467f4f9XX");
                    done();
                });
        });
        test("Delete an issue with missing _id", done => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, "application/json")
                    assert.equal(res.body.error, "missing _id");
                    done();
                });
        });
    });
});
