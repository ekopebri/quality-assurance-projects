function ConvertHandler() {

  const listUnit = {
    gal: {
      unitName: 'gal',
      unitLongName: 'gallons',
      returnUnit: 'L',
      convert: function (num) {
        return (num * 3.78541).toFixed(5);
      }
    },
    L: {
      unitName: 'L',
      unitLongName: 'liters',
      returnUnit: 'gal',
      convert: function (num) {
        return (num / 3.78541).toFixed(5);
      }
    },
    mi: {
      unitName: 'mi',
      unitLongName: 'miles',
      returnUnit: 'km',
      convert: function (num) {
        return num * 1.60934;
      }
    },
    km: {
      unitName: 'km',
      unitLongName: 'kilometers',
      returnUnit: 'mi',
      convert: function (num) {
        return num / 1.60934;
      }
    },
    lbs: {
      unitName: 'lbs',
      unitLongName: 'pounds',
      returnUnit: 'kg',
      convert: function (num) {
        return num * 0.453592;
      }
    },
    kg: {
      unitName: 'kg',
      unitLongName: 'kilograms',
      returnUnit: 'lbs',
      convert: function (num) {
        return (num / 0.453592).toFixed(5);
      }
    }
  }
  
  this.getNum = function(input) {
    if (input.match(/[/|*|\-|+]/g) && input.match(/[/|*|\-|+]/g).length > 1) {
      return "invalid number";
    }

    const regex = /[(gal)|(L)|(mi)|(km)|(lbs)|(kg)]/gi

    const fractionalRegex = /[/|+|\-|*]/;

    let result = input.replace(regex, "");

    if (fractionalRegex.test(result)) {
      const arr = result.split(fractionalRegex);

      arr[0] = arr[0] % 1 > 0 ? parseFloat(arr[0]) : parseInt(arr[0]);
      arr[1] = arr[1] % 1 > 0 ? parseFloat(arr[1]) : parseInt(arr[1]);

      if (result.match(/[/]/)) {
        result = arr[0] / arr[1];
      } else if (result.match(/[*]/)) {
        result = arr[0] * arr[1];
      } else if (result.match(/[-]/)) {
        result = arr[0] - arr[1];
      } else if (result.match(/[+]/)) {
        result = arr[0] + arr[1];
      }
    }

    if (result === '') {
      result = 1;
    }

    return result;
  };
  
  this.getUnit = function(input) {
    const regex = /^(gal|L|mi|km|lbs|kg)$/ig
    let result = input.replace(regex, "");
    result = listUnit[Object.keys(listUnit).find((key) =>
        key.toLowerCase() === result.toLowerCase())];
    if (!result) {
      return "invalid unit";
    }
    return result.unitName;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result = listUnit[initUnit].returnUnit;
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    return listUnit[unit].unitLongName;
  };
  
  this.convert = function(initNum, initUnit) {
    return listUnit[initUnit].convert(initNum);
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
