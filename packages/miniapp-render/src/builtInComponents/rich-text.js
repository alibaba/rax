// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

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
  props
};
