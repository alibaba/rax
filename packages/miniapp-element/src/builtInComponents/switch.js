import callSimpleEvent from '../events/callSimpleEvent';

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
  handles: {
    onSwitchChange(evt) {
      if (!this.domNode) return;

      this.domNode.setAttribute('checked', evt.detail.value);
      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
