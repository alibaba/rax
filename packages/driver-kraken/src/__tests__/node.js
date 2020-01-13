import Node from '../Node';

describe('Node', function() {
  it('should works with stringify', () => {
    const node = new Node('div', { foo: 'bar' });
    node.id = -1;

    expect(JSON.stringify(node)).toEqual(JSON.stringify({
      'type': 'DIV',
      'id': -1,
      'props': { 'foo': 'bar' },
    }));
  });
});
