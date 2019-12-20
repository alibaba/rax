const mock = require('../mock');
const Node = require('../../src/node/node');

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('comment: nodeName/nodeType', () => {
  const node = document.createComment('haha e hehe');
  expect(node.nodeType).toBe(Node.COMMENT_NODE);
  expect(node.nodeName).toBe('#comment');
});

test('comment: cloneNode', () => {
  const node1 = document.createComment('abc cba');
  const node2 = node1.cloneNode();
  expect(node2).not.toBe(node1);
  expect(node2.$$nodeId).not.toBe(node1.$$nodeId);
  expect(node2.$$pageId).toBe(node1.$$pageId);
  expect(node2.nodeType).toBe(Node.COMMENT_NODE);
});
