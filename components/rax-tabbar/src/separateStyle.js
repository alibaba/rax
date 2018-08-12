export default function separateStyle(originStyle, styleName, extraAttr = {}) {
  let style = null;
  switch (styleName) {
    case 'backgroundImage':
      if (originStyle.backgroundImage) {
        style = {
          uri: originStyle.backgroundImage.replace(/url\([\'\"]?([^\'\"]*)[\'\"]?\)/, '$1')
        };
      }
      break;
    case 'text': {
      let textKeys = ['color', 'fontSize', 'lineHeight'];
      for (let k in originStyle) {
        if (textKeys.indexOf(k) >= 0) {
          if (!style ) {
            style = {};
          }
          style[k] = originStyle[k];
        }
      }
    }
  }

  if (style) {
    Object.assign(style, extraAttr);

    delete originStyle[styleName];
  }

  return style;
}