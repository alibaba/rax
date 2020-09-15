/* global CONTAINER */
import Element from '../element';
import Event from '../../event/event';

class Image extends Element {
  constructor(options) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super(options);

    this.$_naturalWidth = 0;
    this.$_naturalHeight = 0;

    this.$_initRect();
  }

  // Override the parent class's destroy instance method
  $$destroy() {
    super.$$destroy();

    this.$_naturalWidth = null;
    this.$_naturalHeight = null;
  }

  // Init length
  $_initRect() {
    const width = parseInt(this.__attrs.get('width'), 10);
    const height = parseInt(this.__attrs.get('height'), 10);

    if (typeof width === 'number' && width >= 0) this.style.width = `${width}px`;
    if (typeof height === 'number' && height >= 0) this.style.height = `${height}px`;
  }

  // Reset width & height
  $_resetRect(rect = {}) {
    this.$_naturalWidth = rect.width || 0;
    this.$_naturalHeight = rect.height || 0;

    this.$_initRect();
  }

  get _renderInfo() {
    return {
      nodeId: this.__nodeId,
      pageId: this.__pageId,
      nodeType: 'image',
      ...this.__attrs.__value,
      style: this.style.cssText,
      class: 'h5-img ' + this.className,
    };
  }

  get src() {
    return this.__attrs.get('src') || '';
  }

  set src(value) {
    if (!value || typeof value !== 'string') return;

    this.__attrs.set('src', value);

    setTimeout(() => {
      if (this.src.indexOf('data:image') !== 0) {
        CONTAINER.getImageInfo({
          src: this.src,
          success: res => {
            // Load successfully, adjust the width and height of the picture
            this.$_resetRect(res);

            // Load event
            this.$$trigger('load', {
              event: new Event({
                name: 'load',
                target: this,
                eventPhase: Event.AT_TARGET
              }),
              currentTarget: this,
            });
          },
          fail: () => {
            // Load failed, adjust the width and height of the image
            this.$_resetRect({width: 0, height: 0});

            // Trigger error event
            this.$$trigger('error', {
              event: new Event({
                name: 'error',
                target: this,
                eventPhase: Event.AT_TARGET
              }),
              currentTarget: this,
            });
          },
        });
      }
    }, 0);
  }

  get width() {
    return +this.__attrs.get('width') || 0;
  }

  set width(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.__attrs.set('width', value);
    this.$_initRect();
  }

  get height() {
    return +this.__attrs.get('height') || 0;
  }

  set height(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.__attrs.set('height', value);
    this.$_initRect();
  }

  get naturalWidth() {
    return this.$_naturalWidth;
  }

  get naturalHeight() {
    return this.$_naturalHeight;
  }
}

export default Image;
