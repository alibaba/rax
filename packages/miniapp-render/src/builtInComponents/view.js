// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

const view = {
  name: 'view',
  props: [{
    name: 'hover-class',
    get(domNode) {
      return domNode.getAttribute('hover-class') || 'none';
    },
  }, {
    name: 'hover-stop-propagation',
    get(domNode) {
      return !!domNode.getAttribute('hover-stop-propagation');
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
      return !isNaN(value) ? value : 400;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }]
};

if (isMiniApp) {
  view.props.push({
    name: 'disable-scroll',
    get(domNode) {
      return !!domNode.getAttribute('disable-scroll');
    },
  });
  view.simpleEvents = [{
    name: 'onViewAppear',
    eventName: 'appear'
  },
  {
    name: 'onViewFirstAppear',
    eventName: 'firstappear'
  },
  {
    name: 'onViewDisappear',
    eventName: 'disappear'
  }];
}

export default view;
