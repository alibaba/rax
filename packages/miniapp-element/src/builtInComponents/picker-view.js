import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'picker-view',
  props: [{
    name: 'value',
    canBeUserChanged: true,
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
  handles: {
    onPickerViewChange(evt) {
      const domNode = this.getDomNodeFromEvt('change', evt);
      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.value = evt.detail.value;
      callSingleEvent('change', evt, this);
    },
    onPickerViewPickstart(evt) {
      callSingleEvent('pickstart', evt, this);
    },
    onPickerViewPickend(evt) {
      callSingleEvent('pickend', evt, this);
    },
  },
};
