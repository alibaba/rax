'use strict';

const isUnitlessNumber = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

module.exports = function appendRemIfNeeded(propertyName, value) {
  let reg = /(\d+)(\w+|\W)/;
  let cValue = parseInt(value);
  let arr = value.toString().match(reg);

  // compatible hairlineWidth
  if (value == 0.5) {
    return value;
  }
  // %、px return origin value
  if (arr && arr[2] && (arr[2] == '%' || arr[2] == 'px')) {
    return value;
  }
  const needsRemSuffix = !isUnitlessNumber[propertyName] && !isNaN(cValue) &&
    typeof cValue === 'number' &&
    value !== 0;
  return needsRemSuffix ? cValue + 'rem' : value;
};

