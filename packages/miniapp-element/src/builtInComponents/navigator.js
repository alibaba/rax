import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'navigator',
  props: [{
    name: 'target',
    get(domNode) {
      return domNode.getAttribute('target') || 'self';
    },
  }, {
    name: 'url',
    get(domNode) {
      return domNode.getAttribute('url') || '';
    },
  }, {
    name: 'openType',
    get(domNode) {
      return domNode.getAttribute('open-type') || 'navigate';
    },
  }, {
    name: 'delta',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('delta'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'appId',
    get(domNode) {
      return domNode.getAttribute('app-id') || '';
    },
  }, {
    name: 'path',
    get(domNode) {
      return domNode.getAttribute('path') || '';
    },
  }, {
    name: 'extraData',
    get(domNode) {
      return domNode.getAttribute('extra-data') || {};
    },
  }, {
    name: 'version',
    get(domNode) {
      return domNode.getAttribute('version') || 'release';
    },
  }, {
    name: 'hoverClass',
    get(domNode) {
      return domNode.getAttribute('hover-class') || 'navigator-hover';
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
      return !isNaN(value) ? value : 600;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onNavigatorSuccess(evt) {
      callSimpleEvent('success', evt, this.domNode);
    },
    onNavigatorFail(evt) {
      callSimpleEvent('fail', evt, this.domNode);
    },
    onNavigatorComplete(evt) {
      callSimpleEvent('complete', evt, this.domNode);
    },
  },
};
