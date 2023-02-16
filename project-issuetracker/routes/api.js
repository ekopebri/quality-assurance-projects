'use strict';

const IssueController = require('./../src/controllers/issue.controller');

require('../config/database');

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(IssueController.getIssueByProject)
    .post(IssueController.createIssueByProject)
    .put(IssueController.updateIssueByProject)
    .delete(IssueController.removeById);

};
