var DEFAULT_NUM_ROWS = 8;
var DEFAULT_NUM_COLS = 20;
var DEFAULT_NUM_BOMBS = 15;

var status = {
  UNCLICKED: 0,
  CLICKED: 1,
  FLAGGED: 2
};

var Board = function(numRows, numCols, numBombs) {
  this.numRows = numRows || DEFAULT_NUM_ROWS;
  this.numCols = numCols || DEFAULT_NUM_COLS;
  this.numBombs = numBombs || DEFAULT_NUM_BOMBS;

  this.matrix = [];
  for (var r = 0; r < this.numRows; r++) {
    var newRow = [];
    for (var c = 0; c < this.numCols; c++) {
      newRow.push({
        isBomb: false,
        numBombNeighbors: 0,
        status: status.UNCLICKED
      });
    }
    this.matrix.push(newRow);
  }

  this._initializeBombs();
};

Board.prototype._initializeBombs = function() {
  // for each bomb,
    // randomly select a location
    // (repeatedly until it's a location that is not already a bomb)

    // set that location's isBomb to true
    // increment all of its neighbors' numBombNeighbors
  for (var i = 0; i < this.numBombs; i++) {
    var position = this.getRandomPositionWhere(
      // filter function: keep looking until position satisifies this
      function(r, c) {
        return this.matrix[r][c].isBomb === false;
      }.bind(this)
    );

    var r = position.r;
    var c = position.c;
    this.matrix[r][c].isBomb = true;
    this.iterateOverNeighbors(r, c, function(nR, nC) {
      this.matrix[nR][nC].numBombNeighbors++;
    }.bind(this));
  }
};

Board.prototype.getRandomPositionWhere = function(filter) {
  while (true) {
    var r = Math.floor(Math.random() * this.numRows);
    var c = Math.floor(Math.random() * this.numCols);
    if (filter(r, c)) {
      return {
        r: r,
        c: c
      };
    }
  }
};

Board.prototype.iterateOverNeighbors = function(r, c, callback) {
  for (var nR = r - 1; nR <= r + 1; nR++) {
    for (var nC = c - 1; nC <= c + 1; nC++) {
      if (this.hasPosition(nR, nC)) {
        callback(nR, nC);
      }
    }
  }
};

Board.prototype.hasPosition = function(r, c) {
  return r >= 0 && r < this.numRows && c >= 0 && c < this.numCols;
};

Board.prototype.print = function(showAll) {
  console.log(this.matrix.map(function(row) {
    return row.map(function(square) {
      if (showAll) {
        return square.isBomb ? 'X' : square.numBombNeighbors;
      }

      if (square.status === status.UNCLICKED) {
        return '-';
      } else if (square.status === status.FLAGGED) {
        return '?';
      } else if (square.isBomb) {
        return 'X';
      } else {
        return square.numBombNeighbors;
      }
    }).join(' ');
  }).join('\n'));
};


module.exports = Board;