// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isMiniApp } from 'universal-env';

const canvas = {
  name: 'canvas',
  props: [{
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || '';
    },
  }, {
    name: 'canvas-id',
    get(domNode) {
      return domNode.getAttribute(isWeChatMiniProgram ? 'canvas-id' : 'id') || '';
    },
  }, {
    name: 'disable-scroll',
    get(domNode) {
      return !!domNode.getAttribute('disable-scroll');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onCanvasTouchStart',
    eventName: 'canvastouchstart'
  },
  {
    name: 'onCanvasTouchMove',
    eventName: 'canvastouchmove'
  },
  {
    name: 'onCanvasTouchEnd',
    eventName: 'canvastouchend'
  },
  {
    name: 'onCanvasTouchCancel',
    eventName: 'canvastouchcancel'
  },
  {
    name: 'onCanvasLongTap',
    eventName: 'longtap'
  },
  {
    name: 'onCanvasError',
    eventName: 'error'
  }]
};

if (isMiniApp) {
  canvas.props = canvas.props.concat([
    {
      name: 'width',
      get(domNode) {
        return domNode.getAttribute('width') || '';
      },
    }, {
      name: 'height',
      get(domNode) {
        return domNode.getAttribute('height') || '';
      },
    }
  ]);
}

export default canvas;
