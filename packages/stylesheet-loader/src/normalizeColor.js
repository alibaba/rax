'use strict';

let isRgb = {
  color: true,
  backgroundColor: true,
  borderColor: true,
  borderBottomColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderLeftColor: true
};

let colors = {
  maroon: '#800000',
  red: '#ff0000',
  orange: '#ffA500',
  yellow: '#ffff00',
  olive: '#808000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  white: '#ffffff',
  lime: '#00ff00',
  green: '#008000',
  navy: '#000080',
  blue: '#0000ff',
  aqua: '#00ffff',
  teal: '#008080',
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  transparent: '#0000'
};

let RGBtoRGB = function(r, g, b, a) {
  if (a == null || a === '') a = 1;
  r = parseFloat(r);
  g = parseFloat(g);
  b = parseFloat(b);
  a = parseFloat(a);
  if (!(r <= 255 && r >= 0 && g <= 255 && g >= 0 && b <= 255 && b >= 0 && a <= 1 && a >= 0)) return null;

  return [Math.round(r), Math.round(g), Math.round(b), a];
};

let hexToRGB = function(hex) {
  if (hex.length === 3) hex += 'f';
  if (hex.length === 4) {
    let h0 = hex.charAt(0),
      h1 = hex.charAt(1),
      h2 = hex.charAt(2),
      h3 = hex.charAt(3);

    hex = h0 + h0 + h1 + h1 + h2 + h2 + h3 + h3;
  }
  if (hex.length === 6) hex += 'ff';
  let rgb = [];
  for (let i = 0, l = hex.length; i < l; i += 2) rgb.push(parseInt(hex.substr(i, 2), 16) / (i === 6 ? 255 : 1));
  return rgb;
};

let hueToRGB = function(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

let hslToRGB = function(h, s, l, a) {
  let r, b, g;
  if (a == null || a === '') a = 1;
  h = parseFloat(h) / 360;
  s = parseFloat(s) / 100;
  l = parseFloat(l) / 100;
  a = parseFloat(a) / 1;
  if (h > 1 || h < 0 || s > 1 || s < 0 || l > 1 || l < 0 || a > 1 || a < 0) return null;
  if (s === 0) {
    r = b = g = l;
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255, a];
};

let keys = [];
for (let c in colors) keys.push(c);

let shex = '(?:#([a-f0-9]{3,8}))',
  sval = '\\s*([.\\d%]+)\\s*',
  sop = '(?:,\\s*([.\\d]+)\\s*)?',
  slist = '\\(' + [sval, sval, sval] + sop + '\\)',
  srgb = '(?:rgb)a?',
  shsl = '(?:hsl)a?',
  skeys = '(' + keys.join('|') + ')';


let xhex = RegExp(shex, 'i'),
  xrgb = RegExp(srgb + slist, 'i'),
  xhsl = RegExp(shsl + slist, 'i');

let color = function(input, array) {
  if (input == null) return null;
  input = (input + '').replace(/\s+/, '');

  let match = colors[input];
  if (match) {
    return color(match, array);
  } else if (match = input.match(xhex)) {
    input = hexToRGB(match[1]);
  } else if (match = input.match(xrgb)) {
    input = match.slice(1);
  } else if (match = input.match(xhsl)) {
    input = hslToRGB.apply(null, match.slice(1));
  } else return input;

  if (!(input && (input = RGBtoRGB.apply(null, input)))) return input;
  if (array) return input;
  if (input[3] === 1) input.splice(3, 1);
  return 'rgb' + (input.length === 4 ? 'a' : '') + '(' + input + ')';
};

let regexp = RegExp([skeys, shex, srgb + slist, shsl + slist].join('|'), 'gi');

module.exports = function normalizeColor(propertyName, value) {
  const rgbStr = isRgb[propertyName];
  return rgbStr ? color(value) : value;
};
