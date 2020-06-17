// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

let props = [{
  name: 'src',
  get(domNode) {
    return domNode.src;
  },
}, {
  name: 'mode',
  get(domNode) {
    return domNode.getAttribute('mode') || 'scaleToFill';
  },
}, {
  name: 'lazy-load',
  get(domNode) {
    return !!domNode.getAttribute('lazy-load');
  },
}, {
  name: 'animation',
  get(domNode) {
    return domNode.getAttribute('animation');
  }
}];

if (isWeChatMiniProgram) {
  props = props.concat([
    {
      name: 'show-menu-by-longpress',
      get(domNode) {
        return !!domNode.getAttribute('show-menu-by-longpress');
      }
    },
    {
      name: 'webp',
      get(domNode) {
        return !!domNode.getAttribute('webp');
      }
    },
  ]);
}
if (isMiniApp) {
  props.push({
    name: 'default-source',
    get(domNode) {
      return !!domNode.getAttribute('default-source');
    },
  });
}

export default {
  name: 'image',
  props,
  singleEvents: [{
    name: 'onImageLoad',
    eventName: 'load'
  },
  {
    name: 'onImageError',
    eventName: 'error'
  }]
};
