/* global CONTAINER */
import Element from '../element';
import Event from '../../event/event';

class Image extends Element {
  // Create instance
  static _create(options, tree) {
    return new Image(options, tree);
  }

  // Override the parent class's _init instance method
  _init(options, tree) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super._init(options, tree);

    this.__naturalWidth = 0;
    this.__naturalHeight = 0;

    this._initRect();
  }

  // Override the parent class's destroy instance method
  _destroy() {
    super._destroy();

    this.__naturalWidth = null;
    this.__naturalHeight = null;
  }

  // Override the parent class's recovery instance method
  _recycle() {
    this._destroy();
  }

  // Init length
  _initRect() {
    const width = parseInt(this._attrs.get('width'), 10);
    const height = parseInt(this._attrs.get('height'), 10);

    if (typeof width === 'number' && width >= 0) this._style.width = `${width}px`;
    if (typeof height === 'number' && height >= 0) this._style.height = `${height}px`;
  }

  // Reset width & height
  _resetRect(rect = {}) {
    this.__naturalWidth = rect.width || 0;
    this.__naturalHeight = rect.height || 0;

    this._initRect();
  }

  get src() {
    return this._attrs.get('src') || '';
  }

  set src(value) {
    if (!value || typeof value !== 'string') return;

    this._attrs.set('src', value);

    setTimeout(() => {
      if (this.src.indexOf('data:image') !== 0) {
        CONTAINER.getImageInfo({
          src: this.src,
          success: res => {
            // Load successfully, adjust the width and height of the picture
            this._resetRect(res);

            // Load event
            this._trigger('load', {
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
            this._resetRect({width: 0, height: 0});

            // Trigger error event
            this._trigger('error', {
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
    return +this._attrs.get('width') || 0;
  }

  set width(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this._attrs.set('width', value);
    this._initRect();
  }

  get height() {
    return +this._attrs.get('height') || 0;
  }

  set height(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this._attrs.set('height', value);
    this._initRect();
  }

  get naturalWidth() {
    return this.__naturalWidth;
  }

  get naturalHeight() {
    return this.__naturalHeight;
  }
}

export default Image;
