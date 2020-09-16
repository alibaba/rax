import mock from '../../renderMock';
import Node from '../../src/node/node';

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('text-node: nodeName/nodeType', () => {
  const node = document.createTextNode('haha e hehe');
  expect(node.nodeType).toBe(Node.TEXT_NODE);
  expect(node.nodeName).toBe('#text');
});

test('text-node: nodeValue/textContent', () => {
  const node1 = document.createElement('div');
  const node2 = document.createTextNode('haha');
  document.body.appendChild(node1);

  node1.appendChild(node2);
  expect(node2.textContent).toBe('haha');
  expect(node2.nodeValue).toBe('haha');

  node2.textContent = 'hehe';
  expect(node2.textContent).toBe('hehe');
  expect(node2.nodeValue).toBe('hehe');

  node2.nodeValue = 'hoho';
  expect(node2.textContent).toBe('hoho');
  expect(node2.nodeValue).toBe('hoho');

  document.body.removeChild(node1);
});

test('text-node: cloneNode', () => {
  const node1 = document.createTextNode('abc');
  const node2 = node1.cloneNode();
  expect(node2).not.toBe(node1);
  expect(node2.__nodeId).not.toBe(node1.__nodeId);
  expect(node2.__pageId).toBe(node1.__pageId);
  expect(node2.textContent).toBe(node1.textContent);
  expect(node2.nodeType).toBe(Node.TEXT_NODE);
});
