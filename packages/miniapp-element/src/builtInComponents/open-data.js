export default {
  name: 'open-data',
  props: [{
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || '';
    },
  }, {
    name: 'openGid',
    get(domNode) {
      return domNode.getAttribute('open-gid') || '';
    },
  }, {
    name: 'lang',
    get(domNode) {
      return domNode.getAttribute('lang') || 'en';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
