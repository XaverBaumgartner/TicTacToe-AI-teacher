// Gewinnen, falls möglich
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] === null && (getBoard()[(nextInRow(i))] === 'O' && getBoard()[(nextInRow((nextInRow(i))))] === 'O')) {
        return i;
    }
}
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[nextInCol(i)] == 'O' && getBoard()[nextInCol(nextInCol(i))] == 'O')) {
        return i;
    }
}
for (i = 0; i <= 8; i += 4) {
    if (getBoard()[i] == null && (getBoard()[nextInDiag(i)] == 'O' && getBoard()[nextInDiag(nextInDiag(i))] == 'O')) {
        return i;
    }
}
for (i = 2; i <= 6; i += 2) {
    if (getBoard()[i] == null && (getBoard()[nextInAntiDiag(i)] == 'O' && getBoard()[nextInAntiDiag(nextInAntiDiag(i))] == 'O')) {
        return i;
    }
}

// Blocken, falls nötig
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[nextInRow(i)] == 'X' && getBoard()[nextInRow(nextInRow(i))] == 'X')) {
        return i;
    }
}
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[nextInCol(i)] == 'X' && getBoard()[nextInCol(nextInCol(i))] == 'X')) {
        return i;
    }
}
for (i = 0; i <= 8; i += 4) {
    if (getBoard()[i] == null && (getBoard()[nextInDiag(i)] == 'X' && getBoard()[nextInDiag(nextInDiag(i))] == 'X')) {
        return i;
    }
}
for (i = 2; i <= 6; i += 2) {
    if (getBoard()[i] == null && (getBoard()[nextInAntiDiag(i)] == 'X' && getBoard()[nextInAntiDiag(nextInAntiDiag(i))] == 'X')) {
        return i;
    }
}


// Sonst: Einfach setzen wie vorhin
// Mitte hat höchste Priorität...
if (getBoard()[4] == null) {
    return 4;
}
// ... dann Ecken...
if (getBoard()[0] == null) {
    return 0;
}
if (getBoard()[8] == null) {
    return 8;
}
if (getBoard()[6] == null) {
    return 6;
}
if (getBoard()[2] == null) {
    return 2;
}
// ... dann Seiten
if (getBoard()[1] == null) {
    return 1;
}
if (getBoard()[7] == null) {
    return 7;
}
if (getBoard()[3] == null) {
    return 3;
}
if (getBoard()[5] == null) {
    return 5;
}