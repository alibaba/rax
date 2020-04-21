import render from 'miniapp-render';
import callSimpleEvent from '../events/callSimpleEvent';

const { cache } = render.$$adapter;

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
    get(domNode) {
      return +domNode.getAttribute('x') || 0;
    },
  }, {
    name: 'y',
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
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const domNode = cache.getNode(this.pageId, nodeId);

      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('x', evt.detail.x);
      domNode.$$setAttributeWithoutUpdate('y', evt.detail.y);
      callSimpleEvent('change', evt, domNode);
    },
    onMovableViewScale(evt) {
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const domNode = cache.getNode(this.pageId, nodeId);

      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('x', evt.detail.x);
      domNode.$$setAttributeWithoutUpdate('y', evt.detail.y);
      domNode.$$setAttributeWithoutUpdate('scale-value', evt.detail.scale);
      callSimpleEvent('scale', evt, domNode);
    },
    onMovableViewHtouchmove(evt) {
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const domNode = cache.getNode(this.pageId, nodeId);

      if (!domNode) return;

      callSimpleEvent('htouchmove', evt, domNode);
    },
    onMovableViewVtouchmove(evt) {
      const nodeId = evt.currentTarget.dataset.privateNodeId;
      const domNode = cache.getNode(this.pageId, nodeId);

      if (!domNode) return;

      callSimpleEvent('vtouchmove', evt, domNode);
    },
  },
};
