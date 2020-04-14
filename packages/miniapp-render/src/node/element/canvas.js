// eslint-disable-next-line import/no-extraneous-dependencies
import { isWeChatMiniProgram, isMiniApp } from 'universal-env';
import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class HTMLCanvasElement extends Element {
  /**
   * 创建实例
   */
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new HTMLCanvasElement(options, tree);
  }

  /**
   * 覆写父类的 $$init 方法
   */
  $$init(options, tree) {
    const width = options.width;
    const height = options.height;

    if (typeof width === 'number' && width >= 0) options.attrs.width = width;
    if (typeof height === 'number' && height >= 0) options.attrs.height = height;

    super.$$init(options, tree);

    this.$_node = null;

    this.$_initRect();
  }

  /**
   * 覆写父类的回收实例方法
   */
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      pool.add(this);
    }
  }

  /**
   * 准备 canvas 节点
   */
  $$prepare() {
    return new Promise((resolve, reject) => {
      if (isMiniApp) {
        this.addEventListener('canvasReady', () => {
          resolve(this);
        });
      } else if (isWeChatMiniProgram) {
        this.$$getNodesRef().then(nodesRef => nodesRef.node(res => {
          this.$_node = res.node;

          // 设置 canvas 宽高
          this.$_node.width = this.width;
          this.$_node.height = this.height;

          resolve(this);
        }).exec()).catch(reject);
      }
    });
  }

  /**
   * 更新父组件树
   */
  $_triggerParentUpdate() {
    this.$_initRect();
    super.$_triggerParentUpdate();
  }

  /**
   * 初始化长宽
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

  /**
   * 对外属性和方法
   */
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
