// Gewinnen, falls möglich
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[(3 * Math.floor(i / 3) + (i + 1) % 3)] == 'O' && getBoard()[(3 * Math.floor(i / 3) + (i + 2) % 3)] == 'O')) {
        return i;
    }
}
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[((i + 3) % 9)] == 'O' && getBoard()[((i + 6) % 9)] == 'O')) {
        return i;
    }
}
for (i = 0; i <= 8; i += 4) {
    if (getBoard()[i] == null && (getBoard()[((i + 4) % 12)] == 'O' && getBoard()[((i + 8) % 12)] == 'O')) {
        return i;
    }
}
for (i = 2; i <= 6; i += 2) {
    if (getBoard()[i] == null && (getBoard()[(2 + i % 6)] == 'O' && getBoard()[(2 + (i + 2) % 6)] == 'O')) {
        return i;
    }
}

// Blocken, falls nötig
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[(3 * Math.floor(i / 3) + (i + 1) % 3)] == 'X' && getBoard()[(3 * Math.floor(i / 3) + (i + 2) % 3)] == 'X')) {
        return i;
    }
}
for (i = 0; i <= 8; i++) {
    if (getBoard()[i] == null && (getBoard()[((i + 3) % 9)] == 'X' && getBoard()[((i + 6) % 9)] == 'X')) {
        return i;
    }
}
for (i = 0; i <= 8; i += 4) {
    if (getBoard()[i] == null && (getBoard()[((i + 4) % 12)] == 'X' && getBoard()[((i + 8) % 12)] == 'X')) {
        return i;
    }
}
for (i = 2; i <= 6; i += 2) {
    if (getBoard()[i] == null && (getBoard()[(2 + i % 6)] == 'X' && getBoard()[(2 + (i + 2) % 6)] == 'X')) {
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