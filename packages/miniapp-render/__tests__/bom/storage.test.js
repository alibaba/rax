const mock = require('../mock');
const Event = require('../../src/event/event');

let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});


test('storage', () => {
  const localStorage = window.localStorage;
  const sessionStorage = window.sessionStorage;
  let event;

  window.addEventListener('storage', evt => {
    expect(evt).toBeInstanceOf(Event);
    event = evt;
  });

  expect(localStorage.length).toBe(0);
  expect(sessionStorage.length).toBe(0);

  localStorage.setItem('a', '123');
  expect(event).toMatchObject({key: 'a', newValue: '123', oldValue: null});

  // setItem/storage event
  localStorage.setItem('a', '1');
  expect(event).toMatchObject({key: 'a', newValue: '1', oldValue: '123'});
  sessionStorage.setItem('b', '2');
  expect(event).toMatchObject({key: 'b', newValue: '2', oldValue: null});
  localStorage.setItem('c', '3');
  expect(event).toMatchObject({key: 'c', newValue: '3', oldValue: null});
  sessionStorage.setItem('d', '4');
  expect(event).toMatchObject({key: 'd', newValue: '4', oldValue: null});
  localStorage.setItem('e', '5');
  expect(event).toMatchObject({key: 'e', newValue: '5', oldValue: null});
  sessionStorage.setItem('f', '6');
  expect(event).toMatchObject({key: 'f', newValue: '6', oldValue: null});
  localStorage.setItem('g', '7');
  expect(event).toMatchObject({key: 'g', newValue: '7', oldValue: null});

  // length
  expect(localStorage.length).toBe(4);
  expect(sessionStorage.length).toBe(3);

  // key
  expect(localStorage.key(0)).toBe('a');
  expect(localStorage.key(1)).toBe('c');
  expect(localStorage.key(2)).toBe('e');
  expect(localStorage.key(3)).toBe('g');
  expect(localStorage.key(4)).toBe(null);
  expect(sessionStorage.key(0)).toBe('b');
  expect(sessionStorage.key(1)).toBe('d');
  expect(sessionStorage.key(2)).toBe('f');
  expect(sessionStorage.key(3)).toBe(null);

  // getItem
  expect(localStorage.getItem('a')).toBe('1');
  expect(localStorage.getItem('c')).toBe('3');
  expect(localStorage.getItem('e')).toBe('5');
  expect(localStorage.getItem('g')).toBe('7');
  expect(localStorage.getItem('i')).toBe(null);
  expect(sessionStorage.getItem('b')).toBe('2');
  expect(sessionStorage.getItem('d')).toBe('4');
  expect(sessionStorage.getItem('f')).toBe('6');
  expect(sessionStorage.getItem('h')).toBe(null);

  // removeItem
  localStorage.removeItem('c');
  expect(event).toMatchObject({key: 'c', newValue: null, oldValue: '3'});
  sessionStorage.removeItem('d');
  expect(event).toMatchObject({key: 'd', newValue: null, oldValue: '4'});

  expect(localStorage.length).toBe(3);
  expect(sessionStorage.length).toBe(2);

  expect(localStorage.key(0)).toBe('a');
  expect(localStorage.key(1)).toBe('e');
  expect(localStorage.key(2)).toBe('g');
  expect(localStorage.key(3)).toBe(null);
  expect(localStorage.key(4)).toBe(null);
  expect(sessionStorage.key(0)).toBe('b');
  expect(sessionStorage.key(1)).toBe('f');
  expect(sessionStorage.key(2)).toBe(null);
  expect(sessionStorage.key(3)).toBe(null);

  expect(localStorage.getItem('a')).toBe('1');
  expect(localStorage.getItem('c')).toBe(null);
  expect(localStorage.getItem('e')).toBe('5');
  expect(localStorage.getItem('g')).toBe('7');
  expect(localStorage.getItem('i')).toBe(null);
  expect(sessionStorage.getItem('b')).toBe('2');
  expect(sessionStorage.getItem('d')).toBe(null);
  expect(sessionStorage.getItem('f')).toBe('6');
  expect(sessionStorage.getItem('h')).toBe(null);

  // clear
  localStorage.clear();
  expect(event).toMatchObject({key: null, newValue: null, oldValue: null});
  sessionStorage.clear();
  expect(event).toMatchObject({key: null, newValue: null, oldValue: null});

  expect(localStorage.length).toBe(0);
  expect(sessionStorage.length).toBe(0);

  expect(localStorage.key(0)).toBe(null);
  expect(localStorage.key(1)).toBe(null);
  expect(localStorage.key(2)).toBe(null);
  expect(localStorage.key(3)).toBe(null);
  expect(localStorage.key(4)).toBe(null);
  expect(sessionStorage.key(0)).toBe(null);
  expect(sessionStorage.key(1)).toBe(null);
  expect(sessionStorage.key(2)).toBe(null);
  expect(sessionStorage.key(3)).toBe(null);

  expect(localStorage.getItem('a')).toBe(null);
  expect(localStorage.getItem('c')).toBe(null);
  expect(localStorage.getItem('e')).toBe(null);
  expect(localStorage.getItem('g')).toBe(null);
  expect(localStorage.getItem('i')).toBe(null);
  expect(sessionStorage.getItem('b')).toBe(null);
  expect(sessionStorage.getItem('d')).toBe(null);
  expect(sessionStorage.getItem('f')).toBe(null);
  expect(sessionStorage.getItem('h')).toBe(null);
});
