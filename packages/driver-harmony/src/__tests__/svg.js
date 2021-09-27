import { createElement, render } from 'rax';
import * as DriverDOM from '../';

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

  it('should set transform as attribute', () => {
    render((
      <svg height="90" width="200">
        <text transform="scale(1 0.5)" test={true}>
          <tspan x="10" y="45">First line.</tspan>
        </text>
        Sorry, your browser does not support inline SVG.
      </svg>
    ), container, {
      driver: DriverDOM
    });

    let svgNode = container.children[0];
    let textNode = svgNode.children[0];

    expect(textNode.getAttribute('transform')).toEqual('scale(1 0.5)');
  });
});
