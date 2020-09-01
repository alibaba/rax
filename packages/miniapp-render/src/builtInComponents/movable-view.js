export default {
  name: 'movable-view',
  singleEvents: [{
    name: 'onMovableViewHtouchmove',
    eventName: 'htouchmove'
  },
  {
    name: 'onMovableViewVtouchmove',
    eventName: 'vtouchmove'
  }],
  functionalSingleEvents: [
    {
      name: 'onMovableViewChange',
      eventName: 'change',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('x', evt.detail.x);
        domNode._setAttributeWithOutUpdate('y', evt.detail.y);
      }
    },
    {
      name: 'onMovableViewScale',
      eventName: 'scale',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('x', evt.detail.x);
        domNode._setAttributeWithOutUpdate('y', evt.detail.y);
        domNode._setAttributeWithOutUpdate('scale-value', evt.detail.scale);
      }
    }
  ]
};
