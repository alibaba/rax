// https://github.com/webcomponents/custom-elements/issues/26
(function() {
  /**
   * if customElements is polyfilled,
   * native shim is not needed.
   */
  if (
    window.customElements &&
    window.customElements.polyfillWrapFlushCallback
  ) {
    return;
  }

  // native shims HTMLElement
  // including ES6 class definition
  // iOS 8 can not recognize by throwing StynaxError
  try {
    eval('class A {}');
  } catch (err) {
    // not support es6 class
    return;
  }

  // vendor compiled
  const nativeShimCode =
    '!function(){"use strict";if(window.customElements){var e=window.HTMLElement,t=window.customElements.define,n=window.customElements.get,o=new Map,c=new Map,l=!1,a=!1;window.HTMLElement=function(){if(!l){var e=o.get(this.constructor),t=n.call(window.customElements,e);return a=!0,new t}l=!1},window.HTMLElement.prototype=e.prototype;Object.defineProperty(window,"customElements",{value:window.customElements,configurable:!0,writable:!0}),Object.defineProperty(window.customElements,"define",{value:function(n,i){var s=i.prototype,r=class extends e{constructor(){super(),Object.setPrototypeOf(this,s),a||(l=!0,i.call(this)),a=!1}},d=r.prototype;r.observedAttributes=i.observedAttributes,d.connectedCallback=s.connectedCallback,d.disconnectedCallback=s.disconnectedCallback,d.attributeChangedCallback=s.attributeChangedCallback,d.adoptedCallback=s.adoptedCallback,o.set(i,n),c.set(n,i),t.call(window.customElements,n,r)},configurable:!0,writable:!0}),Object.defineProperty(window.customElements,"get",{value:function(e){return c.get(e)},configurable:!0,writable:!0})}}();';

  try {
    eval(nativeShimCode);
  } catch (err) {}
})();
