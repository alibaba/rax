import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('ready', evt, this.domNode);
    },
    onEditorFocus(evt) {
      callSimpleEvent('focus', evt, this.domNode);
    },
    onEditorBlur(evt) {
      callSimpleEvent('blur', evt, this.domNode);
    },
    onEditorInput(evt) {
      callSimpleEvent('input', evt, this.domNode);
    },
    onEditorStatusChange(evt) {
      callSimpleEvent('statuschange', evt, this.domNode);
    },
  },
};
