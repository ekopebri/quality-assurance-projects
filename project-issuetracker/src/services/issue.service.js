const {Service} = require("./service");
const {HttpError} = require("../helpers/http-error");
const Issue = require("../models/Issue");
const {IssueResponse} = require("../responses/issue.response");

class IssueService extends Service {
    constructor() {
        super(null);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async insert(data) {
        try {
            let issue = new Issue(data);
            let item = await issue.save();
            if (item) {
                let response = new IssueResponse(item);

                return response.insertOne();
            } else {
                return new HttpError('Something wrong happened');
            }
        } catch (error) {
            return new HttpError('required field(s) missing', {statusCode: 200});
        }
    }

    async get(query) {
        try {
            let item = await Issue.find(query).exec();
            if (item) {
                let response = new IssueResponse(item);

                return response.getMany();
            } else {
                return new HttpError('Something wrong happened');
            }
        } catch (error) {
            return new HttpError('required field(s) missing', {statusCode: 200});
        }
    }

    async update(data) {
        let id = data._id;
        try {
            delete data['_id'];

            if (!id) {
                return new HttpError('missing _id', {statusCode: 200});
            }

            let issue = await Issue.findById(id);

            if (!issue) {
                return new HttpError('could not update', {statusCode: 200, data: {_id: id}});
            }

            if (Object.keys(data).length < 1) {
                return new HttpError("no update field(s) sent", {
                    statusCode: 200,
                    data: {
                        _id: id
                    }
                });
            }

            await Issue.updateOne({_id: id}, data);

            let item = await Issue.findById(id);

            if (item) {
                let response = new IssueResponse(item);
                return response.updateOne();
            } else {
                return new HttpError('Something wrong happened');
            }
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return new HttpError('could not update', {statusCode: 200, data: {_id: id}});
            }
            return new HttpError('required field(s) missing', {statusCode: 200});
        }
    }

    async remove(id) {
        try {
            if (!id) {
                return new HttpError('missing _id', {statusCode: 200});
            }

            let res = await Issue.deleteOne({_id: id});

            if (res) {
                let response = new IssueResponse({_id: id});
                return response.deleteOne();
            } else {
                return new HttpError('Something wrong happened');
            }
        } catch (err) {
            return new HttpError('could not delete', {statusCode: 200, data: {_id: id}});
        }
    }
}

module.exports = { IssueService };