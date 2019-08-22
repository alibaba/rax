import { createElement, render } from 'rax';
import * as DriverDOM from '../../';

describe('Support CSS Custom Properties', () => {
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

  it('CSS Custom Properties works.', () => {
    render((
      <div style={{
        '--backgroundColor': 'red',
        backgroundColor: 'var(--backgroundColor)',
        width: '200px'
      }}>
        Test CSS Custom Properties.
      </div>
    ), container, {
      driver: DriverDOM
    });

    expect(logs).toEqual([['--backgroundColor', 'red']]);
  });
});