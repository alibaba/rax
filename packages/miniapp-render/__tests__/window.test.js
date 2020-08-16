/* eslint-disable no-proto */
import mock from '../renderMock';

let window;
let document;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
  document = res.document;
});

test('window: document', () => {
  expect(window.document).toBe(document);
});

test('window: CustomEvent', () => {
  const evt = new window.CustomEvent('click');
  expect(evt.timeStamp < 3600000).toBe(true);
  expect(evt).toBeInstanceOf(window.CustomEvent);
  expect(evt).toBeInstanceOf(window.CustomEvent);
});

test('window: self', () => {
  expect(window.self).toBe(window);
});

test('window: setTimeout/clearTimeout/setInterval/clearInterval', async() => {
  const res = [];
  let timer;

  timer = window.setTimeout(() => res.push(1), 50);
  window.setTimeout(() => res.push(2), 50);
  window.clearTimeout(timer);

  await mock.sleep(100);
  expect(res).toEqual([2]);

  timer = window.setInterval(() => res.push(3), 50);
  const timer2 = window.setInterval(() => res.push(4), 50);
  window.clearInterval(timer);

  await mock.sleep(200);
  window.clearInterval(timer2);
  expect(res.splice(0, 3)).toEqual([2, 4, 4]);
});

test('window: requestAnimationFrame/cancelAnimationFrame', async() => {
  const res = [];
  const timer = window.requestAnimationFrame(() => res.push(1));
  window.requestAnimationFrame(() => res.push(2));
  window.cancelAnimationFrame(timer);

  await mock.sleep(100);
  expect(res).toEqual([2]);
});
