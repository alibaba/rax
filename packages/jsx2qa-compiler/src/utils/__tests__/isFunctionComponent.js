const isFunctionComponent = require('../isFunctionComponent');
const { parseCode } = require('../../parser');
const getDefaultExportedPath = require('../getDefaultExportedPath');

describe('isFunctionComponent', () => {
  it('#1', () => {
    const code = `
      import Rax from 'rax';
      export default function foo() {
        return (<view></view>);
      }
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isFunctionComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#2', () => {
    const code = `
      function foo() {
        return (<view></view>);
      }
      
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isFunctionComponent(defaultExportedPath)).toBeTruthy();
  });

  /**
   * Support React Now.
   */
  it('#3', () => {
    const code = `
      import React from 'react';
      
      const foo = () => <view></view>;
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isFunctionComponent(defaultExportedPath)).toBeTruthy();
  });
});
