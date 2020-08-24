// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp, isWeChatMiniProgram } from 'universal-env';

const swiper = {
  name: 'swiper',
  props: [{
    name: 'indicator-dots',
    get(domNode) {
      return !!domNode.getAttribute('indicator-dots');
    },
  }, {
    name: 'indicator-color',
    get(domNode) {
      return domNode.getAttribute('indicator-color') || 'rgba(0, 0, 0, .3)';
    },
  }, {
    name: 'indicator-active-color',
    get(domNode) {
      return domNode.getAttribute('indicator-active-color') || '#000000';
    },
  }, {
    name: 'autoplay',
    get(domNode) {
      return !!domNode.getAttribute('autoplay');
    },
  }, {
    name: 'current',
    get(domNode) {
      return +domNode.getAttribute('current') || 0;
    },
  }, {
    name: 'interval',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('interval'), 10);
      return !isNaN(value) ? value : 5000;
    },
  }, {
    name: 'duration',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('duration'), 10);
      return !isNaN(value) ? value : 500;
    },
  }, {
    name: 'circular',
    get(domNode) {
      return !!domNode.getAttribute('circular');
    },
  }, {
    name: 'vertical',
    get(domNode) {
      return !!domNode.getAttribute('vertical');
    },
  }, {
    name: 'previous-margin',
    get(domNode) {
      return domNode.getAttribute('previous-margin') || '0px';
    },
  }, {
    name: 'next-margin',
    get(domNode) {
      return domNode.getAttribute('next-margin') || '0px';
    },
  }, {
    name: 'display-multiple-items',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('display-multiple-items'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'skip-hidden-item-layout',
    get(domNode) {
      return !!domNode.getAttribute('skip-hidden-item-layout');
    },
  }, {
    name: 'easing-function',
    get(domNode) {
      return domNode.getAttribute('easing-function') || 'default';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onSwiperTransition',
    eventName: 'transition'
  }],
  functionalSingleEvents: [
    {
      name: 'onSwiperChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode.__setAttributeWithoutUpdate('current', evt.detail.current);
      }
    }
  ]
};

if (isMiniApp) {
  swiper.singleEvents.push({
    name: 'onSwiperAnimationEnd',
    eventName: 'animationEnd'
  });
}
if (isWeChatMiniProgram) {
  swiper.singleEvents.push({
    name: 'onSwiperAnimationFinish',
    eventName: 'animationfinish'
  });
}

export default swiper;
