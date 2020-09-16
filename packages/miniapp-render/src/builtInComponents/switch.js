export default {
  name: 'switch',
  functionalSingleEvents: [
    {
      name: 'onSwitchChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('checked', evt.detail.value);
      }
    }
  ]
};
