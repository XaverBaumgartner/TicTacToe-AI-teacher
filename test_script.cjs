const fs = require('fs');

function getBranchingWeight(board, nextPlayer) {
  const remaining = board.filter(c => c === null).length;
  let weight = 1;
  let humanOptions = nextPlayer === 'X' ? remaining : remaining - 1;
  for (let i = humanOptions; i > 0; i -= 2) {
    weight *= i;
  }
  return weight;
}

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combo of lines) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
            return board[combo[0]];
        }
    }
    if (!board.includes(null)) return 'draw';
    return null;
}

function getAvailableMoves(board) {
  return board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
}

function evaluateAI(aiCode, startingPlayer = 'X') {
  const stats = { wins: 0, losses: 0, draws: 0, total: 0 };
  const func = new Function('getBoard', 'aiMove', 'nextInRow', 'nextInCol', 'nextInDiag', 'nextInAntiDiag', `
    ${aiCode}
    return aiMove;
  `);
  let runAI = (board) => func(() => board, -1, null, null, null, null);

  function simulate(board, player) {
    const winner = checkWinner(board);
    if (winner) {
      const weight = getBranchingWeight(board, player);
      if (winner === 'O') stats.wins += weight;
      else if (winner === 'X') stats.losses += weight;
      else if (winner === 'draw') stats.draws += weight;
      stats.total += weight;
      return;
    }

    if (player === 'O') {
      let move;
      try {
        move = runAI(board);
      } catch (e) {
        console.error("Crash on board", board.join(''), e);
        move = -1;
      }
      const available = getAvailableMoves(board);
      if (move !== -1 && available.includes(move)) {
        const nextBoard = [...board];
        nextBoard[move] = 'O';
        simulate(nextBoard, 'X');
      } else {
        const weight = getBranchingWeight(board, 'O');
        stats.losses += weight;
        stats.total += weight;
      }
    } else {
      const moves = getAvailableMoves(board);
      moves.forEach(move => {
        const nextBoard = [...board];
        nextBoard[move] = 'X';
        simulate(nextBoard, 'O');
      });
    }
  }

  simulate(Array(9).fill(null), startingPlayer);
  
  return {
    winRate: ((stats.wins / stats.total) * 100).toFixed(1),
    lossRate: ((stats.losses / stats.total) * 100).toFixed(1),
    drawRate: ((stats.draws / stats.total) * 100).toFixed(1),
    total: stats.total,
    stats: stats
  };
}

let aiCode = fs.readFileSync('src/presets/5. perfect strategy.js', 'utf-8');
console.log("Human Starts:", evaluateAI(aiCode, 'X'));
console.log("AI Starts:", evaluateAI(aiCode, 'O'));
