import render from 'miniapp-render';
import callEvent from '../events/callEvent';
import callSimpleEvent from '../events/callSimpleEvent';

const { cache } = render.$$adapter;

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
    name: 'autoFocus',
    get(domNode) {
      return !!domNode.getAttribute('autofocus');
    },
  }, {
    name: 'focus',
    canBeUserChanged: true,
    get(domNode) {
      return !!domNode.getAttribute('focus');
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
  handles: {
    onInputInput(evt) {
      if (!this.domNode) return;
      const value = '' + evt.detail.value;
      this.domNode.$$setAttributeWithoutUpdate('value', value);

      this.domNode.__oldValues = this.domNode.__oldValues || {};
      this.domNode.__oldValues.value = value;

      callEvent('input', evt, null, this.pageId, this.nodeId);
    },
    onInputFocus(evt) {
      this.domNode.__inputOldValue = this.domNode.value;
      this.domNode.$$setAttributeWithoutUpdate('focus', true);

      this.domNode.__oldValues = this.domNode.__oldValues || {};
      this.domNode.__oldValues.focus = true;
      callSimpleEvent('focus', evt, this.domNode);
    },
    onInputBlur(evt) {
      if (!this.domNode) return;

      this.domNode.$$setAttributeWithoutUpdate('focus', false);

      this.domNode.__oldValues = this.domNode.__oldValues || {};
      this.domNode.__oldValues.focus = false;
      if (this.__inputOldValue !== undefined && this.domNode.value !== this.__inputOldValue) {
        this.__inputOldValue = undefined;
        callEvent('change', evt, null, this.pageId, this.nodeId);
      }
      callSimpleEvent('blur', evt, this.domNode);
    },
    onInputConfirm(evt) {
      callSimpleEvent('confirm', evt, this.domNode);
    },
    onInputKeyBoardHeightChange(evt) {
      callSimpleEvent('keyboardheightchange', evt, this.domNode);
    },
    onRadioChange(evt) {
      const window = cache.getWindow();
      const domNode = this.domNode;
      const value = evt.detail.value;
      const name = domNode.name;
      const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || [];

      if (value === domNode.value) {
        domNode.$$setAttributeWithoutUpdate('checked', true);

        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.checked = true;

        const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || [];
        for (const otherDomNode of otherDomNodes) {
          if (otherDomNode.type === 'radio' && otherDomNode !== domNode) {
            otherDomNode.$$setAttributeWithoutUpdate('checked', false);

            otherDomNode.__oldValues = otherDomNode.__oldValues || {};
            otherDomNode.__oldValues.checked = false;
          }
        }
      }
      callEvent('input', evt, null, this.pageId, this.nodeId);
      callEvent('change', evt, null, this.pageId, this.nodeId);
    },
    onCheckboxChange(evt) {
      const domNode = this.domNode;
      const value = evt.detail.value || [];
      if (value.indexOf(domNode.value) >= 0) {
        domNode.$$setAttributeWithoutUpdate('checked', true);

        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.checked = true;
      } else {
        domNode.$$setAttributeWithoutUpdate('checked', false);

        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.checked = false;
      }
      callEvent('change', evt, null, this.pageId, this.nodeId);
    },
    onCheckboxItemChange(evt) {
      const domNode = this.domNode;
      const value = evt.detail.value || false;
      domNode.setAttribute('checked', value);
      callEvent('change', evt, null, this.pageId, this.nodeId);
    },
  },
};
