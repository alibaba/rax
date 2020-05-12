import callSimpleEvent from '../events/callSimpleEvent';

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
  handles: {
    onSwitchChange(evt) {
      if (!this.domNode) return;

      this.domNode.$$setAttributeWithoutUpdate('checked', evt.detail.value);

      this.domNode.__oldValues = this.domNode.__oldValues || {};
      this.domNode.__oldValues.checked = evt.detail.value;

      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
