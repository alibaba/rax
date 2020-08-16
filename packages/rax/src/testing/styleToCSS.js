// TODO process flexbox polyfill
export default function styleToCSS(style) {
  let css = '';
  for (let prop in style) {
    if (style.hasOwnProperty(prop)) {
      let val = style[prop];
      if (val != null) {
        let unit = '';
        if (typeof val === 'number' || String(parseFloat(val)).length === val.length) unit = 'rem';
        css += `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}:${val}${unit};`;
      }
    }
  }
  return css;
}
