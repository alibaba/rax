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

export default ScrollView;
