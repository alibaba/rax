// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isMiniApp } from 'universal-env';
import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class HTMLCanvasElement extends Element {
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

    return new HTMLCanvasElement(options, tree);
  }

  // Override the parent class's $$init method
  $$init(options, tree) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super.$$init(options, tree);

    this.$_node = null;

    this.$_initRect();
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

  // Prepare canvas node
  $$prepare() {
    return new Promise((resolve, reject) => {
      if (isMiniApp) {
        this.addEventListener('canvasReady', () => {
          resolve(this);
        });
      } else if (isWeChatMiniProgram) {
        this.$$getNodesRef().then(nodesRef => nodesRef.node(res => {
          this.$_node = res.node;

          // Set canvas width & height
          this.$_node.width = this.width;
          this.$_node.height = this.height;

          resolve(this);
        }).exec()).catch(reject);
      }
    });
  }

  /**
   * Update parent node
   */
  $_triggerParentUpdate() {
    this.$_initRect();
    super.$_triggerParentUpdate();
  }

  /**
   * Init length
   */
  $_initRect() {
    const width = parseInt(this.$_attrs.get('width'), 10);
    const height = parseInt(this.$_attrs.get('height'), 10);

    if (typeof width === 'number' && width >= 0) {
      this.$_style.width = `${width}px`;
      if (this.$_node) this.$_node.width = width;
    }
    if (typeof height === 'number' && height >= 0) {
      this.$_style.height = `${height}px`;
      if (this.$_node) this.$_node.height = height;
    }
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

  getContext(type) {
    if (this.$_node) console.warn('canvas is not prepared, please call $$prepare method first');
    return this.$_node.getContext(type);
  }
}

export default HTMLCanvasElement;
