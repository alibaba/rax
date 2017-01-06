import {
  transformFor,
  transformIf,
  transformPair
} from '../transformer';

describe('transformer', () => {
  it('transform for statement', () => {
    const beginOutput = transformFor([{
      name: ':for',
      value: 'item in items'
    }], true);
    const endOutput = transformFor([{
      name: ':for',
      value: 'item in items'
    }], false);
    const errorOutput = transformFor([{
      name: ':for',
      value: ' in items'
    }], false);

    expect(beginOutput).toEqual('{props.items.map((item) => {return (');
    expect(endOutput).toEqual(');})}');
    expect(errorOutput).toEqual('');
  });

  it('transform if statement', () => {
    const beginOutput = transformIf([{
      name: ':if',
      value: '{{items.length !== 0}}'
    }], true, 1);
    const endOutput = transformIf([{
      name: ':if',
      value: 'items.length !== 0'
    }], false, 1);

    expect(beginOutput).toEqual('{((props.items.length !== 0)) && ');
    expect(endOutput).toEqual('}');
  });

  it('transform pair statement', () => {
    expect(transformPair('items', 1)).toBe('(props.items)');
  });
});
