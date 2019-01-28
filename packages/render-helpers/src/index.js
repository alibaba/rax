// internal render helpers.
// these are exposed on the instance prototype to reduce generated render
// code size.
import createElement from './createElement';
import createEmptyElement from './createEmptyElement';
import createTextElement from './createTextElement';
import toString from './toString';
import renderList from './renderList';
import createNotImplWarn from './createNotImplWarn';
import renderSlot from './renderSlot';
import renderStyle from './renderStyle';
import resolveScopedSlots from './resolveScopedSlots';
import setRender from './setRender';

export default {
  _r: setRender,
  _c: createElement,
  // _o: markOnce,
  // _n: toNumber,
  _s: toString,
  _l: renderList,
  _t: renderSlot,
  // _q: looseEqual,
  // _i: looseIndexOf,
  _m: createNotImplWarn('v-once'), // renderStatic,
  // _f: resolveFilter,
  // _k: checkKeyCodes,
  // _b: bindObjectProps,
  _v: createTextElement,
  _e: createEmptyElement,
  _u: resolveScopedSlots,
  // _g: bindObjectListeners,
  _cx: renderStyle,
};

