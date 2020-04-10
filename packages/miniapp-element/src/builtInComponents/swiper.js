import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'swiper',
  props: [{
    name: 'indicatorDots',
    get(domNode) {
      return !!domNode.getAttribute('indicator-dots');
    },
  }, {
    name: 'indicatorColor',
    get(domNode) {
      return domNode.getAttribute('indicator-color') || 'rgba(0, 0, 0, .3)';
    },
  }, {
    name: 'indicatorActiveColor',
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
    name: 'previousMargin',
    get(domNode) {
      return domNode.getAttribute('previous-margin') || '0px';
    },
  }, {
    name: 'nextMargin',
    get(domNode) {
      return domNode.getAttribute('next-margin') || '0px';
    },
  }, {
    name: 'displayMultipleItems',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('display-multiple-items'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'skipHiddenItemLayout',
    get(domNode) {
      return !!domNode.getAttribute('skip-hidden-item-layout');
    },
  }, {
    name: 'easingFunction',
    get(domNode) {
      return domNode.getAttribute('easing-function') || 'default';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onSwiperChange(evt) {
      if (!this.domNode) return;

      this.domNode.$$setAttributeWithoutUpdate('current', evt.detail.current);
      callSimpleEvent('change', evt, this.domNode);
    },
    onSwiperTransition(evt) {
      callSimpleEvent('transition', evt, this.domNode);
    },
    onSwiperAnimationfinish(evt) {
      callSimpleEvent('animationfinish', evt, this.domNode);
    },
  },
};
