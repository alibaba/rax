const path = require('path');
const render = require('miniapp-render/dist/wechat');
const simulate = require('miniprogram-simulate');

/**
 * 构建页面
 */
const pageConfig = {
  origin: 'https://test.miniprogram.com',
  entry: '/',
  router: {
    home: [
      {regexp: '^(?:\\/home)?(?:\\/)?$', options: 'i'},
      {regexp: '^\\/index\\/(aaa|bbb)(?:\\/)?$', options: 'i'}
    ],
    list: [
      {regexp: '^\\/index\\/aaa\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
      {regexp: '^\\/index\\/bbb\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
    ],
    detail: [
      {regexp: '^\\/index\\/aaa\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
      {regexp: '^\\/index\\/bbb\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
    ],
  },
  runtime: {
    subpackagesMap: {},
  },
  pages: {
    home: {
      loadingText: '拼命加载页面中...',
      share: true,
      windowScroll: false,
      backgroundColor: '#F7F7F7',
      reachBottom: true,
      reachBottomDistance: 200,
      pullDownRefresh: true
    },
    list: {
      loadingText: '拼命加载页面中...',
      share: true,
      windowScroll: false,
      backgroundColor: '#F7F7F7'
    },
    detail: {
      loadingText: '拼命加载页面中...',
      share: true,
      windowScroll: false,
      backgroundColor: '#F7F7F7'
    },
  },
  redirect: {
    notFound: 'home',
    accessDenied: 'home'
  },
  optimization: {
    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,
    styleValueReduce: 1000,
    attrValueReduce: 1000,
  }
};
function createPage(type = 'home', realUrl) {
  const route = `pages/${type}/index`;
  global.$$page = render.createPage(route, pageConfig);
  realUrl = realUrl || (type === 'home' ? '/' : type === 'list' ? '/index/aaa/list/123' : 'index/aaa/detail/123');
  global.$$page.window.$$miniprogram.init(realUrl);
}
createPage('home');

/**
 * 重写 load 方法
 */
const srcPath = path.resolve(__dirname, '../src');
const oldLoad = simulate.load;
simulate.load = function(componentPath, ...args) {
  if (typeof componentPath === 'string') componentPath = path.join(srcPath, componentPath);
  return oldLoad(componentPath, ...args);
};

/**
 * 获取单行 html 代码
 */
simulate.getSimpleHTML = function(html) {
  return html.trim().replace(/(?:(>)[\n\r\s\t]+)|(?:[\n\r\s\t]+(<))/g, '$1$2').replace(/[\n\r\t]+/g, '');
};

/**
 * 输出日志
 */
function err(msg) {
  const error = new Error(msg);
  console.error(error.stack);
}

/**
 * 检查布尔值
 */
simulate.checkBoolean = async function(component, node, attrName, attributeName, defaultValue) {
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, !defaultValue);
  await simulate.sleep(10);
  if (component.data[attrName] === defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(!defaultValue);

  node.setAttribute(attributeName, defaultValue);
  await simulate.sleep(10);
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, attributeName);
  await simulate.sleep(10);
  if (!component.data[attrName]) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(true);

  node.setAttribute(attributeName, '');
  await simulate.sleep(10);
  if (component.data[attrName]) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(false);
};

/**
 * 检查数字
 */
simulate.checkNumber = async function(component, node, attrName, attributeName, defaultValue) {
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, 20);
  await simulate.sleep(10);
  if (component.data[attrName] !== 20) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(20);

  node.setAttribute(attributeName, 0);
  await simulate.sleep(10);
  if (component.data[attrName] !== 0) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(0);

  node.setAttribute(attributeName, '123');
  await simulate.sleep(10);
  if (component.data[attrName] !== 123) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(123);

  node.setAttribute(attributeName, '');
  await simulate.sleep(10);
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, 'abc');
  await simulate.sleep(10);
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);
};

/**
 * 检查字符串
 */
simulate.checkString = async function(component, node, attrName, attributeName, defaultValue) {
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, '12345');
  await simulate.sleep(10);
  if (component.data[attrName] !== '12345') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('12345');

  node.setAttribute(attributeName, '54321');
  await simulate.sleep(10);
  if (component.data[attrName] !== '54321') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('54321');

  node.setAttribute(attributeName, '');
  await simulate.sleep(10);
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);
};

/**
 * 检查 url
 */
simulate.checkUrl = async function(component, node, attrName, attributeName, defaultValue) {
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);

  node.setAttribute(attributeName, '12345');
  await simulate.sleep(10);
  if (component.data[attrName] !== '12345') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('12345');

  node.setAttribute(attributeName, '//54321');
  await simulate.sleep(10);
  if (component.data[attrName] !== 'https://54321') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('https://54321');

  node.setAttribute(attributeName, 'http://11111');
  await simulate.sleep(10);
  if (component.data[attrName] !== 'http://11111') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('http://11111');

  node.setAttribute(attributeName, 'https://22222');
  await simulate.sleep(10);
  if (component.data[attrName] !== 'https://22222') err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe('https://22222');

  node.setAttribute(attributeName, '');
  await simulate.sleep(10);
  if (component.data[attrName] !== defaultValue) err(`${node.tagName}.${attrName}`);
  expect(component.data[attrName]).toBe(defaultValue);
};

/**
 * 检查数组
 */
simulate.checkArray = async function(component, node, attrName, attributeName, defaultValue, testData) {
  expect(component.data[attrName]).toEqual(defaultValue);

  node.setAttribute(attributeName, testData);
  await simulate.sleep(10);
  expect(component.data[attrName]).toEqual(testData);

  node.setAttribute(attributeName, []);
  await simulate.sleep(10);
  expect(component.data[attrName]).toEqual([]);

  node.setAttribute(attributeName, undefined);
  await simulate.sleep(10);
  expect(component.data[attrName]).toEqual(defaultValue);
};

/**
 * 检查事件
 */
simulate.checkEvent = async function(component, node, eventNameList) {
  const evtList = [];
  eventNameList.forEach(eventName => node.addEventListener(eventName, evt => evtList.push(evt)));
  for (const eventName of eventNameList) {
    component.dispatchEvent(eventName);
    await simulate.sleep(10);
  }
  expect(evtList.map(evt => evt.type)).toEqual(eventNameList);
};

simulate.elementId = simulate.load('index', 'element');

module.exports = simulate;
