export default {
  name: 'editor',
  props: [{
    name: 'read-only',
    get(domNode) {
      return !!domNode.getAttribute('read-only');
    },
  }, {
    name: 'placeholder',
    get(domNode) {
      return domNode.getAttribute('placeholder') || '';
    },
  }, {
    name: 'show-img-size',
    get(domNode) {
      return !!domNode.getAttribute('show-img-size');
    },
  }, {
    name: 'show-img-toolbar',
    get(domNode) {
      return !!domNode.getAttribute('show-img-toolbar');
    },
  }, {
    name: 'show-img-resize',
    get(domNode) {
      return !!domNode.getAttribute('show-img-resize');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onEditorReady',
    eventName: 'ready'
  },
  {
    name: 'onEditorFocus',
    eventName: 'focus'
  },
  {
    name: 'onEditorBlur',
    eventName: 'blur'
  },
  {
    name: 'onEditorInput',
    eventName: 'input'
  },
  {
    name: 'onEditorStatusChange',
    eventName: 'statuschange'
  }]
};
