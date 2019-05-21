const { parseCode } = require('../parser/index');

function parseProgram(code) {
  return parseCode(code).program;
}

function parseBody(code) {
  return parseCode(code).program.body[0];
}

function parseExpression(code) {
  return parseCode(code).program.body[0].expression;
}

module.exports = {
  parseBody,
  parseExpression,
  parseProgram,
};
