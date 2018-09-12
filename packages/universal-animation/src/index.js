'use strict';

import binding from 'weex-bindingx';
import {isWeex} from 'universal-env';
import transition from 'universal-transition';

let isSupportBinding = binding.isSupportNewBinding;

function find(o, condition) {
  let result = null;
  forEach(o, (v, k) => {
    if (typeof condition === 'function') {
      if (condition(v, k)) {
        result = v;
      }
    } else {
      let propName = Object.keys(condition)[0];
      if (propName && v[propName] === condition[propName]) {
        result = v;
      }
    }
  });
  return result;
}

function forEach(o, fn) {
  if (o instanceof Array) {
    return Array.prototype.forEach.call(o, fn);
  }
  Object.keys(o).forEach((key) => {
    fn(o[key], key);
  });
}

function map(o, fn) {
  if (o instanceof Array) {
    return Array.prototype.map.call(o, fn);
  } else {
    let result = [];
    forEach(o, (v, k) => {
      result.push(fn(v, k));
    });
    return result;
  }
}

class Animation {
  constructor(options, callback) {
    this.run(options, callback);
  }

  run(options, callback) {
    let easing = options.easing || 'easeOutSine';
    if (!options.props || !options.props.length) return;
    let props = [];
    let maxDuration = 0;
    let callbackFlag = false;

    map(options.props, (prop) => {
      prop.delay = prop.delay > 0 ? prop.delay : 0;
      prop.duration = prop.duration >= 0 ? prop.duration : 350;
      // get max duration
      if (prop.duration + prop.delay > maxDuration) {
        maxDuration = prop.duration + prop.delay;
      }
      // let {start} = prop;
      let start = undefined !== prop.start ? prop.start : getInitProperty(prop.element, prop.property);
      // TODO start should be optional
      // let start = binding.getComputedStyle(prop.element)[prop.property.replace(/transform\./, '')];
      // console.error(binding.getComputedStyle(prop.element),prop.property,start)
      // TODO cubicBezier support
      // let bezier = formatBezier(easing);
      let bezier = formatBezier(prop.easing || easing);
      let expression = bezier && bezier.length === 4 ?
        `cubicBezier(t-${prop.delay},${start},${prop.end - start},${prop.duration},${bezier.join(',')})`
        : `${prop.easing || easing}(t-${prop.delay},${start},${prop.end - start},${prop.duration})`;
      if (prop && prop.element) {
        props.push({
          element: isWeex ? prop.element.ref : prop.element,
          expression: `t>=${prop.delay}?${expression}:${start}`,
          property: prop.property
        });
      }
    });

    if (isSupportBinding && !options.forceTransition) {
      let res = binding.bind({
        eventType: 'timing',
        exitExpression: `t>${maxDuration}`,
        props
      }, (e) => {
        if (e && e.state === 'exit') {
          callback && callback(e);
        }
      });

      this.token = res && res.token;
    } else {
      // make transition groupby element
      let transitionMap = [];
      map(options.props, (prop) => {
        if (prop && prop.element) {
          let transitionProps = transformProperty(prop.property, prop.end);
          let exist = find(transitionMap, (o) => {
            return o && o.element === prop.element;
          });

          if (exist) {
            let transform = exist.props.transform || [];
            if (transitionProps && transitionProps.transform) {
              transform = [...transform, ...transitionProps.transform];
            }

            exist.props = {...exist.props, ...transitionProps, ...{transform}};
          } else {
            transitionMap.push({
              element: prop.element,
              easing: transformEasing(prop.easing || easing),
              duration: prop.duration,
              props: transitionProps,
              delay: prop.delay || 0
            });
          }
        }
      });

      map(transitionMap, (o) => {
        let transitionProps = {
          ...o.props,
          ...o.props.transform ? {
            transform: o.props.transform.join(' '),
            webkitTransform: o.props.transform.join(' ')
          } : {}
        };

        transition(o.element, transitionProps, {
          duration: o.duration,
          timingFunction: o.easing,
          delay: o.delay
        }, (e) => {
          if (o.duration === maxDuration && !callbackFlag) {
            callback && callback(e);
            callbackFlag = true;
          }
        });
      });
    }
  }

  stop() {
    if (isSupportBinding && this.token) {
      return binding.unbind({
        eventType: 'timing',
        token: this.token
      });
    }
    // transition not support stop
  }
}


function getInitProperty(el, name) {
  if (!el) return 0;
  name = name.replace(/transform\./, '');
  let style = binding.getComputedStyle(isWeex ? el.ref : el);
  switch (name) {
    case 'scale':
      name = 'scaleX';
      break;
    case 'translate':
      name = 'translateX';
      break;
    case 'rotate':
      name = 'rotateZ';
      break;
  }
  if (style && undefined !== style[name]) {
    return style[name];
  }
  return 0;
}


function formatBezier(easing) {
  if (easing) {
    let m = easing.match(/cubicBezier\((.+),(.+),(.+),(.+)\)/);
    return m && [m[1], m[4], m[3], m[4]];
  }
}

// transform easing from binding to transition timingFunction
function transformEasing(easing) {
  let bezier = formatBezier(easing);

  if (bezier && bezier.length === 4) {
    return `cubic-bezier(${bezier.join(',')})`;
  }

  let map = {
    'easeInSine': 'ease-in',
    'easeOutSine': 'ease-out',
    'easeInOutSine': 'ease-in-out',
    'linear': 'linear'
  };


  return map[easing] || 'ease-out';
}

// transform property from binding to transition
function transformProperty(propName, propVal) {
  let key;
  let value;
  let result = {};
  switch (propName) {
    case 'transform.translateX':
      key = 'transform';
      value = ['translateX(' + propVal + 'rem)'];
      break;
    case 'transform.translateY':
      key = 'transform';
      value = ['translateY(' + propVal + 'rem)'];
      break;
    case 'transform.scaleX':
      key = 'transform';
      value = ['scaleX(' + propVal + ')'];
      break;
    case 'transform.scaleY':
      key = 'transform';
      value = ['scaleY(' + propVal + ')'];
      break;
    case 'transform.scale':
      key = 'transform';
      value = ['scale(' + propVal + ')'];
      break;
    case 'transform.rotate':
      key = 'transform';
      value = ['rotate(' + propVal + 'deg)'];
      break;
    default:
      key = propName;
      value = propVal;
      break;
  }
  if (key && value !== undefined) {
    result[key] = value;
    // solve in old version browser
    if (key == 'transform') {
      result.webkitTransform = value;
    }
  }
  return result;
}

function animate(options = {}, callback) {
  return new Animation(options, callback);
}


export default animate;


