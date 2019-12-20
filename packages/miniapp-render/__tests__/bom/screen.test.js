const mock = require('../mock');

let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});

test('screen: width/height', () => {
  expect(window.screen.width).toBe(200);
  expect(window.screen.height).toBe(300);
});
