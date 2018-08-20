const UPPERCASE_REGEXP = /[A-Z]/g;
const CSSPropCache = {};

export default function styleToCSS(style) {
  let css = '';
  for (var prop in style) {
    let val = style[prop];
    prop = CSSPropCache[prop] ? CSSPropCache[prop] : CSSPropCache[prop] = prop.replace(UPPERCASE_REGEXP, '-$&').toLowerCase();
    css = css + `${prop}:${val};`;
  }
  return css;
}
