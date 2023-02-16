const {HttpResponse} = require("../helpers/http-response");

class IssueResponse extends HttpResponse {

    constructor(data, options) {
        super(data, options);
    }

    insertOne() {
        this.data = {
            _id: this.data._id,
            issue_title: this.data.issue_title,
            issue_text: this.data.issue_text,
            created_on: this.data.createdAt,
            updated_on: this.data.updatedAt,
            created_by: this.data.created_by,
            assigned_to: this.data.assigned_to,
            open: this.data.open,
            status_text: this.data.status_text
        };

        return this;
    }

    getMany() {
        this.data = this.data.map(issue => {
            return {
                _id: issue._id,
                issue_title: issue.issue_title,
                issue_text: issue.issue_text,
                created_on: issue.createdAt,
                updated_on: issue.updatedAt,
                created_by: issue.created_by,
                assigned_to: issue.assigned_to,
                open: issue.open,
                status_text: issue.status_text
            }
        });

        return this;
    }

    updateOne() {
        this.data = {
            result: "successfully updated",
            _id: this.data._id
        }

        return this;
    }

    deleteOne() {
        this.data = {
            result: "successfully deleted",
            _id: this.data?._id
        }

        return this;
    }
}

module.exports = { IssueResponse }