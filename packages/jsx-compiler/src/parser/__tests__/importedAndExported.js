const { parseCode, getImported, getExported } = require('../index');

describe('Parse imported', () => {
  it('should parse default imported', () => {
    expect(getImported(parseCode(`
      import Hello from './Hello';
      import Rax, { Component } from 'rax';
    `))).toEqual({
      './Hello': [{ default: true, external: false, local: 'Hello', name: 'c-702789' }],
      rax: [
        {
          default: true,
          external: true,
          local: 'Rax',
          name: 'rax',
        },
        {
          default: false,
          external: true,
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
      export const foo = 1;
      export const bar = 2;
    `))).toEqual(['foo', 'bar']);
  });
});
