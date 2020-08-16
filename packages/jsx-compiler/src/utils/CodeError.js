const { codeFrameColumns } = require('@babel/code-frame');
const { default: generate } = require('@babel/generator');

function createErrorMessage(sourceCode, node, loc, extraMessage) {
  const rawLines = sourceCode ? sourceCode : generate(node).code;
  try {
    return codeFrameColumns(rawLines, loc, { highlightCode: true, message: extraMessage });
  } catch (err) {
    return 'Failed to locate source code position.';
  }
}

class CodeError extends Error {
  constructor(sourceCode, node, loc, message) {
    super('\n' + createErrorMessage(sourceCode, node, loc, message));
    this.node = node;
  }
}

module.exports = CodeError;
