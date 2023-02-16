'use strict'

class Controller {
    constructor(service) {
        this.service = service;
        this.insert = this.insert.bind(this);
    }

    async insert(req, res, next) {
        try {
            const response = await this.service.insert(req.body);
            return res.status(response.statusCode).json(response);
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = { Controller };