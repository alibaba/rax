import colorNames from './colors';
import * as matchers from './colorMatchers';

export default function normalizeColor(color) {
  let match;

  if (typeof color === 'number') {
    return color >>> 0 === color && color >= 0 && color <= 0xffffffff
      ? color
      : null;
  }

  if (match = matchers.hex6.exec(color))
    return parseInt(match[1] + 'ff', 16) >>> 0;

  if (colorNames.hasOwnProperty(color)) return colorNames[color];

  if (match = matchers.rgb.exec(color)) {
    return (
      (parse255(match[1]) << 24 | // r
      parse255(match[2]) << 16 | // g
      parse255(match[3]) << 8 | // b
        0x000000ff) >>> // a
      0
    );
  }

  if (match = matchers.rgba.exec(color)) {
    return (
      (parse255(match[1]) << 24 | // r
      parse255(match[2]) << 16 | // g
      parse255(match[3]) << 8 | // b
        parse1(match[4])) >>> // a
      0
    );
  }

  if (match = matchers.hex3.exec(color)) {
    return (
      parseInt(
        match[1] +
        match[1] + // r
        match[2] +
        match[2] + // g
        match[3] +
        match[3] + // b
          'ff', // a
        16
      ) >>> 0
    );
  }

  // https://drafts.csswg.org/css-color-4/#hex-notation
  if (match = matchers.hex8.exec(color)) return parseInt(match[1], 16) >>> 0;

  if (match = matchers.hex4.exec(color)) {
    return (
      parseInt(
        match[1] +
        match[1] + // r
        match[2] +
        match[2] + // g
        match[3] +
        match[3] + // b
          match[4] +
          match[4], // a
        16
      ) >>> 0
    );
  }

  if (match = matchers.hsl.exec(color)) {
    return (
      (hslToRgb(
        parse360(match[1]), // h
        parsePercentage(match[2]), // s
        parsePercentage(match[3]) // l
      ) |
        0x000000ff) >>> // a
      0
    );
  }

  if (match = matchers.hsla.exec(color)) {
    return (
      (hslToRgb(
        parse360(match[1]), // h
        parsePercentage(match[2]), // s
        parsePercentage(match[3]) // l
      ) |
        parse1(match[4])) >>> // a
      0
    );
  }
  return null;
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return (
    Math.round(r * 255) << 24 |
    Math.round(g * 255) << 16 |
    Math.round(b * 255) << 8
  );
}

function parse255(str) {
  const int = parseInt(str, 10);
  if (int < 0) return 0;
  if (int > 255) return 255;
  return int;
}

function parse360(str) {
  const int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}

function parse1(str) {
  const num = parseFloat(str);
  if (num < 0) return 0;
  if (num > 1) return 255;
  return Math.round(num * 255);
}

function parsePercentage(str) {
  const int = parseFloat(str);
  if (int < 0) return 0;
  if (int > 100) return 1;
  return int / 100;
}
