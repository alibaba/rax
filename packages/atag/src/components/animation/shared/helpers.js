import colors from './colors';
import normalizeColor from './normalizeColor';

// Problem: https://github.com/animatedjs/animated/pull/102
// Solution: https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly/658662
const stringShapeRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
// Covers rgb, rgba, hsl, hsla
// Taken from https://gist.github.com/olmokramer/82ccce673f86db7cda5e
const colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
// Covers color names (transparent, blue, etc.)
const colorNamesRegex = new RegExp(`(${Object.keys(colors).join('|')})`, 'g');

function colorToRgba(input) {
  let int32Color = normalizeColor(input);
  if (int32Color === null) return input;
  int32Color = int32Color || 0;
  let r = (int32Color & 0xff000000) >>> 24;
  let g = (int32Color & 0x00ff0000) >>> 16;
  let b = (int32Color & 0x0000ff00) >>> 8;
  let a = (int32Color & 0x000000ff) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * 将字符串转成对象
 * @TODO: 过滤异常字符串
 * @param {String}
 * @return {Object} 样式字符串
 */
export function converStyleString(string) {
  const properties = string.split(';');
  const object = {};

  properties.forEach((item) => {
    const [property, value] = item.split(':');
    if (property) {
      object[property.trim()] = value.trim();
    }
  });

  return object;
}

export function generateTemplate(params, string) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${string}\`;`)(...vals);
}

export function vec3(x, y, z) {
  const output = [];
  output[0] = x;
  output[1] = y;
  output[2] = z;
  return output;
}

export function range(min, max, value) {
  return (value - min) / (max - min);
}

export function lerp(startValue, endValue, t) {
  return startValue * (1 - t) + endValue * t;
}

export function lerpArray(startValue, endValue, t) {
  const len = Math.min(startValue.length, endValue.length);
  const out = new Array(len);
  for (let index = 0; index < len; index++) {
    out[index] = lerp(startValue[index], endValue[index], t);
  }
  return out;
}

// 将颜色等特殊字符串转化 -> rgba(0, 0, 0, 0) -> [0, 100, 200, 0.5]
export function lerpSpecial(startValue, endValue, t) {
  const outputStartValue = startValue.replace(colorRegex, colorToRgba).replace(colorNamesRegex, colorToRgba);
  const outputEndValue = endValue.replace(colorRegex, colorToRgba).replace(colorNamesRegex, colorToRgba);
  const startArray = outputStartValue.match(stringShapeRegex).map((value) => parseFloat(value));
  const endArray = outputEndValue.match(stringShapeRegex).map((value) => parseFloat(value));

  const array = lerpArray(startArray, endArray, t);

  if (/^rgb/.test(outputStartValue)) {
    const r = array[0];
    const g = array[1];
    const b = array[2];
    const a = array[3];
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
  }
  return array;
}

export function lerpValues(startValue, endValue, t, out) {
  let isArray, isString, isNumber, isSpcial;

  isNumber = typeof startValue === 'number';
  isArray = Array.isArray(startValue);
  isString =
    typeof startValue === 'string' &&
    !startValue.startsWith('#') &&
    !/\d/.test(startValue) &&
    !colors[startValue];
  // 比如说 color、shadow
  isSpcial = !isNumber && !isString && !isArray;

  if (isNumber || isString) {
    return lerp(startValue, endValue, t);
  } else if (isArray) {
    return lerpArray(startValue, endValue, t);
  } else if (isSpcial) {
    return lerpSpecial(startValue, endValue, t);
  }
}

export function requestFrame(cb) {
  typeof window !== 'undefined' && window.requestAnimationFrame(cb);
}

export function cancelFrame(cb) {
  typeof window !== 'undefined' && window.cancelAnimationFrame(cb);
}

export function now() {
  if (performance && performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
}