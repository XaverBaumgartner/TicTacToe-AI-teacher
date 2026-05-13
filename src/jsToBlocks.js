import * as acorn from 'acorn';
import * as Blockly from 'blockly';

// Schreckliches Genudel. Sorry an alle die das debuggen müssen, not proud.

export function convertJsToBlocks(jsCode, workspace) {
  try {
    const ast = acorn.parse(jsCode, {
      ecmaVersion: 2020,
      allowReturnOutsideFunction: true
    });

    // temporary XML container
    const xml = document.createElement('xml');

    let currentGroup = null;
    let lastNode = null;
    const groups = [];

    ast.body.forEach(node => {
      const block = statementToBlock(node, jsCode);
      if (!block) {
        lastNode = node;
        return;
      }

      let separate = false;
      if (lastNode) {
        const gap = jsCode.substring(lastNode.end, node.start);
        if (/\n\s*\n/.test(gap)) {
          separate = true;
        }
      }

      const isStatement = ['IfStatement', 'ReturnStatement', 'ForStatement', 'BlockStatement', 'ExpressionStatement', 'VariableDeclaration'].includes(node.type) || block.getAttribute('type') === 'raw_js';

      if (!currentGroup || separate || !isStatement) {
        currentGroup = { top: block, last: block, start: node.start, end: node.end };
        groups.push(currentGroup);
      } else {
        const next = document.createElement('next');
        next.appendChild(block);
        currentGroup.last.appendChild(next);
        currentGroup.last = block;
        currentGroup.end = node.end;
      }
      lastNode = node;
    });

    groups.forEach(group => {
      xml.appendChild(group.top);
    });

    workspace.clear();
    Blockly.Xml.domToWorkspace(xml, workspace);

    // cleanup block positions bc all blocks spawn on top each other
    workspace.cleanUp();

    return true;
  } catch (e) {
    console.error("Conversion error:", e);
    return false;
  }
}

function createRawJsBlock(node, jsCode) {
  const block = createBlock('raw_js');
  const field = document.createElement('field');
  field.setAttribute('name', 'CODE');
  field.innerText = jsCode.substring(node.start, node.end);
  block.appendChild(field);
  return block;
}

function statementToBlock(node, jsCode) {
  if (!node) return null;
  let block = nodeToBlock(node, jsCode);
  if (!block) {
    if (node.type === 'EmptyStatement' || (node.type === 'BlockStatement' && node.body.length === 0)) {
      return null;
    }
    return createRawJsBlock(node, jsCode);
  }
  return block;
}

function nodeToBlock(node, jsCode) {
  if (!node) return null;

  switch (node.type) {
    case 'IfStatement': {
      const block = createBlock('controls_if');
      const testBlock = nodeToBlock(node.test, jsCode);
      if (testBlock) {
        const value = createValue('IF0', testBlock);
        block.appendChild(value);
      } else return null;

      const consequentBlock = statementToBlock(node.consequent, jsCode);
      if (consequentBlock) {
        const statement = createStatement('DO0', consequentBlock);
        block.appendChild(statement);
      }
      return block;
    }

    case 'BlockStatement': {
      let firstBlock = null;
      let lastBlock = null;
      node.body.forEach(item => {
        const current = statementToBlock(item, jsCode);
        if (!current) return;
        if (!firstBlock) {
          firstBlock = current;
        } else {
          const next = document.createElement('next');
          next.appendChild(current);
          lastBlock.appendChild(next);
        }
        lastBlock = current;
      });
      return firstBlock;
    }

    case 'ReturnStatement': {
      const block = createBlock('tictactoe_move');
      const argBlock = nodeToBlock(node.argument, jsCode);
      if (argBlock) {
        const value = createValue('CELL', argBlock);
        block.appendChild(value);
      } else if (node.argument) {
        return null;
      } else {
        return null;
      }
      return block;
    }

    case 'LogicalExpression': {
      const block = createBlock('logic_operation');
      const opField = document.createElement('field');
      opField.setAttribute('name', 'OP');
      opField.innerText = node.operator === '&&' ? 'AND' : 'OR';
      block.appendChild(opField);

      const leftBlock = nodeToBlock(node.left, jsCode);
      const rightBlock = nodeToBlock(node.right, jsCode);

      if (!leftBlock || !rightBlock) return null;

      block.appendChild(createValue('A', leftBlock));
      block.appendChild(createValue('B', rightBlock));

      return block;
    }

    case 'BinaryExpression': {
      const compOpMap = {
        '==': 'EQ', '===': 'EQ',
        '!=': 'NEQ', '!==': 'NEQ',
        '<': 'LT', '<=': 'LTE',
        '>': 'GT', '>=': 'GTE'
      };

      if (compOpMap[node.operator]) {
        let boardAccess = null;
        let comparisonValue = null;

        if (node.left.type === 'MemberExpression' &&
          node.left.object.type === 'CallExpression' &&
          node.left.object.callee.type === 'Identifier' &&
          node.left.object.callee.name === 'getBoard') {
          boardAccess = node.left;
          comparisonValue = node.right;
        } else if (node.right.type === 'MemberExpression' &&
          node.right.object.type === 'CallExpression' &&
          node.right.object.callee.type === 'Identifier' &&
          node.right.object.callee.name === 'getBoard') {
          boardAccess = node.right;
          comparisonValue = node.left;
        }

        if (boardAccess && comparisonValue.type === 'Literal') {
          let blockType = null;
          if (comparisonValue.value === null) blockType = 'tictactoe_is_empty';
          else if (comparisonValue.value === 'O') blockType = 'tictactoe_is_mine';
          else if (comparisonValue.value === 'X') blockType = 'tictactoe_is_opponent';

          if (blockType) {
            let block = createBlock(blockType);
            const propBlock = nodeToBlock(boardAccess.property, jsCode);
            if (propBlock) {
              block.appendChild(createValue('CELL', propBlock));
            } else return null;

            if (node.operator === '!=' || node.operator === '!==') {
              const notBlock = createBlock('logic_negate');
              notBlock.appendChild(createValue('BOOL', block));
              block = notBlock;
            }
            return block;
          }
        }

        const block = createBlock('logic_compare');
        const opField = document.createElement('field');
        opField.setAttribute('name', 'OP');
        opField.innerText = compOpMap[node.operator];
        block.appendChild(opField);

        const leftBlock = nodeToBlock(node.left, jsCode);
        const rightBlock = nodeToBlock(node.right, jsCode);

        if (!leftBlock || !rightBlock) return null;

        block.appendChild(createValue('A', leftBlock));
        block.appendChild(createValue('B', rightBlock));

        return block;
      }

      const mathOpMap = {
        '+': 'ADD',
        '-': 'MINUS',
        '*': 'MULTIPLY',
        '/': 'DIVIDE',
        '**': 'POWER'
      };

      if (mathOpMap[node.operator]) {
        const block = createBlock('math_arithmetic');
        const opField = document.createElement('field');
        opField.setAttribute('name', 'OP');
        opField.innerText = mathOpMap[node.operator];
        block.appendChild(opField);

        const leftBlock = nodeToBlock(node.left, jsCode);
        const rightBlock = nodeToBlock(node.right, jsCode);

        if (!leftBlock || !rightBlock) return null;

        block.appendChild(createValue('A', leftBlock));
        block.appendChild(createValue('B', rightBlock));

        return block;
      }

      if (node.operator === '%') {
        const block = createBlock('math_modulo');
        const leftBlock = nodeToBlock(node.left, jsCode);
        const rightBlock = nodeToBlock(node.right, jsCode);

        if (!leftBlock || !rightBlock) return null;

        block.appendChild(createValue('DIVIDEND', leftBlock));
        block.appendChild(createValue('DIVISOR', rightBlock));
        return block;
      }

      return null;
    }

    case 'Literal': {
      if (typeof node.value === 'number') {
        const block = createBlock('math_number', true);
        const field = document.createElement('field');
        field.setAttribute('name', 'NUM');
        field.innerText = node.value.toString();
        block.appendChild(field);
        return block;
      }
      if (node.value === null) {
        return createBlock('tictactoe_null');
      }
      if (typeof node.value === 'string') {
        if (node.value === 'O') return createBlock('tictactoe_my_symbol');
        if (node.value === 'X') return createBlock('tictactoe_opponent_symbol');

        const block = createBlock('text');
        const field = document.createElement('field');
        field.setAttribute('name', 'TEXT');
        field.innerText = node.value;
        block.appendChild(field);
        return block;
      }
      return null;
    }

    case 'Identifier': {
      const block = createBlock('variables_get');
      const field = document.createElement('field');
      field.setAttribute('name', 'VAR');
      field.innerText = node.name;
      block.appendChild(field);
      return block;
    }

    case 'MemberExpression': {
      if (node.object.type === 'CallExpression' &&
        node.object.callee.type === 'Identifier' &&
        node.object.callee.name === 'getBoard') {
        const block = createBlock('tictactoe_get_cell');
        const propBlock = nodeToBlock(node.property, jsCode);
        if (propBlock) {
          const value = createValue('CELL', propBlock);
          block.appendChild(value);
        } else return null;
        return block;
      }
      if (node.object.type === 'Identifier' && node.object.name === 'Math' &&
        node.property.type === 'Identifier' && ['floor', 'ceil', 'round'].includes(node.property.name)) {
        const block = createBlock('math_round');
        const opField = document.createElement('field');
        opField.setAttribute('name', 'OP');
        const opMap = { 'floor': 'ROUNDDOWN', 'ceil': 'ROUNDUP', 'round': 'ROUND' };
        opField.innerText = opMap[node.property.name];
        block.appendChild(opField);
        return block;
      }
      return null;
    }

    case 'CallExpression': {
      if (node.callee.type === 'Identifier' && node.callee.name === 'getBoard') {
        return null;
      }

      if (node.callee.type === 'Identifier') {
        const helperMap = {
          'nextInRow': 'tictactoe_next_in_row',
          'nextInCol': 'tictactoe_next_in_col',
          'nextInDiag': 'tictactoe_next_in_diag',
          'nextInAntiDiag': 'tictactoe_next_in_antidiag'
        };
        const type = helperMap[node.callee.name];
        if (type) {
          const block = createBlock(type);
          const argBlock = nodeToBlock(node.arguments[0], jsCode);
          if (argBlock) {
            block.appendChild(createValue('CELL', argBlock));
          } else return null;
          return block;
        }
      }

      if (node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' && node.callee.object.name === 'Math') {
        const block = nodeToBlock(node.callee, jsCode);
        if (block && block.getAttribute('type') === 'math_round') {
          const argBlock = nodeToBlock(node.arguments[0], jsCode);
          if (argBlock) {
            block.appendChild(createValue('NUM', argBlock));
          } else return null;
          return block;
        }
      }
      return null;
    }

    case 'ForStatement': {
      const block = createBlock('controls_for');

      let varName = 'i';
      if (node.init && node.init.type === 'AssignmentExpression' && node.init.left.type === 'Identifier') {
        varName = node.init.left.name;
      } else if (node.init && node.init.type === 'VariableDeclaration') {
        const decl = node.init.declarations[0];
        if (decl && decl.id.type === 'Identifier') varName = decl.id.name;
      }

      const varField = document.createElement('field');
      varField.setAttribute('name', 'VAR');
      varField.innerText = varName;
      block.appendChild(varField);

      let fromNode = null;
      if (node.init && node.init.type === 'AssignmentExpression') fromNode = node.init.right;
      else if (node.init && node.init.type === 'VariableDeclaration') {
        if (node.init.declarations[0]) fromNode = node.init.declarations[0].init;
      }

      if (fromNode) {
        const fromBlock = nodeToBlock(fromNode, jsCode);
        if (fromBlock) block.appendChild(createValue('FROM', fromBlock));
        else return null;
      } else return null;

      if (node.test && node.test.type === 'BinaryExpression') {
        let toNode = node.test.right;
        // For i < 9, set Blockly's "to" is 8
        const toBlock = nodeToBlock(toNode, jsCode);
        if (toBlock) block.appendChild(createValue('TO', toBlock));
        else return null;
      } else return null;

      let stepValue = 1;
      if (node.update) {
        if (node.update.type === 'UpdateExpression') {
          stepValue = 1;
        } else if (node.update.type === 'AssignmentExpression' && node.update.operator === '+=') {
          if (node.update.right.type === 'Literal') stepValue = node.update.right.value;
        }
      }
      const byBlock = createBlock('math_number', true);
      const byField = document.createElement('field');
      byField.setAttribute('name', 'NUM');
      byField.innerText = stepValue.toString();
      byBlock.appendChild(byField);
      block.appendChild(createValue('BY', byBlock));

      const bodyBlock = statementToBlock(node.body, jsCode);
      if (bodyBlock) {
        block.appendChild(createStatement('DO', bodyBlock));
      }

      return block;
    }

    case 'VariableDeclaration': {
      let firstBlock = null;
      let lastBlock = null;
      let failed = false;
      node.declarations.forEach(decl => {
        if (decl.init) {
          const block = createBlock('variables_set');
          const field = document.createElement('field');
          field.setAttribute('name', 'VAR');
          field.innerText = decl.id.name;
          block.appendChild(field);

          const valBlock = nodeToBlock(decl.init, jsCode);
          if (valBlock) {
            block.appendChild(createValue('VALUE', valBlock));
          } else {
            failed = true;
          }

          if (!firstBlock) {
            firstBlock = block;
          } else {
            const next = document.createElement('next');
            next.appendChild(block);
            lastBlock.appendChild(next);
          }
          lastBlock = block;
        }
      });
      if (failed) return null;
      return firstBlock;
    }

    case 'AssignmentExpression': {
      const block = createBlock('variables_set');
      const field = document.createElement('field');
      field.setAttribute('name', 'VAR');
      field.innerText = node.left.name || 'i';
      block.appendChild(field);

      const valBlock = nodeToBlock(node.right, jsCode);
      if (valBlock) {
        block.appendChild(createValue('VALUE', valBlock));
      } else return null;

      return block;
    }

    case 'ExpressionStatement': {
      const exprBlock = nodeToBlock(node.expression, jsCode);
      if (!exprBlock) return null;
      return exprBlock;
    }

    default:
      return null;
  }
}

function createBlock(type, isShadow = false) {
  const block = document.createElement(isShadow ? 'shadow' : 'block');
  block.setAttribute('type', type);
  return block;
}

function createValue(name, innerBlock) {
  const value = document.createElement('value');
  value.setAttribute('name', name);
  if (innerBlock) value.appendChild(innerBlock);
  return value;
}

function createStatement(name, innerBlock) {
  const statement = document.createElement('statement');
  statement.setAttribute('name', name);
  if (innerBlock) statement.appendChild(innerBlock);
  return statement;
}
