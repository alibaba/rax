export default {
  name: 'textarea',
  props: [{
    name: 'value',
    get(domNode) {
      return domNode.value || '';
    },
  }, {
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }, {
    name: 'placeholder',
    get(domNode) {
      return domNode.placeholder;
    },
  }, {
    name: 'placeholderColor',
    get(domNode) {
      return domNode.getAttribute('placeholderColor') || '#999999';
    },
  }, {
    name: 'placeholderStyle',
    get(domNode) {
      return domNode.getAttribute('placeholder-style') || '';
    },
  }, {
    name: 'placeholderClass',
    get(domNode) {
      return domNode.getAttribute('placeholder-class') || 'input-placeholder';
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return domNode.disabled || domNode.readOnly;
    },
  }, {
    name: 'maxlength',
    get(domNode) {
      const value = parseInt(domNode.maxlength, 10);
      return !isNaN(value) ? value : 140;
    }
  }, {
    name: 'autofocus',
    get(domNode) {
      return !!domNode.getAttribute('autofocus');
    },
  }, {
    name: 'focus',
    get(domNode) {
      return !!domNode.getAttribute('focus');
    },
  }, {
    name: 'autoHeight',
    get(domNode) {
      return !!domNode.getAttribute('auto-height');
    },
  }, {
    name: 'fixed',
    get(domNode) {
      return !!domNode.getAttribute('fixed');
    },
  }, {
    name: 'cursorSpacing',
    get(domNode) {
      return +domNode.getAttribute('cursor-spacing') || 0;
    },
  }, {
    name: 'cursor',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('cursor'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'showConfirmBar',
    get(domNode) {
      const value = domNode.getAttribute('show-confirm-bar');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'selectionStart',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('selection-start'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'selectionEnd',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('selection-end'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'adjustPosition',
    get(domNode) {
      const value = domNode.getAttribute('adjust-position');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }, {
    name: 'controlled',
    get(domNode) {
      return !!domNode.getAttribute('controlled');
    },
  }],
  singleEvents: [{
    name: 'keyboardheightchange',
    eventName: 'keyboardheightchange'
  }],
  simpleEvents: [{
    name: 'onTextareaConfirm',
    eventName: 'confirm'
  }],
  complexEvents: [{
    name: 'onTextareaFocus',
    eventName: 'input',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__textareaOldValue = domNode.value || '';
      domNode.$$setAttributeWithoutUpdate('focus', true);
      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onTextareaBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.$$setAttributeWithoutUpdate('focus', false);
      if (domNode.__textareaOldValue !== undefined && domNode.value !== domNode.__textareaOldValue) {
        domNode.__textareaOldValue = undefined;
        this.callEvent('change', evt, pageId, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  },
  {
    name: 'onTextareaInput',
    eventName: 'input',
    middleware(evt, domNode, pageId, nodeId) {
      const value = '' + evt.detail.value;
      domNode.$$setAttributeWithoutUpdate('value', value);

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  }]
};
