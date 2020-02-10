import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'progress',
  props: [{
    name: 'percent',
    get(domNode) {
      return +domNode.getAttribute('percent') || 0;
    },
  }, {
    name: 'showInfo',
    get(domNode) {
      return !!domNode.getAttribute('show-info');
    },
  }, {
    name: 'borderRadius',
    get(domNode) {
      return domNode.getAttribute('border-radius') || '0';
    },
  }, {
    name: 'fontSize',
    get(domNode) {
      return domNode.getAttribute('font-size') || '16';
    },
  }, {
    name: 'strokeWidth',
    get(domNode) {
      return domNode.getAttribute('stroke-width') || '6';
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '#09BB07';
    },
  }, {
    name: 'activeColor',
    get(domNode) {
      return domNode.getAttribute('active-color') || '#09BB07';
    },
  }, {
    name: 'backgroundColor',
    get(domNode) {
      return domNode.getAttribute('background-color') || '#EBEBEB';
    },
  }, {
    name: 'active',
    get(domNode) {
      return !!domNode.getAttribute('active');
    },
  }, {
    name: 'activeMode',
    get(domNode) {
      return domNode.getAttribute('active-mode') || 'backwards';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onProgressActiveEnd(evt) {
      callSimpleEvent('activeend', evt, this.domNode);
    },
  },
};
