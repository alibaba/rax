const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const isJSXClassDeclaration = require('../isJSXClassDeclaration');
const { parserOption } = require('../options');

describe('isJSXClassDeclaration', () => {

  it('#1', () => {
    const code = `
      import Rax, { Component } from 'rax';
      export default class extends Component {}
    `;
    traverse(parse(code, parserOption), {
      ClassDeclaration(path) {
        expect(isJSXClassDeclaration(path)).toBeTruthy();
      }
    });
  });

  it('#2', () => {
    const code = `
      import RaxRef from 'rax';
      export default class extends RaxRef.Component {}
    `;
    traverse(parse(code, parserOption), {
      ClassDeclaration(path) {
        expect(isJSXClassDeclaration(path)).toBeTruthy();
      }
    });
  });

  it('#3', () => {
    const code = `
      import React, { Component } from 'react';
      export default class extends Component {}
    `;
    traverse(parse(code, parserOption), {
      ClassDeclaration(path) {
        expect(isJSXClassDeclaration(path)).toBeFalsy();
      }
    });
  });
})
