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

var _styleSheet = appStyleSheet;
class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }
}`);
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

var _styleSheet = appStyleSheet;
class App extends Component {
  render() {
    return <div style={[_styleSheet["header1"], _styleSheet["header2"]]} />;
  }
}`);
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

var _styleSheet = _mergeStyles(appStyleSheet, styleStyleSheet);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1]} />;
  }
}`);
  });

  it('combine inline style object and className', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.css';

class App extends Component {
  render() {
    return <div className="header" style={{
      height: 100
    }} />;
  }
}`)).toBe(`
import { createElement, Component } from 'rax';
import appStyleSheet from './app.css';

var _styleSheet = appStyleSheet;
class App extends Component {
  render() {
    return <div style={[_styleSheet["header"], {
      height: 100
    }]} />;
  }
}`);
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

var _styleSheet = _mergeStyles(appStyleSheet, styleStyleSheet);

class App extends Component {
  render() {
    return <div style={[_styleSheet["header2"], styles.header1, styles.header3]} />;
  }
}`);
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

  it('transform scss file', () => {
    expect(getTransfromCode(`
import { createElement, Component } from 'rax';
import './app.scss';

class App extends Component {
  render() {
    return <div className="header" />;
  }
}`)).toBe(`
import { createElement, Component } from 'rax';
import appStyleSheet from './app.scss';

var _styleSheet = appStyleSheet;
class App extends Component {
  render() {
    return <div style={_styleSheet["header"]} />;
  }
}`);
  });

  it('transform constant elements in render', () => {
    expect(getTransfromCode(`
import { createElement, render } from 'rax';
import './app.css';

render(<div className="header" />);
`)).toBe(`
import { createElement, render } from 'rax';
import appStyleSheet from './app.css';

var _styleSheet = appStyleSheet;
render(<div style={_styleSheet["header"]} />);`);
  });
});
