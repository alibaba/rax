import mock from '../../renderMock';
import EventTarget from '../../src/event/event-target';
import Event from '../../src/event/event';

let window;
let document;

beforeAll(() => {
  const page = mock.createPage('home');
  window = page.window;
  document = page.document;
});

test('event', () => {
  const a = document.querySelector('.aa');
  const b = document.querySelector('#bb');
  const c = document.querySelector('header');
  const d = document.querySelector('footer');
  const e = document.querySelector('#bb4');

  const miniprogramEvent = {timeStamp: Date.now};
  const seqList = [];

  // addEventListener/removeEventListener
  const countMap = {
    doc: 0, a: 0, b: 0, c: 0, d: 0, e: 0
  };
  let target = null;
  const onEvent = (node, type) => function(evt) {
    expect(this).toBe(node);
    expect(evt).toBeInstanceOf(Event);
    expect(evt.currentTarget).toBe(node);
    expect(evt.target).toBe(target);
    countMap[type]++;
    seqList.push(type);
  };
  const onDocEvent = onEvent(document.documentElement, 'doc');
  const onAEvent = onEvent(a, 'a');
  const onBEvent = onEvent(b, 'b');
  const onCEvent = onEvent(c, 'c');
  const onDEvent = onEvent(d, 'd');
  const onEEvent = onEvent(e, 'e');

  document.addEventListener('click', onDocEvent);
  a.addEventListener('click', onAEvent);
  b.addEventListener('click', onBEvent);
  c.addEventListener('click', onCEvent);
  d.addEventListener('click', onDEvent, true);
  e.addEventListener('click', onEEvent);

  target = e;
  expect(EventTarget._process(target, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(countMap.doc).toBe(1);
  expect(countMap.a).toBe(1);
  expect(countMap.b).toBe(1);
  expect(countMap.c).toBe(0);
  expect(countMap.d).toBe(1);
  expect(countMap.e).toBe(1);
  expect(seqList).toEqual(['d', 'e', 'b', 'a', 'doc']);

  target = c;
  seqList.length = 0;
  expect(EventTarget._process(target, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(countMap.doc).toBe(2);
  expect(countMap.a).toBe(2);
  expect(countMap.b).toBe(2);
  expect(countMap.c).toBe(1);
  expect(countMap.d).toBe(1);
  expect(countMap.e).toBe(1);
  expect(seqList).toEqual(['c', 'b', 'a', 'doc']);

  target = d;
  seqList.length = 0;
  d.removeEventListener('click', onDEvent);
  expect(EventTarget._process(target, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  d.removeEventListener('click', onDEvent, true);
  expect(EventTarget._process(target, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(countMap.doc).toBe(4);
  expect(countMap.a).toBe(4);
  expect(countMap.b).toBe(4);
  expect(countMap.c).toBe(1);
  expect(countMap.d).toBe(2);
  expect(countMap.e).toBe(1);
  expect(seqList).toEqual(['d', 'b', 'a', 'doc', 'b', 'a', 'doc']);

  target = e;
  seqList.length = 0;
  d.addEventListener('click', onDEvent);
  expect(EventTarget._process(target, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(countMap.doc).toBe(5);
  expect(countMap.a).toBe(5);
  expect(countMap.b).toBe(5);
  expect(countMap.c).toBe(1);
  expect(countMap.d).toBe(3);
  expect(countMap.e).toBe(2);
  expect(seqList).toEqual(['e', 'd', 'b', 'a', 'doc']);

  document.removeEventListener('click', onDocEvent);
  a.removeEventListener('click', onAEvent);
  b.removeEventListener('click', onBEvent);
  c.removeEventListener('click', onCEvent);
  d.removeEventListener('click', onDEvent);
  e.removeEventListener('click', onEEvent);

  // eventPhase/stopPropagation
  let passEvt;
  const onDocEvent2 = evt => {
    passEvt = evt;
    seqList.push('doc');
    expect(evt.eventPhase).toBe(Event.CAPTURING_PHASE);
  };
  const onAEvent2 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('a');
    expect(evt.eventPhase).toBe(Event.CAPTURING_PHASE);
  };
  const onBEvent2 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('b');
    expect(evt.eventPhase).toBe(Event.CAPTURING_PHASE);
    evt.stopPropagation();
  };
  const onCEvent2 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('c');
    expect(evt.eventPhase).toBe(Event.AT_TARGET);
  };
  const onDocEvent3 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('doc');
    expect(evt.eventPhase).toBe(Event.BUBBLING_PHASE);
  };
  const onAEvent3 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('a');
    expect(evt.eventPhase).toBe(Event.BUBBLING_PHASE);
  };
  const onBEvent3 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('b');
    expect(evt.eventPhase).toBe(Event.BUBBLING_PHASE);
    evt.stopPropagation();
  };
  const onCEvent3 = evt => {
    expect(evt).toBe(passEvt);
    seqList.push('c');
    expect(evt.eventPhase).toBe(Event.AT_TARGET);
  };

  seqList.length = 0;
  document.addEventListener('click', onDocEvent2, true);
  a.addEventListener('click', onAEvent2, true);
  c.addEventListener('click', onCEvent2, true);
  document.addEventListener('click', onDocEvent3);
  a.addEventListener('click', onAEvent3);
  c.addEventListener('click', onCEvent3);
  expect(EventTarget._process(c, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(passEvt.eventPhase).toBe(Event.NONE);
  expect(seqList).toEqual(['doc', 'a', 'c', 'c', 'a', 'doc']);

  seqList.length = 0;
  b.addEventListener('click', onBEvent2, true);
  expect(EventTarget._process(c, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(passEvt.eventPhase).toBe(Event.NONE);
  expect(seqList).toEqual(['doc', 'a', 'b']);

  seqList.length = 0;
  b.removeEventListener('click', onBEvent2, true);
  b.addEventListener('click', onBEvent3);
  expect(EventTarget._process(c, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(passEvt.eventPhase).toBe(Event.NONE);
  expect(seqList).toEqual(['doc', 'a', 'c', 'c', 'b']);

  document.removeEventListener('click', onDocEvent2, true);
  a.removeEventListener('click', onAEvent2, true);
  c.removeEventListener('click', onCEvent2, true);
  document.removeEventListener('click', onDocEvent3);
  a.removeEventListener('click', onAEvent3);
  b.removeEventListener('click', onBEvent3);
  c.removeEventListener('click', onCEvent3);

  // stopImmediatePropagation
  seqList.length = 0;
  const onAEvent4 = () => {
    seqList.push('a');
  };
  const onBEvent4 = () => {
    seqList.push('b1');
  };
  const onBEvent5 = evt => {
    seqList.push('b2');
    evt.stopImmediatePropagation();
  };
  const onBEvent6 = () => {
    seqList.push('b3');
  };
  const onCEvent4 = () => {
    seqList.push('c');
  };
  a.addEventListener('click', onAEvent4);
  b.addEventListener('click', onBEvent4);
  b.addEventListener('click', onBEvent5);
  b.addEventListener('click', onBEvent6);
  c.addEventListener('click', onCEvent4);

  expect(EventTarget._process(c, 'click', miniprogramEvent)).toBeInstanceOf(Event);
  expect(seqList).toEqual(['c', 'b1', 'b2']);

  a.removeEventListener('click', onAEvent4);
  b.removeEventListener('click', onBEvent4);
  b.removeEventListener('click', onBEvent5);
  b.removeEventListener('click', onBEvent6);
  c.removeEventListener('click', onCEvent4);
});

test('event: CustomEvent/dispatchEvent', () => {
  const a = document.querySelector('.aa');
  const b = document.querySelector('#bb');
  const c = document.querySelector('#bb4');
  const seqList = [];
  let customEvent;
  let detail = null;
  const onEvent = (node, type) => function(evt) {
    expect(this).toBe(node);
    expect(evt).toBe(customEvent);
    expect(evt.detail).toEqual(detail);
    seqList.push(type);
  };

  const onAEvent = onEvent(a, 'a');
  const onBEvent = onEvent(b, 'b');
  const onCEvent = onEvent(c, 'c');
  const onAEvent2 = onEvent(a, 'a');
  const onBEvent2 = onEvent(b, 'b');
  const onCEvent2 = onEvent(c, 'c');

  a.addEventListener('testevent', onAEvent, true);
  b.addEventListener('testevent', onBEvent, true);
  c.addEventListener('testevent', onCEvent, true);
  a.addEventListener('testevent', onAEvent2);
  b.addEventListener('testevent', onBEvent2);
  c.addEventListener('testevent', onCEvent2);

  // 普通
  customEvent = new window.CustomEvent('testevent');
  expect(customEvent.type).toBe('testevent');
  expect(customEvent).toBeInstanceOf(Event);

  b.dispatchEvent(customEvent);
  expect(seqList).toEqual(['a', 'b', 'b']);

  seqList.length = 0;
  c.dispatchEvent(customEvent);
  expect(seqList).toEqual(['a', 'b', 'c', 'c']);

  // 带 detail，可冒泡
  detail = {a: 123};
  customEvent = new window.CustomEvent('testevent', {
    detail,
    bubbles: true,
  });
  expect(customEvent.type).toBe('testevent');
  expect(customEvent.detail).toEqual(detail);
  expect(customEvent.bubbles).toBe(true);

  seqList.length = 0;
  b.dispatchEvent(customEvent);
  expect(seqList).toEqual(['a', 'b', 'b', 'a']);

  seqList.length = 0;
  c.dispatchEvent(customEvent);
  expect(seqList).toEqual(['a', 'b', 'c', 'c', 'b', 'a']);

  a.removeEventListener('testevent', onAEvent, true);
  b.removeEventListener('testevent', onBEvent, true);
  c.removeEventListener('testevent', onCEvent, true);
  a.removeEventListener('testevent', onAEvent2);
  b.removeEventListener('testevent', onBEvent2);
  c.removeEventListener('testevent', onCEvent2);
});
