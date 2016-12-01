'use strict';

const unitlessNumbers = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columns: true,
  columnCount: true,
  fillOpacity: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexNegative: true,
  flexOrder: true,
  flexShrink: true,
  fontWeight: true,
  lineHeight: true,
  lineClamp: true,
  opacity: true,
  order: true,
  orphans: true,
  stopOpacity: true,
  strokeDashOffset: true,
  strokeOpacity: true,
  strokeWidth: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  lines: true
};

const SUFFIX = 'rem';

const unitNormalize = (property, value, suffix = SUFFIX) => {
  if (!unitlessNumbers[property] && typeof value === 'number') {
    value = `${value + suffix}`;
  }
  return value;
};

export default unitNormalize;
