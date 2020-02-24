const isClassComponent = require('../isClassComponent');
const getDefaultExportedPath = require('../getDefaultExportedPath');
const { parseCode } = require('../../parser');

describe('isClassComponent', () => {
  it('#1', () => {
    const code = `
      import { createElement, Component } from 'rax';
      import View from 'rax-view';
      import './index.css';

      export default class extends Component {
        render() {
          return (
            <View className="header">
              {this.props.children}
            </View>
          );
        }
      }
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#2', () => {
    const code = `
      import RaxRef from 'rax';
      export default class extends RaxRef.Component {}
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#3', () => {
    const code = `
      import React, { Component } from 'react';
      export default class extends Component {}
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#4', () => {
    const code = `
      import React, { Component } from 'react';
      export default class {}
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeFalsy();
  });

  it('#5', () => {
    const code = `
      import Rax, { Component } from 'rax';
      const foo = class extends Component {};
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });

  it('#6', () => {
    const code = `
      import Rax, { Component } from 'rax';
      class foo extends Component {}
      export default foo;
    `;

    const defaultExportedPath = getDefaultExportedPath(parseCode(code));
    expect(isClassComponent(defaultExportedPath)).toBeTruthy();
  });
});
