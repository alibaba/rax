export default {
  name: 'input',
  props: [{
    name: 'value',
    canBeUserChanged: true,
    get(domNode) {
      return domNode.value || '';
    },
  }, {
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }, {
    name: 'type',
    get(domNode) {
      const value = domNode.type || 'text';
      return value !== 'password' ? value : 'text';
    },
  }, {
    name: 'password',
    get(domNode) {
      return domNode.type !== 'password' ? !!domNode.getAttribute('password') : true;
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
    },
  }, {
    name: 'cursorSpacing',
    get(domNode) {
      return +domNode.getAttribute('cursor-spacing') || 0;
    },
  }, {
    name: 'autofocus',
    get(domNode) {
      return !!domNode.getAttribute('autofocus');
    },
  }, {
    name: 'confirmType',
    get(domNode) {
      return domNode.getAttribute('confirm-type') || 'done';
    },
  }, {
    name: 'confirmHold',
    get(domNode) {
      return !!domNode.getAttribute('confirm-hold');
    },
  }, {
    name: 'cursor',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('cursor'), 10);
      return !isNaN(value) ? value : -1;
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
    name: 'checked',
    canBeUserChanged: true,
    get(domNode) {
      return !!domNode.getAttribute('checked');
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '#09BB07';
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
  simpleEvents: [{
    name: 'onInputConfirm',
    eventName: 'confirm'
  }],
  singleEvents: [{
    name: 'onInputKeyBoardHeightChange',
    eventName: 'keyboardheightchange'
  }],
  complexEvents: [{
    name: 'onInputInput',
    eventName: 'input',
    middleware(evt, domNode, pageId, nodeId) {
      const value = '' + evt.detail.value;
      domNode.$$setAttributeWithoutUpdate('value', value);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.value = value;

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  },
  {
    name: 'onInputFocus',
    eventName: 'focus',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__inputOldValue = domNode.value || '';
      domNode.$$setAttributeWithoutUpdate('focus', true);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.focus = true;
      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onInputBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.$$setAttributeWithoutUpdate('focus', false);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.focus = false;
      if (domNode.__inputOldValue !== undefined && domNode.value !== domNode.__inputOldValue) {
        domNode.__inputOldValue = undefined;
        this.callEvent('change', evt, null, pageId, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  }]
};
