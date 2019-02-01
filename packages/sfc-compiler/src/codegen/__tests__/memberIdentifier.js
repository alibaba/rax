import memberIdentifier from '../memberIdentifier';
import { makeMap } from '../../utils';

describe('memberIdentifier', () => {
  it('identifier', () => {
    expect(memberIdentifier('foo = foo + 1')).toEqual('this.foo = this.foo + 1;');
  });

  it('memberExpression', () => {
    expect(memberIdentifier('foo.bar = foo.bar + 1')).toEqual('this.foo.bar = this.foo.bar + 1;');

    expect(
      memberIdentifier('foo.bar = foo.bar + 1', makeMap('foo'))
    ).toEqual('foo.bar = foo.bar + 1;');
  });

  it('callExpression', () => {
    expect(
      memberIdentifier('foo($event)', makeMap('$event'), 'this')
    ).toEqual('this.foo($event);');
  });

  it('preveserd identifier', () => {
    expect(
      memberIdentifier('bar = foo($event, true)', makeMap('$event'), 'this')
    ).toEqual('this.bar = this.foo($event, true);');
  });

  it('global preversed object', () => {
    expect(
      memberIdentifier('bar = JSON.stringify({ a: 1 }, true)')
    ).toEqual('this.bar = JSON.stringify({ a: 1 }, true);');
  });

  it('literal', () => {
    expect(
      memberIdentifier('bar = JSON.stringify(1, \'string\', true)')
    ).toEqual('this.bar = JSON.stringify(1, \'string\', true);');

    expect(
      memberIdentifier('foo[5]')
    ).toEqual('this.foo[5];');

    expect(
      memberIdentifier('foo[\'hello\']')
    ).toEqual('this.foo[\'hello\'];');

    expect(
      memberIdentifier('\'str\'')
    ).toEqual('\'str\';');
  });
});
