'use strict';

import _ from 'simple-lodash';
import Expression from './expression';
import {PanHandler, OrientationHandler, TimingHandler, ScrollHandler} from './handlers';
import {matrixToTransformObj, px, pxTo750, prefixStyle} from './utils';
import Fn from './fn';
import assign from 'object-assign';
// transform
const vendorTransform = prefixStyle('transform');

class Binding {

  _eventHandler = null;

  elTransforms = [];

  token = null;

  constructor(options, callback) {
    this.options = options;
    this.callback = callback;
    this.token = this.genToken();
    this._initElTransforms();
    let {eventType} = options;
    switch (eventType) {
      case 'pan':
        this._eventHandler = new PanHandler(this);
        break;
      case 'orientation':
        this._eventHandler = new OrientationHandler(this);
        break;
      case 'timing':
        this._eventHandler = new TimingHandler(this);
        break;
      case 'scroll':
        this._eventHandler = new ScrollHandler(this);
        break;
    }
  }

  genToken() {
    return parseInt(Math.random() * 10000000);
  }

  _initElTransforms() {
    let {props = []} = this.options;
    let elTransforms = this.elTransforms;
    props.forEach((prop) => {
      let {element} = prop;
      if (!_.find(elTransforms, (o) => {
        return o.element === element;
      })) {
        elTransforms.push({
          element,
          transform: {
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }
        });
      }
    });
  }


  getValue(params, expression) {
    return Expression.execute(expression, assign(Fn, params));
  }

  // TODO scroll.contentOffset 待确认及补全
  setProperty(el, property, val) {
    let elTransform = _.find(this.elTransforms, (o) => {
      return o.element === el;
    });
    switch (property) {
      case 'transform.translateX':
        elTransform.transform.translateX = px(val);
        break;
      case 'transform.translateY':
        elTransform.transform.translateY = px(val);
        break;
      case 'transform.translateZ':
        elTransform.transform.translateZ = px(val);
        break;
      case 'transform.rotateX':
        elTransform.transform.rotateX = val;
        break;
      case 'transform.rotateY':
        elTransform.transform.rotateY = val;
        break;
      case 'transform.rotateZ':
        elTransform.transform.rotateZ = val;
        break;
      case 'transform.rotate':
        elTransform.transform.rotateZ = val;
        break;
      case 'transform.scaleX':
        elTransform.transform.scaleX = val;
        break;
      case 'transform.scaleY':
        elTransform.transform.scaleY = val;
        break;
      case 'transform.scale':
        elTransform.transform.scaleX = val;
        elTransform.transform.scaleY = val;
        break;
      case 'width':
        el.style.width = `${px(val)}px`;
        break;
      case 'height':
        el.style.height = `${px(val)}px`;
        break;
      case 'opacity':
        el.style.opacity = val;
        break;
      case 'background-color':
        el.style['background-color'] = val;
        break;
      case 'color':
        el.style.color = val;
        break;
    }
    el.style[vendorTransform] = [
      `translateX(${elTransform.transform.translateX}px)`,
      `translateY(${elTransform.transform.translateY}px)`,
      `translateZ(${elTransform.transform.translateZ}px)`,
      `scaleX(${elTransform.transform.scaleX})`,
      `scaleY(${elTransform.transform.scaleY})`,
      `rotateX(${elTransform.transform.rotateX}deg)`,
      `rotateY(${elTransform.transform.rotateY}deg)`,
      `rotateZ(${elTransform.transform.rotateZ}deg)`
    ].join(' ');
  }

  destroy() {
    this._eventHandler.destroy();
  }

}


module.exports = {
  _bindingInstances: [],
  /**
   * 绑定
   * @param options 参数
   * @example
   {
     anchor:blockRef,
     eventType:'pan',
     props: [
     {
       element:blockRef,
       property:'transform.translateX',
       expression:{
         origin:"x+1",
         transformed:"{\"type\":\"+\",\"children\":[{\"type\":\"Identifier\",\"value\":\"x\"},{\"type\":\"NumericLiteral\",\"value\":1}]}"
       }
     }
    ]
   }
   */
  bind(options, callback = function() {
  }) {
    if (!options) {
      throw new Error('should pass options for binding');
    }
    let existInstances = _.filter(this._bindingInstances, (instance) => {
      if (options.anchor) {
        return instance.options.anchor === options.anchor && instance.options.eventType === options.eventType;
      }
    });
    // 销毁上次实例
    if (existInstances) {
      _.forEach(existInstances, (inst) => {
        inst.destroy();
        this._bindingInstances = _.dropWhile(this._bindingInstances, (bindInst) => {
          return bindInst === inst;
        });
      });
    }
    let binding = new Binding(options, callback);
    this._bindingInstances.push(binding);
    return {token: binding.token};
  },
  /**
   *  @param {object} options
   *  @example
   *  {eventType:'pan',
   *   token:self.gesToken}
   */
  unbind(options) {
    if (!options) {
      throw new Error('should pass options for binding');
    }
    let inst = _.find(this._bindingInstances, (instance) => {
      return instance.options.eventType === options.eventType && instance.token === options.token;
    });
    if (inst) {
      inst.destroy();
    }
  },
  unbindAll() {
    this._bindingInstances.forEach((inst) => {
      inst.destroy({
        eventType: inst.options.eventType,
        token: inst.token
      });
    });
  },
  getComputedStyle(elRef) {
    let computedStyle = window.getComputedStyle(elRef);
    let style = matrixToTransformObj(computedStyle[vendorTransform]);
    style.opacity = Number(computedStyle.opacity);
    style.width = pxTo750(computedStyle.width.replace('px', ''));
    style.height = pxTo750(computedStyle.height.replace('px', ''));
    style['background-color'] = computedStyle['background-color'];
    style.color = computedStyle.color;
    return style;
  }

};


