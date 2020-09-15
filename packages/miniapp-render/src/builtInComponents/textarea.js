export default {
  name: 'textarea',
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
      domNode._setAttributeWithOutUpdate('focus-state', true);
      this.callSimpleEvent('focus', evt, domNode);
    }
  },
  {
    name: 'onTextareaBlur',
    eventName: 'blur',
    middleware(evt, domNode, pageId, nodeId) {
      domNode._setAttributeWithOutUpdate('focus-state', false);
      if (domNode.__textareaOldValue !== undefined && domNode.value !== domNode.__textareaOldValue) {
        domNode.__textareaOldValue = undefined;
        this.callEvent('change', evt, null, pageId, nodeId);
      }
      this.callSimpleEvent('blur', evt, domNode);
    }
  },
  {
    name: 'onTextareaInput',
    eventName: 'input',
    middleware(evt, domNode, pageId, nodeId) {
      const value = '' + evt.detail.value;
      domNode._setAttributeWithOutUpdate('value', value);

      this.callEvent('input', evt, null, pageId, nodeId);
    }
  }]
};
