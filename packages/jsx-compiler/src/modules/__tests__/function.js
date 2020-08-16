const t = require('@babel/types');
const { _transformFunction } = require('../function');
const { parseCode } = require('../../parser');
const genExpression = require('../../codegen/genExpression');

describe('Transform function', () => {
  it('should remove weex module', () => {
    const code = `
        export default function Index() {
          if (isWeex) {
            const dom = require('@weex-module/dom');
            console.log(dom);
          }
        }
      `;
    const ast = parseCode(code);
    _transformFunction(ast);
    expect(genExpression(ast)).toEqual(`export default function Index() {
  if (isWeex) {
    const dom = null;
    console.log(dom);
  }
}`);
  });
  it('should remove weex module in another function', () => {
    const code = `
        export default function Index() {
          useEffect(() => {
            if (isWeex) {
              const dom = require('@weex-module/dom');
              console.log(dom);
            }
          });
        }
      `;
    const ast = parseCode(code);
    _transformFunction(ast);
    expect(genExpression(ast)).toEqual(`export default function Index() {
  useEffect(() => {
    if (isWeex) {
      const dom = null;
      console.log(dom);
    }
  });
}`);
  });
});
