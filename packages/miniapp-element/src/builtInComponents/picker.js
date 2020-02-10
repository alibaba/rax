import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'picker',
  props: [{
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'selector';
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return !!domNode.getAttribute('disabled');
    },
  }, {
    name: 'range',
    get(domNode) {
      const value = domNode.getAttribute('range');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'rangeKey',
    get(domNode) {
      return domNode.getAttribute('range-key') || '';
    },
  }, {
    name: 'value',
    get(domNode) {
      const mode = domNode.getAttribute('mode') || 'selector';
      const value = domNode.getAttribute('value');
      if (mode === 'selector' || mode === 'multiSelector') {
        return +value || 0;
      } else if (mode === 'time') {
        return value || '';
      } else if (mode === 'date') {
        return value || '0';
      } else if (mode === 'region') {
        return value || [];
      }

      return value;
    },
  }, {
    name: 'start',
    get(domNode) {
      return domNode.getAttribute('start') || '';
    },
  }, {
    name: 'end',
    get(domNode) {
      return domNode.getAttribute('end') || '';
    },
  }, {
    name: 'fields',
    get(domNode) {
      return domNode.getAttribute('fields') || 'day';
    },
  }, {
    name: 'customItem',
    get(domNode) {
      return domNode.getAttribute('custom-item') || '';
    }
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onPickerChange(evt) {
      if (!this.domNode) return;

      this.domNode.$$setAttributeWithoutUpdate('value', evt.detail.value);
      callSimpleEvent('change', evt, this.domNode);
    },
    onPickerColumnChange(evt) {
      callSimpleEvent('columnchange', evt, this.domNode);
    },
    onPickerCancel(evt) {
      callSimpleEvent('cancel', evt, this.domNode);
    },
  },
};
