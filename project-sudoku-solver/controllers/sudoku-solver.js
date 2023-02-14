class SudokuSolver {

  validate(puzzleString) {
    let error = null;
    if (!puzzleString || puzzleString.length === 0) {
      error = "Required field missing";
    } else if (puzzleString.match(/^([1-9.]{81})$/g)) {
      return error;
    } else {
      if (puzzleString.length != 81) {
        error = "Expected puzzle to be 81 characters long";
      } else {
        error = "Invalid characters in puzzle";
      }
    }

    return error;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowPuzzleStr = puzzleString.slice((row - 1) * 9, row * 9);

    for (let i = 0; i < 9; i++) {
      if (rowPuzzleStr.charAt(i) == value && (column - 1) !== i) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString.charAt(i * column * 9) == value && (row - 1) !== i) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let index = 9 * ( 3 * Math.floor(row / 3) + i) + ( 3 * Math.floor(column / 3) + j);
        if (puzzleString.charAt(index) == value && (row % 3 !== i || column % 3 !== j)) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    const result = {
      error: "Invalid characters in puzzle",
      success: false
    }

    if (this.validate(puzzleString) == null) {
      let sudoku = [];
      let currentRow = [];
      let count = 0;
      for (let i = 0; i < puzzleString.length; i++) {
          if (puzzleString.charAt(i) === '.') {
            currentRow.push(null)
          } else {
            currentRow.push(parseInt(puzzleString.charAt(i)))
          }

          if (count === 8) {
            sudoku.push(currentRow);
            currentRow = [];
            count = 0;
          } else {
            count++;
          }
      }

      if(this.solveSudoku(sudoku, 0, 0)) {
        result.error = null;
        result.success = true;
        result.solution = this.convertSudokuToString(sudoku);
      } else {
        result.error = null;
        result.success = false;
      }
    }

    return result;
  }

  solveSudoku(sudoku, start, end) {
    for (let i = start; i < 9; i++) {
      for (let j = end; j < 9; j++) {
        if (sudoku[i][j] == null) {
          let possibilities = this.nextBoards(sudoku, i, j);
          for (let k = 0; k < possibilities.length; k++) {
            sudoku[i][j] = possibilities[k];

            if (this.solveSudoku(sudoku, (end === 8) ? i + 1 : i, (j === 8) ? 0 : j + 1)) {
              return true;
            }
          }
          sudoku[i][j] = null
          return false;
        }
      }

      end = 0;
    }

    return true;
  }

  nextBoards(sudoku, start, end) {
    let number_to_avoid = [];
    let result = [];

    for (let i = 0; i < 9; i++) {
      number_to_avoid.push(sudoku[start][i]);
      number_to_avoid.push(sudoku[i][end]);
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        number_to_avoid.push(sudoku[3 * Math.floor(start / 3) + i][3 * Math.floor(end / 3) + j]);
      }
    }


    for (let i = 1; i < 10; i++) {
      if (number_to_avoid.indexOf(i) === -1) {
        result.push(i);
      }
    }

    return result;
  }

  convertSudokuToString(sudoku) {
    let sudokuStr = '';
    for (let i = 0; i < sudoku.length; i++) {
      for (let j = 0; j < sudoku[i].length; j++) {
        sudokuStr += sudoku[i][j];
      }
    }

    return sudokuStr;
  }

  getRowAndColumn(place) {
    if (place.match(/^[A-I]{1}?([1-9]{1})$/gi)) {
      let res = place.split("");
      return [res[0].toUpperCase().codePointAt(0) - 64, parseInt(res[1])]
    }

    return null;
  }
}

module.exports = SudokuSolver;

