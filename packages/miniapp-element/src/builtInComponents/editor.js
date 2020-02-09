export default {
  name: 'editor',
  props: [{
    name: 'readOnly',
    get(domNode) {
      return !!domNode.getAttribute('read-only');
    },
  }, {
    name: 'placeholder',
    get(domNode) {
      return domNode.getAttribute('placeholder') || '';
    },
  }, {
    name: 'showImgSize',
    get(domNode) {
      return !!domNode.getAttribute('show-img-size');
    },
  }, {
    name: 'showImgToolbar',
    get(domNode) {
      return !!domNode.getAttribute('show-img-toolbar');
    },
  }, {
    name: 'showImgResize',
    get(domNode) {
      return !!domNode.getAttribute('show-img-resize');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onEditorReady(evt) {
      this.callSimpleEvent('ready', evt);
    },
    onEditorFocus(evt) {
      this.callSimpleEvent('focus', evt);
    },
    onEditorBlur(evt) {
      this.callSimpleEvent('blur', evt);
    },
    onEditorInput(evt) {
      this.callSimpleEvent('input', evt);
    },
    onEditorStatusChange(evt) {
      this.callSimpleEvent('statuschange', evt);
    },
  },
};
