export default {
  name: 'rich-text',
  props: [{
    name: 'nodes',
    get(domNode) {
      return domNode.getAttribute('nodes') || [];
    },
  }],
  handles: {},
};
