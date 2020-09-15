import mock from '../../renderMock';
import tool from '../../src/utils/tool';

test('tool: toDash', () => {
  expect(tool.toDash('abcD12kKD;saS')).toBe('abc-d12k-k-d;sa-s');
  expect(tool.toDash('ABC')).toBe('-a-b-c');
});

test('tool: toCamel', () => {
  expect(tool.toCamel('abc-d12k-k-d;sa-s')).toBe('abcD12kKD;saS');
  expect(tool.toCamel('-a-b-c')).toBe('ABC');
});

test('tool: getId', () => {
  expect(tool.getId().toString()).toEqual('0');
  expect(tool.getId().toString()).toEqual('1');
  expect(tool.getId().toString()).toEqual('2');
});

test('tool: throttle/flushThrottleCache', async() => {
  let count = 0;
  const func = tool.throttle(() => count++);
  func();
  func();
  func();
  await mock.sleep(10);
  expect(count).toBe(1);
  func();
  func();
  expect(count).toBe(1);
  tool.flushThrottleCache();
  expect(count).toBe(2);
  await mock.sleep(10);
  expect(count).toBe(2);
});
