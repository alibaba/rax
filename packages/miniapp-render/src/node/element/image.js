/* global CONTAINER */
import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';
import Event from '../../event/event';

const pool = new Pool();

class Image extends Element {
  // Create instance
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reuse element node
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new Image(options, tree);
  }

  // Override the parent class's $$init instance method
  $$init(options, tree) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super.$$init(options, tree);

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

  // Override the parent class's recovery instance method
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reuse element node
      pool.add(this);
    }
  }

  // Update parent
  $_triggerParentUpdate() {
    this.$_initRect();
    super.$_triggerParentUpdate();
  }

  // Init length
  $_initRect() {
    const width = parseInt(this.$_attrs.get('width'), 10);
    const height = parseInt(this.$_attrs.get('height'), 10);

    if (typeof width === 'number' && width >= 0) this.$_style.width = `${width}px`;
    if (typeof height === 'number' && height >= 0) this.$_style.height = `${height}px`;
  }

  // Reset width & height
  $_resetRect(rect = {}) {
    this.$_naturalWidth = rect.width || 0;
    this.$_naturalHeight = rect.height || 0;

    this.$_initRect();
  }

  get src() {
    return this.$_attrs.get('src') || '';
  }

  set src(value) {
    if (!value || typeof value !== 'string') return;

    this.$_attrs.set('src', value);

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
    return +this.$_attrs.get('width') || 0;
  }

  set width(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.$_attrs.set('width', value);
    this.$_initRect();
  }

  get height() {
    return +this.$_attrs.get('height') || 0;
  }

  set height(value) {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) return;

    this.$_attrs.set('height', value);
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
