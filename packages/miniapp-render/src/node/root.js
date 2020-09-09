import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import getProperty from '../utils/getProperty';
import { BODY_NODE_ID } from '../constants';

class RootElement extends Element {
  constructor(options) {
    super(options);
    this.__nodeId = BODY_NODE_ID;
    this.allowRender = true;
    this.renderStacks = [];
    this.__renderCallbacks = [];
  }

  $$destroy() {
    super.$$destroy();
    this.allowRender = null;
    this.renderStacks = null;
  }

  get _path() {
    return 'root';
  }
  get _root() {
    return this;
  }

  enqueueRender(payload) {
    clearTimeout(this.__timer);
    this.__timer = setTimeout(() => {
      this.executeRender();
    }, 0);
    this.renderStacks.push(payload);
  }

  executeRender() {
    if (!this.allowRender) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      perf.start('setData');
    }
    // type 1: { path, start, deleteCount, item? } => need to simplify item
    // type 2: { path, value }

    const internal = cache.getDocument(this.__pageId)._internal;

    if (internal.$batchedUpdates) {
      let callback;
      internal.$batchedUpdates(() => {
        this.renderStacks.forEach((task, index) => {
          if (index === this.renderStacks.length - 1) {
            callback = () => {
              if (process.env.NODE_ENV === 'development') {
                perf.stop('setData');
              }
              let fn;
              while (fn = this.__renderCallbacks.pop()) {
                fn();
              }
            };
            internal.firstRenderCallback();
          }
          if (task.type === 'children') {
            const spliceArgs = [task.start, task.deleteCount];
            internal.$spliceData({
              [task.path]: task.item ? spliceArgs.concat(task.item) : spliceArgs
            }, callback);
          } else {
            internal.setData({
              [task.path]: task.value
            }, callback);
          }
        });
      });
    } else {
      const renderObject = {};
      const pathCache = [];
      this.renderStacks.forEach(task => {
        const path = task.path;
        // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
        if (task.type === 'children') {
          const taskInfo = getProperty(internal.data, path, pathCache);
          // path cache should save lastest taskInfo value
          pathCache.push({
            path: task.path,
            value: taskInfo.value
          });

          if (!renderObject[path]) {
            renderObject[path] = taskInfo.value ? [...taskInfo.value] : [];
          }
          if (task.item) {
            renderObject[path].splice(task.start, task.deleteCount, task.item);
          } else {
            renderObject[path].splice(task.start, task.deleteCount);
          }
        } else {
          renderObject[path] = task.value;
        }
      });
      internal.firstRenderCallback(renderObject);
      internal.setData(renderObject, () => {
        let fn;
        while (fn = this.__renderCallbacks.pop()) {
          fn();
        }
        if (process.env.NODE_ENV === 'development') {
          perf.stop('setData');
        }
      });
    }

    this.renderStacks = [];
  }
}

export default RootElement;

