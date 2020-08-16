import { mutate } from './MutationObserver';

const CanvasContext2DMethods = [
  'arc',
  'arcTo',
  'addHitRegion',
  'beginPath',
  'bezierCurveTo',
  'clearHitRegions',
  'clearRect',
  'clip',
  'closePath',
  'createImageData',
  'createLinearGradient',
  'createPattern',
  'createRadialGradient',
  'drawFocusIfNeeded',
  'drawImage',
  'drawWidgetAsOnScreen',
  'drawWindow',
  'ellipse',
  'fill',
  'fillRect',
  'fillText',
  'getImageData',
  'getLineDash',
  'isPointInPath',
  'isPointInStroke',
  'lineTo',
  'measureText',
  'moveTo',
  'putImageData',
  'quadraticCurveTo',
  'rect',
  'removeHitRegion',
  'resetTransform',
  'restore',
  'rotate',
  'save',
  'scale',
  'scrollPathIntoView',
  'setLineDash',
  'setTransform',
  'stroke',
  'strokeRect',
  'strokeText',
  'transform',
  'translate'
];

export default class CanvasRenderingContext2D {
  constructor(vnode) {
    this.canvas = vnode;

    let propertyValues = {
      fillStyle: '#000000',
      filter: 'none',
      font: '10px sans-serif',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'low',
      lineCap: 'butt',
      lineDashOffset: 0,
      lineJoin: 'miter',
      lineWidth: 1,
      miterLimit: 10,
      shadowBlur: 0,
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeStyle: '#000000',
      textAlign: 'start',
      textBaseline: 'alphabetic'
    };

    // context properties
    const properties = [
      'direction',
      'fillStyle',
      'filter',
      'font',
      'globalAlpha',
      'globalCompositeOperation',
      'imageSmoothingEnabled',
      'imageSmoothingQuality',
      'lineCap',
      'lineDashOffset',
      'lineJoin',
      'lineWidth',
      'miterLimit',
      'shadowBlur',
      'shadowColor',
      'shadowOffsetX',
      'shadowOffsetY',
      'strokeStyle',
      'textAlign',
      'textBaseline'
    ];

    properties.forEach(property => {
      Object.defineProperty(this, property, {
        get: function() {
          return propertyValues[property];
        },
        set: function(value) {
          propertyValues[property] = value;
        }
      });
    });

    CanvasContext2DMethods.forEach(method => {
      this[method] = (...args) => {
        mutate(vnode, 'canvasRenderingContext2D', {
          method: method,
          args: args,
          properties: Object.assign({}, propertyValues)
        });
      };
    });
  }
}
