import { javascriptGenerator } from 'blockly/javascript';
import { nextInRow, nextInCol, nextInDiag, nextInAntiDiag } from './gameLogic.js';
import { t } from './i18n.js';

export class AIManager {
  constructor(workspace) {
    this.workspace = workspace;
  }

  getGeneratedCode() {
    return javascriptGenerator.workspaceToCode(this.workspace);
  }

  validateMove(move, game) {
    if (move === -1 || move === undefined || move === null) {
      return { valid: false, error: t('notification_ai_no_move') };
    }
    const moveIdx = parseInt(move);
    if (moveIdx < 0 || moveIdx > 8 || isNaN(moveIdx)) {
      return { valid: false, error: t('notification_ai_invalid_move', { move }) };
    }
    if (game.board[moveIdx] !== null) {
      return { valid: false, error: t('notification_ai_occupied_cell', { moveIdx }) };
    }
    return { valid: true, error: null };
  }

  getAIMove(game) {
    const code = this.getGeneratedCode();
    const getBoard = () => game.board;

    try {
      const func = new Function(
        'getBoard',
        'aiMove',
        'nextInRow',
        'nextInCol',
        'nextInDiag',
        'nextInAntiDiag',
        `
          ${code}
          return aiMove;
        `
      );

      const move = func(getBoard, -1, nextInRow, nextInCol, nextInDiag, nextInAntiDiag);
      return move;
    } catch (e) {
      console.error("AI execution error:", e);
      throw e;
    }
  }
}
