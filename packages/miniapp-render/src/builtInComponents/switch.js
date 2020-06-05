export default {
  name: 'switch',
  props: [{
    name: 'checked',
    canBeUserChanged: true,
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
        domNode.$$setAttributeWithoutUpdate('checked', evt.detail.value);
        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.checked = evt.detail.value;
      }
    }
  ]
};
