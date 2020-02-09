export default {
  name: 'picker-view',
  props: [{
    name: 'value',
    get(domNode) {
      const value = domNode.getAttribute('value');
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
  handles: {
    onPickerViewChange(evt) {
      if (!this.domNode) return;

      this.domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);
      this.callSimpleEvent('change', evt);
    },
    onPickerViewPickstart(evt) {
      this.callSimpleEvent('pickstart', evt);
    },
    onPickerViewPickend(evt) {
      this.callSimpleEvent('pickend', evt);
    },
  },
};
