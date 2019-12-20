const mock = require('../mock');

let document;

beforeAll(() => {
  const res = mock.createPage('home');
  document = res.document;
});

test('class-list', () => {
  let updateCount = 0;
  const element = document.createElement('div');
  element.addEventListener('$$domNodeUpdate', () => {
    updateCount++;
  });
  const classList = element.classList;
  classList.$$parse('a b c');

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
  expect(updateCount).toBe(1);

  // add
  classList.add('d');
  expect(classList.item(3)).toBe('d');
  expect(classList.contains('d')).toBe(true);
  expect(updateCount).toBe(2);

  // remove
  classList.remove('b');
  expect(classList.item(1)).toBe('c');
  expect(classList.item(2)).toBe('d');
  expect(classList.item(3)).toBe(undefined);
  expect(classList.contains('b')).toBe(false);
  expect(updateCount).toBe(3);

  // toggle
  expect(classList.toggle('c')).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c')).toBe(true);
  expect(classList.contains('c')).toBe(true);
  expect(updateCount).toBe(5);

  expect(classList.toggle('c', true)).toBe(true);
  expect(classList.contains('c')).toBe(true);
  expect(classList.toggle('c', false)).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c', false)).toBe(false);
  expect(classList.contains('c')).toBe(false);
  expect(classList.toggle('c', true)).toBe(true);
  expect(classList.contains('c')).toBe(true);
  expect(updateCount).toBe(7);

  // toString
  expect(classList.toString()).toBe('a d c');

  classList.$$parse('c   b   a dd');
  expect(classList.toString()).toBe('c b a dd');
  expect(updateCount).toBe(8);
});
