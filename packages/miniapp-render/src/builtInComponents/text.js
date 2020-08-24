// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const text = {
  name: 'text',
  props: [{
    name: 'selectable',
    get(domNode) {
      return !!domNode.getAttribute('selectable');
    },
  }, {
    name: 'space',
    get(domNode) {
      return domNode.getAttribute('space') || '';
    },
  }, {
    name: 'decode',
    get(domNode) {
      return !!domNode.getAttribute('decode');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }]
};

if (isMiniApp) {
  text.props.push({
    name: 'number-of-lines',
    get(domNode) {
      return domNode.getAttribute('number-of-lines');
    }
  });
}

export default text;
