/* global isWeChatMiniProgram */

const props = [{
  name: 'nodes',
  get(domNode) {
    return domNode.getAttribute('nodes') || [];
  },
}];
if (isWeChatMiniProgram) {
  props.push({
    name: 'space',
    get(domNode) {
      return domNode.getAttribute('space') || '';
    },
  });
}

export default {
  name: 'rich-text',
  props,
  handles: {},
};
