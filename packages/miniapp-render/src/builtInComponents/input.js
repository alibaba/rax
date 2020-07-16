// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const input = {
  name: 'input',
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
    name: 'placeholder-style',
    get(domNode) {
      let style = domNode.getAttribute('placeholder-style') || '';
      // Compatible with placeholderColor attribute of rax-textinput
      const color = domNode.getAttribute('placeholderColor');
      if (color) {
        style = 'color:' + color + ';' + style;
      }
      return style;
    }
  }, {
    name: 'placeholder-class',
    get(domNode) {
      return domNode.getAttribute('placeholder-class');
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
    name: 'cursor-spacing',
    get(domNode) {
      return +domNode.getAttribute('cursor-spacing') || 0;
    },
  }, {
    name: 'confirm-type',
    get(domNode) {
      return domNode.getAttribute('confirm-type') || 'done';
    },
  }, {
    name: 'confirm-hold',
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
    name: 'focus-state',
    get(domNode) {
      return !!(domNode.getAttribute('autofocus') || domNode.getAttribute('focus-state'));
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
      domNode.__setAttributeWithoutUpdate('value', value);

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  },
  {
    name: 'onInputFocus',
    eventName: 'focus',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__inputOldValue = domNode.value || '';
      domNode.__setAttributeWithoutUpdate('focus-state', true);

      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onInputBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__setAttributeWithoutUpdate('focus-state', false);

      if (domNode.__inputOldValue !== undefined && domNode.value !== domNode.__inputOldValue) {
        domNode.__inputOldValue = undefined;
        this.callEvent('change', evt, null, pageId, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  }]
};

if (!isMiniApp) {
  input.props.push({
    name: 'controlled',
    get(domNode) {
      return !!domNode.getAttribute('controlled');
    },
  });
}

export default input;
