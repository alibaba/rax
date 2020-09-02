// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram } from 'universal-env';

const ScrollView = {
  name: 'scroll-view',
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
        domNode._setAttributeWithOutUpdate('scroll-into-view', '');
        domNode._setAttributeWithOutUpdate('scroll-top', evt.detail.scrollTop);
        domNode._setAttributeWithOutUpdate('scroll-left', evt.detail.scrollLeft);
      }
    }
  ]
};

if (isWeChatMiniProgram) {
  ScrollView.props = ScrollView.props.concat([,
    {
      name: 'scroll-anchoring',
      get(domNode) {
        return !!domNode.getAttribute('scroll-anchoring');
      },
    }, {
      name: 'refresher-enabled',
      get(domNode) {
        return !!domNode.getAttribute('refresher-enabled');
      },
    }, {
      name: 'refresher-threshold',
      get(domNode) {
        return domNode.getAttribute('refresher-threshold') || '45';
      },
    }, {
      name: 'refresher-defaultStyle',
      get(domNode) {
        return domNode.getAttribute('refresher-default-style') || 'black';
      },
    }, {
      name: 'refresher-background',
      get(domNode) {
        return domNode.getAttribute('refresher-background') || '#FFF';
      },
    }, {
      name: 'refresher-triggered',
      get(domNode) {
        return !!domNode.getAttribute('refresher-triggered');
      },
    }
  ]);
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
