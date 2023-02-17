const {Service} = require("./service");
const Book = require('./../models/book');
const {BookResponse} = require("../responses/book.response");
const {HttpError} = require("../helpers/http-error");

class BookService extends Service {
    constructor() {
        super(null);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.insertComment = this.insertComment.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.deleteAllBook = this.deleteAllBook.bind(this);
    }

    async getAll() {
        try {
            let item = await Book.find({});
            if (item) {
                let response = new BookResponse(item);

                return response.getBooks();
            }

            throw new Error('Something wrong happened');
        } catch (error) {
            return new HttpError(error.message);
        }
    }

    async get(id) {
        try {
            let book = await Book.findById(id);
            if (book) {
                let response = new BookResponse(book);

                return response.getBook();
            }

            throw new Error('no book exists');
        } catch (error) {
            return new HttpError(error.message, { statusCode: 200 });
        }
    }


    async insert(data) {
        try {
            // If title is missing
            if (!data.title) {
                throw new Error("missing required field title");
            }

            let book = new Book(data);
            await book.save();

            if (book) {
                let response = new BookResponse(book);

                return response.insertBookResponse();
            }

            return new HttpError('Something wrong happened');
        } catch (error) {
            return new HttpError(error.message, {statusCode: 200});
        }
    }

    async insertComment(id, comment) {
        try {
            if (!comment) {
                throw new Error("missing required field comment");
            }
            let book = await Book.findById(id);

            if (book != null) {
                let comments = book.comments;
                comments.push(comment);
                const res = await Book.updateOne({ _id: id }, { comments: comments });
                if (res) {
                    book = await Book.findById(id);

                    let response = new BookResponse(book);

                    return response.getBook();
                }
            }

            throw new Error('no book exists');
        } catch (error) {
            return new HttpError(error.message, { statusCode: 200 });
        }
    }

    async deleteBook(id) {
        try {
            let book = await Book.deleteOne({ _id: id });

            if (book.deletedCount > 0) {
                let response = new BookResponse(null);

                return response.deleteBook();
            }

            throw new Error('no book exists');
        } catch (error) {
            return new HttpError(error.message, { statusCode: 200 });
        }
    }

    async deleteAllBook() {
        try {
            let book = await Book.deleteMany({});
            let response = new BookResponse(null);
            return response.deleteBookMany();
        } catch (error) {
            return new HttpError(error.message, { statusCode: 200 });
        }
    }
}

module.exports = { BookService };