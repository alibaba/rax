const input = {
  name: 'input',
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
      domNode._setAttributeWithOutUpdate('value', value);

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  },
  {
    name: 'onInputFocus',
    eventName: 'focus',
    middleware(evt, domNode, pageId, nodeId) {
      domNode.__inputOldValue = domNode.value || '';
      domNode._setAttributeWithOutUpdate('focus-state', true);

      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onInputBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode._setAttributeWithOutUpdate('focus-state', false);

      if (domNode.__inputOldValue !== undefined && domNode.value !== domNode.__inputOldValue) {
        domNode.__inputOldValue = undefined;
        this.callEvent('change', evt, null, pageId, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  }]
};

export default input;
