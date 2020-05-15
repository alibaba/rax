import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'movable-view',
  props: [{
    name: 'direction',
    get(domNode) {
      return domNode.getAttribute('direction') || 'none';
    },
  }, {
    name: 'inertia',
    get(domNode) {
      return !!domNode.getAttribute('inertia');
    },
  }, {
    name: 'outOfBounds',
    get(domNode) {
      return !!domNode.getAttribute('out-of-bounds');
    },
  }, {
    name: 'x',
    canBeUserChanged: true,
    get(domNode) {
      return +domNode.getAttribute('x') || 0;
    },
  }, {
    name: 'y',
    canBeUserChanged: true,
    get(domNode) {
      return +domNode.getAttribute('y') || 0;
    },
  }, {
    name: 'damping',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('damping'), 10);
      return !isNaN(value) ? value : 20;
    },
  }, {
    name: 'friction',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('friction'), 10);
      return !isNaN(value) ? value : 2;
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return !!domNode.getAttribute('disabled');
    },
  }, {
    name: 'scale',
    canBeUserChanged: true,
    get(domNode) {
      return !!domNode.getAttribute('scale');
    },
  }, {
    name: 'scaleMin',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scale-min'), 10);
      return !isNaN(value) ? value : 0.5;
    },
  }, {
    name: 'scaleMax',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scale-max'), 10);
      return !isNaN(value) ? value : 10;
    },
  }, {
    name: 'scaleValue',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('scale-value'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'animation',
    get(domNode) {
      const value = domNode.getAttribute('animation');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onMovableViewChange(evt) {
      const domNode = this.getDomNodeFromEvt('change', evt);

      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('x', evt.detail.x);
      domNode.$$setAttributeWithoutUpdate('y', evt.detail.y);

      domNode.__oldValues = domNode.__oldValues || {};
      domNode.__oldValues.x = evt.detail.x;
      domNode.__oldValues.y = evt.detail.y;
      callSingleEvent('change', evt, this);
    },
    onMovableViewScale(evt) {
      const domNode = this.getDomNodeFromEvt('scale', evt);

      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('x', evt.detail.x);
      domNode.$$setAttributeWithoutUpdate('y', evt.detail.y);
      domNode.$$setAttributeWithoutUpdate('scale-value', evt.detail.scale);
      callSingleEvent('scale', evt, this);
    },
    onMovableViewHtouchmove(evt) {
      callSingleEvent('htouchmove', evt, this);
    },
    onMovableViewVtouchmove(evt) {
      callSingleEvent('vtouchmove', evt, this);
    },
  },
};
