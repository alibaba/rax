const isClassComponent = require('../isClassComponent');
const { parse } = require('../../parser');
const traverse = require('../traverseNodePath');

describe('isClassComponent', () => {
  it('#1', (done) => {
    const code = `
      import Rax, { Component } from 'rax';
      export default class extends Component {}
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        expect(isClassComponent(path.get('declaration'))).toBeTruthy();
        done();
      }
    });
  });

  it('#2', (done) => {
    const code = `
      import RaxRef from 'rax';
      export default class extends RaxRef.Component {}
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        expect(isClassComponent(path.get('declaration'))).toBeTruthy();
        done();
      }
    });
  });

  it('#3', (done) => {
    const code = `
      import React, { Component } from 'react';
      export default class extends Component {}
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        const declarationPath = path.get('declaration');
        expect(isClassComponent(declarationPath)).toBeFalsy();
        done();
      }
    });
  });

  it('#4', (done) => {
    const code = `
      import React, { Component } from 'react';
      export default class {}
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        expect(isClassComponent(path.get('declaration'))).toBeFalsy();
        done();
      }
    });
  });

  it('#5', (done) => {
    const code = `
      import Rax, { Component } from 'rax';
      const foo = class extends Component {};
      export default foo;
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        expect(isClassComponent(path.get('declaration'))).toBeTruthy();
        done();
      }
    });
  });

  it('#6', (done) => {
    const code = `
      import Rax, { Component } from 'rax';
      class foo extends Component {}
      export default foo;
    `;
    traverse(parse(code).ast, {
      ExportDefaultDeclaration(path) {
        expect(isClassComponent(path.get('declaration'))).toBeTruthy();
        done();
      }
    });
  });
});
