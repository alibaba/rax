const { default: traverse } = require('@babel/traverse');
const isFunctionComponent = require('../isFunctionComponent');
const { parse } = require('../../parser');

describe('isFunctionComponent', () => {
  it('#1', (done) => {
    const code = `
      import Rax from 'rax';
      export default function foo() {
        return (<view></view>);
      }
    `;
    traverse(parse(code), {
      ExportDefaultDeclaration(path) {
        const declarationPath = path.get('declaration');
        expect(isFunctionComponent(declarationPath)).toBeTruthy();
        done();
      }
    });
  });

  it('#2', (done) => {
    const code = `
      function foo() {
        return (<view></view>);
      }
      
      export default foo;
    `;
    traverse(parse(code), {
      ExportDefaultDeclaration(path) {
        const declarationPath = path.get('declaration');
        expect(isFunctionComponent(declarationPath)).toBeTruthy();
        done();
      }
    });
  });

  it('#3', (done) => {
    const code = `
      import React from 'react';
      
      const foo = () => <view></view>;
      export default foo;
    `;
    traverse(parse(code), {
      ExportDefaultDeclaration(path) {
        const declarationPath = path.get('declaration');
        expect(isFunctionComponent(declarationPath)).toBeTruthy();
        done();
      }
    });
  });
});
