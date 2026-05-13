globalThis.moveCache = globalThis.moveCache || {};
var b = getBoard().slice();
var boardKey = b.map(function (x) { return x ? x : '-'; }).join('');

if (globalThis.moveCache[boardKey] !== undefined) {
    return globalThis.moveCache[boardKey];
}

function getWeight(boardState, nextPlayer) {
    var remaining = 0;
    for (var i = 0; i <= 8; i++) {
        if (!boardState[i]) remaining++;
    }
    var weight = 1;
    var humanOptions = nextPlayer === 'X' ? remaining : remaining - 1;
    while (humanOptions > 0) {
        weight *= humanOptions;
        humanOptions -= 2;
    }
    return weight;
}

function getWinner(boardState) {
    var lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (var i = 0; i <= 7; i++) {
        var combo = lines[i];
        if (boardState[combo[0]] && boardState[combo[0]] === boardState[combo[1]] && boardState[combo[0]] === boardState[combo[2]]) {
            return boardState[combo[0]];
        }
    }
    if (!boardState.includes(null)) return 'draw';
    return null;
}

function sim(boardState, player) {
    var winner = getWinner(boardState);
    if (winner) {
        var w = getWeight(boardState, player);
        if (winner === 'O') return [0, w, 0];
        if (winner === 'X') return [w, 0, 0];
        return [0, 0, w];
    }

    var availMoves = [];
    for (var i = 0; i <= 8; i++) {
        if (!boardState[i]) availMoves.push(i);
    }

    if (player === 'O') {
        var bStats = [Infinity, -1, -1];
        var k = 0;
        while (k < availMoves.length) {
            var m = availMoves[k];
            boardState[m] = 'O';
            var currentStats = sim(boardState, 'X');
            boardState[m] = null;
            if (currentStats[0] < bStats[0] || (currentStats[0] === bStats[0] && currentStats[1] > bStats[1])) {
                bStats = currentStats;
            }
            k++;
        }
        return bStats;
    } else {
        var total = [0, 0, 0];
        var l = 0;
        while (l < availMoves.length) {
            var m2 = availMoves[l];
            boardState[m2] = 'X';
            var currentStats2 = sim(boardState, 'O');
            boardState[m2] = null;
            total[0] += currentStats2[0];
            total[1] += currentStats2[1];
            total[2] += currentStats2[2];
            l++;
        }
        return total;
    }
}

var avail = [];
for (var i = 0; i <= 8; i++) {
    if (!b[i]) avail.push(i);
}

var bestMove = -1;
var bestStats = [Infinity, -1, -1];

var idx = 0;
while (idx < avail.length) {
    var move = avail[idx];
    b[move] = 'O';
    var stats = sim(b, 'X');
    b[move] = null;

    if (stats[0] < bestStats[0] || (stats[0] === bestStats[0] && stats[1] > bestStats[1])) {
        bestStats = stats;
        bestMove = move;
    }
    idx++;
}

globalThis.moveCache[boardKey] = bestMove;
return bestMove;
