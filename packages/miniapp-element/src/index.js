/* global isMiniApp, Component */
import render from 'miniapp-render';
import filterNodes from './vdom/filterNodes';
import checkDiffChildNodes from './vdom/checkDiffChildNodes';
import checkComponentAttr from './vdom/checkComponentAttr';
import dealWithLeafAndSimple from './vdom/dealWithLeafAndSimple';
import init from './init';
import { componentNameMap, handlesMap } from './component';
import { NOT_SUPPORT, IN_COVER } from './constants';
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
      const childNodes = filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this);
      if (checkDiffChildNodes(childNodes, this.data.childNodes)) {
        this.setData({
          childNodes: dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate),
        });
      }

      // dispatch child update
      const childNodeStack = [].concat(childNodes);
      let childNode = childNodeStack.pop();
      while (childNode) {
        if (childNode.type === 'element' && !childNode.isImage && !childNode.isLeaf && !childNode.isSimple && !childNode.useTemplate) {
          childNode.domNode.$$trigger('$$childNodesUpdate');
        }

        if (childNode.childNodes && childNode.childNodes.length) childNode.childNodes.forEach(subChildNode => childNodeStack.push(subChildNode));
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
          newData.builtinComponentName = builtinComponentName;
      }

      this.setData(newData);
    },
    onAppear(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;
      callSimpleEvent('appear', evt, originNode);
    },
    onDisappear(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;
      callSimpleEvent('disappear', evt, originNode);
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
    getDomNodeFromEvt(eventName, evt) {
      if (!evt) return;
      const pageId = this.pageId;
      let originNodeId = this.nodeId;
      if (evt.currentTarget && evt.currentTarget.dataset.privateNodeId) {
        originNodeId = evt.currentTarget.dataset.privateNodeId;
      } else if (
        eventName &&
        eventName.indexOf('canvas') === 0 &&
        evt.target &&
        evt.target.dataset.privateNodeId
      ) {
        originNodeId = evt.target.dataset.privateNodeId;
      }
      return cache.getNode(pageId, originNodeId);
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
    if (IN_COVER.indexOf(data.builtinComponentName) !== -1) this.data.inCover = true;

    // init child nodes
    const childNodes = filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this);
    data.childNodes = dealWithLeafAndSimple(
      childNodes,
      this.onChildNodesUpdate
    );

    if (Object.keys(data).length) this.setData(data);
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
