import { createElement, render } from 'rax';
import * as DriverDOM from '../../';

describe('svg', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should create SVG with SVG namespace URI', () => {
    render((
      <svg height="90" width="200">
        <text x="10" y="20" style={{ fill: 'red' }}>
          <tspan x="10" y="45">First line.</tspan>
          <tspan x="10" y="70">Second line.</tspan>
        </text>
        Sorry, your browser does not support inline SVG.
      </svg>
    ), container, {
        driver: DriverDOM
      });
    let svgNode = container.children[0];
    expect(svgNode.namespaceURI).toEqual('http://www.w3.org/2000/svg');

    let textNode = svgNode.children[0];
    expect(textNode.namespaceURI).toEqual('http://www.w3.org/2000/svg');

    let tspanNode = textNode.children[0];
    expect(tspanNode.namespaceURI).toEqual('http://www.w3.org/2000/svg');
  });
});

describe('Support css custome properties', () => {
  let container;
  let logs;
  const setProperty = CSSStyleDeclaration.prototype.setProperty;

  beforeAll(() => {
    CSSStyleDeclaration.prototype.setProperty = (prop, value) => {
      logs.push([prop, value]);
    };
  })

  afterAll(() => {
    CSSStyleDeclaration.prototype.setProperty = setProperty;
  })

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
    logs = [];
  });

  it('Css custome properties works.', () => {
    render((
      <div style={{
        '--backgroundColor': 'red',
        backgroundColor: 'var(--backgroundColor)',
        width: '200px'
      }}>
        test css cutome properties
      </div>
    ), container, {
        driver: DriverDOM
      });

    expect(logs).toEqual([["--backgroundColor", "red"]]);
  });
});