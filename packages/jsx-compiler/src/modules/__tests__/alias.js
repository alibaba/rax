const t = require('@babel/types');
const { _transformAlias } = require('../alias');
const { parseCode } = require('../../parser');
const genExpression = require('../../codegen/genExpression');

describe('use alias to replace', () => {
  it('should replace imported module with alias', () => {
    const code = 'import { createElement } from \'react\';';
    const ast = parseCode(code);
    _transformAlias(ast, { 'react': 'rax'});
    expect(genExpression(ast)).toEqual('import { createElement } from "rax";');
  });
  it('should replace required module with alias', () => {
    const code = `
        export default function Index() {
          useEffect(() => {
              const foo = require('FOO');
              console.log(foo);
          });
        }
      `;
    const ast = parseCode(code);
    _transformAlias(ast, { 'FOO': 'BAR'});
    expect(genExpression(ast)).toEqual(`export default function Index() {
  useEffect(() => {
    const foo = require("BAR");

    console.log(foo);
  });
}`);
  });
});
