import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('change', evt, this.domNode);
    },
    onPickerViewPickstart(evt) {
      callSimpleEvent('pickstart', evt, this.domNode);
    },
    onPickerViewPickend(evt) {
      callSimpleEvent('pickend', evt, this.domNode);
    },
  },
};
