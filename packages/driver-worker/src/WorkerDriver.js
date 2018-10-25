import createWorkerGlobalScope from './worker/createWorkerGlobalScope';
import Operator from './worker/Operator';
import Driver from './Driver';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const BODY = 'BODY';
const IS_TOUCH_EVENTS = /^touch/;
const TO_SANITIZE = [
  'target',
  'addedNodes',
  'removedNodes',
  'nextSibling',
  'previousSibling',
];

export default class WorkerDriver extends Driver {
  constructor({ postMessage, addEventListener }) {
    const workerGlobalScope = createWorkerGlobalScope();
    super(workerGlobalScope.document);

    this.global = workerGlobalScope;
    this.nodesMap = new Map();
    this.nodeCounter = 0;
    this.postMessage = postMessage;

    this.initMutationObserver(workerGlobalScope.document.defaultView.MutationObserver);
    this.operator = new Operator(postMessage);

    addEventListener('message', this.handleMessage);
  }

  initMutationObserver(MutationObserver) {
    let mutationObserver = new MutationObserver(mutations => {
      for (let i = mutations.length; i--;) {
        let mutation = mutations[i];
        for (let j = TO_SANITIZE.length; j--;) {
          let prop = TO_SANITIZE[j];
          mutation[prop] = this.sanitize(mutation[prop], prop);
        }
      }
      this.send({ type: 'MutationRecord', mutations });
    });

    mutationObserver.observe(this.global.document, { subtree: true });
  }

  /**
   * Event `message' listener.
   */
  handleMessage = ({ data }) => {
    const { document } = this.global;
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

  /**
   * Serialize instruction.
   */
  sanitize(node, prop) {
    if (!node || typeof node !== 'object') {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(n => this.sanitize(n, prop));
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
          Object.assign(result, {
            events: node._getEvents(),
            attributes: node.attributes,
            nodeName: node.nodeName,
            style: node.style,
          });
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
    if (node.nodeName === BODY) return this.global.document.body;
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

  hnaldeReturn(data) {
    this.operator.apply(data);
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

  send(payload) {
    this.postMessage && this.postMessage(payload);
  }
}
