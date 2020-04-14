import callSimpleEvent from '../events/callSimpleEvent';
import callEvent from '../events/callEvent';

export default {
  name: 'textarea',
  props: [{
    name: 'value',
    get(domNode) {
      return domNode.value || '';
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
  }],
  handles: {
    onTextareaFocus(evt) {
      this._textareaOldValue = this.domNode.value;
      callSimpleEvent('focus', evt, this.domNode);
    },
    onTextareaBlur(evt) {
      if (!this.domNode) return;

      this.domNode.setAttribute('focus', false);
      if (this._textareaOldValue !== undefined && this.domNode.value !== this._textareaOldValue) {
        this._textareaOldValue = undefined;
        this.callEvent('change', evt);
      }
      callSimpleEvent('blur', evt, this.domNode);
    },
    onTextareaLineChange(evt) {
      callSimpleEvent('linechange', evt, this.domNode);
    },
    onTextareaInput(evt) {
      if (!this.domNode) return;

      const value = '' + evt.detail.value;
      this.domNode.setAttribute('value', value);
      callEvent('input', evt, null, this.pageId, this.nodeId);
    },
    onTextareaConfirm(evt) {
      callSimpleEvent('confirm', evt, this.domNode);
    },
    onTextareaKeyBoardHeightChange(evt) {
      callSimpleEvent('keyboardheightchange', this.domNode);
    },
  },
};
