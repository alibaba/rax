const CodeError = require('../CodeError');

describe('Code Error', () => {
  it('should throw error', () => {
    expect(() => {
      throw new CodeError(`class Foo {
  constructor() {
    console.log("hello");
  }
}`, null, { start: { line: 2, column: 16 } }, 'hello');
    }).toThrowErrorMatchingSnapshot();
  });
});
