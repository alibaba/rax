export default {
  name: 'switch',
  props: [{
    name: 'checked',
    get(domNode) {
      return !!domNode.getAttribute('checked');
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return !!domNode.getAttribute('disabled');
    },
  }, {
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }, {
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || 'switch';
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '#04BE02';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
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
