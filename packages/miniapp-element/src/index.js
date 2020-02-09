import render from 'miniapp-render';
import filterNodes from './vdom/filterNodes';
import checkDiffChildNodes from './vdom/checkDiffChildNodes';
import checkComponentAttr from './vdom/checkComponentAttr';
import dealWithLeafAndSimple from './vdom/dealWithLeafAndSimple';
import checkEventAccessDomNode from './vdom/checkEventAccessDomNode';
import findParentNode from './vdom/findParentNode';
import initHandle from './utils/initHandle';
import { componentNameMap, handlesMap } from './component';
import { NOT_SUPPORT } from './utils/constants';
import getInitialProps from './adapter/getInitialProps';
import getId from './adapter/getId';
import getLifeCycle from './adapter/getLifeCycle';

const { cache, EventTarget, tool } = render.$$adapter;

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
    addGlobalClass: true // 开启全局样式
  },
  methods: {
    // Watch child nodes update
    onChildNodesUpdate() {
      // Node unomunted
      if (!this.pageId || !this.nodeId) return;

      // 儿子节点有变化
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

      if (tagName === 'BUILTIN-COMPONENT') {
        // 内置组件
        if (data.builtinComponentName !== domNode.behavior)
          newData.builtinComponentName = domNode.behavior;
        const builtinComponentName = componentNameMap[domNode.behavior];
        if (builtinComponentName)
          checkComponentAttr(builtinComponentName, domNode, newData, data);
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
        const builtinComponentName = componentNameMap[tagName];
        if (builtinComponentName)
          checkComponentAttr(builtinComponentName, domNode, newData, data);
      }

      this.setData(newData);
    },

    // call event
    callEvent(eventName, evt, extra) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;

      EventTarget.$$process(
        originNode,
        eventName,
        evt,
        extra,
        (domNode, evt, isCapture) => {
          // Delay triggering the jump until all synchronous callback processing is complete
          setTimeout(() => {
            if (evt.cancelable) return;
            const window = cache.getWindow(this.pageId);

            // Handle special node event
            if (domNode.tagName === 'A' && evt.type === 'click' && !isCapture) {
              // Handle a tag
              const href = domNode.href;
              const target = domNode.target;

              if (!href || href.indexOf('javascript') !== -1) return;

              if (target === '_blank') window.open(href);
              else window.location.href = href;
            } else if (
              domNode.tagName === 'LABEL' &&
              evt.type === 'click' &&
              !isCapture
            ) {
              // Handle label
              const forValue = domNode.getAttribute('for');
              let targetDomNode;
              if (forValue) {
                targetDomNode = window.document.getElementById(forValue);
              } else {
                targetDomNode = domNode.querySelector('input');

                // Find switch node
                if (!targetDomNode)
                  targetDomNode = domNode.querySelector(
                    'builtin-component[behavior=switch]'
                  );
              }

              if (!targetDomNode || !!targetDomNode.getAttribute('disabled'))
                return;

              // Find target node
              if (targetDomNode.tagName === 'INPUT') {
                if (checkEventAccessDomNode(evt, targetDomNode, domNode))
                  return;

                const type = targetDomNode.type;
                if (type === 'radio') {
                  targetDomNode.checked = true;
                  const name = targetDomNode.name;
                  const otherDomNodes =
                    window.document.querySelectorAll(`input[name=${name}]`) ||
                    [];
                  for (const otherDomNode of otherDomNodes) {
                    if (
                      otherDomNode.type === 'radio' &&
                      otherDomNode !== targetDomNode
                    ) {
                      otherDomNode.checked = false;
                    }
                  }
                  this.callSimpleEvent(
                    'change',
                    { detail: { value: targetDomNode.value } },
                    targetDomNode
                  );
                } else if (type === 'checkbox') {
                  targetDomNode.checked = !targetDomNode.checked;
                  this.callSimpleEvent(
                    'change',
                    {
                      detail: {
                        value: targetDomNode.checked
                          ? [targetDomNode.value]
                          : []
                      }
                    },
                    targetDomNode
                  );
                } else {
                  targetDomNode.focus();
                }
              } else if (targetDomNode.tagName === 'BUILTIN-COMPONENT') {
                if (checkEventAccessDomNode(evt, targetDomNode, domNode))
                  return;

                const behavior = targetDomNode.behavior;
                if (behavior === 'switch') {
                  const checked = !targetDomNode.getAttribute('checked');
                  targetDomNode.setAttribute('checked', checked);
                  this.callSimpleEvent(
                    'change',
                    { detail: { value: checked } },
                    targetDomNode
                  );
                }
              }
            } else if (
              (domNode.tagName === 'BUTTON' ||
                domNode.tagName === 'BUILTIN-COMPONENT' &&
                  domNode.behavior === 'button') &&
              evt.type === 'click' &&
              !isCapture
            ) {
              // Handle button click
              const type =
                domNode.tagName === 'BUTTON'
                  ? domNode.getAttribute('type')
                  : domNode.getAttribute('form-type');
              const formAttr = domNode.getAttribute('form');
              const form = formAttr
                ? window.document.getElementById('formAttr')
                : findParentNode(domNode, 'FORM');

              if (!form) return;
              if (type !== 'submit' && type !== 'reset') return;

              const inputList = form.querySelectorAll('input[name]');
              const textareaList = form.querySelectorAll('textarea[name]');
              const switchList = form
                .querySelectorAll('builtin-component[behavior=switch]')
                .filter(item => !!item.getAttribute('name'));
              const sliderList = form
                .querySelectorAll('builtin-component[behavior=slider]')
                .filter(item => !!item.getAttribute('name'));
              const pickerList = form
                .querySelectorAll('builtin-component[behavior=picker]')
                .filter(item => !!item.getAttribute('name'));

              if (type === 'submit') {
                const formData = {};
                if (inputList.length) {
                  inputList.forEach(item => {
                    if (item.type === 'radio') {
                      if (item.checked) formData[item.name] = item.value;
                    } else if (item.type === 'checkbox') {
                      formData[item.name] = formData[item.name] || [];
                      if (item.checked) formData[item.name].push(item.value);
                    } else {
                      formData[item.name] = item.value;
                    }
                  });
                }
                if (textareaList.length)
                  textareaList.forEach(
                    item => formData[item.getAttribute('name')] = item.value
                  );
                if (switchList.length)
                  switchList.forEach(
                    item =>
                      formData[
                        item.getAttribute('name')
                      ] = !!item.getAttribute('checked')
                  );
                if (sliderList.length)
                  sliderList.forEach(
                    item =>
                      formData[item.getAttribute('name')] =
                        +item.getAttribute('value') || 0
                  );
                if (pickerList.length)
                  pickerList.forEach(
                    item =>
                      formData[item.getAttribute('name')] = item.getAttribute(
                        'value'
                      )
                  );

                this.callSimpleEvent(
                  'submit',
                  { detail: { value: formData }, extra: { $$from: 'button' } },
                  form
                );
              } else if (type === 'reset') {
                if (inputList.length) {
                  inputList.forEach(item => {
                    if (item.type === 'radio') {
                      item.checked = false;
                    } else if (item.type === 'checkbox') {
                      item.checked = false;
                    } else {
                      item.value = '';
                    }
                  });
                }
                if (textareaList.length)
                  textareaList.forEach(item => item.value = '');
                if (switchList.length)
                  switchList.forEach(item =>
                    item.setAttribute('checked', undefined)
                  );
                if (sliderList.length)
                  sliderList.forEach(item =>
                    item.setAttribute('value', undefined)
                  );
                if (pickerList.length)
                  pickerList.forEach(item =>
                    item.setAttribute('value', undefined)
                  );

                this.callSimpleEvent(
                  'reset',
                  { extra: { $$from: 'button' } },
                  form
                );
              }
            }
          }, 0);
        }
      );
    },

    // Dom event
    onTouchStart(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        this.callEvent('touchstart', evt);
      }
    },
    onTouchMove(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        this.callEvent('touchmove', evt);
      }
    },
    onTouchEnd(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        this.callEvent('touchend', evt);
      }
    },
    onTouchCancel(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        this.callEvent('touchcancel', evt);
      }
    },
    onTap(evt) {
      if (this.document && this.document.$$checkEvent(evt)) {
        this.callEvent('click', evt, { button: 0 }); // 默认左键
      }
    },
    onImgLoad(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;

      this.callSimpleEvent('load', evt, originNode);
    },
    onImgError(evt) {
      const pageId = this.pageId;
      const originNodeId =
        evt.currentTarget.dataset.privateNodeId || this.nodeId;
      const originNode = cache.getNode(pageId, originNodeId);

      if (!originNode) return;

      this.callSimpleEvent('error', evt, originNode);
    },
    init: initHandle.init,
    callSimpleEvent: initHandle.callSimpleEvent,

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

    // 记录 dom
    this.domNode = cache.getNode(pageId, nodeId);
    if (!this.domNode) return;

    // TODO，为了兼容基础库的一个 bug，暂且如此实现
    if (this.domNode.tagName === 'CANVAS')
      this.domNode._builtInComponent = this;

    // 存储 document
    this.document = cache.getDocument(pageId);

    // 监听全局事件
    this.onChildNodesUpdate = tool.throttle(this.onChildNodesUpdate.bind(this));
    this.domNode.$$clearEvent('$$childNodesUpdate');
    this.domNode.addEventListener(
      '$$childNodesUpdate',
      this.onChildNodesUpdate
    );
    this.onSelfNodeUpdate = tool.throttle(this.onSelfNodeUpdate.bind(this));
    this.domNode.$$clearEvent('$$domNodeUpdate');
    this.domNode.addEventListener('$$domNodeUpdate', this.onSelfNodeUpdate);

    // 初始化
    this.init(data);

    // 初始化孩子节点
    const childNodes = filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1);
    const dataChildNodes = dealWithLeafAndSimple(
      childNodes,
      this.onChildNodesUpdate
    );
    if (data.builtinComponentName || data.customComponentName) {
      // 内置组件/自定义组件
      data.innerChildNodes = dataChildNodes;
      data.childNodes = [];
    } else {
      // 普通标签
      data.innerChildNodes = [];
      data.childNodes = dataChildNodes;
    }

    // 执行一次 setData
    if (Object.keys(data).length) this.setData(data);
  },
  ready() {},
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
