// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const ScrollView = {
  name: 'scroll-view',
  props: [{
    name: 'scroll-x',
    get(domNode) {
      return !!domNode.getAttribute('scroll-x');
    },
  }, {
    name: 'scroll-y',
    get(domNode) {
      return !!domNode.getAttribute('scroll-y');
    },
  }, {
    name: 'upper-threshold',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('upper-threshold'), 10);
      return !isNaN(value) ? value : 50;
    },
  }, {
    name: 'lower-threshold',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('lower-threshold'), 10);
      return !isNaN(value) ? value : 50;
    },
  }, {
    name: 'scroll-top',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scroll-top'), 10);
      return !isNaN(value) ? value : '';
    },
  }, {
    name: 'scroll-left',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scroll-left'), 10);
      return !isNaN(value) ? value : '';
    },
  }, {
    name: 'scroll-into-view',
    get(domNode) {
      return domNode.getAttribute('scroll-into-view') || '';
    },
  }, {
    name: 'scroll-with-animation',
    get(domNode) {
      return !!domNode.getAttribute('scroll-with-animation');
    },
  }, {
    name: 'scroll-animation-duration',
    get(domNode) {
      return domNode.getAttribute('scroll-animation-duration');
    },
  }, {
    name: 'enable-back-to-top',
    get(domNode) {
      return !!domNode.getAttribute('enable-back-to-top');
    },
  }, {
    name: 'enable-flex',
    get(domNode) {
      return !!domNode.getAttribute('enable-flex');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onScrollViewScrollToUpper',
    eventName: 'scrolltoupper'
  },
  {
    name: 'onScrollViewScrollToLower',
    eventName: 'scrolltolower'
  }],
  functionalSingleEvents: [
    {
      name: 'onScrollViewScroll',
      eventName: 'scroll',
      middleware(evt, domNode) {
        domNode.__setAttributeWithoutUpdate('scroll-into-view', '');
        domNode.__setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop);
        domNode.__setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft);
      }
    }
  ]
};

if (isWeChatMiniProgram) {
  ScrollView.singleEvents = ScrollView.singleEvents.concat([
    {
      name: 'onScrollViewRefresherPulling',
      eventName: 'refresherpulling'
    },
    {
      name: 'onScrollViewRefresherRefresh',
      eventName: 'refresherrefresh'
    },
    {
      name: 'onScrollViewRefresherRestore',
      eventName: 'refresherrestore'
    },
    {
      name: 'onScrollViewRefresherAbort',
      eventName: 'refresherabort'
    }
  ]);
}

export default ScrollView;
