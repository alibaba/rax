/**
 * CSS properties which accept numbers but are not in units of "px".
 */
const UNITLESS_NUMBER_PROPS = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
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
  // We make lineHeight default is px that is diff with w3c spec
  // lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // Weex only
  lines: true,
};
const SUFFIX = 'rem';
const DP_SUFFIX = 'dp';
const REM_REG = /[-+]?\d*\.?\d+rem/g;
const DP_REG = /[-+]?\d*\.?\d+dp/g;

let defaultRem;

/**
 * Is string contains rem
 * @param {String} str
 * @returns {Boolean}
 */
export function isRem(str) {
  return typeof str === 'string' && str.indexOf(SUFFIX) !== -1;
}

export function isDp(str) {
  return typeof str === 'string' && str.indexOf(DP_SUFFIX) !== -1;
}

/**
 * Calculate rem to pixels: '1.2rem' => 1.2 * rem
 * @param {String} str
 * @param {Number} rem
 * @returns {number}
 */
export function calcRem(str, rem = defaultRem) {
  return str.replace(REM_REG, function(remValue) {
    return parseFloat(remValue) * rem + 'px';
  });
}

export function calcDp(str) {
  return str.replace(DP_REG, function(dpValue) {
    return parseFloat(dpValue) * window.devicePixelRatio + 'px';
  });
}

export function getRem() {
  return defaultRem;
}

export function setRem(rem) {
  defaultRem = rem;
}

export function isUnitNumber(val, prop) {
  return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
}

export function convertUnit(val, prop, isWeb) {
  if (prop && isUnitNumber(val, prop)) {
    return val * defaultRem + 'px';
  } else if (isRem(val)) {
    return calcRem(val);
  } else if (isWeb && isDp(val)) {
    return calcDp(val);
  }

  return val;
}
