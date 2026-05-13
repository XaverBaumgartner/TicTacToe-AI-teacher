import { checkWinner, getAvailableMoves, nextInRow, nextInCol, nextInDiag, nextInAntiDiag } from './gameLogic.js';

function getBranchingWeight(board, nextPlayer) {
  const remaining = board.filter(c => c === null).length;
  let weight = 1;

  // All branches (only human branches! AI is deterministic)
  let humanOptions = nextPlayer === 'X' ? remaining : remaining - 1;

  for (let i = humanOptions; i > 0; i -= 2) {
    weight *= i;
  }
  return weight;
}

export function evaluateAI(aiCode, startingPlayer = 'X') {
  const stats = { wins: 0, losses: 0, draws: 0, total: 0 };

  let runAI;
  try {
    const func = new Function('getBoard', 'aiMove', 'nextInRow', 'nextInCol', 'nextInDiag', 'nextInAntiDiag', `
      ${aiCode}
      return aiMove;
    `);
    runAI = (board) => func(() => board, -1, nextInRow, nextInCol, nextInDiag, nextInAntiDiag);
  } catch (e) {
    console.error("AI Compile Error:", e);
    return { winRate: "0.0", lossRate: "100.0", drawRate: "0.0", total: 0 };
  }

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
        move = -1; // crash -> instant loss
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
      // Human plays all moves
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
    total: stats.total
  };
}
