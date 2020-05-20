// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';
import callSingleEvent from '../events/callSingleEvent';

const ScrollView = {
  name: 'scroll-view',
  props: [{
    name: 'scrollX',
    get(domNode) {
      return !!domNode.getAttribute('scroll-x');
    },
  }, {
    name: 'scrollY',
    get(domNode) {
      return !!domNode.getAttribute('scroll-y');
    },
  }, {
    name: 'upperThreshold',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('upper-threshold'), 10);
      return !isNaN(value) ? value : 50;
    },
  }, {
    name: 'lowerThreshold',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('lower-threshold'), 10);
      return !isNaN(value) ? value : 50;
    },
  }, {
    name: 'scrollTop',
    canBeUserChanged: true,
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scroll-top'), 10);
      return !isNaN(value) ? value : '';
    },
  }, {
    name: 'scrollLeft',
    canBeUserChanged: true,
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scroll-left'), 10);
      return !isNaN(value) ? value : '';
    },
  }, {
    name: 'scrollIntoView',
    canBeUserChanged: true,
    get(domNode) {
      return domNode.getAttribute('scroll-into-view') || '';
    },
  }, {
    name: 'scrollWithAnimation',
    get(domNode) {
      return !!domNode.getAttribute('scroll-with-animation');
    },
  }, {
    name: 'scrollAnimationDuration',
    get(domNode) {
      return domNode.getAttribute('scroll-animation-duration');
    },
  }, {
    name: 'enableBackToTop',
    get(domNode) {
      return !!domNode.getAttribute('enable-back-to-top');
    },
  }, {
    name: 'enableFlex',
    get(domNode) {
      return !!domNode.getAttribute('enable-flex');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onScrollViewScrolltoupper(evt) {
      callSingleEvent('scrolltoupper', evt, this);
    },
    onScrollViewScrolltolower(evt) {
      callSingleEvent('scrolltolower', evt, this);
    },
    onScrollViewScroll(evt) {
      const domNode = this.getDomNodeFromEvt('scroll', evt);
      if (!domNode) return;
      domNode.$$setAttributeWithoutUpdate('scroll-into-view', '');
      domNode.$$setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop);
      domNode.$$setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.scrollIntoView = '';
      domNode.__oldValues.scrollTop = evt.detail.scrollTop;
      domNode.__oldValues.scrollLeft = evt.detail.scrollLeft;
      callSingleEvent('scroll', evt, this);
    },
  },
};

if (isWeChatMiniProgram) {
  Object.assign(ScrollView.handles, {
    onScrollViewRefresherPulling(evt) {
      callSingleEvent('refresherpulling', evt, this);
    },

    onScrollViewRefresherRefresh(evt) {
      callSingleEvent('refresherrefresh', evt, this);
    },

    onScrollViewRefresherRestore(evt) {
      callSingleEvent('refresherrestore', evt, this);
    },

    onScrollViewRefresherAbort(evt) {
      callSingleEvent('refresherabort', evt, this);
    },
  });
}

export default ScrollView;
