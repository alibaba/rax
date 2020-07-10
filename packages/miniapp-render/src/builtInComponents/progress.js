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
    name: 'border-radius',
    get(domNode) {
      return domNode.getAttribute('border-radius') || '0';
    },
  }, {
    name: 'font-size',
    get(domNode) {
      return domNode.getAttribute('font-size') || '16';
    },
  }, {
    name: 'stroke-width',
    get(domNode) {
      return domNode.getAttribute('stroke-width') || '6';
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '#09BB07';
    },
  }, {
    name: 'active-color',
    get(domNode) {
      return domNode.getAttribute('active-color') || '#09BB07';
    },
  }, {
    name: 'background-color',
    get(domNode) {
      return domNode.getAttribute('background-color') || '#EBEBEB';
    },
  }, {
    name: 'active',
    get(domNode) {
      return !!domNode.getAttribute('active');
    },
  }, {
    name: 'active-mode',
    get(domNode) {
      return domNode.getAttribute('active-mode') || 'backwards';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onProgressActiveEnd',
    eventName: 'activeend'
  }]
};
