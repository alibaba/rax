const { astParser } = require('../parser/index');

function parseAst(code) {
  return astParser(code);
}

function parseAstProgram(code) {
  return parseAst(code).program;
}

function parseAstBody(code) {
  return parseAst(code).program.body[0];
}

function parseAstExpression(code) {
  return parseAst(code).program.body[0].expression;
}

module.exports = {
  parseAst,
  parseAstBody,
  parseAstExpression,
  parseAstProgram,
};
