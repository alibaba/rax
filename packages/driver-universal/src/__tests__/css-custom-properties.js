import { createElement, render } from 'rax';
import DriverDOM from '../';

describe('Support CSS custom properties', () => {
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

  it('CSS custom properties works.', () => {
    render((
      <div style={{
        '--backgroundColor': 'red',
        backgroundColor: 'var(--backgroundColor)',
      }}>
        Test CSS custom properties.
      </div>
    ), container, {
      driver: DriverDOM
    });

    expect(logs).toEqual([['--backgroundColor', 'red']]);
  });
});