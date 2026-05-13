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