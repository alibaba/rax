const mock = require('../mock');

let window;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
});

test('performance: timeOrigin', () => {
  expect(+new Date() - window.performance.timeOrigin < 3600).toBe(true);
});

test('performance: now', () => {
  expect(+new Date() - window.performance.timeOrigin - window.performance.now() < 100).toBe(true);
});
