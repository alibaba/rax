// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import Element from './element';
import cache from '../utils/cache';
import perf from '../utils/perf';
import getProperty from '../utils/getProperty';
import { propsMap } from '../builtInComponents';

function simplify(node) {
  const domInfo = node.$$domInfo;
  const simpleNode = {};
  for (let attr in domInfo) {
    simpleNode[attr] = domInfo[attr];
  }

  let componentType;
  if (node.behavior) {
    componentType = simpleNode.behavior = node.behavior;
  } else {
    componentType = node.tagName;
  }

  // Get specific props
  const specificProps = propsMap[componentType] || [];
  specificProps.forEach(prop => {
    simpleNode[prop.name] = prop.get(node);
  });

  return simpleNode;
}

function traverseTree(node, action) {
  if (!node) {
    return;
  }
  let copiedNode;
  let queue = [];
  queue.push(node);
  while (queue.length) {
    let curNode = queue.shift();
    const result = action(curNode);
    if (!copiedNode) {
      copiedNode = result;
      copiedNode.children = [];
    } else {
      curNode.__parent.children = curNode.__parent.children || [];
      curNode.__parent.children.push(result);
    }
    if (curNode.$_children && curNode.$_children.length) {
      curNode.$_children.forEach(n => n.__parent = result);
      queue = queue.concat(curNode.$_children);
    }
    if (!result.children) {
      result.children = [];
    }
  }
  return copiedNode;
}

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
      if (!taskInfo.parentRendered) break;
      if (renderTask.type === 'children') {
        const ElementNode = renderTask.item;
        const simplifiedNode = traverseTree(ElementNode, simplify);
        renderTask.item = simplifiedNode;
        pathCache.push({
          path: renderTask.path,
          value: renderTask.item
        });
      }

      if (!internal.$batchedUpdates) {
        // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist
        if (renderTask.type === 'children') {
          renderObject[path] = renderObject[path] || taskInfo.value || [];
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

