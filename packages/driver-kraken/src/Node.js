import isValidElement from 'rax-is-valid-element';
import { videoNodeMixin } from './mixins/Video';

export const nodesMap = new Map();

const EVENT_REG = /^on[A-Z]/;
const STYLE = 'style';
const EVENT_MARK = '__event_mark__';

function isEventListener(prop) {
  return EVENT_REG.test(prop);
}

let nodeCount = 0;

function createId() {
  return ++nodeCount;
}

export default class Node {
  constructor(type, props) {
    this.type = type;
    this.id = createId();
    this.propList = []; // [{ name, value }]
    this.eventList = []; // [{ eventName, eventListener }]
    this.childNodes = [];
    this.parent = null;

    if (type.toUpperCase() === 'VIDEO') {
      videoNodeMixin(this);
    }

    if (props != null) {
      const propKeys = Object.keys(props);
      for (let i = 0; i < propKeys.length; i++) {
        const key = propKeys[i];
        const value = props[key];
        if (isEventListener(key)) {
          this.addEventListener(key.slice(2).toLowerCase(), props[key]);
        } else if (key === 'children') {
          continue;
        } else {
          if (isValidElement(value)) throw new Error('Can not pass element as props.');

          this.propList.push({ name: key, value });
          if (key === STYLE) this.style = value;
        }
      }
    }
    nodesMap.set(this.id, this);
  }

  destroy() {
    nodesMap.delete(this.id);
    this.propList = this.eventList = null;
  }

  hasEvent(eventName) {
    return !!this[EVENT_MARK + eventName];
  }

  dispatchEvent(event) {
    this.eventList.forEach(({ eventName, eventListener }) => {
      if (event.type === eventName) {
        eventListener.call(this, event);
      }
    });
  }

  addEventListener(eventName, eventListener) {
    this[EVENT_MARK + eventName] = true;
    this.eventList.push({ eventName, eventListener });
  }

  removeEventListener(eventName, eventHandler) {
    let index = -1;
    for (let i = 0; i < this.eventList.length; i++) {
      const event = this.eventList[i];
      if (eventName === event.eventName && eventHandler === event.eventListener) {
        index = i;
      }
    }

    if (index !== -1) {
      this.eventList.splice(index, 1);
    }
  }

  setProp(name, value) {
    if (isEventListener(name)) return value;
    if (isValidElement(value)) throw new Error('Can not pass element as props.');

    let updated = false;
    for (let i = 0; i < this.propList.length; i++) {
      if (name === this.propList[i].name) {
        this.propList[i].value = value;
        updated = true;
      }
    }
    if (!updated) {
      this.propList.push({ name, value });
    }

    if (name === STYLE) this.style = value;

    return value;
  }

  getDescriptor() {
    const props = {};
    for (let i = 0; i < this.propList.length; i++) {
      props[this.propList[i].name] = this.propList[i].value;
    }

    const descriptor = {
      type: this.type.toUpperCase(),
      id: this.id,
    };

    if (this.propList.length > 0) {
      descriptor.props = props;
    }

    if (this.eventList.length > 0) {
      descriptor.events = this.eventList.map(el => el.eventName);
    }

    return descriptor;
  }

  toJSON() {
    return this.getDescriptor();
  }
}

export class TextNode extends Node {
  constructor(data) {
    super('#text', null);
    this.data = data || '';
  }

  setProp(key, value) {
    if (key === 'data') {
      this.data = value;
    }
  }

  getDescriptor() {
    return {
      id: this.id,
      nodeType: 3,
      data: this.data,
    };
  }
}
