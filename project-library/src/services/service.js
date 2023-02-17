const {HttpResponse} = require("../helpers/http-response");
const {HttpError} = require("../helpers/http-error");

class Service {
    constructor(model) {
        this.model = model;
        this.insert = this.insert.bind(this);
    }

    async insert(data) {
        try {
            let item = await this.model.create(data);
            if (item) {
                return new HttpResponse(item);
            } else {
                return new HttpError('Something wrong happened');
            }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = { Service };