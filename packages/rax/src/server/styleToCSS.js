import {convertUnit} from 'style-unit';

// TODO process flexbox polyfill
export default function styleToCSS(style, disableConvertUnit) {
  let css = '';
  for (let prop in style) {
    if (style.hasOwnProperty(prop)) {
      let val = style[prop];
      if (val != null) {
        css += `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}:`;
        if (!disableConvertUnit) {
          // If in server-side render should not convert rem unit that depends on client width
          css += convertUnit(val, prop);
        } else {
          css += `${val}`;
        }
        css += ';';
      }
    }
  }
  return css;
}
