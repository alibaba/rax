/* eslint-disable no-proto */
import mock from './mock';

let window;
let document;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
  document = res.document;
});

test('window: $$getPrototype/$$extend/$$addAspect', () => {
  // window.location
  window.$$extend('window.location', {
    testStr: 'window.location',
    testFunc() {
      return this;
    },
  });
  expect(window.location.testFunc()).toMatchObject(window.location);
  expect(window.location.testStr).toBe('window.location');

  // window.event
  const evt = new window.CustomEvent('test');
  window.$$extend('window.event', {
    testStr: 'window.event',
    testFunc() {
      return this;
    },
  });
  expect(evt.testFunc()).toMatchObject(evt);
  expect(evt.testStr).toBe('window.event');

  // window
  expect(window.$$getPrototype('window')).toMatchObject(window.__proto__);
  window.$$extend('window', {
    testStr: 'window',
    testFunc() {
      return this;
    },
  });
  expect(window.testFunc()).toMatchObject(window);
  expect(window.testStr).toBe('window');

  // document
  expect(window.$$getPrototype('document')).toMatchObject(document.__proto__);
  window.$$extend('document', {
    testStr: 'document',
    testFunc() {
      return this;
    },
  });
  // expect(document.testFunc()).toMatchObject(document);
  expect(document.testStr).toBe('document');

  const element = document.createElement('div');

  // element.attribute
  expect(window.$$getPrototype('element.attribute')).toMatchObject(element.$_attrs.__proto__);
  window.$$extend('element.attribute', {
    testStr: 'element.attribute',
    testFunc() {
      return this;
    },
  });
  // expect(element.$_attrs.testFunc()).toMatchObject(element.$_attrs);
  expect(element.$_attrs.testStr).toBe('element.attribute');

  // element.classList
  expect(window.$$getPrototype('element.classList')).toMatchObject(element.classList.__proto__);
  window.$$extend('element.classList', {
    testStr: 'element.classList',
    testFunc() {
      return this;
    },
  });
  expect(element.classList.testFunc()).toMatchObject(element.classList);
  expect(element.classList.testStr).toBe('element.classList');

  // element.style
  expect(window.$$getPrototype('element.style')).toMatchObject(element.style.__proto__);
  window.$$extend('element.style', {
    testStr: 'element.style',
    testFunc() {
      return this;
    },
  });
  expect(element.style.testFunc()).toMatchObject(element.style);
  expect(element.style.testStr).toBe('element.style');

  // element
  expect(window.$$getPrototype('element')).toMatchObject(element.__proto__);
  window.$$extend('element', {
    testStr: 'element',
    testFunc() {
      return this;
    },
  });
  // expect(element.testFunc()).toMatchObject(element);
  expect(element.testStr).toBe('element');

  // textNode
  const textNode = document.createTextNode('text');
  expect(window.$$getPrototype('textNode')).toMatchObject(textNode.__proto__);
  window.$$extend('textNode', {
    testStr: 'textNode',
    testFunc() {
      return this;
    },
  });
  // expect(textNode.testFunc()).toMatchObject(textNode);
  expect(textNode.testStr).toBe('textNode');

  // comment
  const comment = document.createComment('comment');
  expect(window.$$getPrototype('comment')).toMatchObject(comment.__proto__);
  window.$$extend('comment', {
    testStr: 'comment',
    testFunc() {
      return this;
    },
  });
  // expect(comment.testFunc()).toMatchObject(comment);
  expect(comment.testStr).toBe('comment');

  // normal aspect
  const expectArg1 = 123;
  const expectArg2 = {a: 'abc'};
  const beforeAspect = function(arg1, arg2) {
    expect(arg1).toBe(expectArg1);
    expect(arg2).toBe(expectArg2);
    this.testStr = 'before-' + this.testStr;
  };
  const beforeAspect2 = function(arg1, arg2) {
    expect(arg1).toBe(expectArg1);
    expect(arg2).toBe(expectArg2);
    this.testStr = 'before2-' + this.testStr;
  };
  const afterAspect = function(arg1) {
    expect(arg1).toBe(this);
    this.testStr = this.testStr + '-after';
  };
  const afterAspect2 = function(arg1) {
    expect(arg1).toBe(this);
    this.testStr = this.testStr + '-after2';
  };
  const afterAspect3 = function(arg1) {
    expect(arg1).toBe(this);
    this.testStr = this.testStr + '-after3';
  };
  let originalFunc = window.location.testFunc;
  window.$$addAspect('window.location.testFunc.before', beforeAspect);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before-window.location');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$addAspect('window.location.testFunc.after', afterAspect);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before-before-window.location-after');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$removeAspect('window.location.testFunc.before', beforeAspect);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before-before-window.location-after-after');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$removeAspect('window.location.testFunc.after', afterAspect);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before-before-window.location-after-after');
  expect(window.location.testFunc).toBe(originalFunc);

  // multiple aspect
  window.$$addAspect('window.location.testFunc.before', beforeAspect);
  window.$$addAspect('window.location.testFunc.before', beforeAspect2);
  window.$$addAspect('window.location.testFunc.after', afterAspect);
  window.$$addAspect('window.location.testFunc.after', afterAspect2);
  window.$$addAspect('window.location.testFunc.after', afterAspect3);
  window.location.testStr = 'window.location';
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before2-before-window.location-after-after2-after3');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$removeAspect('window.location.testFunc.before', beforeAspect);
  window.$$removeAspect('window.location.testFunc.after', afterAspect);
  window.location.testStr = 'window.location';
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before2-window.location-after2-after3');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$removeAspect('window.location.testFunc.before', beforeAspect2);
  window.$$removeAspect('window.location.testFunc.after', afterAspect3);
  window.location.testStr = 'window.location';
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('window.location-after2');
  expect(window.location.testFunc).not.toBe(originalFunc);
  window.$$removeAspect('window.location.testFunc.after', afterAspect2);
  window.location.testStr = 'window.location';
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('window.location');
  expect(window.location.testFunc).toBe(originalFunc);

  // before aspect stop
  const beforeAspect3 = function(arg1, arg2) {
    expect(arg1).toBe(expectArg1);
    expect(arg2).toBe(expectArg2);
    if (this.testStr === 'before-before-before-window.location') return true;
    this.testStr = 'before-' + this.testStr;
  };
  window.$$addAspect('window.location.testFunc.before', beforeAspect3);
  window.location.testStr = 'window.location';
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testStr).toBe('before-before-before-window.location');
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(undefined);
  expect(window.location.testStr).toBe('before-before-before-window.location');
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(undefined);
  expect(window.location.testStr).toBe('before-before-before-window.location');
  window.$$removeAspect('window.location.testFunc.before', beforeAspect3);
  expect(window.location.testFunc(expectArg1, expectArg2)).toBe(window.location);
  expect(window.location.testFunc).toBe(originalFunc);

  // parent class method aspect
  originalFunc = element.hasChildNodes;
  const beforeAspect4 = function(arg1, arg2) {
    expect(arg1).toBe(expectArg1);
    expect(arg2).toBe(expectArg2);
    if (this.testStr === 'before-before-before-element') return true;
    this.testStr = 'before-' + this.testStr;
  };
  const afterAspect4 = function(arg1) {
    expect(arg1).toBe(false);
    this.testStr = this.testStr + '-after4';
  };
  window.$$addAspect('element.hasChildNodes.before', beforeAspect);
  window.$$addAspect('element.hasChildNodes.after', afterAspect4);
  element.testStr = 'element';
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false);
  expect(element.testStr).toBe('before-element-after4');
  window.$$removeAspect('element.hasChildNodes.before', beforeAspect);
  window.$$removeAspect('element.hasChildNodes.after', afterAspect4);
  window.$$addAspect('element.hasChildNodes.before', beforeAspect4);
  element.testStr = 'element';
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false);
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false);
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false);
  expect(element.testStr).toBe('before-before-before-element');
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(undefined);
  expect(element.testStr).toBe('before-before-before-element');
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(undefined);
  expect(element.testStr).toBe('before-before-before-element');
  window.$$removeAspect('element.hasChildNodes.before', beforeAspect4);
  expect(element.hasChildNodes(expectArg1, expectArg2)).toBe(false);
  expect(element.hasChildNodes).toBe(originalFunc);
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

test('window: HTMLElement', () => {
  // TODO
});

test('window: open', () => {
  const location = window.location;

  let hashChangeCount = 0;
  let pageAccessDeniedCount = 0;
  let pageNotFoundCount = 0;
  let tempURL = '';
  let tempType = '';
  const onHashChange = () => {
    hashChangeCount++;
  };
  const onPageAccessDenied = evt => {
    tempURL = evt.url;
    tempType = evt.type;
    pageAccessDeniedCount++;
  };
  const onPageNotFound = evt => {
    tempURL = evt.url;
    tempType = evt.type;
    pageNotFoundCount++;
  };
  location.addEventListener('hashchange', onHashChange);
  window.addEventListener('pageaccessdenied', onPageAccessDenied);
  window.addEventListener('pagenotfound', onPageNotFound);

  window.$$miniprogram.init('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  global.expectPagePath = `/pages/detail/index?type=open&targeturl=${encodeURIComponent('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash')}&search=${encodeURIComponent('?query=string')}&hash=${encodeURIComponent('#hash')}`;
  global.expectCallMethod = 'navigateTo';
  window.open('https://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  window.open('https://test.miniprogram.com/index/hahaha?query=string#321');
  expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  expect(pageNotFoundCount).toBe(1);
  expect(tempURL).toBe('https://test.miniprogram.com/index/hahaha?query=string#321');
  expect(tempType).toBe('open');
  window.open('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(location.href).toBe('https://test.miniprogram.com/p/a/t/h?query=string#hash');
  expect(pageAccessDeniedCount).toBe(1);
  expect(tempURL).toBe('http://test.miniprogram.com/index/aaa/detail/123?query=string#hash');
  expect(tempType).toBe('open');

  expect(hashChangeCount).toBe(0);
  expect(pageAccessDeniedCount).toBe(1);
  expect(pageNotFoundCount).toBe(1);

  location.removeEventListener('hashchange', onHashChange);
  window.removeEventListener('pageaccessdenied', onPageAccessDenied);
  window.removeEventListener('pagenotfound', onPageNotFound);
});

test('window: getComputedStyle', () => {
  // TODO
});

test('window: requestAnimationFrame/cancelAnimationFrame', async() => {
  const res = [];
  const timer = window.requestAnimationFrame(() => res.push(1));
  window.requestAnimationFrame(() => res.push(2));
  window.cancelAnimationFrame(timer);

  await mock.sleep(100);
  expect(res).toEqual([2]);
});
