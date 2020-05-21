import callSimpleEvent from '../events/callSimpleEvent';
import callEvent from '../events/callEvent';
import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'textarea',
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
    name: 'autoFocus',
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
  handles: {
    onTextareaFocus(evt) {
      const domNode = this.getDomNodeFromEvt('focus', evt);
      if (!domNode) return;
      domNode.__textareaOldValue = domNode.value;
      domNode.$$setAttributeWithoutUpdate('focus', true);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.focus = true;
      callSimpleEvent('focus', evt, domNode);
    },
    onTextareaBlur(evt) {
      const domNode = this.getDomNodeFromEvt('blur', evt);
      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('focus', false);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.focus = false;
      if (this.__textareaOldValue !== undefined && domNode.value !== this.__textareaOldValue) {
        this.__textareaOldValue = undefined;
        callEvent('change', evt, this.pageId, this.nodeId);
      }
      callSimpleEvent('blur', evt, domNode);
    },
    onTextareaLineChange(evt) {
      const domNode = this.getDomNodeFromEvt('linechange', evt);
      callSimpleEvent('linechange', evt, domNode);
    },
    onTextareaInput(evt) {
      const domNode = this.getDomNodeFromEvt('blur', evt);
      if (!domNode) return;

      const value = '' + evt.detail.value;
      domNode.$$setAttributeWithoutUpdate('value', value);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.value = value;

      callEvent('input', evt, null, this.pageId, this.nodeId);
    },
    onTextareaConfirm(evt) {
      const domNode = this.getDomNodeFromEvt('confirm', evt);
      callSimpleEvent('confirm', evt, domNode);
    },
    onTextareaKeyBoardHeightChange(evt) {
      callSingleEvent('keyboardheightchange', evt, this);
    },
  },
};
