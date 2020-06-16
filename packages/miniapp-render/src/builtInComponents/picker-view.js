export default {
  name: 'picker-view',
  props: [{
    name: 'value',
    get(domNode) {
      let value = domNode.getAttribute('value');
      if (typeof value === 'string') value = value.split(',').map(item => parseInt(item, 10));

      return value !== undefined ? value : [];
    },
  }, {
    name: 'indicatorStyle',
    get(domNode) {
      return domNode.getAttribute('indicator-style') || '';
    },
  }, {
    name: 'indicatorClass',
    get(domNode) {
      return domNode.getAttribute('indicator-class') || '';
    },
  }, {
    name: 'maskStyle',
    get(domNode) {
      return domNode.getAttribute('mask-style') || '';
    },
  }, {
    name: 'maskClass',
    get(domNode) {
      return domNode.getAttribute('mask-class') || '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onPickerViewPickstart',
    eventName: 'pickstart'
  },
  {
    name: 'onPickerViewPickend',
    eventName: 'pickend'
  }],
  functionalSingleEvents: [
    {
      name: 'onPickerViewChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);
      }
    }
  ]
};
