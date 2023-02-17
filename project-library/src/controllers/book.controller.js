const {Controller} = require("./controller");
const {BookService} = require("../services/book.service");

class BookController extends Controller {
    constructor() {
        super(new BookService());
        this.getBooks = this.getBooks.bind(this);
        this.insertBook = this.insertBook.bind(this);
        this.getBookById = this.getBookById.bind(this);
        this.addComment = this.addComment.bind(this);
        this.deleteBookById = this.deleteBookById.bind(this);
        this.deleteAllBook = this.deleteAllBook.bind(this);
    }

    async getBooks(req, res, next) {
        try {
            const response = await this.service.getAll();
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async getBookById(req, res, next) {
        try {
            const response = await this.service.get(req.params.id);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async addComment(req, res){
        try {
            const response = await this.service.insertComment(req.params.id, req.body.comment);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    };

    async insertBook(req, res, next) {
        try {
            const response = await this.service.insert(req.body);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async deleteBookById(req, res, next) {
        try {
            const response = await this.service.deleteBook(req.params.id);
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }

    async deleteAllBook(req, res, next) {
        try {
            const response = await this.service.deleteAllBook();
            return res.status(response.statusCode).json(response.data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BookController();