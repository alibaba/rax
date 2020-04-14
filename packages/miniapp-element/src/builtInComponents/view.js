export default {
  name: 'view',
  props: [{
    name: 'hoverClass',
    get(domNode) {
      return domNode.getAttribute('hover-class') || 'none';
    },
  }, {
    name: 'hoverStopPropagation',
    get(domNode) {
      return !!domNode.getAttribute('hover-stop-propagation');
    },
  }, {
    name: 'hoverStartTime',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('hover-start-time'), 10);
      return !isNaN(value) ? value : 50;
    },
  }, {
    name: 'hoverStayTime',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('hover-stay-time'), 10);
      return !isNaN(value) ? value : 400;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
