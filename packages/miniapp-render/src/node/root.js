import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import getProperty from '../utils/getProperty';

class RootElement extends Element {
  $$init(options, tree) {
    super.$$init(options, tree);
    this.allowRender = true;
    this.renderStacks = [];
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
    const renderObject = {};
    const renderStacks = [];
    const pathCache = [];
    const internal = cache.getDocument(this.__pageId)._internal;
    for (let i = 0, j = this.renderStacks.length; i < j; i++) {
      const renderTask = this.renderStacks[i];
      const path = renderTask.path;
      const taskInfo = getProperty(internal.data, path, pathCache);
      if (!taskInfo.parentRendered) continue;
      if (renderTask.type === 'children') {
        // path cache should save lastest taskInfo value
        pathCache.push({
          path: renderTask.path,
          value: taskInfo.value
        });
      }

      if (!internal.$batchedUpdates) {
        // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
        if (renderTask.type === 'children') {
          if (!renderObject[path]) {
            renderObject[path] = taskInfo.value ? [...taskInfo.value] : [];
          }
          if (renderTask.item) {
            renderObject[path].splice(renderTask.start, renderTask.deleteCount, renderTask.item);
          } else {
            renderObject[path].splice(renderTask.start, renderTask.deleteCount);
          }
        } else {
          renderObject[path] = renderTask.value;
        }
      } else {
        renderStacks.push(renderTask);
      }
    }

    this.$$trigger('render', { args: internal.$batchedUpdates ? renderStacks : renderObject });
    this.renderStacks = [];
  }
}

export default RootElement;

