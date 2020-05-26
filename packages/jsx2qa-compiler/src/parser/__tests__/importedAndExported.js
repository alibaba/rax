const { parseCode, getImported, getExported } = require('../index');

describe('Parse imported', () => {
  it('should parse default imported', () => {
    expect(getImported(parseCode(`
      import Hello from './Hello';
      import * as Env from 'universal-env';
      import Rax, { Component } from 'rax';
    `))).toEqual({
      './Hello': [{ default: true, namespace: false, isCustomEl: true, local: 'Hello', name: 'c-702789' }],
      'universal-env': [{ default: false, namespace: true, isCustomEl: false, local: 'Env', name: 'universal-env' }],
      rax: [
        {
          default: true,
          namespace: false,
          isCustomEl: false,
          local: 'Rax',
          name: 'rax',
        },
        {
          default: false,
          namespace: false,
          isCustomEl: false,
          importFrom: 'Component',
          local: 'Component',
          name: 'rax'
        }
      ]
    }
    );
  });
});

describe('Parse exported', () => {
  it('should parse default exported', () => {
    expect(getExported(parseCode(`
      export default class Foo extends Component {}
    `))).toEqual(['default']);
  });

  it('should parse default exported lines', () => {
    expect(getExported(parseCode(`
      class Foo extends Component {}
      export default Foo;
    `))).toEqual(['default']);
  });

  it('should parse named exported', () => {
    expect(getExported(parseCode(`
      const foo = 1;
      const bar = 2;
      export { foo, bar };
    `))).toEqual(['foo', 'bar']);
  });

  it('should parse named exported inline', () => {
    expect(getExported(parseCode(`
      export function foo1() {};
      export class foo2 {};
      export var bar1 = 1, bar2 = 2;
    `))).toEqual(['foo1', 'foo2', 'bar1', 'bar2']);
  });
});
