import { TicTacToe } from './gameLogic.js';
import { initBlockly } from './blocklyConfig.js';
import { UIManager } from './uiManager.js';
import { AIManager } from './aiManager.js';
import { evaluateAI } from './evaluator.js';
import { convertJsToBlocks } from './jsToBlocks.js';
import { t } from './i18n.js';


const STORAGE_JS_KEY = 'tictactoe_js_input'; // Persistence

const workspace = initBlockly('blocklyDiv');
const ui = new UIManager();
ui.translateUI();
const ai = new AIManager(workspace);
const game = new TicTacToe();

// performance stats
let lastEvaluatedState = { code: null, startingPlayer: null };
let evaluationTimeout = null;


const evaluatorWorker = new Worker(
  new URL('./evaluator.worker.js', import.meta.url),
  { type: 'module' }
);

evaluatorWorker.onmessage = (e) => {
  const { type, results, code } = e.data;
  if (type === 'results') {
    ui.updateStats(results);
  } else if (type === 'error') {
    console.error("Worker Error:", e.data.error);
    ui.resetEvalStats();
  }
};

function triggerEvaluation() {
  const code = ai.getGeneratedCode();
  const startingPlayer = game.startingPlayer;

  // prevent reruns without state changes inbetween
  if (code === lastEvaluatedState.code && startingPlayer === lastEvaluatedState.startingPlayer) return;

  if (evaluationTimeout) clearTimeout(evaluationTimeout);

  ui.setEvalLoading();

  // avoid overwhelming the worker
  evaluationTimeout = setTimeout(() => {
    lastEvaluatedState = { code, startingPlayer };
    evaluatorWorker.postMessage({ code, startingPlayer });
  }, 500);
}

function handleAIMove() {
  if (game.winner || game.currentPlayer === 'X') return;

  try {
    const move = ai.getAIMove(game);
    const validation = ai.validateMove(move, game);

    if (validation.valid) {
      game.makeMove(move);
      ui.updateBoard(game);
    } else {
      game.invalidMoveError = validation.error;
      game.winner = 'X';
      ui.updateBoard(game);
    }
  } catch (e) {
    game.invalidMoveError = t('notification_ai_runtime_error');
    game.winner = 'X';
    ui.updateBoard(game);
  }
}

function updateCodePreview() {
  const code = ai.getGeneratedCode();
  ui.updateCodeDisplay(code);
}

// UI Event Handlers
ui.bindEvents({
  onBoardClick: (index) => {
    if (game.currentPlayer === 'X' && !game.board[index] && !game.winner) {
      game.makeMove(index);
      ui.updateBoard(game);

      if (!game.winner) {
        setTimeout(handleAIMove, 500);
      }
    }
  },

  onReset: () => {
    game.reset();
    ui.updateBoard(game);
    if (game.currentPlayer === 'O') {
      setTimeout(handleAIMove, 500);
    }
  },

  onToggleStartPlayer: (player) => {
    game.setStartingPlayer(player);
    game.reset();
    ui.updateBoard(game);
    triggerEvaluation(); // reevaluate if starting player changes despite no block changes
    if (game.currentPlayer === 'O') {
      setTimeout(handleAIMove, 500);
    }
  },


  onImportJs: (jsCode) => {
    if (!jsCode.trim()) return;

    const success = convertJsToBlocks(jsCode, workspace);
    if (success) {
      ui.showNotification(t('notification_import_success'), "success");
      triggerEvaluation();
    } else {
      ui.showNotification(t('notification_import_error'), "error");
    }
  },

  onPresetSelect: (jsCode) => {
    const success = convertJsToBlocks(jsCode, workspace);
    if (success) {
      ui.showNotification(t('notification_preset_success'), "success");
      triggerEvaluation();
    } else {
      ui.showNotification(t('notification_preset_error'), "error");
    }
  },

  onJsInputChange: (value) => {
    localStorage.setItem(STORAGE_JS_KEY, value);
  }
});



workspace.addChangeListener((event) => {
  const interestEvents = ['move', 'change', 'create', 'delete', 'var_create', 'var_rename'];
  if (interestEvents.includes(event.type)) {
    updateCodePreview();
    triggerEvaluation();
  }
});

// Load saved 
const savedJs = localStorage.getItem(STORAGE_JS_KEY);
if (savedJs) {
  ui.jsInput.value = savedJs;
}


ui.updateBoard(game);
updateCodePreview();
triggerEvaluation();
