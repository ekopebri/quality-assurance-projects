'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
      .get(function (req, res) {
        const input = req.query.input || '';
        let initUnit = convertHandler.getUnit(input);
        let initNum = convertHandler.getNum(input);

        if (initUnit === 'invalid unit' && initNum === 'invalid number') {
            res.json('invalid number and unit');
        }

        console.log(initUnit);

        if (initUnit === 'invalid unit') {
            res.json(initUnit);
            return;
        }

        if (initNum === 'invalid number') {
          res.json(initNum);
          return;
        }

        let returnUnit = convertHandler.getReturnUnit(initUnit);
        let returnNum = convertHandler.convert(initNum, initUnit);

        res.json({
            initNum: initNum,
            initUnit: initUnit,
            returnNum: returnNum,
            returnUnit: returnUnit,
            string: convertHandler.getString(initNum, initUnit, returnNum, returnUnit)
        });
      });
};
