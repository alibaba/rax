// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

let props = [{
  name: 'open-type',
  get(domNode) {
    return domNode.getAttribute('open-type') || 'navigate';
  },
}, {
  name: 'hover-class',
  get(domNode) {
    return domNode.getAttribute('hover-class') || 'none';
  },
}, {
  name: 'hover-start-time',
  get(domNode) {
    const value = parseInt(domNode.getAttribute('hover-start-time'), 10);
    return !isNaN(value) ? value : 50;
  },
}, {
  name: 'hover-stay-time',
  get(domNode) {
    const value = parseInt(domNode.getAttribute('hover-stay-time'), 10);
    return !isNaN(value) ? value : 600;
  },
}, {
  name: 'url',
  get(domNode) {
    return domNode.getAttribute('url') || '';
  },
}, {
  name: 'animation',
  get(domNode) {
    return domNode.getAttribute('animation');
  }
}];
if (isWeChatMiniProgram) {
  props = props.concat([{
    name: 'target',
    get(domNode) {
      return domNode.getAttribute('target') || 'self';
    },
  }, {
    name: 'delta',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('delta'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'app-id',
    get(domNode) {
      return domNode.getAttribute('app-id') || '';
    },
  }, {
    name: 'path',
    get(domNode) {
      return domNode.getAttribute('path') || '';
    },
  }, {
    name: 'extra-data',
    get(domNode) {
      return domNode.getAttribute('extra-data') || {};
    },
  }, {
    name: 'version',
    get(domNode) {
      return domNode.getAttribute('version') || 'release';
    },
  }, {
    name: 'hover-stop-propagation',
    get(domNode) {
      return !!domNode.getAttribute('hover-stop-propagation');
    },
  }]);
}

export default {
  name: 'navigator',
  props,
  singleEvents: [{
    name: 'onNavigatorSuccess',
    eventName: 'success'
  },
  {
    name: 'onNavigatorFail',
    eventName: 'fail'
  },
  {
    name: 'onNavigatorComplete',
    eventName: 'complete'
  }]
};
