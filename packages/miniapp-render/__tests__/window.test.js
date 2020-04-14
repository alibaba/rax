/* eslint-disable no-proto */
import mock from '../renderMock';

let window;
let document;

beforeAll(() => {
  const res = mock.createPage('home');
  window = res.window;
  document = res.document;
});

test('window: $$getPrototype/$$extend/$$addAspect', () => {
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
    testStr: 'document'
  });
  expect(document.testStr).toBe('document');

  const element = document.createElement('div');

  // element.attribute
  expect(window.$$getPrototype('element.attribute')).toMatchObject(element.$_attrs.__proto__);
  window.$$extend('element.attribute', {
    testStr: 'element.attribute'
  });
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
    testStr: 'element'
  });
  expect(element.testStr).toBe('element');

  // textNode
  const textNode = document.createTextNode('text');
  expect(window.$$getPrototype('textNode')).toMatchObject(textNode.__proto__);
  window.$$extend('textNode', {
    testStr: 'textNode'
  });
  expect(textNode.testStr).toBe('textNode');

  // comment
  const comment = document.createComment('comment');
  expect(window.$$getPrototype('comment')).toMatchObject(comment.__proto__);
  window.$$extend('comment', {
    testStr: 'comment'
  });
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

  // parent class method aspect
  let originalFunc = element.hasChildNodes;
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

test('window: requestAnimationFrame/cancelAnimationFrame', async() => {
  const res = [];
  const timer = window.requestAnimationFrame(() => res.push(1));
  window.requestAnimationFrame(() => res.push(2));
  window.cancelAnimationFrame(timer);

  await mock.sleep(100);
  expect(res).toEqual([2]);
});
