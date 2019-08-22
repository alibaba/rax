import { createElement, render } from 'rax';
import * as DriverDOM from '../../';

describe('Support css custome properties', () => {
  let container;
  let logs;
  const setProperty = CSSStyleDeclaration.prototype.setProperty;

  beforeAll(() => {
    CSSStyleDeclaration.prototype.setProperty = (prop, value) => {
      logs.push([prop, value]);
    };
  });

  afterAll(() => {
    CSSStyleDeclaration.prototype.setProperty = setProperty;
  });

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
    logs = [];
  });

  it('CSS custome properties works.', () => {
    render((
      <div style={{
        '--backgroundColor': 'red',
        backgroundColor: 'var(--backgroundColor)',
        width: '200px'
      }}>
        Test CSS Cutome Properties.
      </div>
    ), container, {
      driver: DriverDOM
    });

    expect(logs).toEqual([['--backgroundColor', 'red']]);
  });
});