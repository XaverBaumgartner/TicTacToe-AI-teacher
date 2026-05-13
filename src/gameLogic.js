export const WIN_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function checkWinner(board) {
  for (const combo of WIN_COMBINATIONS) {
    if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
      return board[combo[0]];
    }
  }
  if (!board.includes(null)) return 'draw';
  return null;
}

export function nextInRow(i) {
  return (3 * Math.floor(i / 3) + (i + 1) % 3);
}

export function nextInCol(i) {
  return (i + 3) % 9;
}

export function nextInDiag(i) {
  return (i + 4) % 12;
}

export function nextInAntiDiag(i) {
  return (2 + i % 6);
}

export function getAvailableMoves(board) {
  return board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
}

export class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.startingPlayer = 'X'; // Default: Human
    this.currentPlayer = this.startingPlayer;
    this.winner = null;
  }

  makeMove(index) {
    if (this.board[index] || this.winner) return false;
    this.board[index] = this.currentPlayer;
    this.winner = checkWinner(this.board);
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    return true;
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = this.startingPlayer;
    this.winner = null;
    this.invalidMoveError = null;
  }

  setStartingPlayer(player) {
    this.startingPlayer = player;
  }
}
