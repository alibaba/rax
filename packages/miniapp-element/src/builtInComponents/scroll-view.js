// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';
import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('scrolltoupper', evt, this.domNode);
    },
    onScrollViewScrolltolower(evt) {
      callSimpleEvent('scrolltolower', evt, this.domNode);
    },
    onScrollViewScroll(evt) {
      const domNode = this.domNode;
      if (!domNode) return;
      domNode.$$setAttributeWithoutUpdate('scroll-into-view', '');
      domNode.$$setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop);
      domNode.$$setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.scrollIntoView = '';
      domNode.__oldValues.scrollTop = evt.detail.scrollTop;
      domNode.__oldValues.scrollLeft = evt.detail.scrollLeft;
      callSimpleEvent('scroll', evt, this.domNode);
    },
  },
};

if (isWeChatMiniProgram) {
  Object.assign(ScrollView.handles, {
    onScrollViewRefresherPulling(evt) {
      callSimpleEvent('refresherpulling', evt, this.domNode);
    },

    onScrollViewRefresherRefresh(evt) {
      callSimpleEvent('refresherrefresh', evt, this.domNode);
    },

    onScrollViewRefresherRestore(evt) {
      callSimpleEvent('refresherrestore', evt, this.domNode);
    },

    onScrollViewRefresherAbort(evt) {
      callSimpleEvent('refresherabort', evt, this.domNode);
    },
  });
}

export default ScrollView;
