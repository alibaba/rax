'use strict';

import _ from 'simple-lodash';
import Easing from './easing';

// 内置方法
function colorToDecimal(hexColor) {
  let hex = hexColor.replace(/'|"|#/g, '');
  return parseInt(hex, 16);
}

function decToHex(dec) {
  let hex = dec.toString(16);
  let a = [];
  for (let i = 0; i < 6 - hex.length; i++) {
    a.push('0');
  }
  return a.join('') + hex;
}


function parseColor(hexColor) {
  let hex = hexColor.replace(/'|"|#/g, '');
  hex = hex.length === 3 ? [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join('') : hex;
  let r = `${hex[0]}${hex[1]}`;
  let g = `${hex[2]}${hex[3]}`;
  let b = `${hex[4]}${hex[5]}`;
  return {
    r,
    g,
    b,
    dr: colorToDecimal(r),
    dg: colorToDecimal(g),
    db: colorToDecimal(b)
  };
}


let Fn = {
  max: Math.max,
  min: Math.min,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  log: Math.log,
  abs: Math.abs,
  atan: Math.atan,
  floor: Math.floor,
  ceil: Math.ceil,
  pow: Math.pow,
  exp: Math.exp,
  PI: Math.PI,
  E: Math.E,
  acos: Math.acos,
  asin: Math.asin,
  sign: Math.sign,
  atan2: Math.atan2,
  round: Math.round,
  rgb: function(r, g, b) {
    return `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`;
  },
  rgba: function(r, g, b, a) {
    return `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)},${a})`;
  },
  // 用来获取参数
  getArgs: function() {
    return arguments;
  },
  // 颜色估值算法
  evaluateColor: function(colorFrom, colorTo, percent) {
    percent = percent > 1 ? 1 : percent;
    let from = parseColor(colorFrom);
    let to = parseColor(colorTo);
    let dr = parseInt((to.dr - from.dr) * percent + from.dr);
    let dg = parseInt((to.dg - from.dg) * percent + from.dg);
    let db = parseInt((to.db - from.db) * percent + from.db);
    let resDec = dr * 16 * 16 * 16 * 16 + dg * 16 * 16 + db;
    return `#${decToHex(resDec)}`;
  }
};

// 内置easing所有方法
_.map(Easing, (v, k) => {
  Fn[k] = function(t) {
    return t;
  };
});

export default Fn;