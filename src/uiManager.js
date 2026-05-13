import { t, setLanguage, getLanguage } from './i18n.js';
import { presets } from './presetLoader.js';

export class UIManager {
  constructor() {
    // Game stuff
    this.boardEl = document.getElementById('board');
    this.cells = document.querySelectorAll('.cell');

    // Control stuff
    this.resetBtn = document.getElementById('reset-game');
    this.importJsBtn = document.getElementById('import-js');
    this.presetSelect = document.getElementById('preset-select');

    // I/O stuff
    this.jsInput = document.getElementById('js-input');
    this.codeDisplay = document.getElementById('code-display');
    this.notificationEl = document.getElementById('notification');
    this.statusEl = document.getElementById('eval-status');
    this.evalPlaceholder = document.getElementById('eval-placeholder');
    this.evalResults = document.getElementById('eval-results');

    this.statsEls = {
      win: document.getElementById('stat-win'),
      draw: document.getElementById('stat-draw'),
      loss: document.getElementById('stat-loss'),
    };

    this.langBtns = document.querySelectorAll('.lang-btn');
    this.startPlayerInputs = document.querySelectorAll('input[name="start-player"]');

    // language switcher
    this.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== getLanguage()) {
          setLanguage(lang);
          window.location.reload();
        }
      });
    });

    this.notificationTimer = null;

    // filenames were discovered at build time, now load into dropdown
    Object.keys(presets).forEach(filename => {
      const option = document.createElement('option');
      option.value = filename;
      option.textContent = filename;
      this.presetSelect.appendChild(option);
    });
  }

  translateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(key));
    });

    const currentLang = getLanguage();
    this.langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  showNotification(message, type = 'info') {
    this.notificationEl.innerText = message;
    this.notificationEl.className = `show ${type}`;

    if (this.notificationTimer) clearTimeout(this.notificationTimer);
    this.notificationTimer = setTimeout(() => {
      this.notificationEl.classList.remove('show');
    }, 4000);
  }

  updateBoard(game) {
    game.board.forEach((val, i) => {
      const cell = this.cells[i];
      cell.innerText = val || '';
      cell.className = `cell ${val ? val.toLowerCase() : 'empty'}`;
    });

    if (game.winner) {
      if (game.invalidMoveError) {
        setTimeout(() => this.showNotification(game.invalidMoveError, 'error'), 50);
      } else if (game.winner === 'draw') {
        setTimeout(() => this.showNotification(t('notification_draw'), 'info'), 50);
      } else {
        const type = game.winner === 'X' ? 'success' : 'error';
        setTimeout(() => this.showNotification(t('notification_win', { winner: game.winner }), type), 50);
      }
    }
  }

  updateStats(results) {
    this.statsEls.win.innerText = `${results.winRate}%`;
    this.statsEls.draw.innerText = `${results.drawRate}%`;
    this.statsEls.loss.innerText = `${results.lossRate}%`;
    this.statusEl.innerText = t('eval_complete', { total: results.total.toLocaleString() });

    // placeholder while loading to prevent flickering
    this.evalPlaceholder.style.display = 'none';
    this.evalResults.style.display = 'block';
    this.evalResults.classList.remove('loading');
  }

  resetEvalStats() {
    this.evalPlaceholder.style.display = '';
    this.evalResults.style.display = 'none';
  }

  setEvalLoading() {
    this.statusEl.innerText = t('evaluating');
    this.evalResults.classList.add('loading');
  }

  updateCodeDisplay(code) {
    this.codeDisplay.innerText = code || t('no_code');
  }

  bindEvents(handlers) {
    if (handlers.onBoardClick) {
      this.boardEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cell')) return;
        const index = parseInt(e.target.dataset.index);
        handlers.onBoardClick(index);
      });
    }

    if (handlers.onReset) {
      this.resetBtn.addEventListener('click', handlers.onReset);
    }


    if (handlers.onImportJs) {
      this.importJsBtn.addEventListener('click', () => {
        handlers.onImportJs(this.jsInput.value);
      });
    }

    if (handlers.onJsInputChange) {
      this.jsInput.addEventListener('input', () => {
        handlers.onJsInputChange(this.jsInput.value);
      });
    }

    if (handlers.onToggleStartPlayer) {
      this.startPlayerInputs.forEach(input => {
        input.addEventListener('change', (e) => {
          handlers.onToggleStartPlayer(e.target.value);
        });
      });
    }

    if (handlers.onPresetSelect) {
      this.presetSelect.addEventListener('change', (e) => {
        const filename = e.target.value;
        if (!filename) return;
        const code = presets[filename];
        if (code) handlers.onPresetSelect(code);
        // Reset to placeholder to allow resetting to a preset without loading another one inbetween
        this.presetSelect.value = '';
      });
    }
  }
}

