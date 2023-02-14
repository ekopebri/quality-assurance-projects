'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
        let response = {};

        if(!req.body.value || !req.body.puzzle || !req.body.coordinate) {
            response.error = "Required field(s) missing";
        } else {
            const value = parseInt(req.body.value);
            const place = solver.getRowAndColumn(req.body.coordinate);
            const validate = solver.validate(req.body.puzzle);
            const validateValue = /^[1-9]$/g.test(value);
            if (place == null) {
                response.error = "Invalid coordinate";
            } else if (!validateValue) {
                response.error = "Invalid value";
            } else if(validate != null) {
                response.error = validate;
            } else {
                const conflict = [];
                if (!solver.checkRowPlacement(req.body.puzzle, place[0], place[1], value)) {
                    conflict.push("row");
                }

                if (!solver.checkColPlacement(req.body.puzzle, place[0], place[1], value)) {
                    conflict.push("column");
                }

                if (!solver.checkRegionPlacement(req.body.puzzle, place[0], place[1], value)) {
                    conflict.push("region");
                }

                if (conflict.length > 0) {
                    response.valid = false;
                    response.conflict = conflict;
                } else {
                    response.valid = true;
                }
            }
        }

        res.json(response);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
        let response = {};
        let validate = solver.validate(req.body.puzzle);
        if (validate != null) {
            response.error = validate;
        } else {
            const result = solver.solve(req.body.puzzle);
            if (!result.success) {
                response.error = "Puzzle cannot be solved";
            } else {
                response.solution = result.solution;
            }
        }
      res.json(response);
    });
};
