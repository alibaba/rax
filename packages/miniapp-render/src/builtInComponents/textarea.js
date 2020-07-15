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
    name: 'placeholder-color',
    get(domNode) {
      return domNode.getAttribute('placeholder-color') || '#999999';
    },
  }, {
    name: 'placeholder-style',
    get(domNode) {
      return domNode.getAttribute('placeholder-style') || '';
    },
  }, {
    name: 'placeholder-class',
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
    name: 'focus-state',
    get(domNode) {
      return !!domNode.getAttribute('autofocus');
    },
  }, {
    name: 'focus',
    get(domNode) {
      return !!domNode.getAttribute('focus');
    },
  }, {
    name: 'auto-height',
    get(domNode) {
      return !!domNode.getAttribute('auto-height');
    },
  }, {
    name: 'fixed',
    get(domNode) {
      return !!domNode.getAttribute('fixed');
    },
  }, {
    name: 'cursor-spacing',
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
    name: 'show-confirm-bar',
    get(domNode) {
      const value = domNode.getAttribute('show-confirm-bar');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'selection-start',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('selection-start'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'selection-end',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('selection-end'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'adjust-position',
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
      domNode.__setAttributeWithoutUpdate('focus-state', true);
      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onTextareaBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__setAttributeWithoutUpdate('focus-state', false);
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
      domNode.__setAttributeWithoutUpdate('value', value);

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  }]
};
