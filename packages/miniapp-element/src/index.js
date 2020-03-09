/* global isMiniApp, Component */
import render from 'miniapp-render';
import filterNodes from './vdom/filterNodes';
import checkDiffChildNodes from './vdom/checkDiffChildNodes';
import checkComponentAttr from './vdom/checkComponentAttr';
import dealWithLeafAndSimple from './vdom/dealWithLeafAndSimple';
import init from './init';
import { componentNameMap, handlesMap } from './component';
import { NOT_SUPPORT } from './constants';
import getInitialProps from './adapter/getInitialProps';
import getId from './adapter/getId';
import getLifeCycle from './adapter/getLifeCycle';
import callEvent from './events/callEvent';
import callSimpleEvent from './events/callSimpleEvent';

const { cache, tool } = render.$$adapter;

// The number of levels of dom subtrees rendered as custom components
const MAX_DOM_SUB_TREE_LEVEL = 10;
let DOM_SUB_TREE_LEVEL = 10;

const config = {
  data: {
    builtinComponentName: '', // the builtIn component name
    customComponentName: '', // current render custom component name
    innerChildNodes: [], // BuiltIn component children
    childNodes: []
  },
  ...getInitialProps(),
  options: {
    addGlobalClass: true // global style
  },
  methods: {
    // Watch child nodes update
    onChildNodesUpdate() {
      // Node unomunted
      if (!this.pageId || !this.nodeId) return;

      // child nodes update
      const childNodes = filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1);
      const oldChildNodes =
        this.data.builtinComponentName || this.data.customComponentName
          ? this.data.innerChildNodes
          : this.data.childNodes;
      if (checkDiffChildNodes(childNodes, oldChildNodes)) {
        const dataChildNodes = dealWithLeafAndSimple(
          childNodes,
          this.onChildNodesUpdate
        );
        const newData = {};
        if (this.data.builtinComponentName || this.data.customComponentName) {
          // builtIn component/custom component
          newData.innerChildNodes = dataChildNodes;
          newData.childNodes = [];
        } else {
          // normal tag
          newData.innerChildNodes = [];
          newData.childNodes = dataChildNodes;
        }
        this.setData(newData);
      }

      // dispatch child update
      const childNodeStack = [].concat(childNodes);
      let childNode = childNodeStack.pop();
      while (childNode) {
        if (
          childNode.type === 'element' &&
          !childNode.isLeaf &&
          !childNode.isSimple
        ) {
          childNode.domNode.$$trigger('$$childNodesUpdate');
        }

        if (childNode.childNodes && childNode.childNodes.length)
          childNode.childNodes.forEach(subChildNode =>
            childNodeStack.push(subChildNode)
          );
        childNode = childNodeStack.pop();
      }
    },

    // Watch node update
    onSelfNodeUpdate() {
      // Node unomunted
      if (!this.pageId || !this.nodeId) return;

      const newData = {};
      const domNode = this.domNode;
      const data = this.data;
      const tagName = domNode.tagName;
      let newAttrData = newData;

      if (!this.__ready) {
        this.__readyData = newAttrData = {};
      }

      if (tagName === 'BUILTIN-COMPONENT') {
        // BuiltIn component
        if (data.builtinComponentName !== domNode.behavior)
          newData.builtinComponentName = domNode.behavior;
        const builtinComponentName = componentNameMap[domNode.behavior];
        if (builtinComponentName)
          checkComponentAttr(this, builtinComponentName, newAttrData);
      } else if (tagName === 'CUSTOM-COMPONENT') {
        // Custom component
        if (data.customComponentName !== domNode.behavior)
          newData.customComponentName = domNode.behavior;
        if (data.nodeId !== this.nodeId) data.nodeId = this.nodeId;
        if (data.pageId !== this.pageId) data.pageId = this.pageId;
      } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
        // Not support
        newData.builtinComponentName = 'not-support';
        if (data.content !== domNode.content)
          newData.content = domNode.textContent;
      } else {
        // Replaced html tag
        const builtinComponentName = componentNameMap[tagName.toLowerCase()];
        if (builtinComponentName)
          checkComponentAttr(this, builtinComponentName, newAttrData);
      }

      this.setData(newData);
    },

    // Dom event
    onTouchStart(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        callEvent('touchstart', evt, null, this.pageId, this.nodeId);
      }
    },
    onTouchMove(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        callEvent('touchmove', evt, null, this.pageId, this.nodeId);
      }
    },
    onTouchEnd(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        callEvent('touchend', evt, null, this.pageId, this.nodeId);
      }
    },
    onTouchCancel(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        callEvent('touchcancel', evt, null, this.pageId, this.nodeId);
      }
    },
    onTap(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        callEvent('click', evt, { button: 0 }, this.pageId, this.nodeId); // 默认左键
      }
    },
    onImgLoad(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;

      callSimpleEvent('load', evt, originNode);
    },
    onImgError(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;

      callSimpleEvent('error', evt, originNode);
    },
    ...handlesMap
  }
};

const lifeCycles = getLifeCycle({
  init() {
    const config = cache.getConfig();
    // Resets global variables according to configuration
    if (config.optimization) {
      const domSubTreeLevel = +config.optimization.domSubTreeLevel;
      if (domSubTreeLevel >= 1 && domSubTreeLevel <= MAX_DOM_SUB_TREE_LEVEL)
        DOM_SUB_TREE_LEVEL = domSubTreeLevel;
    }
  },
  mount() {
    const { nodeId, pageId } = getId(this);
    const data = {};
    this.nodeId = nodeId;
    this.pageId = pageId;

    // Record dom
    this.domNode = cache.getNode(pageId, nodeId);
    if (!this.domNode) return;

    // TODO, for the sake of compatibility with a bug in the underlying library, is implemented as follows
    if (this.domNode.tagName === 'CANVAS') {
      this.domNode._builtInComponent = this;
    }

    // Store document
    this.document = cache.getDocument(pageId);

    // Listen global event
    this.onChildNodesUpdate = tool.throttle(this.onChildNodesUpdate.bind(this));
    this.domNode.$$clearEvent('$$childNodesUpdate');
    this.domNode.addEventListener(
      '$$childNodesUpdate',
      this.onChildNodesUpdate
    );
    this.onSelfNodeUpdate = tool.throttle(this.onSelfNodeUpdate.bind(this));
    this.domNode.$$clearEvent('$$domNodeUpdate');
    this.domNode.addEventListener('$$domNodeUpdate', this.onSelfNodeUpdate);

    // init
    init(this, data);

    // init child nodes
    const childNodes = filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1);
    const dataChildNodes = dealWithLeafAndSimple(
      childNodes,
      this.onChildNodesUpdate
    );
    if (data.builtinComponentName || data.customComponentName) {
      // builtIn component/custom component
      data.innerChildNodes = dataChildNodes;
      data.childNodes = [];
    } else {
      // normal tag
      data.innerChildNodes = [];
      data.childNodes = dataChildNodes;
    }
    this.setData(data);
    if (isMiniApp) {
      if (this.domNode.tagName === 'CANVAS') {
        this.domNode.$$trigger('canvasReady');
      }
    }
  },
  ready() {
    this.__ready = true;
    if (this.__readyData) {
      this.setData(this.__readyData);
      this.__readyData = null;
    }
  },
  unmount() {
    this.nodeId = null;
    this.pageId = null;
    this.domNode = null;
    this.document = null;
  }
});

Component({
  ...config,
  ...lifeCycles
});
