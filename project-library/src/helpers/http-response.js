class HttpResponse {
    constructor(data, options = {statusCode: 200}) {
        this.statusCode = options.statusCode || 200;
        this.data = data;
    }
}

module.exports = { HttpResponse };