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
import { isMiniApp } from 'universal-env';

const { cache, EventTarget, tool } = render.$$adapter;

// dom 子树作为自定义组件渲染的层级数
const MAX_DOM_SUB_TREE_LEVEL = 10;
let DOM_SUB_TREE_LEVEL = 10;

// adapter
let PROPS, INIT, MOUNT, UNMOUNT;

if (isMiniApp) {
  PROPS = 'props';
  INIT = 'onInit';
  MOUNT = 'didMount';
  UNMOUNT = 'didUnmount';
} else {
  PROPS = 'properties';
  INIT = 'created';
  MOUNT = 'attached';
  UNMOUNT = 'detached';
}

function getProps() {
  if (isMiniApp) {
    return {
      inCover: false
    };
  } else {
    return {
      inCover: {
        type: Boolean,
        value: false
      }
    };
  }
}

function getId(instance) {
  let nodeId, pageId;
  if (isMiniApp) {
    nodeId = instance.props['data-private-node-id'];
    pageId = instance.props['data-private-page-id'];
  } else {
    nodeId = instance.dataset.privateNodeId;
    pageId = instance.dataset.privatePageId;
  }

  return {
    nodeId,
    pageId
  };
}

Component({
  [PROPS]: getProps(),
  data: {
    builtinComponentName: '', // 需要渲染的内置组件名
    customComponentName: '', // 需要渲染的自定义组件名
    innerChildNodes: [], // 内置组件的孩子节点
    childNodes: [] // 孩子节点
  },
  options: {
    addGlobalClass: true // 开启全局样式
  },
  [INIT]() {
    const config = cache.getConfig();
    // 根据配置重置全局变量
    const domSubTreeLevel = +config.optimization.domSubTreeLevel;
    if (domSubTreeLevel >= 1 && domSubTreeLevel <= MAX_DOM_SUB_TREE_LEVEL)
      DOM_SUB_TREE_LEVEL = domSubTreeLevel;
  },
  [MOUNT]() {
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
  [UNMOUNT]() {
    this.nodeId = null;
    this.pageId = null;
    this.domNode = null;
    this.document = null;
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
          // 内置组件/自定义组件
          newData.innerChildNodes = dataChildNodes;
          newData.childNodes = [];
        } else {
          // 普通标签
          newData.innerChildNodes = [];
          newData.childNodes = dataChildNodes;
        }

        this.setData(newData);
      }

      // 触发子节点变化
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
        // 自定义组件
        if (data.customComponentName !== domNode.behavior)
          newData.customComponentName = domNode.behavior;
        if (data.nodeId !== this.nodeId) data.nodeId = this.nodeId;
        if (data.pageId !== this.pageId) data.pageId = this.pageId;
      } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
        // 不支持标签
        newData.builtinComponentName = 'not-support';
        if (data.content !== domNode.content)
          newData.content = domNode.textContent;
      } else {
        // 可替换 html 标签
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
          // 延迟触发跳转，先等所有同步回调处理完成
          setTimeout(() => {
            if (evt.cancelable) return;
            const window = cache.getWindow(this.pageId);

            // 处理特殊节点事件
            if (domNode.tagName === 'A' && evt.type === 'click' && !isCapture) {
              // 处理 a 标签的跳转
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
              // 处理 label 的点击
              const forValue = domNode.getAttribute('for');
              let targetDomNode;
              if (forValue) {
                targetDomNode = window.document.getElementById(forValue);
              } else {
                targetDomNode = domNode.querySelector('input');

                // 寻找 switch 节点
                if (!targetDomNode)
                  targetDomNode = domNode.querySelector(
                    'builtin-component[behavior=switch]'
                  );
              }

              if (!targetDomNode || !!targetDomNode.getAttribute('disabled'))
                return;

              // 找到了目标节点
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
              // 处理 button 点击
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
});
