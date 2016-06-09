var prompt = require('prompt');
var Board = require('./Board');

var gameState = {
  ONGOING: 0,
  WON: 1,
  LOST: 2
};

var board = new Board();
var instructionMessage = 'Select row, col, and then action.\nActions: c (click), f (flag), u (unflag)';

var warningMessage = '';
prompt.start();

/* main loop
  warningMessage = ''
  while (board state is still ONGOING) loop:
    prints board
    print warningMessage if exists
    set warningMessage to ''
    prompts for location (r, then c)
    prompts for click, flag, or unflag
    either flags or clicks location, or sets warningMessage: "That action is invalid"

  if game is won or lost, generate congratulations/boo message
  prompt for new game: if yes, create new board and restart loop
*/

var runTurn = function() {
  if (board.state !== gameState.ONGOING) {
    board.print(true);
    if (board.state === gameState.WON) {
      console.log('Congratulations! You won.');
    } else {
      console.log('Sorry! You lost.');
    }
    return;
  }

  board.print();
  if (warningMessage) {
    console.log('WARNING:', warningMessage);
    warningMessage = '';
  }
  console.log(instructionMessage);
  prompt.get(['r', 'c', 'action'], function(err, result) {
    var r = result.r;
    var c = result.c;
    var action = result.action;
    if (action === 'c') {
      board.clickPosition(r, c);
    } else if (action === 'f') {
      board.flagPosition(r, c);
    } else if (action === 'u') {
      board.unflagPosition(r, c);
    }
    runTurn();
  })
};

// main
runTurn();