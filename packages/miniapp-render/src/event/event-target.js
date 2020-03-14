import Event from './event';
import CustomEvent from './custom-event';

/**
 * Compare touch list
 */
function compareTouchList(a, b) {
  if (a.length !== b.length) return false;

  for (let i, len = a.length; i < len; i++) {
    const aItem = a[i];
    const bItem = b[i];

    if (aItem.identifier !== bItem.identifier) return false;
    if (aItem.pageX !== bItem.pageX || aItem.pageY !== bItem.pageY || aItem.clientX !== bItem.clientX || aItem.clientY !== bItem.clientY) return false;
  }

  return true;
}

/**
 * Compare event detail
 * @param {object} a
 * @param {object} b
 */
function compareDetail(a, b) {
  if (a.pageX === b.pageX && a.pageY === b.pageY && a.clientX === b.clientX && a.clientY === b.clientY) {
    return true;
  }
  return false;
}

/**
 *
 * @param {string} property 'touches' or 'changedTouches' or 'detail'
 * @param {object} last last event
 * @param {object} now current event
 */
function compareEventProperty(property, last, now) {
  const compareFn = property === 'detail' ? compareDetail : compareTouchList;
  if (last[property] && now[property] && !compareFn(last[property], now[property])) {
    // property are different
    return true;
  }
  if (!last[property] && now[property] || last[property] && !now[property]) {
    // One of them  doesn't have property
    return true;
  }
  return false;
}

function compareEventInAlipay(last, now) {
  // In Alipay, timestamps of the same event may have slight differences when bubbling
  // Set the D-value threshold to 10
  if (!last || now.timeStamp - last.timeStamp > 10) {
    return true;
  }
  // Tap event has no touches or changedTouches in Alipay, so use detail property to check
  return compareEventProperty('detail', last, now) || compareEventProperty('touches', last, now) || compareEventProperty('changedTouches', last, now);
}

function compareEventInWechat(last, now) {
  // TimeStamps are different
  if (!last || last.timeStamp !== now.timeStamp) {
    return true;
  }
  return compareEventProperty('touches', last, now) || compareEventProperty('changedTouches', last, now);
}

class EventTarget {
  constructor(...args) {
    this.$$init(...args);
  }

  /**
     * 初始化实例
     */
  $$init() {
    // 补充实例的属性，用于 'xxx' in XXX 判断
    this.ontouchstart = null;
    this.ontouchmove = null;
    this.ontouchend = null;
    this.ontouchcancel = null;
    this.oninput = null;
    this.onfocus = null;
    this.onblur = null;
    this.onchange = null;

    this.$_miniappEvent = null; // 记录已触发的小程序事件
    this.$_eventHandlerMap = null;
  }

  /**
     * 销毁实例
     */
  $$destroy() {
    Object.keys(this).forEach(key => {
      // 处理 on 开头的属性
      if (key.indexOf('on') === 0) this[key] = null;
      // 处理外部挂进来的私有的属性
      if (key[0] === '_') this[key] = null;
      if (key[0] === '$' && (key[1] !== '_' && key[1] !== '$')) this[key] = null;
    });

    this.$_miniappEvent = null;
    this.$_eventHandlerMap = null;
  }

  set $_eventHandlerMap(value) {
    this.$__eventHandlerMap = value;
  }

  get $_eventHandlerMap() {
    if (!this.$__eventHandlerMap) this.$__eventHandlerMap = Object.create(null);
    return this.$__eventHandlerMap;
  }

  /**
     * 触发事件捕获、冒泡流程
     */
  static $$process(target, eventName, miniprogramEvent, extra, callback) {
    let event;

    if (eventName instanceof CustomEvent || eventName instanceof Event) {
      // 传入的是事件对象
      event = eventName;
      eventName = event.type;
    }

    eventName = eventName.toLowerCase();

    const path = [target];
    let parentNode = target.parentNode;

    while (parentNode && parentNode.tagName !== 'HTML') {
      path.push(parentNode);
      parentNode = parentNode.parentNode;
    }

    if (path[path.length - 1].tagName === 'BODY') {
      // 如果最后一个节点是 document.body，则追加 document.documentElement
      path.push(parentNode);
    }

    if (!event) {
      // 此处特殊处理，不直接返回小程序的 event 对象
      event = new Event({
        name: eventName,
        target,
        timeStamp: miniprogramEvent.timeStamp,
        touches: miniprogramEvent.touches,
        changedTouches: miniprogramEvent.changedTouches,
        bubbles: true, // 默认都可以冒泡 TODO
        $$extra: extra,
      });
    }

      // 捕获
    for (let i = path.length - 1; i >= 0; i--) {
      const currentTarget = path[i];

      if (!event.$$canBubble) break; // 判定冒泡是否结束
      if (currentTarget === target) continue;

      event.$$setCurrentTarget(currentTarget);
      event.$$setEventPhase(Event.CAPTURING_PHASE);

      currentTarget.$$trigger(eventName, {
        event,
        isCapture: true,
      });
      if (callback) callback(currentTarget, event, true);
    }

    // 目标
    if (event.$$canBubble) {
      event.$$setCurrentTarget(target);
      event.$$setEventPhase(Event.AT_TARGET);

      // 捕获和冒泡阶段监听的事件都要触发
      target.$$trigger(eventName, {
        event,
        isCapture: true,
        isTarget: true
      });
      if (callback) callback(target, event, true);

      target.$$trigger(eventName, {
        event,
        isCapture: false,
        isTarget: true
      });
      if (callback) callback(target, event, false);
    }

    if (event.bubbles) {
      // 冒泡
      for (const currentTarget of path) {
        if (!event.$$canBubble) break; // 判定冒泡是否结束
        if (currentTarget === target) continue;

        event.$$setCurrentTarget(currentTarget);
        event.$$setEventPhase(Event.BUBBLING_PHASE);

        currentTarget.$$trigger(eventName, {
          event,
          isCapture: false,
        });
        if (callback) callback(currentTarget, event, false);
      }
    }

    // 重置事件
    event.$$setCurrentTarget(null);
    event.$$setEventPhase(Event.NONE);

    return event;
  }

  /**
     * 获取 handlers
     */
  $_getHandlers(eventName, isCapture, isInit) {
    const handlerMap = this.$_eventHandlerMap;

    if (isInit) {
      const handlerObj = handlerMap[eventName] = handlerMap[eventName] || {};

      handlerObj.capture = handlerObj.capture || [];
      handlerObj.bubble = handlerObj.bubble || [];

      return isCapture ? handlerObj.capture : handlerObj.bubble;
    } else {
      const handlerObj = handlerMap[eventName];

      if (!handlerObj) return null;

      return isCapture ? handlerObj.capture : handlerObj.bubble;
    }
  }

  /**
     * 触发节点事件
     */
  $$trigger(eventName, { event, args = [], isCapture, isTarget } = {}) {
    eventName = eventName.toLowerCase();
    const handlers = this.$_getHandlers(eventName, isCapture);
    const onEventName = `on${eventName}`;

    if ((!isCapture || !isTarget) && typeof this[onEventName] === 'function') {
      // 触发 onXXX 绑定的事件
      if (event && event.$$immediateStop) return;
      try {
        this[onEventName].call(this || null, event, ...args);
      } catch (err) {
        console.error(err);
      }
    }

    if (handlers && handlers.length) {
      // 触发 addEventListener 绑定的事件
      handlers.forEach(handler => {
        if (event && event.$$immediateStop) return;
        try {
          handler.call(this || null, event, ...args);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  /**
     * 检查该事件是否可以触发
     */
  $$checkEvent(miniprogramEvent) {
    const last = this.$_miniappEvent;
    const now = miniprogramEvent;

    let flag = false;

    if (isMiniApp) {
      flag = compareEventInAlipay(last, now);
    } else if (isWeChatMiniProgram) {
      flag = compareEventInWechat(last, now);
    }

    if (flag) this.$_miniappEvent = now;
    return flag;
  }

  /**
     * 清空某个事件的所有句柄
     */
  $$clearEvent(eventName, isCapture = false) {
    if (typeof eventName !== 'string') return;

    eventName = eventName.toLowerCase();
    const handlers = this.$_getHandlers(eventName, isCapture);

    if (handlers && handlers.length) handlers.length = 0;
  }

  /**
     * 对外属性和方法
     */
  addEventListener(eventName, handler, options) {
    if (typeof eventName !== 'string' || typeof handler !== 'function') return;

    let isCapture = false;

    if (typeof options === 'boolean') isCapture = options;
    else if (typeof options === 'object') isCapture = options.capture;

    eventName = eventName.toLowerCase();
    const handlers = this.$_getHandlers(eventName, isCapture, true);

    handlers.push(handler);
  }

  removeEventListener(eventName, handler, isCapture = false) {
    if (typeof eventName !== 'string' || typeof handler !== 'function') return;

    eventName = eventName.toLowerCase();
    const handlers = this.$_getHandlers(eventName, isCapture);

    if (handlers && handlers.length) handlers.splice(handlers.indexOf(handler), 1);
  }

  dispatchEvent(evt) {
    if (evt instanceof CustomEvent) {
      EventTarget.$$process(this, evt);
    }

    // 因为不支持 preventDefault，所以永远返回 true
    return true;
  }
}

export default EventTarget;
