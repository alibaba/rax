const mock = require('../mock');

let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});

test('navigator: userAgent', () => {
  expect(window.navigator.userAgent).toBe('Mozilla/5.0 (Windows NT 6.1; win64; x64) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile MicroMessenger/7.0.0 Language/zh');
});

test('navigator: appCodeName', () => {
  expect(window.navigator.appCodeName).toBe('Mozilla');
});

test('navigator: appName', () => {
  expect(window.navigator.appName).toBe('Netscape');
});

test('navigator: language', () => {
  expect(window.navigator.language).toBe('zh');
});

test('navigator: languages', () => {
  expect(window.navigator.languages).toEqual(['zh']);
});

test('navigator: platform', () => {
  expect(window.navigator.platform).toBe('devtools');
});

test('navigator: product', () => {
  expect(window.navigator.product).toBe('Gecko');
});
