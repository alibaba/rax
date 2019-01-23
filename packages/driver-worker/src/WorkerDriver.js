import createWorkerGlobalScope from './worker/createWorkerGlobalScope';
import Evaluator from './worker/Evaluator';
import Driver from './Driver';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const BODY = 'BODY';
const STYLE_ELEMENT = 'STYLE';
const IS_TOUCH_EVENTS = /^touch/;
const TO_SANITIZE = [
  'target',
  'addedNodes',
  'removedNodes',
  'nextSibling',
  'previousSibling',
];

function getChildText(node) {
  let text = '';
  if (node && node.childNodes) {
    // Only get the first child text.
    for (let i = 0, l = node.childNodes.length; i < l; i++) {
      if (node.childNodes[i].nodeType === TEXT_NODE) {
        text = node.childNodes[i].data;
        break;
      }
    }
  }
  return text;
}

export default class WorkerDriver extends Driver {
  constructor({ postMessage, addEventListener, deduplicateStyle }) {
    const workerGlobalScope = createWorkerGlobalScope();
    super(workerGlobalScope.document);

    this.evaluator = new Evaluator(postMessage);
    this.nodesMap = new Map();
    this.nodeCounter = 0;
    /**
     * Deduplicate same style tags.
     */
    this.deduplicateStyle = deduplicateStyle;

    let mutationObserver = this.createMutationObserver(postMessage);
    mutationObserver.observe(this.document, { subtree: true });

    addEventListener('message', this.handleMessage);
  }

  createMutationObserver(callback) {
    let MutationObserver = this.document.defaultView.MutationObserver;
    return new MutationObserver(mutations => {
      for (let i = mutations.length; i--;) {
        let mutation = mutations[i];
        for (let j = TO_SANITIZE.length; j--;) {
          let prop = TO_SANITIZE[j];
          const value = this.sanitize(mutation[prop], prop);
          if (value) mutation[prop] = value;
        }
      }

      callback({ type: 'MutationRecord', mutations });
    });
  }

  /**
   * Event `message' listener.
   */
  handleMessage = ({ data }) => {
    const document = this.document;
    switch (data.type) {
      case 'init':
        document.URL = data.url;
        document.documentElement.clientWidth = data.width;
        break;
      case 'event':
        this.handleEvent(data.event);
        break;
      case 'return':
        this.handleReturn(data.return);
        break;
    }
  };

  hitStyle = {};

  /**
   * Serialize instruction.
   */
  sanitize(node, prop) {
    if (!node || typeof node !== 'object') {
      return node;
    }

    if (Array.isArray(node)) {
      let ret = new Array(node.length);
      for (let i = 0, l = node.length; i < l; i ++) {
        ret[i] = this.sanitize(node[i], prop);
        if (ret[i] === null) ret.splice(i, 1);
      }
      return ret;
    }

    if (!node.$$id) {
      node.$$id = String(++this.nodeCounter);
      this.nodesMap.set(node.$$id, node);
    }

    const result = {
      $$id: node.$$id,
    };

    if (node.nodeName === BODY) {
      result.nodeName = BODY;
    } else if (prop === 'addedNodes') {
      const nodeType = node.nodeType;
      result.nodeType = nodeType;

      switch (nodeType) {
        case ELEMENT_NODE:
          result.nodeName = node.nodeName;
          if (this.deduplicateStyle && node.nodeName === STYLE_ELEMENT) {
            const textStyle = getChildText(node);
            if (this.hitStyle[textStyle]) return null;
            this.hitStyle[textStyle] = node;
          }

          const events = node._getEvents();
          if (events.length > 0) result.events = events;
          if (node.attributes) result.attributes = node.attributes;
          if (Object.keys(node.style).length > 0) result.style = node.style;
          break;

        case TEXT_NODE:
        case COMMENT_NODE:
          result.data = node.data;
          break;
      }
    }

    return result;
  }

  getNode(node) {
    let id;
    if (node && typeof node === 'object') id = node.$$id;
    if (typeof node === 'string') id = node;
    if (!id) return null;
    if (node.nodeName === BODY) return this.document.body;
    return this.nodesMap.get(id);
  }

  handleEvent(event) {
    const target = this.getNode(event.target);

    if (IS_TOUCH_EVENTS.test(event.type)) {
      event = this.convertTouchTarget(event);
    }

    if (target) {
      event.target = target;
      target.dispatchEvent(event);
    }
  }

  handleReturn(data) {
    this.evaluator.apply(data);
  }

  /**
   * Convert TouchEvent#$$id to targetNode
   */
  extractTouchListTarget(touchList) {
    for (let i = 0, l = touchList.length; i < l; i++) {
      if ('$$id' in touchList[i]) {
        touchList[i].target = this.getNode(touchList[i].$$id);
        delete touchList[i].$$id;
      }
    }
  }

  /**
   * Extract touches and currentTouches
   */
  convertTouchTarget(evt) {
    if (evt.touches) {
      this.extractTouchListTarget(evt.touches);
    }
    if (evt.changedTouches) {
      this.extractTouchListTarget(evt.changedTouches);
    }
    return evt;
  }
}
