import mock from '../../renderMock';
import tool from '../../src/util/tool';
import cache from '../../src/util/cache';

test('tool: toDash', () => {
  expect(tool.toDash('abcD12kKD;saS')).toBe('abc-d12k-k-d;sa-s');
  expect(tool.toDash('ABC')).toBe('-a-b-c');
});

test('tool: toCamel', () => {
  expect(tool.toCamel('abc-d12k-k-d;sa-s')).toBe('abcD12kKD;saS');
  expect(tool.toCamel('-a-b-c')).toBe('ABC');
});

test('tool: getId', () => {
  expect(tool.getId().toString()).toEqual(expect.stringMatching(/^\d{13}$/));
  expect(tool.getId().toString()).toEqual(expect.stringMatching(/^\d{13}$/));
  expect(tool.getId().toString()).toEqual(expect.stringMatching(/^\d{13}$/));
});

test('tool: getPageRoute/getPageName', () => {
  const res1 = mock.createPage('home');
  expect(tool.getPageRoute(res1.document.$$pageId)).toBe('/pages/home/index');
  expect(tool.getPageName('pages/home/index')).toBe('home');
  const res2 = mock.createPage('list');
  expect(tool.getPageRoute(res2.document.$$pageId)).toBe('/pages/list/index');
  expect(tool.getPageName('pages/list/index')).toBe('list');
  const res3 = mock.createPage('detail');
  expect(tool.getPageRoute(res3.document.$$pageId)).toBe('/pages/detail/index');
  expect(tool.getPageName('pages/detail/index')).toBe('detail');
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

test('tool: decodeContent', () => {
  expect(tool.decodeContent('asdc&nbsp;s &ensp;d &emsp; weq&lt;&gt;s sw&quot;wwee&quot;w&apos;w&amp;')).toBe('asdc\u00A0s \u2002d \u2003 weq<>s sw"wwee"w\'w&');
});

test('tool: isTagNameSupport', () => {
  expect(tool.isTagNameSupport('DIV')).toBe(true);
  expect(tool.isTagNameSupport('IFRAME')).toBe(false);
  expect(tool.isTagNameSupport('SPAN')).toBe(true);
});
