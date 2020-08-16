import mock from '../../renderMock';

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('node: parentNode', () => {
  const node1 = document.querySelector('.bb1');
  const node2 = document.createElement('div');
  const node3 = document.createElement('span');
  const node4 = document.createTextNode('123');
  const node5 = document.createComment('comment');

  expect(node1.parentNode).toBe(document.querySelector('header'));
  expect(node1.childNodes[0].parentNode).toBe(node1);
  expect(node2.parentNode).toBe(null);
  expect(node3.parentNode).toBe(null);
  expect(node4.parentNode).toBe(null);
  expect(node5.parentNode).toBe(null);

  node2.appendChild(node3);
  node2.appendChild(node4);
  node2.appendChild(node5);
  expect(node2.parentNode).toBe(null);
  expect(node3.parentNode).toBe(node2);
  expect(node4.parentNode).toBe(node2);
  expect(node5.parentNode).toBe(node2);

  node3.appendChild(node4);
  node3.appendChild(node5);
  expect(node2.parentNode).toBe(null);
  expect(node3.parentNode).toBe(node2);
  expect(node4.parentNode).toBe(node3);
  expect(node5.parentNode).toBe(node3);
});

test('node: nodeValue', () => {
  const node1 = document.createElement('div');
  const node2 = document.createComment('comment');
  const node3 = document.createTextNode('haha');

  expect(node1.nodeValue).toBe(null);
  expect(node2.nodeValue).toBe(null);
  expect(node3.nodeValue).toBe('haha');
  node3.textContent = 'hehe';
  expect(node3.nodeValue).toBe('hehe');
  node3.nodeValue = 'hoho';
  expect(node3.nodeValue).toBe('hoho');
});

test('node: previousSibling/previousElementSibling/nextSibling/nextElementSibling', () => {
  const node1 = document.createElement('div');
  const node2 = document.createElement('div');
  const node3 = document.createTextNode('haha');
  const node4 = document.createElement('h1');
  const node5 = document.createComment('comment');
  const node6 = document.createElement('span');

  node1.appendChild(node2);
  node1.appendChild(node3);
  node1.appendChild(node4);
  node1.appendChild(node5);
  node1.appendChild(node6);

  expect(node2.previousSibling).toBe(null);
  expect(node2.previousElementSibling).toBe(null);
  expect(node2.nextSibling).toBe(node3);
  expect(node2.nextElementSibling).toBe(node4);

  expect(node3.previousSibling).toBe(node2);
  expect(node3.previousElementSibling).toBe(node2);
  expect(node3.nextSibling).toBe(node4);
  expect(node3.nextElementSibling).toBe(node4);

  expect(node4.previousSibling).toBe(node3);
  expect(node4.previousElementSibling).toBe(node2);
  expect(node4.nextSibling).toBe(node5);
  expect(node4.nextElementSibling).toBe(node6);

  expect(node5.previousSibling).toBe(node4);
  expect(node5.previousElementSibling).toBe(node4);
  expect(node5.nextSibling).toBe(node6);
  expect(node5.nextElementSibling).toBe(node6);

  expect(node6.previousSibling).toBe(node5);
  expect(node6.previousElementSibling).toBe(node4);
  expect(node6.nextSibling).toBe(null);
  expect(node6.nextElementSibling).toBe(null);
});

test('node: ownerDocument', () => {
  const node1 = document.createElement('div');
  const node2 = document.createElement('span');
  const node3 = document.createTextNode('hahaha');
  const node4 = document.createComment('comment');
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);
  expect(node4.ownerDocument).toBe(document);

  document.body.appendChild(node1);
  node2.appendChild(node3);
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);
  node2.appendChild(node4);
  expect(node4.ownerDocument).toBe(document);

  node1.appendChild(node2);
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);

  node2.removeChild(node3);
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);
  node2.removeChild(node4);
  expect(node4.ownerDocument).toBe(document);

  node1.removeChild(node2);
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);
  expect(node4.ownerDocument).toBe(document);

  document.body.removeChild(node1);
  expect(node1.ownerDocument).toBe(document);
  expect(node2.ownerDocument).toBe(document);
  expect(node3.ownerDocument).toBe(document);
  expect(node4.ownerDocument).toBe(document);
});

test('node: hasChildNodes', () => {
  const node1 = document.createElement('div');
  const node2 = document.createElement('div');
  const node3 = document.createTextNode('haha');
  const node4 = document.createElement('h1');
  const node5 = document.createComment('comment');
  const node6 = document.createElement('span');

  node1.appendChild(node2);
  node2.appendChild(node3);
  node2.appendChild(node4);
  node2.appendChild(node5);
  node4.appendChild(node6);

  expect(node1.hasChildNodes()).toBe(true);
  expect(node2.hasChildNodes()).toBe(true);
  expect(node3.hasChildNodes()).toBe(false);
  expect(node4.hasChildNodes()).toBe(true);
  expect(node5.hasChildNodes()).toBe(false);
  expect(node6.hasChildNodes()).toBe(false);
});
