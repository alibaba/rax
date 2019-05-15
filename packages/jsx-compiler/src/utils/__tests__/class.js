const isClassComponent = require('../isClassComponent');
const getDefaultExportedPath = require('../getDefaultExportedPath');
const { astParser } = require('../../parser');

describe('isClassComponent', () => {
  it('#1', () => {
    const code = `
      import Rax, { Component } from 'rax';
      export default class extends Component {}
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#2', () => {
    const code = `
      import RaxRef from 'rax';
      export default class extends RaxRef.Component {}
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#3', () => {
    const code = `
      import React, { Component } from 'react';
      export default class extends Component {}
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeFalsy();
  });

  it('#4', () => {
    const code = `
      import React, { Component } from 'react';
      export default class {}
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeFalsy();
  });

  it('#5', () => {
    const code = `
      import Rax, { Component } from 'rax';
      const foo = class extends Component {};
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#6', () => {
    const code = `
      import Rax, { Component } from 'rax';
      class foo extends Component {}
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(astParser(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });
});
