const {HttpResponse} = require("../helpers/http-response");

class BookResponse extends HttpResponse {
    constructor(data, options) {
        super(data, options);
    }

    getBooks() {
        this.data = this.data.map(book => {
            return {
                _id: book._id,
                title: book.title,
                comments: book.comments,
                commentcount: book.comments.length,
                __v: book.__v
            }
        })
        return this;
    }

    getBook() {
        this.data = {
            _id: this.data._id,
            title: this.data.title,
            comments: this.data.comments,
            commentcount: this.data.comments.length,
            __v: this.data.__v
        };

        return this;
    }

    insertBookResponse() {
        this.data = {
            _id: this.data._id,
            title: this.data.title
        }

        return this;
    }

    deleteBook() {
        this.data = "delete successful";

        return this;
    }

    deleteBookMany() {
        this.data = "complete delete successful";

        return this;
    }
}

module.exports = { BookResponse };