import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { t } from './i18n.js';

Blockly.defineBlocksWithJsonArray([
  {
    "type": "tictactoe_move",
    "message0": t('block_move'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": t('block_move_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_get_cell",
    "message0": t('block_get_cell'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "String",
    "outputShape": 3,
    "colour": 160,
    "tooltip": t('block_get_cell_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_is_empty",
    "message0": t('block_is_empty'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": 200,
    "tooltip": t('block_is_empty_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_my_symbol",
    "message0": t('block_my_symbol'),
    "output": "String",
    "outputShape": 3,
    "colour": 65,
    "tooltip": t('block_my_symbol_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_opponent_symbol",
    "message0": t('block_opponent_symbol'),
    "output": "String",
    "outputShape": 3,
    "colour": 15,
    "tooltip": t('block_opponent_symbol_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_null",
    "message0": t('block_null'),
    "output": null,
    "outputShape": 3,
    "colour": 200,
    "tooltip": t('block_null_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "raw_js",
    "message0": t('block_raw_js'),
    "args0": [
      {
        "type": "field_input",
        "name": "CODE",
        "text": ""
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": t('block_raw_js_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_next_in_row",
    "message0": t('block_next_row'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": 160,
    "tooltip": t('block_next_row_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_next_in_col",
    "message0": t('block_next_col'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": 160,
    "tooltip": t('block_next_col_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_next_in_diag",
    "message0": t('block_next_diag'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": 160,
    "tooltip": t('block_next_diag_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_next_in_antidiag",
    "message0": t('block_next_antidiag'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": 160,
    "tooltip": t('block_next_antidiag_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_is_mine",
    "message0": t('block_is_mine'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": 65,
    "tooltip": t('block_is_mine_tooltip'),
    "helpUrl": ""
  },
  {
    "type": "tictactoe_is_opponent",
    "message0": t('block_is_opponent'),
    "args0": [
      {
        "type": "input_value",
        "name": "CELL",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": 15,
    "tooltip": t('block_is_opponent_tooltip'),
    "helpUrl": ""
  }
]);

// Custom Logic Colors for better readability when stacking/nesting
const logicColors = {
  'controls_if': 210, // Logic Blue
  'logic_compare': 280, // Purple
  'logic_operation': 190, // Cyan
  'logic_boolean': 350, // Pink/Red
  'controls_for': 120, // Loops Green
};

Object.entries(logicColors).forEach(([type, color]) => {
  if (Blockly.Blocks[type]) {
    const oldInit = Blockly.Blocks[type].init;
    Blockly.Blocks[type].init = function () {
      if (typeof oldInit === 'function') {
        oldInit.call(this);
      } else if (Blockly.Blocks[type].jsonInit) {
        // blocks w/o init function
        this.jsonInit(Blockly.Blocks[type]);
      }
      this.setColour(color);
    };
  }
});


// Generators
javascriptGenerator.forBlock['tictactoe_move'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return `return ${cell};\n`;
};

javascriptGenerator.forBlock['tictactoe_get_cell'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`getBoard()[${cell}]`, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator.forBlock['tictactoe_is_empty'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`getBoard()[${cell}] === null`, javascriptGenerator.ORDER_EQUALITY];
};

javascriptGenerator.forBlock['tictactoe_is_mine'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`getBoard()[${cell}] === 'O'`, javascriptGenerator.ORDER_EQUALITY];
};

javascriptGenerator.forBlock['tictactoe_is_opponent'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`getBoard()[${cell}] === 'X'`, javascriptGenerator.ORDER_EQUALITY];
};

javascriptGenerator.forBlock['tictactoe_my_symbol'] = function () {
  return ["'O'", javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['tictactoe_opponent_symbol'] = function () {
  return ["'X'", javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['tictactoe_null'] = function () {
  return ["null", javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator.forBlock['tictactoe_next_in_row'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`nextInRow(${cell})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator.forBlock['tictactoe_next_in_col'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`nextInCol(${cell})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator.forBlock['tictactoe_next_in_diag'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`nextInDiag(${cell})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator.forBlock['tictactoe_next_in_antidiag'] = function (block) {
  const cell = javascriptGenerator.valueToCode(block, 'CELL', javascriptGenerator.ORDER_ATOMIC) || '0';
  return [`nextInAntiDiag(${cell})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator.forBlock['raw_js'] = function (block) {
  const code = block.getFieldValue('CODE');
  return `${code}\n`;
};
