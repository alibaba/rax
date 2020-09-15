import mock from '../../renderMock';
import ClassList from '../../src/node/class-list';

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('class-list', () => {
  const element = document.createElement('div');
  element.setAttribute('class', 'a b c');
  const classList = element.classList;

  // item
  expect(classList.item(0)).toBe('a');
  expect(classList.item(1)).toBe('b');
  expect(classList.item(2)).toBe('c');
  expect(classList.item(3)).toBe(undefined);

  // contains
  expect(classList.contains('a')).toBe(true);
  expect(classList.contains('b')).toBe(true);
  expect(classList.contains('c')).toBe(true);
  expect(classList.contains('d')).toBe(false);

  // add
  classList.add('d');
  expect(classList.item(3)).toBe('d');
  expect(classList.contains('d')).toBe(true);

  // remove
  classList.remove('b');
  expect(classList.item(1)).toBe('c');
  expect(classList.item(2)).toBe('d');
  expect(classList.item(3)).toBe(undefined);
  expect(classList.contains('b')).toBe(false);

  // toggle
  expect(classList.toggle('c')).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c')).toBe(true);
  expect(classList.contains('c')).toBe(true);

  expect(classList.toggle('c', true)).toBe(true);
  expect(classList.contains('c')).toBe(true);
  expect(classList.toggle('c', false)).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c', false)).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c', true)).toBe(true);
  expect(classList.contains('c')).toBe(true);

  // toString
  expect(classList.toString()).toBe('a d c');
});
