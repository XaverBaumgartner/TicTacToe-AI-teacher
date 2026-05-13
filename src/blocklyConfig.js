import * as Blockly from 'blockly';
import DarkTheme from '@blockly/theme-dark';
import * as De from 'blockly/msg/de';
import * as En from 'blockly/msg/en';
import './blocks.js';
import { t, getLanguage } from './i18n.js';

const currentLang = getLanguage();
if (currentLang === 'de') {
  Blockly.setLocale(De);
} else {
  Blockly.setLocale(En);
}

// Fix weird bug where all INPUT_VALUE connections on a block get the shape of the outputShape
if (Blockly.zelos && Blockly.zelos.ConstantProvider) {
  const oldShapeFor = Blockly.zelos.ConstantProvider.prototype.shapeFor;
  Blockly.zelos.ConstantProvider.prototype.shapeFor = function (connection) {
    if (connection.type === Blockly.INPUT_VALUE) {
      let check = connection.getCheck();
      if (!check && connection.targetConnection) {
        check = connection.targetConnection.getCheck();
      }
      if (check) {
        if (check.includes('Number')) return this.ROUNDED;
        if (check.includes('String')) return this.SQUARED;
        if (check.includes('Boolean')) return this.HEXAGONAL;
      }
    }
    return oldShapeFor.call(this, connection);
  };
}

// custom notifications because alert() does not work for some reason, just immediately disappearing after being triggered
Blockly.dialog.setPrompt(function (message, defaultValue, callback) {
  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'background: #1e1e24; color: white; border: 1px solid var(--glass-border); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 10000;';

  const msgLabel = document.createElement('label');
  msgLabel.textContent = message;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = defaultValue || '';
  input.style.cssText = 'background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); color: white; padding: 0.5rem; border-radius: 4px; outline: none; font-family: inherit; width: 300px;';

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = t('cancel') || 'Cancel';
  cancelBtn.style.cssText = 'background: transparent; border: 1px solid var(--glass-border); color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; transition: background 0.2s;';
  cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255,255,255,0.1)';
  cancelBtn.onmouseout = () => cancelBtn.style.background = 'transparent';

  const okBtn = document.createElement('button');
  okBtn.textContent = t('ok') || 'OK';
  okBtn.style.cssText = 'background: var(--accent-primary, #3b82f6); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;';

  btnContainer.appendChild(cancelBtn);
  btnContainer.appendChild(okBtn);

  dialog.appendChild(msgLabel);
  dialog.appendChild(input);
  dialog.appendChild(btnContainer);

  document.body.appendChild(dialog);
  dialog.showModal();
  input.focus();
  input.select();

  const closeAndReturn = (val) => {
    dialog.close();
    dialog.remove();
    callback(val);
  };

  cancelBtn.onclick = () => closeAndReturn(null);
  okBtn.onclick = () => closeAndReturn(input.value);
  input.onkeydown = (e) => {
    if (e.key === 'Enter') closeAndReturn(input.value);
    if (e.key === 'Escape') closeAndReturn(null);
  };
});

Blockly.dialog.setAlert(function (message, callback) {
  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'background: #1e1e24; color: white; border: 1px solid var(--glass-border); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 10000; max-width: 400px;';

  const msgLabel = document.createElement('div');
  msgLabel.textContent = message;

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 0.5rem;';

  const okBtn = document.createElement('button');
  okBtn.textContent = t('ok') || 'OK';
  okBtn.style.cssText = 'background: var(--accent-primary, #3b82f6); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;';

  btnContainer.appendChild(okBtn);
  dialog.appendChild(msgLabel);
  dialog.appendChild(btnContainer);

  document.body.appendChild(dialog);
  dialog.showModal();
  okBtn.focus();

  const closeAndReturn = () => {
    dialog.close();
    dialog.remove();
    callback();
  };

  okBtn.onclick = closeAndReturn;
});

Blockly.dialog.setConfirm(function (message, callback) {
  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'background: #1e1e24; color: white; border: 1px solid var(--glass-border); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 10000; max-width: 400px;';

  const msgLabel = document.createElement('div');
  msgLabel.textContent = message;

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = t('cancel') || 'Cancel';
  cancelBtn.style.cssText = 'background: transparent; border: 1px solid var(--glass-border); color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; transition: background 0.2s;';
  cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255,255,255,0.1)';
  cancelBtn.onmouseout = () => cancelBtn.style.background = 'transparent';

  const okBtn = document.createElement('button');
  okBtn.textContent = t('ok') || 'OK';
  okBtn.style.cssText = 'background: var(--accent-primary, #3b82f6); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;';

  btnContainer.appendChild(cancelBtn);
  btnContainer.appendChild(okBtn);

  dialog.appendChild(msgLabel);
  dialog.appendChild(btnContainer);

  document.body.appendChild(dialog);
  dialog.showModal();
  cancelBtn.focus();

  const closeAndReturn = (val) => {
    dialog.close();
    dialog.remove();
    callback(val);
  };

  cancelBtn.onclick = () => closeAndReturn(false);
  okBtn.onclick = () => closeAndReturn(true);
});

const STORAGE_KEY = 'tictactoe_ai_workspace';

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: t('cat_logic'),
      colour: '210',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {
            FROM: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
            BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
          }
        },
      ],
    },
    {
      kind: 'category',
      name: t('cat_variables'),
      colour: '330',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: t('cat_math'),
      colour: '230',
      contents: [
        { kind: 'block', type: 'math_number', fields: { NUM: 0 } },
        {
          kind: 'block',
          type: 'math_arithmetic',
          inputs: {
            A: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            B: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_single',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_round',
          inputs: {
            NUM: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_modulo',
          inputs: {
            DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
          }
        },
      ],
    },
    {
      kind: 'category',
      name: t('cat_tictactoe'),
      colour: '160',
      contents: [
        { kind: 'block', type: 'tictactoe_move', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_get_cell', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_is_empty', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_is_mine', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_is_opponent', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_null' },
        { kind: 'block', type: 'tictactoe_my_symbol' },
        { kind: 'block', type: 'tictactoe_opponent_symbol' },
        { kind: 'block', type: 'tictactoe_next_in_row', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_next_in_col', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_next_in_diag', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'tictactoe_next_in_antidiag', inputs: { CELL: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
      ],
    },
    {
      kind: 'category',
      name: t('cat_functions'),
      colour: '290',
      custom: 'PROCEDURE_CUSTOM'
    },
  ],
};


function saveWorkspace(workspace) {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const text = Blockly.Xml.domToText(xml);
  localStorage.setItem(STORAGE_KEY, text);
}

function loadWorkspace(workspace) {
  const text = localStorage.getItem(STORAGE_KEY);
  if (text) {
    try {
      const xml = Blockly.utils.xml.textToDom(text);
      Blockly.Xml.domToWorkspace(xml, workspace);
      return true;
    } catch (e) {
      console.error('Failed to load workspace from localStorage:', e);
      return false;
    }
  }
  return false;
}

export function initBlockly(containerId) {
  const workspace = Blockly.inject(containerId, {
    toolbox,
    theme: DarkTheme,
    renderer: 'zelos',
    scrollbars: true,
    trashcan: true,
    sounds: false,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  });

  // Allow raw JS block
  workspace.registerToolboxCategoryCallback('PROCEDURE_CUSTOM', (workspace) => {
    const items = [];

    items.push({
      kind: 'block',
      type: 'raw_js'
    });

    items.push({
      kind: 'sep',
      gap: '24'
    });

    // Add standard blocks
    const procedureBlocks = Blockly.Procedures.flyoutCategory(workspace);
    return items.concat(procedureBlocks);
  });

  const loaded = loadWorkspace(workspace);

  // Default blocks upom first page load
  if (!loaded) {
    const defaultXml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="controls_if" x="50" y="50">
          <value name="IF0">
            <block type="tictactoe_is_empty">
              <value name="CELL">
                <block type="math_number">
                  <field name="NUM">4</field>
                </block>
              </value>
            </block>
          </value>
          <statement name="DO0">
            <block type="tictactoe_move">
              <value name="CELL">
                <block type="math_number">
                  <field name="NUM">4</field>
                </block>
              </value>
            </block>
          </statement>
        </block>
      </xml>
    `;
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(defaultXml), workspace);
  }

  workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;
    saveWorkspace(workspace);
  });

  return workspace;
}
