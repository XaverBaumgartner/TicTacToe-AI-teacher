const translations = {
  de: {
    app_title: "TicTacToe KI Labor",
    app_subtitle: "Programmiere deine KI auf der linken Seite und teste sie hier.",
    ai_performance: "KI-Leistung",
    reset_board: "Spielfeld zurücksetzen",
    win_rate: "Gewonnen",
    draw_rate: "Unentschieden",
    loss_rate: "Verloren",
    eval_info: "Auswertung basierend auf allen 255.168 möglichen Spielzuständen.",
    eval_not_run: "Noch keine Auswertung durchgeführt. Deine KI wird automatisch analysiert, während du baust.",
    how_to_use_title: "Anleitung",
    how_to_use_step1: "1. Nutze die <b>Logik</b>-Blöcke, um das Denken deiner KI zu definieren.",
    how_to_use_step2: "2. Der <b>Zug</b>-Block sagt der KI, wo sie spielen soll.",
    how_to_use_step3: "3. Klicke auf das Spielfeld, um als 'X' zu spielen und zu sehen, wie die KI ('O') reagiert.",
    how_to_use_step4: "4. Deine KI wird automatisch im Hintergrund gegen alle 255.168 Spielzustände getestet!",
    current_strategy: "Aktuelle Strategie (JS Code)",
    import_strategy: "Strategie importieren",
    toggle_ai_start: "KI beginnt",
    toggle_human_start: "Mensch beginnt",
    import_placeholder: "Füge deinen JavaScript-Code hier ein...\nBeispiel:\nif (getBoard()[4] === null) {\n  return 4;\n}",
    convert_js: "JS in Blöcke umwandeln",
    notification_draw: "Unentschieden!",
    notification_win: "{winner} gewinnt!",
    eval_complete: "Auswertung abgeschlossen! {total} Spielausgänge simuliert.",
    evaluating: "Wird ausgewertet... Bitte warten.",
    no_code: "// Noch kein Code generiert. Füge einige Blöcke hinzu!",
    select_preset: "Vorlage auswählen",

    // Blockly Categories
    cat_logic: "Logik",
    cat_loops: "Schleifen",
    cat_variables: "Variablen",
    cat_math: "Mathematik",
    cat_tictactoe: "TicTacToe",
    cat_functions: "Funktionen",

    // Blockly Blocks
    block_move: "Spiele in Zelle %1",
    block_move_tooltip: "Gib eine Zelle (0-8) an, um dein Zeichen zu setzen und das Nachdenken zu beenden.",
    block_get_cell: "Symbol in Zelle %1",
    block_get_cell_tooltip: "Gibt 'X', 'O' oder leer zurück.",
    block_is_empty: "Zelle %1 ist leer?",
    block_is_empty_tooltip: "Überprüft, ob die angegebene Zelle leer ist.",
    block_my_symbol: "Mein Symbol (O)",
    block_my_symbol_tooltip: "Gibt dein KI-Symbol ('O') zurück.",
    block_opponent_symbol: "Gegner-Symbol (X)",
    block_opponent_symbol_tooltip: "Gibt das Gegner-Symbol ('X') zurück.",
    block_null: "Leer",
    block_null_tooltip: "Stellt eine leere Zelle (null) dar.",
    block_raw_js: "JS-Code einfügen: %1",
    block_raw_js_tooltip: "Roh-JavaScript-Code injizieren.",
    block_next_row: "Nächste in Zeile von %1",
    block_next_row_tooltip: "Gibt den nächsten Zellenindex in der gleichen Zeile zurück.",
    block_next_col: "Nächste in Spalte von %1",
    block_next_col_tooltip: "Gibt den nächsten Zellenindex in der gleichen Spalte zurück.",
    block_next_diag: "Nächste in Diagonale von %1",
    block_next_diag_tooltip: "Gibt den nächsten Zellenindex in der Hauptdiagonale zurück.",
    block_next_antidiag: "Nächste in Antidiagonale von %1",
    block_next_antidiag_tooltip: "Gibt den nächsten Zellenindex in der Antidiagonale zurück.",
    block_is_mine: "Zelle %1 ist Mein Symbol (O)?",
    block_is_mine_tooltip: "Überprüft, ob die angegebene Zelle dein Symbol (O) enthält.",
    block_is_opponent: "Zelle %1 ist Gegner-Symbol (X)?",
    block_is_opponent_tooltip: "Überprüft, ob die angegebene Zelle das Gegner-Symbol (X) enthält.",

    // Blockly Dialogs
    ok: "OK",
    cancel: "Abbrechen",

    // Notifications
    notification_ai_no_move: "KI hat keinen Zug gefunden. Zug übersprungen!",
    notification_ai_invalid_move: "KI hat einen ungültigen Zug versucht (Zelle {move}). Zug übersprungen!",
    notification_ai_occupied_cell: "KI hat versucht, in eine belegte Zelle zu spielen ({moveIdx}). Zug übersprungen!",
    notification_ai_runtime_error: "KI Laufzeitfehler! Spiel beendet.",
    notification_import_success: "JavaScript erfolgreich in Blöcke umgewandelt!",
    notification_import_error: "JS konnte nicht umgewandelt werden. Prüfe die Konsole für Details.",
    notification_preset_success: "Vorlage erfolgreich geladen!",
    notification_preset_error: "Vorlage konnte nicht geladen werden. Prüfe die Konsole für Details."
  },
  en: {
    app_title: "TicTacToe AI Lab",
    app_subtitle: "Program your AI on the left, test it here.",
    ai_performance: "AI Performance",
    reset_board: "Reset Board",
    win_rate: "Win Rate",
    draw_rate: "Draw Rate",
    loss_rate: "Loss Rate",
    eval_info: "Evaluation based on all 255,168 possible game states.",
    eval_not_run: "No evaluation run yet. Your AI will be analyzed automatically as you build.",
    how_to_use_title: "How to use",
    how_to_use_step1: "1. Use the <b>Logic</b> blocks to define how your AI thinks.",
    how_to_use_step2: "2. The <b>Move</b> block tells the AI where to play.",
    how_to_use_step3: "3. Click the board to play as 'X' and see the AI ('O') react.",
    how_to_use_step4: "4. Your AI is automatically tested against all 255,168 possible game states in the background!",
    current_strategy: "Converted JS Code",
    import_strategy: "Import Code",
    toggle_ai_start: "AI Starts",
    toggle_human_start: "Human Starts",
    import_placeholder: "Paste your JavaScript code here...\nExample:\nif (getBoard()[4] === null) {\n  return 4;\n}",
    convert_js: "Convert JS to Blocks",
    notification_draw: "It's a draw!",
    notification_win: "{winner} wins!",
    eval_complete: "Evaluation complete! Simulated {total} game outcomes.",
    evaluating: "Evaluating... Please wait.",
    no_code: "// No code generated yet. Add some blocks!",
    select_preset: "Select Preset",

    // Blockly Categories
    cat_logic: "Logic",
    cat_loops: "Loops",
    cat_variables: "Variables",
    cat_math: "Math",
    cat_tictactoe: "TicTacToe",
    cat_functions: "Functions",

    // Blockly Blocks
    block_move: "Play in cell %1",
    block_move_tooltip: "Specify a cell (0-8) to place your mark and stop thinking.",
    block_get_cell: "Symbol in cell %1",
    block_get_cell_tooltip: "Returns 'X', 'O', or empty.",
    block_is_empty: "Cell %1 is empty?",
    block_is_empty_tooltip: "Checks if the specified cell is empty.",
    block_my_symbol: "My Symbol (O)",
    block_my_symbol_tooltip: "Returns your AI symbol ('O').",
    block_opponent_symbol: "Opponent Symbol (X)",
    block_opponent_symbol_tooltip: "Returns the opponent symbol ('X').",
    block_null: "Empty",
    block_null_tooltip: "Represents an empty cell (null).",
    block_raw_js: "Paste JS Code: %1",
    block_raw_js_tooltip: "Inject raw JavaScript code.",
    block_next_row: "Next in row from %1",
    block_next_row_tooltip: "Returns the next cell index in the same row.",
    block_next_col: "Next in column from %1",
    block_next_col_tooltip: "Returns the next cell index in the same column.",
    block_next_diag: "Next in diagonal from %1",
    block_next_diag_tooltip: "Returns the next cell index in the main diagonal.",
    block_next_antidiag: "Next in anti-diagonal from %1",
    block_next_antidiag_tooltip: "Returns the next cell index in the anti-diagonal.",
    block_is_mine: "Cell %1 is My Symbol (O)?",
    block_is_mine_tooltip: "Checks if the specified cell contains your symbol (O).",
    block_is_opponent: "Cell %1 is Opponent Symbol (X)?",
    block_is_opponent_tooltip: "Checks if the specified cell contains the opponent's symbol (X).",

    // General UI
    ok: "OK",
    cancel: "Cancel",

    // Notifications
    notification_ai_no_move: "AI did not find a move to make. Turn skipped!",
    notification_ai_invalid_move: "AI tried an invalid move (cell {move}). Turn skipped!",
    notification_ai_occupied_cell: "AI tried to play in an occupied cell ({moveIdx}). Turn skipped!",
    notification_ai_runtime_error: "AI Runtime Error! Game Over.",
    notification_import_success: "JavaScript converted to blocks successfully!",
    notification_import_error: "Could not convert JS. Check console for errors.",
    notification_preset_success: "Preset loaded successfully!",
    notification_preset_error: "Could not convert preset. Check console for errors."
  }
};

const STORAGE_KEY = 'tictactoe_language';
let currentLang = localStorage.getItem(STORAGE_KEY) || 'de';

export function t(key, params = {}) {
  let text = translations[currentLang][key] || translations['en'][key] || key;

  for (const [param, value] of Object.entries(params)) {
    text = text.replace(`{${param}}`, value);
  }

  return text;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

export function getLanguage() {
  return currentLang;
}
