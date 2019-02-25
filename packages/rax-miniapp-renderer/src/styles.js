const PREFIX_PROPS = {
  flex: true,
  alignItems: true,
  alignSelf: true,
  flexDirection: true,
  justifyContent: true,
  flexWrap: true,

  lineClamp: true,
  textSizeAdjust: true,
  textDecorationLine: true,
  textDecorationColor: true,
  textDecorationStyle: true,
  textDecorationSkip: true,
  writingMode: true,

  animatin: true,
  animationName: true,
  animationDuration: true,
  animationTimingFunction: true,
  animationDelay: true,
  animationIterationCount: true,
  animationDirection: true,
  animationFillMode: true,
  animationPlayState: true,

  transform: true,
  transformOrigin: true,
  transformStyle: true,
  perspective: true,
  perspectiveOrigin: true,
  backfaceVisibility: true,
  appearance: true,
  userSelect: true,

  columns: true,
  columnWidth: true,
  columnCount: true,
  columnGap: true,
  columnRule: true,
  columnRuleWidth: true,
  columnRuleStyle: true,
  columnRuleColor: true,
  columnSpan: true,
  columnFill: true,
  columnBreakBefore: true,
  columnBreakAfter: true,
  columnBreakInside: true,
};

const PREFIX_PROP_VALS = {
  position: 'sticky',
  display: 'flex',
};

const StylePrefixer = {
  shouldPrefix(prop) {
    return PREFIX_PROPS[prop] || PREFIX_PROP_VALS[prop];
  },
};

Object.keys(PREFIX_PROPS).forEach((prop) => {
  const vendorProp = 'webkit' + prop[0].toUpperCase() + prop.slice(1);
  StylePrefixer[prop] = (value, style = {}) => {
    style[vendorProp] = value;
    style[prop] = value;
    return style;
  };
});

Object.keys(PREFIX_PROP_VALS).forEach((prop) => {
  const rule = PREFIX_PROP_VALS[prop];
  StylePrefixer[prop] = (value, style = {}) => {
    if (value === rule) {
      style[prop] = ['-webkit-' + rule, rule];
    } else {
      style[prop] = value;
    }
    return style;
  };
});

export function setStyle(node, styleObject) {
  let tranformedStyles = {};

  for (let prop in styleObject) {
    let val = styleObject[prop];
    if (StylePrefixer.shouldPrefix(prop)) {
      StylePrefixer[prop](val, tranformedStyles);
    } else {
      tranformedStyles[prop] = val;
    }
  }

  for (let prop in tranformedStyles) {
    const transformValue = tranformedStyles[prop];
    // if browser only accept -webkit-flex
    // node.style.display = 'flex' will not work
    if (Array.isArray(transformValue)) {
      for (let i = 0; i < transformValue.length; i++) {
        node.style[prop] = transformValue[i];
      }
    } else {
      node.style[prop] = transformValue;
    }
  }
}
