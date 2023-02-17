/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookController = require('./../src/controllers/book.controller');

require('../config/database');

module.exports = function (app) {

  app.route('/api/books')
    .get(BookController.getBooks)
    
    .post(BookController.insertBook)
    
    .delete(BookController.deleteAllBook);



  app.route('/api/books/:id')
    .get(BookController.getBookById)
    
    .post(BookController.addComment)
    
    .delete(BookController.deleteBookById);
  
};
