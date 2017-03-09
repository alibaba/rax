import jSXStylePlugin from '../index';
import syntaxJSX from 'babel-plugin-syntax-jsx';
import { transform } from 'babel-core';

const mergeStylesFunctionTemplate = `function _mergeStyles() {
  var newTarget = {};

  for (var index = 0; index < arguments.length; index++) {
    var target = arguments[index];

    for (var key in target) {
      newTarget[key] = Object.assign(newTarget[key] || {}, target[key]);
    }
  }

  return newTarget;
}`;

describe('jsx style plugin', () => {
  function getTransfromCode(code) {
    return transform(code, {
      plugins: [jSXStylePlugin, syntaxJSX]
    }).code;
  }

  it('transform only one className to style as member', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }
}
const _styleSheet = appStyleSheet;`);
  });

  it('transform multiple classNames to style as array', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header1 header2" />;
  }
}`)).toBe(`
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
  }
}
const _styleSheet = appStyleSheet;`);
  });

  it('combine one style and className', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={styles.header1} />;
  }
}`)).toBe(`${mergeStylesFunctionTemplate}

import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';
import styleStyleSheet from './style.css';

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1]} />;
  }
}

const _styleSheet = _mergeStyles(appStyleSheet, styleStyleSheet);`);
  });

  it('combine multiple styles and className', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';
import style from './style.css';

class App extends Component {
  render() {
    return <div className="header2" style={[styles.header1, styles.header3]} />;
  }
}`)).toBe(`${mergeStylesFunctionTemplate}

import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';
import styleStyleSheet from './style.css';

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1, styles.header3]} />;
  }
}

const _styleSheet = _mergeStyles(appStyleSheet, styleStyleSheet);`);
  });

  it('do not transfrom code when no css file', () => {
    const code = `
import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`;

    expect(getTransfromCode(code)).toBe(code);
  });
});
