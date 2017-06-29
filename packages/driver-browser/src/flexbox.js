const BOX_ALIGN = {
  stretch: 'stretch',
  'flex-start': 'start',
  'flex-end': 'end',
  center: 'center'
};

const BOX_ORIENT = {
  row: 'horizontal',
  column: 'vertical'
};

const BOX_PACK = {
  'flex-start': 'start',
  'flex-end': 'end',
  center: 'center',
  'space-between': 'justify',
  'space-around': 'justify' // Just same as `space-between`
};

const FLEX_PROPS = {
  display: true,
  flex: true,
  alignItems: true,
  alignSelf: true,
  flexDirection: true,
  justifyContent: true,
  flexWrap: true,
};

let Flexbox = {
  isFlexProp(prop) {
    return FLEX_PROPS[prop];
  },
  display(value, style = {}) {
    if (value === 'flex') {
      style.display = ['-webkit-box', '-webkit-flex', 'flex'];
    } else {
      style.display = value;
    }

    return style;
  },
  flex(value, style = {}) {
    style.webkitBoxFlex = value;
    style.webkitFlex = value;
    style.flex = value;
    return style;
  },
  flexWrap(value, style = {}) {
    style.flexWrap = value;
    return style;
  },
  alignItems(value, style = {}) {
    style.webkitBoxAlign = BOX_ALIGN[value];
    style.webkitAlignItems = value;
    style.alignItems = value;
    return style;
  },
  alignSelf(value, style = {}) {
    style.webkitAlignSelf = value;
    style.alignSelf = value;
    return style;
  },
  flexDirection(value, style = {}) {
    style.webkitBoxOrient = BOX_ORIENT[value];
    style.webkitFlexDirection = value;
    style.flexDirection = value;
    return style;
  },
  justifyContent(value, style = {}) {
    style.webkitBoxPack = BOX_PACK[value];
    style.webkitJustifyContent = value;
    style.justifyContent = value;
    return style;
  }
};

export default Flexbox;
